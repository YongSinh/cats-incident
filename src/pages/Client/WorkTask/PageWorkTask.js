import React from "react";
import PageContainer from "../../container/PageContainer";
import './PageRequested.css'
import { Button, Col, Divider, Form, Image, Input, InputNumber, Modal, Radio, Row, Select, Space, Table, Tag } from "antd"
import { useState, useEffect } from 'react';
import { EyeOutlined } from "@ant-design/icons";
import { request } from "../../../config/api.config";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom"
const PageWorkTask = () => {


    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState("")
    useEffect(() => {
        getList()
    }, [])
    useEffect(() => {
        const interval = setInterval(() => {
            getList()
        }, 10000); //set your time here. repeat every 10 seconds
      
        return () => clearInterval(interval);
      }, []);
    const getList = async () => {
        setLoading(true)
        request("get", "requests/findByEmpId/" + 2020, {}).then(res => {
            if (res.status == 200) {
                setLoading(false)
                var data = res.data
                setdata(data.data)
            }
        })
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (

        <PageContainer
            btnRight="New Incident Ticket"
            //onClickBtnRight={onClickView}
            pageTitle='Requested'
            loading={loading}
            search={{
                title: "Requested",
                allowClear: true
            }}
        // onSearch={onSearch}
        >
            <Table
                //   rowKey={'id'}
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
                    },

                    {

                        title: 'Handler',
                        dataIndex: 'iSOby',
                        key: 'iSOby',
                        fixed: true,

                    },
                    {

                        title: 'Service',
                        dataIndex: 'serviceID',
                        key: 'serviceID',
                    },
                    ,
                    {
                        title: 'Prioritization',
                        dataIndex: "prioId",
                        key: 'prioId',

                    }
                    ,
                    {
                        title: 'Categorization',
                        dataIndex: "cateoId",
                        key: 'cateoId',

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
                        title: "Action",
                        key: "Action",
                        render: (item, items, index) => {
                            
                            return (

                                <Space>
                                    <Button type="primary" size='small'>Close Ticket</Button>
                                    {/* <Button type="primary" size='small' onClick={() => showDrawer(items)}><FontAwesomeIcon icon={faEye} /></Button> */}

                                    <Link to={`/client/request/${items.id}`}>
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
        </PageContainer>
    )
};

export default PageWorkTask;