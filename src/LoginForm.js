import React from 'react';
import { Button, Form, Input } from 'antd';
import { Card } from 'antd';

class LoginForm extends React.Component {


  sendLogin(values){
    this.props.callBackOnFinishLoginForm({
        email: values.email,
        password : values.password,
    });
  }

  
    render() {
      return (
        <div>
          <Card>
            <Form name="basic" labelCol={{span: 24/3}} wrapperCol={{ span: 24/3}} 
              initialValues={{remember: true,}}
              onFinish={ values => this.sendLogin(values) } autoComplete="off">

              <Form.Item label="Correo" name="email"
                rules={[ 
                  { required: true,message: 'Introduzca su correo',},
                ]}>
                <Input />
              </Form.Item>

              <Form.Item label="Contraseña"  name="password"
                rules={[
                  { required: true, message: 'Introduzca su contraseña', },
                ]}>
                <Input.Password />
              </Form.Item>

              <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
                <Button type="primary" htmlType="submit" block>Iniciar sesión</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
   
      )
    }
  }

  export default LoginForm;
