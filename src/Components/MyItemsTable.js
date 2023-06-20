import React from "react";
import { Button } from "antd";
import { Table } from "antd";
import { Input } from "antd";
import { notification } from "antd";
import { Modal } from 'antd';
class MyItemsTable extends React.Component {
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

  confirmDeleteItem = async (id) => {
    const {
      data: { user },
    } = await this.props.supabase.auth.getUser();
    if (user != null) {
      const { data, error } = await this.props.supabase
        .from("menu_items")
        .delete()
        .match({ id: this.state.selectedItemId }); 
        if (error == null) {
          this.getUserItemsForSell();
        }
  
        notification.info({
          message: "plato eliminado",
          duration: 3,
          description: "El plato ha sido eliminado",
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
        .from("menu_items")
        .select("*, sale_menu ( buyer )")
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
        title: "Plato",
        dataIndex: "name",
      },
      {
        title: "Descripción",
        dataIndex: "description",
      },
      {
        title: "Precio €",
        dataIndex: "price",
      },

      {
        title: "Acciones",
        dataIndex: "id",
        render: (id) => (
          <div>
            <Button type="link" onClick={() => this.deleteItem(id)}>
              Eliminar
            </Button>
            <Button type="link" href={"/edit/item/" + id}>
              Editar
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
          title="Confirmar eliminación"
          visible={this.state.showModal}
          onCancel={this.handleCancel}
          onOk={this.confirmDeleteItem}
          okText="Confirmar"
          cancelText="Eliminar"
        >
          <p>¿Estás seguro de que deseas eliminar este plato?</p>
        </Modal>
        <div style={{ margin: "1rem", display: "flex" }}>
          <div style={{ marginRight: "1rem" }}>
            <Input
              placeholder="Buscar Plato"
              title="Buscar Plato"
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

export default MyItemsTable;
