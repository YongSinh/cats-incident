import { SaveFilled } from "@ant-design/icons";
import {
    Button, Col, Divider, Form, Image, Input, Modal, Row, Select, Space,
} from "antd"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { useState } from 'react';
import dayjs from "dayjs";

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
    const today = new Date();


    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    React.useEffect(() => {
        if (items != null) {
            form.setFieldsValue({
                prio_id: items.prio_id,
                prio_name: items.prio_name,
                effectiveDate: dayjs(items.effectiveDate).format("YYYY-MM-DD"),
                expDate: dayjs(items.expDate).format("YYYY-MM-DD")
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
                name="form_priority"
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
                    name={"prio_id"}
                    rules={[{
                        required: true, message: 'Please input prio_id!'
                    }]}
                >
                    <Input
                        placeholder="ID"
                    />
                </Form.Item>

                <Form.Item
                    label={"Name"}
                    name={"prio_name"}
                    rules={[{
                        required: true, message: 'Please input prio_name!'
                    }]}
                >
                    <Input
                        placeholder="Name"
                    />
                </Form.Item>

                <Form.Item
                    label={"Effective Date"}
                    name={"effectiveDate"}
                >
                    <DatePicker

                        className="datepicker"
                        selected={startDate}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate} // add the endDate to your startDate DatePicker now that it is defined
                        onChange={date => setStartDate(date)}
                    />

                </Form.Item>


                <Form.Item
                    label={"Expire Date"}
                    name={"expDate"}
                >
                    <DatePicker

                        className="datepicker"
                        selected={endDate}
                        selectsStart
                        startDate={endDate}
                        endDate={endDate} // add the endDate to your startDate DatePicker now that it is defined
                        onChange={date => setEndDate(date)}
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

