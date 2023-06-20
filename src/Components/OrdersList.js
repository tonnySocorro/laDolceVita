import React from "react";
import { Button } from "antd";
import { Table } from "antd";
import { notification } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { DatePicker, InputNumber, TimePicker, message, Result } from "antd";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import withRouter from "./withRouter";
class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdOrder: false,
      orderCode: "",
      items: [],
    };
    this.getUserItemsForSell();
  }

  deleteItem = async (id) => {
    const {
      data: { user },
    } = await this.props.supabase.auth.getUser();
    if (user != null) {
      const { data, error } = await this.props.supabase
        .from("orders_with_mail")
        .delete()
        .match({ item_id: id });

      if (error == null) {
        this.getUserItemsForSell();
      }

      notification.info({
        message: "Producto eliminado del carrito",
        duration: 3,
        description: "Se han eliminado todos los prodcutos iguales al seleccionado ",
      });
    }
  };

  getUserItemsForSell = async () => {
    const {
      data: { user },
    } = await this.props.supabase.auth.getUser();

    if (user != null) {
      const { data, error } = await this.props.supabase
        .from("orders_with_mail")
        .select("*,menu_items (*)")
        .eq("user_email", user.email);

      console.log(data);

      if (error == null) {
        this.setState({
          items: data,
        });
      } else {
        console.log(error); // Imprime el valor del error en la consola
      }
    }
  };
  finishOrder = async (totalPrice) => {
    const {
      data: { user },
    } = await this.props.supabase.auth.getUser();

    if (user != null) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const userEmail = user.email.split("@")[0];
      const orderCode = `${userEmail}-${formattedDate}-$`;

      const { data: orderData, error: orderError } = await this.props.supabase
        .from("orders_with_mail")
        .select("item_id")
        .eq("user_email", user.email);

      if (orderError != null) {
        console.log(orderError);
        return;
      }

      const items = orderData.map((order) => order.item_id);

      const { data: orderCarData, error: orderCarError } =
        await this.props.supabase.from("order_car").insert(
          [
            {
              order_car_code: orderCode,
              total_price: totalPrice,
              status: "creado",
              user: user.email,
              date: formattedDate,
            },
          ],
          { returning: "id" } // Especifica las columnas que deseas devolver
        );

      if (orderCarError != null) {
        console.log(orderCarError);
        return;
      } else {
        console.log("Pedido creada:");
        // Realizar otras acciones necesarias después de crear la reserva
        this.setState({
          createdOrder: true,
          orderCode: orderCode,
        });
      }

      // Obtener el ID del order_car insertado
      const { data: insertedOrderCarData, error: insertedOrderCarError } =
        await this.props.supabase
          .from("order_car")
          .select("id")
          .eq("order_car_code", orderCode)
          .limit();

      if (insertedOrderCarError != null) {
        console.log(insertedOrderCarError);
        return;
      }

      const orderCarId = insertedOrderCarData[0].id; // Obtener el ID del order_car
      console.log("orderCarId");
      console.log(orderCarId);
      if (orderCarId != null) {
        console.log("ID del order_car:", orderCarId);
      } else {
        console.log("No se pudo obtener el ID del order_car.");
      }

      const { data: orderItemsData, error: orderItemsError } =
        await this.props.supabase.from("order_items").insert(
          items.map((item) => ({
            order_car_code: orderCarId, // Utilizar el identificador del order_car
            menu_item_id: item,
          }))
        );

      if (orderItemsError != null) {
        console.log(orderItemsError);
        this.setState({
          createdOrder: true,
          orderCode: orderCode,
        });
      }

      if (orderCarError != null) {
        console.log(orderCarError);
        this.setState({
          createdOrder: true,
          orderCode: orderCode,
        });

        return;
      }

      // Vaciar la lista "orders_with_mail"
      const { error: deleteError } = await this.props.supabase
        .from("orders_with_mail")
        .delete()
        .eq("user_email", user.email);

      if (deleteError != null) {
        console.log(deleteError);
      }

      Modal.confirm({
        title: "Pedido creado",
        content: `El código de pedido es: ${orderCode}`,
        okText: "Mirar platos",
       
        onOk: () => {
          // Redirigir al usuario al menú
          this.props.navigate("/items");
        },
      });
    } else {
      notification.error({
        message: "Error",
        duration: 3,
        description:
          "Debes autenticarte para poder añadir productos al carrito",
      });
    }
    // Mostrar modal de confirmación
  };

  render() {
    let columns = [
      {
        title: "Plato",
        dataIndex: ["menu_items", "name"],
      },
      {
        title: "Descripción",
        dataIndex: ["menu_items", "description"],
      },
      {
        title: "Precio €",
        dataIndex: ["menu_items", "price"],
      },
      {
        title: "Cantidad",
        dataIndex: "quantity",
      },
      {
        title: "Acciones",
        dataIndex: "item_id",
        render: (id) => (
          <div>
            <Button type="link" onClick={() => this.deleteItem(id)}>
              Eliminar
            </Button>
          </div>
        ),
      },
    ];
    let data = this.state.items.map((element) => {
      element.key = "table" + element.id;
      return element;
    });

    const totalPrice = data
      .map(({ menu_items, quantity }) => menu_items.price * quantity)
      .reduce((a, b) => a + b, 0);

    return (
      <>
        <Table columns={columns} dataSource={data} />
        <div style={{ width: "100%", display: "flex", marginTop: "1rem" }}>
          <div style={{ display: "flex", width: "20%" }}>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>
             Total a pagar
            </div>
            <div style={{ fontSize: "1rem", marginLeft: "0.3rem" }}>
              {totalPrice}
            </div>
            <div style={{ fontSize: "1rem", marginLeft: "0.3rem" }}>€</div>
          </div>
          <div style={{ width: "80%", textAlign: "end" }}>
            <Button
              type="primary"
              onClick={() => this.finishOrder(totalPrice)}
              icon={<ShoppingOutlined />}
              size="large"
            >
              Finalizar pedido
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(OrderList);
