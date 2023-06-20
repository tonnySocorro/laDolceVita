import React from "react";
import withRouter from "./withRouter";
import { Typography, Descriptions, Image } from "antd";
import { PageHeader } from "@ant-design/pro-layout";

import { Button } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { InputNumber } from "antd";
import "./itmeDeatilsList.css";
import { Row, Col } from 'antd';
const { Text } = Typography;
class ItemDetails extends React.Component {
  constructor(props) {
    super(props);
    this.id = this.props.params.id;
    this.state = {
      item: {},
      valueInputCount: 1,
    };
    this.getItemDetails();
  }

  buyItem = async () => {
    const {
      data: { user },
    } = await this.props.supabase.auth.getUser();

    if (user != null) {
      const { data, error } = await this.props.supabase
        .from("orders_with_mail")
        .insert([
          {
            item_id: this.state.item.id,
            quantity: this.state.valueInputCount,
            status: "creado",
            user_email: user.email,
          },
        ]);

      const { data: dataMenu } = await this.props.supabase
        .from("sale_menu")
        .select("*");

      notification.info({
        message: "Producto añadido correctamente al carrito",
        duration: 3,
        description: "El elemento ha sido añadido correctamente",
      });

      if (error != null) {
        console.log(error);
      }
    } else {
      notification.error({
        message: "Error",
        duration: 3,
        description:
          "Debes autenticarte para poder añadir productos al carrito",
      });
    }
  };

  getItemDetails = async () => {
    const { data, error } = await this.props.supabase
      .from("menu_items")
      .select()
      .eq("id", this.id);

    if (error == null && data.length > 0) {
      const item = data[0];
      const imageUrl = `https://pxdzokovubskxtsaefra.supabase.co/storage/v1/object/public/items/${item.image}`;
      item.imageUrl = imageUrl;
      this.setState({
        item: item,
      });
    }
  };

  onChangeInputCount = (value) => {
    this.setState({ valueInputCount: value });
  };

  render() {
    const { Text } = Typography;

    return (
      <PageHeader
        title={this.state.item.name}
        ghost={false}
        onBack={() => window.history.back()}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            {this.state.item.imageUrl && <Image src={this.state.item.imageUrl} style={{ width: '100%', maxWidth: '400px' }} />}
          </Col>
          <Col span={16}>
            <div style={{ padding: '14px' }}>
              <Descriptions title={this.state.item.title} bordered >
                <Descriptions.Item label="Descripción:">
                  {this.state.item.description}
                </Descriptions.Item>
                {this.state.item.price && (
                  <Descriptions.Item label="Precio:">
                    <Text strong style={{ fontSize: 20 }}>{`${this.state.item.price} €`}</Text>
                  </Descriptions.Item>
                )}
              </Descriptions>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
                <InputNumber
                  min={1}
                  style={{ width: '3.5rem', marginRight: '0.2rem' }}
                  value={this.state.valueInputCount}
                  onChange={this.onChangeInputCount.bind(this)}
                />
                <Button
                  type="primary"
                  onClick={() => this.buyItem()}
                  icon={<ShoppingOutlined />}
                  size="large"
                >
                  Añadir al carrito
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </PageHeader>
    );
  }
}

export default withRouter(ItemDetails);
