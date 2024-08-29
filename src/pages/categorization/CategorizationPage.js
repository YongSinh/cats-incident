import React from "react";
import { useEffect, useState } from "react";
import { request } from "../../config/api.config"
import { Button, List, Space, Table, message, Popconfirm } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { formatDateForClient, isEmptyOrNull } from "../../config/service"
import PageContainer from "../container/PageContainer"
import dayjs from "dayjs";
import ModalForm from "./ModelForm";
import DrawerPage from "./Drawer"
import { faBriefcase, faClockRotateLeft, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const CategorizationPage = () => {


    const [open, setOpen] = useState(false);
    const showDrawer = (param) => {
        setItems(param)
        setOpen(true);
    };

    const onCloseDrawer = () => {
        setOpen(false);
    };

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

    const getList = () => {
        setLoading(true)
        request("get", "admin/categorization", {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data
                setdata(data.data)
                // console.log(data.data.length)
                //console.log(data)
            }
        })
    }

    const onFinish = (item) => {
        setVisibleModal(false)
        setLoading(true)
        //console.log(item)
        var body = {
            "cate_id": item.cate_id,
            "cateo_name": item.cateo_name,
            "effectiveDate": dayjs(item.effectiveDate).format("YYYY-MM-DD"),
            "expDate": dayjs(item.expDate).format("YYYY-MM-DD")
        }
        var method = "post"
        var url = "admin/categorization/add"
        if (items != null) {
            method = "put"
            url = "admin/categorization/update/" + body.cate_id
            body.cate_id = body.cate_id
            //form.append("service_id",items.service_id)
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
        request("delete", "admin/categorization/Delete/" + id, {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                message.success(res.data.message)
                getList()
            }
        })
    }

    // const onSearch = (text) => {
    //     setLoading(true)
    //     var param = ""
    //     if (!isEmptyOrNull(text)) {
    //         param = "findByName/?name=" + text // query parameter
    //         // param += "&from_date=2023-05-02&to_date=2023-05-02" // YYYY-MM-DD
    //     }
    //     request("get", "isousers/" + param, {}).then(res => {
    //         setLoading(false)
    //         if (res.status == 200) {
    //             var data = res.data
    //             setdata(data.data)
    //         }
    //     })
    // }

    useEffect(() => {
        getList()
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: "cate_id",
            key: 'cate_id',
        },
        {

            title: 'Name',
            dataIndex: 'cateo_name',
            key: 'cateo_name',
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
                            onConfirm={() => onClickDeleteBtn(items.cate_id)}
                            okText="Delete"
                            cancelText="No"
                        >
                            <Button danger={true} size="small">
                                <DeleteFilled />
                            </Button>
                        </Popconfirm>
                        <Button onClick={() => onClickEditBtn(items)} size='small' type="primary" ><EditFilled /></Button>
                        <Button type="primary" size='small' onClick={() => showDrawer(items)}><FontAwesomeIcon icon={faEye} /></Button>
                    </Space>
                )
            }
        },


    ];


    return (
        <PageContainer
            pageTitle='Categorization'
            btnRight="New Categorization"
            loading={loading}
            onClickBtnRight={onClickBtnRight}
            search={{
                title: "Categorization",
                allowClear: true
            }}
        // onSearch={onSearch}
        >
            <Table dataSource={data} columns={columns} />
            <ModalForm
                items={items}
                open={visibleModal}
                title={items != null ? "Update ISO User" : "New ISO User"}
                onCancel={onCloseModalForm}
                onFinish={onFinish}
            />

            <DrawerPage
                items={items}
                open={open}
                closable={false}
                onClose={onCloseDrawer}
            />
        </PageContainer>


    )
};

export default CategorizationPage;