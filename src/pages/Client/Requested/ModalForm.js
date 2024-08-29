import { MailTwoTone, SendOutlined } from "@ant-design/icons";
import {
  Button, Col, Divider, Form, Input, Modal, Row, Select, Space,
} from "antd"
import DatePicker from "react-datepicker";
import { request } from "../../../config/api.config";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { useState } from 'react';
const { TextArea } = Input;
const ModalForm = ({
  open = false,
  title = null,
  footer = null,
  onCancel,
  onOk,
  onFinish,
  items,
  mailFrom

}) => {

  const [form] = Form.useForm() // 

  React.useEffect(() => {
    if (items != null) {
      request("get", "Em/getEmEmail/" + items.isoby, {}).then(res => {
        if (res.status == 200) {
            var data = res.data
            form.setFieldsValue({
              id: items.id,
              from:mailFrom.EmEmail,
              mailTo:data.data.EmEmail
            })
        }
        else{
          console.info("ID has not yet defined it, but don't worry, it will be defined when you click the button message.")
        }
         
    })   
    .catch(error => {
      console.log(error)  
  });

    }
  }, [items])




  const handleCancel = () => {
    form.resetFields() // clear data in form
    onCancel()
  }


  return (
    <Modal
      open={open}
      title={title}
      onCancel={handleCancel}
      onOk={onOk}
      footer={footer}
      maskClosable={false}
    //width={"50%"}
    >

      <Form
        form={form}
        name="form_category"
        layout='vertical'
        onFinish={(item) => {
          form.resetFields()
          onFinish(item)
        }}

        initialValues={{
          status: 1
        }}
      >
        <Divider />

        <Form.Item
          label={"Req ID"}
          name={"id"}
          rules={[{
            required: true, message: 'Please input ID!'
          }]}
        >
          <Input
            placeholder="ID"
          />
        </Form.Item>

        <Form.Item
          labelCol={{ style: { width: 200 } }}
          label="From"
          name="from"
          rules={[
            {
                required: true,
                message: 'Please input your Email!',
            },
        ]}
        >
            <Input  prefix={<MailTwoTone />} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          labelCol={{ style: { width: 200 } }}
          label="Recipients"
          name="mailTo"
          rules={[
            {
                required: true,
                message: 'Please input your Email!',
            },
        ]}
        >
          <Input  prefix={<MailTwoTone />} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          labelCol={{ style: { width: 200 } }}
          label="Subject"
          name="subject"
          rules={[
            {
                required: true,
                message: 'Please input your Subject!',
            },
        ]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          labelCol={{ style: { width: 200 } }}
          label="Body"
          name="body"
          rules={[
            {
                required: true,
                message: 'Please input your description!',
            },
        ]}
        >
          <TextArea
            showCount
            maxLength={300}
            style={{
              height: 120,
              marginBottom: 24,
            }}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType='submit'><SendOutlined />Send</Button>
          </Space>
        </Form.Item>

      </Form>

    </Modal>
  )
}

export default ModalForm;

