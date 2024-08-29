import { SaveFilled } from "@ant-design/icons";
import {
  Button, Col, Divider, Form, Image, Input, Modal, Row, Select, Space,
} from "antd"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";


const ModalForm = ({
  open = false,
  title = null,
  footer = null,
  onCancel,
  onOk,
  onFinish,
  items,
  ServiceDetail_list,
  autoFill,
  department,
  onchangedepartment


}) => {

  const [form] = Form.useForm() // 

  const onServiceChange = (value) => {
    const service = autoFill;
    service.map((requests) => {
      if (requests.service_id.includes(value)) {

        form.setFieldsValue({
          ForwardEmp: `${requests.isOusers.em_ID}`,
          ForwardDept: `${requests.dept_handler}`,
          ForwardSec: `${requests.sec_handler}`
        });

      }
    });

  };

  React.useEffect(() => {
    if (items != null) {
      form.setFieldsValue({
        id: items.id,
      })
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
          label="Department"
          rules={[
            {
              required: true,
              message: 'Please',
            },
          ]}
        >
          <Select
            showSearch
            style={{
              width: '100%',
            }}
            placeholder="Search to Select"
            optionFilterProp="children"
            options={department}
            onChange={onchangedepartment}
          />
        </Form.Item>
        <Form.Item
          labelCol={{ style: { width: 200 } }}
          label="Service"
          name="service_ID"
          rules={[
            {
              required: true,
              message: 'Please',
            },
          ]}
        >
          <Select
            showSearch
            onChange={onServiceChange}
            style={{
              width: '100%',
            }}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={ServiceDetail_list}
          />
        </Form.Item>

        <Form.Item
          labelCol={{ style: { width: 200 } }}
          label="Forward to Handler"
          name="ForwardEmp"
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          labelCol={{ style: { width: 200 } }}
          label="Forward to Department"
          name="ForwardDept"
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          labelCol={{ style: { width: 200 } }}
          label="Forward to Section"
          name="ForwardSec"
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType='submit'><SaveFilled />Forward</Button>
          </Space>
        </Form.Item>

      </Form>

    </Modal>
  )
}

export default ModalForm;

