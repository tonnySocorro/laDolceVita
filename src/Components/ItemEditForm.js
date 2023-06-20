import React from 'react';
import { Button, InputNumber, Form, Input, notification} from 'antd';
import { Card } from 'antd';
import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';


export default function ItemEditForm(props) {
    // get the URL param ID
    const { id } = useParams();
    let item = {}

    let [ count, setCount ] = useState(0);

    let formRef = useRef();


    let modifyCount = () => {
        console.log("count "+count)
        setCount(count+1) // The UPDATE is NOT in REAL TIME, be careful
        console.log("count "+count)
      }

      

    let getItemDetails = async () => {
        console.log("getItemDetails")
        const { data, error } = await props.supabase
          .from('menu_items')
          .select()
          .eq('id', id )
  
        if ( error == null && data.length > 0){
          item = data[0]

          formRef.current.setFieldsValue({
            name: item.name,
            description : item.description,
            price : item.price
          });


        }
      }

    useEffect(() => {
        getItemDetails();
    }, []);


    useEffect(() => {
        console.log("useEffect count changed")
      }, [count]);

    const updateItem = async (value) => {
        const { data, error } = await props.supabase
            .from('menu_items')
            .update({ 
            name: value.name,
            description : value.description,
            price : value.price
            })
            .eq('id', id)
            .select()

        if ( error == null && data != null){
            item = data;
            notification.success({
              message: 'plato actualizado',
              duration: 3,
              description: 'El plato ha sido actualizado correctamente',
            });
    
        }
    }
  
    return (
      <Card>
        <Form 
            onFinish={ values => updateItem(values) } 
            ref={formRef} name="basic" labelCol={ {span: 24/3} } 
          wrapperCol={{ span: 24/3}}  size="Large" autoComplete="off" >

          <Form.Item label="Nombre" name="name"
            rules={[ 
              { required: true,message: 'Please input a title!',},
            ]}>
            <Input/>
          </Form.Item>

          <Form.Item label="Description"  name="description"
            rules={[
              { required: true, message: 'Please input a description!', },
            ]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Price"  name="price"
            rules={[
              { required: true, message: 'Please input a price!', },
            ]}>
              <InputNumber />
          </Form.Item>

          <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
            <Button onClick={ () => { modifyCount() }}   type="primary" htmlType="submit"  block>Save Item</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  
}
