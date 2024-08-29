import React from "react";
import PageContainer from "../container/PageContainer"
import { useEffect, useState } from "react";
import { request } from "../../config/api.config"
import { formatDateForClient, isEmptyOrNull } from "../../config/service"
import { Button, List, Space, Table, message, Popconfirm } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import ModalForm from "./ModalForm";
const numberToStringToQuote = (number) => {
    return `"${number}"`;
  };
const PagePriority = () => {
    const number = 12345;
    const stringWithQuote = numberToStringToQuote(number);
    console.log(stringWithQuote)
    const onCloseModalForm = () => {
        setVisibleModal(false)
        setItems(null)
    }
    const [items, setItems] = useState(null)
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false)
    const [visibleModal, setVisibleModal] = useState(false)
    const onClickBtnRight = () => {
        setVisibleModal(true)
    }


    const onClickDeleteBtn = (id) => {
        setLoading(true)
        request("delete", "admin/priority/deleteById/" + id, {}).then(res => {
            if (res.status == 200) {
                message.success(res.data.message)
                getList()
                setLoading(false)
            }
        })
    }


    const onClickEditBtn = (param) => {
        setItems(param)
        setVisibleModal(true)
    }

    const getList = () => {
        setLoading(true)
        request("get", "admin/priority", {}).then(res => {
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
    const onFinish = (item) => {
        setVisibleModal(false)
        setLoading(true)
        //console.log(item)
        var body = {
            "prio_id": item.prio_id,
            "prio_name": item.prio_name,
            "effectiveDate": dayjs(item.effectiveDate).format("YYYY-MM-DD"),
            "expDate": dayjs(item.expDate).format("YYYY-MM-DD")
        }
        var method = "post"
        var url = "admin/priority/add"
        if (items != null) {
            method = "put"
            url = "admin/priority/update/" + body.prio_id
            body.prio_id = body.prio_id
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

    const columns = [
        {
            title: 'ID',
            dataIndex: "prio_id",
            key: 'prio_id',
        },
        {

            title: 'Name',
            dataIndex: 'prio_name',
            key: 'prio_name',
        },
        {
            title: 'Effective Date',
            dataIndex: 'effectiveDate',
            key: 'effectiveDate',
            render: (item) => formatDateForClient(item)
        }
        ,
        {
            title: 'Expire Date',
            dataIndex: "expDate",
            key: 'expDate',
            render: (item) => formatDateForClient(item)
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
                            description={"Are sure to remove this Iso user"}
                            onConfirm={() => onClickDeleteBtn(items.prio_id)}
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
            pageTitle='Priority'
            btnRight="New Priority"
            loading={loading}
            onClickBtnRight={onClickBtnRight}
            search={{
                title: "Priority",
                allowClear: true
            }}
        >
             <Table dataSource={data} columns={columns} />
             <ModalForm
                items={items}
                open={visibleModal}
                title={items != null ? "Update Priority" : "New Priority"}
                onCancel={onCloseModalForm}
                onFinish={onFinish}
            />
        </PageContainer>
    )
};

export default PagePriority;