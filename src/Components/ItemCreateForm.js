import React from "react";
import { Button, InputNumber, Form, Input } from "antd";
import { Card } from "antd";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Result } from "antd";
import withRouter from "./withRouter";

class ItemCreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.file = null;
    this.state = { createdItem: false };
    this.imageClicable = React.createRef();
  }

  async changeValueImage(file) {
    // Check extension Only .png
    this.file = file;
    console.log(file);
  }

  async sendCreateItem(values) {
    const {
      data: { user },
    } = await this.props.supabase.auth.getUser();

    //let file = values.image.file  // dont use "value.image.file" it has an error in upload
    let pictureName = user.id + Date.now() + ".png";

    const { data, error } = await this.props.supabase.storage
      .from("items")
      .upload(pictureName, this.file, {
        cacheControl: "3600",
        upsert: false,
      });

    let imageData = data; //.path

    if (user != null) {
      const { data, error } = await this.props.supabase
        .from("menu_items")
        .insert([
          {
            name: values.name,
            description: values.description,
            price: values.price,
            user: user.email,
            image: imageData.path,
          },
        ]);

      if (error != null) {
        console.log(error);
      } else {
        this.setState({
          createdItem: true,
        });
      }
    }
  }

  choosePart = () => {
    console.log("click");
    this.imageClicable.current.src = "/manga_derecha_selected.png";
  };

  mouseOver = () => {
    console.log("over");
    this.imageClicable.current.src = "/manga_derecha_over.png";
  };

  mouseOut = () => {
    console.log("out");
    this.imageClicable.current.src = "/manga_derecha.png";
  };

  render() {
    if (this.state.createdItem) {
      return (
        <Result
          status="success"
          title="Plato creado"
          subTitle="Su plato está listo para añadirlo al menú"
          extra={[
            <Button
              type="primary"
              key="myItemsButton"
              onClick={() => this.props.navigate("/userItems")}
            >
              Ir a mis platos
            </Button>,
            <Button
              key="createItemButton"
              onClick={() => this.setState({ createdItem: false })}
            >
              Crear otro plato
            </Button>,
          ]}
        />
      );
    }

    return (
      <Card>
        <Form
          name="basic"
          labelCol={{ span: 24 / 3 }}
          wrapperCol={{ span: 24 / 3 }}
          size="Large"
          onFinish={(values) => this.sendCreateItem(values)}
          autoComplete="off"
        >
          <Form.Item
            label="Nombre del plato"
            name="name"
            rules={[{ required: true, message: "Please input a title!" }]}
          >
            <Input placeholder="Pizza Margarita"/>
          </Form.Item>

          <Form.Item
            label="Descripción"
            name="description"
            rules={[{ required: true, message: "Please input a description!" }]}
          >
            <Input.TextArea placeholder=" Deliciosa pizza con salsa de tomate, queso mozzarella y albahaca fresca." />
          </Form.Item>

          <Form.Item
            label="Precio"
            name="price"
            rules={[{ required: true, message: "Please input a price!" }]}
          >
            <InputNumber placeholder=" 9.99"/>
          </Form.Item>

          <Form.Item
            wrapperCol={{ xs: { offset: 0 }, sm: { offset: 8, span: 24 / 3 } }}
            name="image"
          >
            <Upload
              action={(file) => {
                this.changeValueImage(file);
              }}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Subir imágen</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            wrapperCol={{ xs: { offset: 0 }, sm: { offset: 8, span: 24 / 3 } }}
          >
            <Button type="primary" htmlType="submit" block>
              Agregar plato
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default withRouter(ItemCreateForm);
