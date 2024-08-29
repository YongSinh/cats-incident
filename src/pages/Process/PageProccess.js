import { useEffect, useState } from "react";
import { request } from "../../config/api.config"
import { Button, List, Space, Table, message, Popconfirm } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { formatDateForClient, isEmptyOrNull } from "../../config/service"
import PageContainer from "../container/PageContainer"
import ModalForm from "./ModalForm";
import dayjs from "dayjs";

import './PageProccess.css'
const PageProccess = () => {


    const [items, setItems] = useState(null)
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false)
    const [visibleModal, setVisibleModal] = useState(false)
    const onClickBtnRight = () => {
        setVisibleModal(true)
    }
    const handleOpenModal = () => {
        setVisibleModal(true);
    };
    const onCloseModalForm = () => {
        setVisibleModal(false)
        setItems(null)
    }

    const onClickEditBtn = (param) => {
        setItems(param)
        setVisibleModal(true)
    }

    const onFinish = (item) => {
        setVisibleModal(false)
        setLoading(true)
       // console.log(item)
        var body = {
            "pro_id": item.pro_id,
            "pro_name": item.pro_name,
        }
        var method = "post"
        var url = "admin/process/add"
        if (items != null) {
            method = "put"
            url = "admin/process/update/" + body.em_ID
            body.em_ID = body.em_ID
            // form.append("service_id",items.service_id)
        }

        request(method, url, body).then(res => {
            if (res.status == 200) {
                message.success(res.data.message)
                setItems(null)
                getList()
            }
        })

    }

    const onClickDeleteBtn = (id) => {
        setLoading(true)
        request("delete", "admin/process/delete/" + id, {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                message.success(res.data.message)
                getList()
            }
        })
    }
    const onSearch = (text) => {
        setLoading(true)
        var param = ""
        if (!isEmptyOrNull(text)) {
            param = "findById/" + text // query parameter
            // param += "&from_date=2023-05-02&to_date=2023-05-02" // YYYY-MM-DD
        }
        request("get", "admin/rocess/" + param, {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data
                setdata(data.data)
            }
        })
    }

    useEffect(() => {
        getList()
    }, [])

    const getList = () => {
        setLoading(true)
        request("get", "admin/process", {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data
                setdata(data.data)
                // console.log(data.data.length)
                //console.log(data)
            }
        })
    }


    const columns = [

        {
            title: 'ID',
            dataIndex: "pro_id",
            key: 'pro_id',
        },
        {

            title: 'Name',
            dataIndex: 'pro_name',
            key: 'pro_name',
        },
        {
            title: "Action",
            key: "Action",
            render: (item, items, index) => {
                return (
                    <Space>
                        <Popconfirm
                            placement="topRight"
                            title={"Delete"}
                            description={"Are sure to remove this status"}
                            onConfirm={() => onClickDeleteBtn(items.pro_id)}
                            okText="Delete"
                            cancelText="No"
                        >
                            <Button danger={true} size="small">
                                <DeleteFilled />
                            </Button>
                        </Popconfirm>
                        <Button onClick={() => onClickEditBtn(items)} size='small' type="primary" ><EditFilled /></Button>
                    </Space>
                )
            }
        },


    ];


    return (


        <PageContainer
            pageTitle='Process'
            btnRight="New Process"
            loading={loading}
            onClickBtnRight={onClickBtnRight}
            search={{
                title: "Process",
                allowClear: true
            }}
        //onSearch={onSearch}
        >
            <Table dataSource={data} columns={columns} />
            <ModalForm
                items={items}
                open={visibleModal}
                title={items != null ? "Update status" : "New status"}
                onCancel={onCloseModalForm}
                onFinish={onFinish}

            />
        </PageContainer>

    )
};

export default PageProccess;