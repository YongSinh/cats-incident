import React from "react";
import PageContainer from "../../container/PageContainer";
import { Button, message, Space, Table, Tag } from "antd"
import { useState, useEffect } from 'react';
import { EyeOutlined, InfoCircleFilled } from "@ant-design/icons";
import { request } from "../../../config/api.config";
import { isEmptyOrNull, formatDateForClient } from "../../../config/service";
import { useParams, Link } from "react-router-dom"
import UserService from "../../../UserService/UserService";
import { faBriefcase, faShareFromSquare, faReply } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalForm from "./ModalForm";
import dayjs from "dayjs";
import 'antd-button-color/dist/css/style.css'
const PageWorkTask = () => {
    useEffect(() => {
        getList()
        //role()
        getDepartment()
    }, [])

    const [visibleModal, setVisibleModal] = useState(false)
    const [mailFrom, setFrom] = useState([])
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState(null)
    const [ServiceDetail, setServiceDetail] = useState([])
    const [ServiceDetail1, setServiceDetail1] = useState([])
    const [department, setdepartment] = useState()
    
    useEffect(() => {
            getList()
      }, []);

    const onCloseModalForm = () => {
        setVisibleModal(false)
        setItems(null)
    }

    const onClickEditBtn = (param) => {
        setItems(param)
        setVisibleModal(true)
    }
    const UserId = localStorage.getItem("Id");
    const getmailFrom = async () => {
        setLoading(true)
        request("get", "Em/getEmEmail/" + UserId, {}).then(res => {
            if (res.status == 200) {
                setLoading(false)
                var data = res.data
                //console.log(data)
                setFrom(data.data)
            }
        })
    }

    
    const getDepartment = async () => {
        setLoading(true)
        request("get", "Em/getAllDept", {}).then(res => {
            if (res.status == 200) {
                setLoading(false)
                var data = res.data
                var arrTmpS = []
                data.data.map((item) => {
                    arrTmpS.push({
                        label: item.Dept,
                        value: item.Dept
                    })
                })
                setdepartment(arrTmpS)
            }
        })
    }

    const onchangedepartment = (value) => {
        setLoading(true)
        request("get", "admin/service", {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data
                setServiceDetail1(data.data.ServiceDetail)
                var arrTmpS = []
                const filtered = data.data.ServiceDetail.filter(item => {
                    return item.dept == value
                });
                

                filtered.map((item) => {
                    arrTmpS.push({
                        label: item.serviceName,
                        value: item.service_id
                    })
                })
                setServiceDetail(arrTmpS)
            }
        })
    }

    const getList = async () => {
        setLoading(true)
        request("get", "requests/findHandler/" + UserId, {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
   
                var data = res.data
                setdata(data.data)
                // console.log(data)
            }
        })
    }
    
    const onFinish = async (item) => {
        setVisibleModal(false)
        setLoading(true)
        //console.log(item)
    
        var body = {
            "saveRequestDto": {
                "service_ID": item.service_ID
            }
        }
       
        var method = "put"
        var url = "requestDetail/forward/" + item.id

        request(method, url, body).then(res => {
            if (res.status == 200) {
                message.success(res.data.message)
                setItems(null)
                getList()
            }
        })

    }
  
    const onSearch = (text) => {
        setLoading(true)
        var param = ""
        if(!isEmptyOrNull(text)){
            param = "requests/findById/"+text // query parameter
            request("get", param, {}).then((res) => {
                if (res.status == 200) {
                  var data = res.data;
                  setdata([data.data]);
                  setLoading(false);
                }
              });
        }else{
            param ="requests/findHandler/" + UserService.getUsername()
            request("get", param,{}).then(res=>{
                if(res.status == 200){
                    var data = res.data
                    setdata(data.data)
                    setLoading(false)
                }
            })
        }


    }

    

    return (

        <PageContainer
            // btnRight="New Incident Ticket"
            //onClickBtnRight={onClickView}
            pageTitle='My Tickets'
            loading={loading}
            search={{
                title: "Request ID",
                allowClear: true
            }}
            onSearch={onSearch}
        >
            <Table

                columns={[
                    {
                        title: "No",
                        render: (item, items, index) => index + 1,
                        key: "No",
                        fixed: true,

                    },
                    ,
                    {

                        title: 'Req ID',
                        dataIndex: 'id',
                        key: 'id',
                        fixed: true,
                        render: (item, items, index) => {
                            let color = item?.length > 5 ? 'geekblue' : 'green';
                            if (items.prioId == "Hight") {
                                color = 'red';
                            } else if (items.prioId == "Low") {
                                color = 'green';
                            } else if (items.prioId == "Medium") {
                                color = 'geekblue';
                            }
                            else if (items.prioId == "Critical") {
                                color = 'red';
                            }
                            else{
                                color = 'green';
                            }
                            return (
                                <Tag color={color} icon={<InfoCircleFilled/>}>
                                    {item}
                                </Tag>

                            )
                        }

                    },

                    {

                        title: 'Req.EmID',
                        dataIndex: 'fromEmp',
                        key: 'fromEmp',


                    },
                    {
                        key: 'FromDept',
                        title: 'Req.Dept',
                        dataIndex: "fromDept",

                    }
                    ,
                    {
                        title: 'Req.Sec',
                        dataIndex: "fromGroup",
                        key: 'FromGroup',
                    }
                    ,
                    {
                        title: 'Req.Location',
                        dataIndex: "fromLocal",
                        key: 'fromLocal',

                    }
                    ,
                    {
                        key: 'toDept',
                        title: 'Resp.Dept',
                        dataIndex: "toDept",

                    }
                    ,
                    {
                        title: 'Resp.Sec',
                        dataIndex: "toGroup",
                        key: 'toGroup',
                    }
                    ,
                    {

                        title: 'Service Type',
                        dataIndex: 'serviceID',
                        key: 'serviceID',
                    },
                    ,
                    {
                        title: 'Prioritization',
                        dataIndex: "prioId",
                        key: 'prioId',
                        render: (item, items, index) => {
                            let color = item?.length > 5 ? 'geekblue' : 'green';
                            if (items.prioId == "Hight") {
                                color = 'red';
                            } else if (items.prioId == "Low") {
                                color = 'green';
                            } else if (items.prioId == "Medium") {
                                color = 'geekblue';
                            }
                            else if (items.prioId == "Critical") {
                                color = 'red';
                            }
                            else{
                                color = 'green';
                            }
                            return (
                                <Tag color={color}>
                                    {item}
                                </Tag>

                            )
                        }

                    }
                    ,
                    {
                        title: 'Type of Requset',
                        dataIndex: "cateoId",
                        key: 'cateoId',
                        render: (item, items, index) => {
                            let color;
                            if (item == "Incident") {
                                color = 'geekblue';
                            } else {
                                color = 'green';
                            } 
                            return (
                                <Tag color={color}>
                                    {item}
                                </Tag>

                            )
                        }

                    },
                    {
                        title: 'Incident No',
                        render: (item, items, index) => {
                          
                            let num;
                            item.runNumber == null ? (num="000"):(num=item.runNumber) 
                            return(
                                dayjs(item.createDate).format("MMYYYY")+"~"+num
                            )
                            
                        }
                    },
                    {
                        title: 'Craete Date',
                        dataIndex: "createDate",
                        key: 'createDate',
                        render: (item) => formatDateForClient(item),
                    },

                    {
                        key: 'proId',
                        title: 'Status',
                        dataIndex: "proId",
                    
                        render: (item, items, index) => {
                            let color = item?.length > 5 ? 'geekblue' : 'green';
                            if (item == "Not Started") {
                                color = 'red';
                            } else if (item == "In Progress") {
                                color = 'green';
                            } else if (item == "Completed") {
                                color = 'geekblue';
                            }
                            else {
                                color = 'geekblue';
                            }
                            return (
                                <Tag color={color}>
                                    {item}
                                </Tag>

                            )
                        }

                    },
                    {
                        key: 'Close',
                        title: 'Close',
                        render: (item, items, index) => {
                            let color;
                            let value;
                            if(items.status == 1){
                                color='red'
                                value ='Not Resolve'
                            
                            }
                            else if(items.status == 2)
                            {
                                color='red'
                                value ='Not Resolve'
                            }
                            else{
                                color='geekblue'
                                value ='Resolve'
                            }

                            return (
                                <Tag color={color}>
                                    {value}
                                </Tag>

                            )
                        }

                    },
                    {
                        title: "Action",
                        key: "Action",
                        fixed: "right",
                        render: (item, items, index) => {

                            return (

                                <Space>
                                    <Link to={`/responsible/${items.id}`}>
                                        <Button
                                            type="success"
                                            size='small'
                                        ><Space><FontAwesomeIcon icon={faReply} /> Response </Space></Button>
                                    </Link>
                                   
                                    {item.status == '3' ? 
                                    (
                                    <Button disabled={true} onClick={() => onClickEditBtn(items)} type="primary" size='small'><Space><FontAwesomeIcon icon={faShareFromSquare} /></Space></Button>
                                    )
                                    :
                                    (
                                    <Button onClick={() => onClickEditBtn(items)} type="primary" size='small'><Space><FontAwesomeIcon icon={faShareFromSquare} /></Space></Button>
                                    )
                                    }
                          
                                    <Link to={`/requestRep/${items.id}`}>
                                        <Button type="primary" size='small'><EyeOutlined /></Button>
                                    </Link>
                                </Space>


                            )
                        }
                    },


                ]}
                dataSource={data}
                scroll={{ x: 'max-content' }}
            />

            <ModalForm
                items={items}
                open={visibleModal}
                title={"Forward Ticket"}
                onCancel={onCloseModalForm}
                ServiceDetail_list={ServiceDetail}
                autoFill={ServiceDetail1}
                onFinish={onFinish}
                department={department}
                onchangedepartment={onchangedepartment}

            />
        </PageContainer>
    )
};

export default PageWorkTask;