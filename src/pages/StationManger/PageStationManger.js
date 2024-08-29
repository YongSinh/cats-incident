import { useEffect, useState } from "react";
import { request } from "../../config/api.config"
import { Button, List, Space, Table ,message,Popconfirm} from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { formatDateForClient,isEmptyOrNull } from "../../config/service"
import PageContainer from "../container/PageContainer"
import ModalForm from "./ModelForm";
import dayjs from "dayjs";
import './PageStationManger.css'
const PageStationManger = () => {
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
        request("get", "admin/StationManager", {}).then(res => {
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
            "id": item.id,
            "fullName": item.fullName,
            "email": item.email,
            "phone": item.phone,
            "station": item.station,
            "startDate": dayjs(item.startDate).format("YYYY-MM-DD"),
            "endDate": dayjs(item.endDate).format("YYYY-MM-DD")
        }
        var method = "post"
        var url = "StationManager/add"
        if (items != null) {
            method = "put"
            url = "admin/StationManager/update/" + body.id
            body.id = body.id
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
        request("delete", "admin/StationManager/delete/" + id, {}).then(res => {
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
        if(!isEmptyOrNull(text)){
            param = "findByName?name="+text // query parameter
            // param += "&from_date=2023-05-02&to_date=2023-05-02" // YYYY-MM-DD
        }
        request("get","admin/StationManager/"+param,{}).then(res=>{
            setLoading(false)
            if(res.status == 200){
                var data = res.data 
                setdata(data.data)
            }
        })
    }

    useEffect(() => {
        getList()
    }, [])

    const columns = [

        {
            title: "No",
            render: (item, items, index) => index + 1,
            key: "No"
        },

        {
            title: 'ID',
            dataIndex: "id",
            key: 'id',
        },
        {

            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            key: 'email',
            title: 'Email',
            dataIndex: "email"

        }
        ,
        {
            title: 'Phnoe Number',
            dataIndex: "phone",
            key: 'phone',
        }
        ,

        {
            title: 'Station',
            dataIndex: "station",
            key: 'station',
        }
        ,

        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (item) => formatDateForClient(item)
        }
        ,
        {
            title: 'End Date',
            dataIndex: "endDate",
            key: 'endDate',
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
                            description={"Are sure to remove this Station Manager"}
                            onConfirm={() => onClickDeleteBtn(items.id)}
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
            pageTitle='Station Manager'
            btnRight="New Station Manager"
            loading={loading}
            onClickBtnRight={onClickBtnRight}
            search={{
                title : "StationManager",
                allowClear:true
            }}
            onSearch={onSearch}
        >
            <Table dataSource={data} columns={columns} />
            <ModalForm
                items={items}
                open={visibleModal}
                title={items != null ? "Update Station Manager" : "NewStation Manager"}
                onCancel={onCloseModalForm}
                onFinish={onFinish}

            />
        </PageContainer>

    )
};

export default PageStationManger;