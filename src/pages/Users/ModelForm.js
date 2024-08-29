import { SaveFilled } from "@ant-design/icons";
import {
    Button, Col, Divider, Form, Image, Input, Modal, Row, Select, Space,
} from "antd"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { useState } from 'react';




// const isDateValid = (dateString) => {
//     const isValidDate = new Date(dateString).toLocaleDateString("en-US") === dateString;
//     return isValidDate;
//   };



const ModalForm = ({
    open = false,
    title = null,
    footer = null,
    onCancel,
    onOk,
    onFinish,
    items,
    EmInfor,
    onChange


}) => {

    const [form] = Form.useForm() // 
    const today = new Date();


    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);


    // const [date1, setdate1] = useState(new Date()); // return current date
    // const [date2, setdate2] = useState(new Date()); // return current date

    React.useEffect(() => {
        if (items != null) {
            form.setFieldsValue({
                em_ID: items.em_ID,
                username: items.username,
                dept: items.dept,
                section: items.section,
                // startDate: dayjs(items.startDate).format("YYYY-MM-DD"),
                // endDate: dayjs(items.endDate).format("YYYY-MM-DD")
            })
        } 
    }, [items])


        EmInfor.map((requests) => {
          form.setFieldsValue({
          dept: `${requests.poDepartment}`,
          section: `${requests.poSection}`,
          username: `${requests.firstName+' '+ requests.lastName}`,
          });
  });


    const handleCancel = () => {
        form.resetFields() // clear data in form
        onCancel()
    }

   // console.log(EmInfor)

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
                onChange={onChange}
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
                    name={"em_ID"}
                    rules={[{
                        required: true, message: 'Please input em_ID!'
                    }]}
                >
                    <Input
                        placeholder="ID"
                    />
                </Form.Item>

                <Form.Item
                    label={"Name"}
                    name={"username"}
                    rules={[{
                        required: true, message: 'Please input username!'
                    }]}
                >
                    <Input
                        placeholder="Department Name"
                    />
                </Form.Item>


                <Form.Item
                    label={"Department"}
                    name={"dept"}
                    rules={[{
                        required: true, message: 'Please input Department Name!'
                    }]}
                >
                    <Input
                        placeholder="Department Name"
                    />
                </Form.Item>

                <Form.Item
                    label={"Section"}
                    name={"section"}
                    rules={[{
                        required: true, message: 'Please input Section Name!'
                    }]}
                >
                    <Input
                        placeholder="Section Name"
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

