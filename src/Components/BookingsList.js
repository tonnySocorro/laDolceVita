import React from "react";
import { Button } from "antd";
import { Table } from "antd";
import { Input } from "antd";
import { notification } from "antd";
import { Modal } from 'antd';

class BookingsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      valueInput: "",
      showModal: false,
    };
    this.getUserItemsForSell();
  }

  deleteItem = async (id) => {
    this.setState({ showModal: true, selectedItemId: id }); // Mostrar el modal y guardar el ID del elemento seleccionado
  };

  handleCancel = () => {
    this.setState({ showModal: false, selectedItemId: null }); // Ocultar el modal y limpiar el ID del elemento seleccionado
  };
  confirmDeleteItem = async () => {
    const {
      data: { user },
    } = await this.props.supabase.auth.getUser();
    if (user != null) {
      const { data, error } = await this.props.supabase
        .from("booking")
        .delete()
        .match({ id: this.state.selectedItemId }); // Utilizar el ID almacenado en el estado

      if (error == null) {
        this.getUserItemsForSell();
      }

      notification.info({
        message: "Deleted Item",
        duration: 3,
        description: "Item has been deleted",
      });
    }

    this.setState({ showModal: false, selectedItemId: null }); // Ocultar el modal y limpiar el ID del elemento seleccionado
  };

  getUserItemsForSell = async () => {
    const {
      data: { user },
    } = await this.props.supabase.auth.getUser();
    if (user != null) {
      const { data, error } = await this.props.supabase
        .from("booking")
        .select()
        .eq("user", user.email);
  
      if (error == null) {
        this.setState({
          items: data,
        });
      }
    }
  };
  

  handleChange(event) {
    this.setState({ valueInput: event.target.value });
  }

  getItemsFind() {
    return this.state.items.filter((value) =>
      value.name.startsWith(this.state.valueInput)
    );
  }

  cleanFilter() {
    this.getUserItemsForSell();
  }

  render() {
    let columns = [
      {
        title: "Fecha",
        dataIndex: "date",
      },
      {
        title: "horario",
        dataIndex: "time",
      },
      {
        title: "cantidad de personas",
        dataIndex: "cant_people",
      },
      {
        title: "código de reserva",
        dataIndex: "reservationCode",
      },

      {
        title: "Acciones",
        dataIndex: "id",
        render: (id) => (
          <div>
            <Button type="link" onClick={() => this.deleteItem(id)}>
              Cancelar Reserva
            </Button>
            
          </div>
        ),
      },
    ];
    let data = this.state.items.map((element) => {
      element.key = "table" + element.id;
      return element;
    });

    return (
      <>
       <Modal
          title="Confirmar cancelación"
          visible={this.state.showModal}
          onCancel={this.handleCancel}
          onOk={this.confirmDeleteItem}
          okText="Confirmar"
          cancelText="Cancelar"
        >
          <p>¿Estás seguro de que deseas cancelar esta reserva?</p>
        </Modal>
        <div style={{ margin: "1rem", display: "flex" }}>
          <div style={{ marginRight: "1rem" }}>
            <Input
              placeholder="Buscar Reserva"
              title="Buscar Reserva"
              value={this.state.valueInput}
              onChange={this.handleChange.bind(this)}
            />
          </div>
          <div style={{ marginRight: "0.4rem" }}>
            <Button
              type="primary"
              onClick={() => {
                this.setState({ items: this.getItemsFind() });
              }}
            >
              Buscar
            </Button>
          </div>
          <div>
            <Button
              type="default"
              onClick={() => {
                this.setState({ valueInput: "" });
                this.cleanFilter()
              }}
            >
              Limpiar
            </Button>
          </div>
        </div>

        <Table columns={columns} dataSource={data} />
      </>
    );
  }
}

export default BookingsList;
