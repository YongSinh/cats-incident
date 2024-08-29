import { useEffect, useState } from "react";
import { request } from "../../config/api.config"
import { Button, List, Space, Table ,message,Popconfirm} from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { formatDateForClient,isEmptyOrNull } from "../../config/service"
import PageContainer from "../container/PageContainer"
import ModalForm from "./ModelForm";
import dayjs from "dayjs";
import { Container } from "react-bootstrap";
import './User.css'
const User = () => {
    const [items, setItems] = useState(null)
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false)
    const [visibleModal, setVisibleModal] = useState(false)
    const [EmInfor, setEmInfor] = useState([])
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
       // console.log(param)
    }

    const onFinish = (item) => {
        setVisibleModal(false)
        setLoading(true)
        //console.log(item)
        var body = {
            "em_ID": item.em_ID,
            "username": item.username,
            "dept": item.dept,
            "section": item.section,
            "startDate": dayjs(item.startDate).format("YYYY-MM-DD"),
            "endDate": dayjs(item.endDate).format("YYYY-MM-DD")

        }
        var method = "post"
        var url = "admin/isousers/add"
        if (items != null) {
            method = "put"
            url = "admin/isousers/update/" + body.em_ID
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
        request("delete", "admin/isousers/delete/" + id, {}).then(res => {
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
            param = "findByName/?name="+text // query parameter
            // param += "&from_date=2023-05-02&to_date=2023-05-02" // YYYY-MM-DD
        }
        request("get","admin/isousers/"+param,{}).then(res=>{
            setLoading(false)
            if(res.status == 200){
                var data = res.data 
                setdata(data.data)
            }
        })
    }

    const getEmInfor = (item) => {

    }
    
    // var Dept =EmInfor.map((requests) => {
    //   return  requests.poDepartment
    //     // form.setFieldsValue({
    //     //     fromDept: `${requests.poDepartment}`,
    //     //     fromGroup: `${requests.poSection}`,
    //     //     fromLocal: `${requests.emWorksite}`
    //     // });
    // });
    // console.log(Dept)

    const onChange = (event) => {
        setLoading(true)
        request("get", "Em/getEmById/" + event.target.value, {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data
                setEmInfor([data.data])
                //console.log(EmInfor)
            }
        })
    };

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
            dataIndex: "em_ID",
            key: 'em_ID',
        },
        {

            title: 'Name',
            dataIndex: 'username',
            key: 'username',
        },
        {
            key: 'dept',
            title: 'Dapartment',
            dataIndex: "dept"

        }
        ,
        {
            title: 'Section',
            dataIndex: "section",
            key: 'section',
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
                            description={"Are sure to remove this Iso user"}
                            onConfirm={() => onClickDeleteBtn(items.em_ID)}
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

 
    const getList = () => {
        setLoading(true)
        request("get", "admin/isousers", {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data
                setdata(data.data)
                // console.log(data.data.length)
               // console.log(data)
            }
        })
    }

    return (


        <PageContainer
            pageTitle='ISO User'
            btnRight="New ISO User"
            loading={loading}
            onClickBtnRight={onClickBtnRight}
            search={{
                title : "ISO User",
                allowClear:true
            }}
            onSearch={onSearch}
        >
            <Table dataSource={data} columns={columns} />
            <ModalForm
                items={items}
                open={visibleModal}
                title={items != null ? "Update ISO User" : "New ISO User"}
                onCancel={onCloseModalForm}
                onFinish={onFinish}
                EmInfor={EmInfor}
                onChange={onChange}

            />
        </PageContainer>

    )
};

export default User;