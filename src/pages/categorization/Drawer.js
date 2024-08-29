import { Button, Drawer, Radio, Space, Form, Input, Divider } from 'antd';
import { useState } from 'react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import dayjs from "dayjs";

const DrawerPage = ({
    open = false,
    title = null,
    footer = null,
    onClose,
    items,
}

) => {

    const handleCancel = () => {

        onClose()
    }


    const [form] = Form.useForm() // 

    const today = new Date();
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    React.useEffect(() => {
        if (items != null) {
            form.setFieldsValue({
                cate_id: items.cate_id,
                cateo_name: items.cateo_name,
                effectiveDate: dayjs(items.effectiveDate).format("YYYY-MM-DD"),
                expDate: dayjs(items.expDate).format("YYYY-MM-DD")
            })
        }
    }, [items])


    return (
        <>
            <Drawer
                title="Categorization"
                placement={"right"}
                width={500}
                onClose={handleCancel}
                open={open}
                extra={
                    <Space>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" onClick={handleCancel}>
                            OK
                        </Button>
                    </Space>
                }
            >
                <Form
                    disabled={true}
                    form={form}
                    layout='vertical'
                    initialValues={{
                        status: 1
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                >

                    <Form.Item
                        label={"ID"}
                        name={"cate_id"}
                    >
                        <Input

                        />
                    </Form.Item>

                    <Form.Item
                        label={"Name"}
                        name={"cateo_name"}
                    >
                        <Input

                        />
                    </Form.Item>

                    <Form.Item
                        label={"Effective Date"}
                        name={"effectiveDate"}
                    >
                        <DatePicker
                            disabled={true}
                            className="datepicker"
                            selected={startDate}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate} // add the endDate to your startDate DatePicker now that it is defined

                        />

                    </Form.Item>


                    <Form.Item
                        label={"Expire Date"}
                        name={"expDate"}
                    >
                        <DatePicker
                            disabled={true}
                            className="datepicker"
                            selected={endDate}
                            selectsStart
                            startDate={endDate}
                            endDate={endDate} // add the endDate to your startDate DatePicker now that it is defined

                        />

                    </Form.Item>

                </Form>
            </Drawer>
        </>
    );
};
export default DrawerPage;