import React from "react";
import { Button, Form, Input, Typography ,Row,Col} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import withRouter from "./withRouter";

class SignUp extends React.Component {
  sendSignUp(values) {
    this.props
      .callBackOnFinishSignUpForm({
        email: values.email,
        password: values.password,
      })
      .then(() => {
        this.props.navigate("/");
      });
  }

  render() {
    return (
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Typography.Title level={2} style={{ textAlign: 'center' }}>
            Regístrate
          </Typography.Title>
          <Form
            name="signup"
            onFinish={(values) => this.sendSignUp(values)}
            layout="vertical"
          >
            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                { required: true, message: 'Por favor, introduce tu correo electrónico' },
              ]}
              wrapperCol={{ span: 24 }}
            >
              <Input prefix={<UserOutlined />} placeholder=" uo296392@uniovi.es"/>
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'Por favor, introduce tu contraseña' }]}
              wrapperCol={{ span: 24 }}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit" block>
                Registrarse
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default withRouter(SignUp);
