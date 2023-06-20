import React from "react";
import { Button } from "antd";
import { Table } from "antd";
import { notification } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { DatePicker, InputNumber, TimePicker, message, Result } from "antd";
import { Modal } from "antd";
import withRouter from "./withRouter";
class AfterCarritoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdOrder: false,
      orderCode: "",
      visible: false,
      items: [],
      itemsModal: [],
    };
    this.getUserItemsForSell();
  }

  showDetails = (id) => {
    this.getDataModal(id);
    console.log(id);
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  

  getUserItemsForSell = async () => {
    const {
      data: { user },
    } = await this.props.supabase.auth.getUser();

    if (user != null) {
      const { data, error } = await this.props.supabase
        .from("order_car")
        .select("*")
        .eq("user", user.email);

      if (error == null) {
        this.setState({
          items: data,
        });
      } else {
        console.log(error); // Imprime el valor del error en la consola
      }
    }
  };

  getDataModal = async (id) => {
    const {
      data: { user },
    } = await this.props.supabase.auth.getUser();

    if (user != null) {
      const { data, error } = await this.props.supabase
        .from("order_items")
        .select("*, menu_items(*)")
        .eq("order_car_code", id);

      if (error == null) {
        this.setState({
          itemsModal: data,
        });
        this.setState({ visible: true });
      } else {
        console.log(error); // Imprime el valor del error en la consola
      }
    }
  };

  render() {
    let columns = [
      {
        title: "fecha",
        dataIndex: ["date"],
      },
      {
        title: "estatus",
        dataIndex: ["status"],
      },
      {
        title: "código de orden",
        dataIndex: ["order_car_code"],
      },
      {
        title: "Precio €",
        dataIndex: ["total_price"],
      },

      {
        title: "Acciones",
        dataIndex: "id",
        render: (id) => (
          <div>
           
            <Button type="link" onClick={() => this.showDetails(id)}>
              Ver detalles del pedido
            </Button>
          </div>
        ),
      },
    ];
    let data = this.state.items.map((element) => {
      element.key = "table" + element.id;
      return element;
    });

    const columnsModal = [
      {
        title: "Plato",
        dataIndex: ["menu_items", "name"],
      },
      {
        title: "Descripción",
        dataIndex: ["menu_items", "description"],
      },
      {
        title: "Precio",
        dataIndex: ["menu_items", "price"],
      },
    ];

    const dataModal = this.state.itemsModal.map((element) => {
      element.key = "table" + element.id;
      return element;
    });

    return (
      <>
        <Table columns={columns} dataSource={data} />
        <div style={{ display: "flex" }}></div>
        <Modal
          title="Lista de platos"
          open={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          okText={"Cerrar"}
          cancelButtonProps={{ hidden: true }}
        >
          <Table columns={columnsModal} dataSource={dataModal} />
        </Modal>
      </>
    );
  }
}

export default withRouter(AfterCarritoList);
