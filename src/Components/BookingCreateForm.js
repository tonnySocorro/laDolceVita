import React from 'react';
import { DatePicker, Button, InputNumber, TimePicker, message, Result } from 'antd';
import withRouter from "./withRouter";
import moment from 'moment';
import { Modal } from 'antd';

const availableTimes = ['12:00', '14:00', '16:00', '18:00', '20:00'];

class BookingCreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdBooking: false,
      selectedDate: null,
      selectedTime: null,
      numberOfPeople: 1,
      reservationCode: '',
      selectedTime: null,
      isModalVisible: false,
    };
  }
  showModal = () => {
    this.setState({ isModalVisible: true });
  };
  hideModal = () => {
    this.setState({ isModalVisible: false });
  };
    
  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
  };

  handleTimeChange = (time) => {
    const selectedTime = moment(time, 'HH:mm'); // Crear objeto Moment a partir del valor de time
    this.setState({ selectedTime });
  };


  handleNumberOfPeopleChange = (value) => {
    if (value > 6) {
      message.error('No tenemos mesas disponibles para más de 6 personas');
      return;
    }
    this.setState({ numberOfPeople: value });
  };

  handleMyItemsButtonClick = () => {
    // Redirigir al usuario al menú
    this.props.navigate('/items');
  };

  async sendCreateBooking() {
    const { data: { user } } = await this.props.supabase.auth.getUser();

    if (user != null) {
      const { selectedDate, selectedTime, numberOfPeople } = this.state;
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      const formattedTime = selectedTime.format('HH:mm:ss');
      const reservationCode = `${user.email}-${formattedDate}-${Math.random().toString(36).substr(2, 9)}`;

      // Verificar disponibilidad de reserva
      const { data: existingBookings, error: existingBookingsError } = await this.props.supabase
        .from('booking')
        .select('id')
        .eq('date', formattedDate)
        .eq('time', formattedTime);

      if (existingBookingsError != null) {
        console.log(existingBookingsError);
        return;
      }

      if (numberOfPeople > 6) {
        message.error('No tenemos disponibilidad de mesa para más de 6 personas. Lo sentimos');
        return;
      }

      if (existingBookings.length >= 5) {
        message.error('No queda disponibilidad para el horario seleccionado, por favor elija otro.');
        return;
      }

      // Crear reserva
      const { data, error } = await this.props.supabase
        .from('booking')
        .insert([
          {
            date: formattedDate,
            time: formattedTime,
            cant_people: numberOfPeople,
            user: user.email,
            reservationCode: reservationCode
          }
        ]);

      if (error != null) {
        console.log(error);
      } else {
        console.log('Reserva creada:', data);
        // Realizar otras acciones necesarias después de crear la reserva
        this.setState({
          createdBooking: true,
          reservationCode: reservationCode
        });
      }
    }
  }

  disabledDate = (current) => {
    // Desactivar fechas anteriores a la actual
    return current && current < Date.now();
  };

  disabledHours = () => {
    // Definir las horas deshabilitadas
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 16, 17, 19, 21, 23];
  };
  

  render() {
    const { createdBooking, selectedDate, selectedTime, numberOfPeople, reservationCode } = this.state;

    if (createdBooking) {
      return (
        <Result
          status="success"
          title="Reserva creada"
          subTitle="No retrasarse más de 10 minutos o perderán la reserva"
          extra={[
            <div key="reservationCode">Código de reserva: {reservationCode}</div>,
            <Button
              type="primary"
              key="myItemsButton"
              onClick={this.handleMyItemsButtonClick}
            >
              Mirar platos
            </Button>,
          ]}
        />
      );
    }

    return (
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Crear reserva</h2>
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <label style={{ display: 'inline-block', width: '120px' }}>Fecha de reserva:</label>
          <DatePicker
            onChange={this.handleDateChange}
            value={selectedDate}
            placeholder="Selecciona una fecha"
            disabledDate={this.disabledDate}
          />
        </div>
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <label style={{ display: 'inline-block', width: '120px' }}>Hora de reserva:</label>
        <div>
          {availableTimes.map((time) => (
            <Button
              key={time}
              type={selectedTime === time ? 'primary' : 'default'}
              onClick={() => this.handleTimeChange(time)}
              disabled={!selectedDate}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <label style={{ display: 'inline-block', width: '120px' }}>Cantidad de personas:</label>
        <InputNumber
          min={1}
          max={6}
          value={numberOfPeople}
          onChange={this.handleNumberOfPeopleChange}
        />
      </div>
        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={this.sendCreateBooking.bind(this)}
            disabled={!selectedDate || !selectedTime || numberOfPeople < 1}
            style={{ width: '120px' }}
          >
            Crear reserva
          </Button>
          <Button type="default" onClick={this.showModal} style={{ marginLeft: '16px' }}>
        Reservar por teléfono
      </Button>
    </div>
    <Modal
      title="Reservar por teléfono"
      visible={this.state.isModalVisible}
      onCancel={this.hideModal}
      footer={null}
    >
      <p>Número de teléfono: 123-456-789</p>
    </Modal>
  </div>
    );
  }
}

export default withRouter(BookingCreateForm);
