import React from "react";
import { Button, Input } from "antd";
import { Table } from "antd";
import { notification } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { DatePicker, InputNumber, TimePicker, message, Result } from "antd";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import withRouter from "./withRouter";

class AllOrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdOrder: false,
      orderCode: "",
      items: [],
      valueInput: "",
      visible: false,
      valueInputModal: "",
      idPedido: "",
    };
    this.getUserItemsForSell();
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = async () => {
    const { data, error } = await this.props.supabase
      .from("orders_with_mail")
      .update({
        status: this.state.valueInputModal,
      })
      .eq("id", this.state.idPedido)
      .select();

    if (error == null && data != null) {
      notification.success({
        message: "Estado del pedido actualizado",
        duration: 3,
        description: "El estado del pedido ha sido actualizado correctamente",
      });
      this.setState({
        visible: false,
      });
      this.getUserItemsForSell();
      this.setState({
        idPedido: "",
        valueInputModal: "",
      });
    }
  };

  changeStatus = async (id) => {
    this.setState({ visible: true, idPedido: id });
  };

  handleChange(event) {
    this.setState({ valueInput: event.target.value });
  }

  handleChangeModal(event) {
    this.setState({ valueInputModal: event.target.value });
  }

  getItemsFind() {
    return this.state.items.filter((value) =>
      value.user_email.startsWith(this.state.valueInput)
    );
  }

  cleanFilter() {
    this.getUserItemsForSell();
  }

  getUserItemsForSell = async () => {
    const {
      data: { user },
    } = await this.props.supabase.auth.getUser();

    if (user != null) {
      const { data, error } = await this.props.supabase
        .from("orders_with_mail")
        .select("*");

      if (error == null) {
        this.setState({
          items: data,
        });
      } else {
        console.log(error); // Imprime el valor del error en la consola
      }
    }
  };

  render() {
    let columns = [
      {
        title: "Usuario",
        dataIndex: ["user_email"],
      },
      {
        title: "Fecha de creación",
        dataIndex: ["created_at"],
      },
      {
        title: "Estado",
        dataIndex: ["status"],
      },
      {
        title: "Acciones",
        dataIndex: "id",
        render: (id) => (
          <div>
            <Button type="link" onClick={() => this.changeStatus(id)}>
              Editar Estado
            </Button>
          </div>
        ),
      },
    ];
    let data = this.state.items.map((element) => {
      element.key = "table" + element.id;
      element.status = element.status.toLocaleUpperCase();
      element.created_at = `${element.created_at.split("T")[0]}`;
      return element;
    });

    return (
      <>
        <div style={{ margin: "1rem", display: "flex" }}>
          <div style={{ marginRight: "1rem" }}>
            <Input
              placeholder="Filtrar por usuario"
              title="Filtrar por usuario"
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
                this.cleanFilter();
              }}
            >
              Limpiar
            </Button>
          </div>
        </div>

        <Modal
          title="Modificar estado del pedido"
          open={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={"Modificar"}
          cancelText={"Cancelar"}
        >
          <div style={{ marginRight: "1rem" }}>
            <Input
              placeholder="Nuevo estado"
              title="Nuevo estado"
              value={this.state.valueInputModal}
              onChange={this.handleChangeModal.bind(this)}
            />
          </div>
        </Modal>

        <Table columns={columns} dataSource={data} />
      </>
    );
  }
}

export default withRouter(AllOrderList);
