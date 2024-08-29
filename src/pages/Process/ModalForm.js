import { SaveFilled } from "@ant-design/icons";
import {
    Button, Col, Divider, Form, Image, Input, Modal,  Row, Select, Space,
} from "antd"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { useState } from 'react';

const ModalForm = ({
    open = false,
    title = null,
    footer = null,
    onCancel,
    onOk,
    onFinish,
    items,
}) => {

    const [form] = Form.useForm() // 

    React.useEffect(() => {
        if (items != null) {
            form.setFieldsValue({
                pro_id: items.pro_id,
                pro_name: items.pro_name,
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
                    label={"ID"}
                    name={"pro_id"}
                    rules={[{
                        required: true, message: 'Please input ID!'
                    }]}
                >
                    <Input
                        placeholder="ID"
                    />
                </Form.Item>

                <Form.Item
                    label={"Name"}
                    name={"pro_name"}
                    rules={[{
                        required: true, message: 'Please input name!'
                    }]}
                >
                    <Input
                        placeholder="Department Name"
                    />
                </Form.Item>

                <Form.Item style={{ textAlign: 'right' }}>
                    <Space>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" htmlType='submit'><SaveFilled />{items != null ? "Update" : "Save"}</Button>
                    </Space>
                </Form.Item>

            </Form>

        </Modal>
    )
}

export default ModalForm;

