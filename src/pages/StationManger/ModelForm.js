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
                id: items.id,
                fullName: items.fullName,
                email: items.email,
                phone: items.phone,
                station: items.station,
                startDate: dayjs(items.startDate).format("YYYY-MM-DD"),
                endDate: dayjs(items.endDate).format("YYYY-MM-DD")
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
                    label={"Name"}
                    name={"fullName"}
                    rules={[{
                        required: true, message: 'Please input full Name!'
                    }]}
                >
                    <Input
                        placeholder="Department Name"
                    />
                </Form.Item>


                <Form.Item
                    label={"Email"}
                    name={"email"}
                    rules={[{
                        required: true, message: 'Please input email!'
                    }]}
                >
                    <Input
                        placeholder="email"
                    />
                </Form.Item>

                <Form.Item
                    label={"Phone"}
                    name={"phone"}
                    rules={[{
                        required: true, message: 'Please input phone number!'
                    }]}
                >
                    <Input
                        placeholder="Phone Number"
                    />
                </Form.Item>

                <Form.Item
                    label={"Station"}
                    name={"station"}
                    rules={[{
                        required: true, message: 'Please input phone number!'
                    }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a Station"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            {
                                value: 'VDPP',
                                label: 'VDPP',
                            },
                            {
                                value: 'VDSR',
                                label: 'VDSR',
                            },
                            {
                                value: 'VDSV',
                                label: 'VDSV',
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label={"Start Date"}
                    name={"startDate"}
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
                    label={"End Date"}
                    name={"endDate"}
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

