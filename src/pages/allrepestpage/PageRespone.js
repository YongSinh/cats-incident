import { useEffect, useState } from "react";
import { request } from "../../config/api.config"
import { Button, Space, Table, Tag } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { formatDateForClient } from "../../config/service"
import PageContainer from "../container/PageContainer"
const PageRespone = () => {
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState("");
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
        request("get", "response", {}).then(res => {
            if (res.status == 200) {
                setLoading(false)
                var data = res.data
                setdata(data.data)
               // console.log(data)
            }
        })
    }
    const list = [data];


    return (
        <PageContainer
            pageTitle='All Requested'
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

                        title: 'ID',
                        dataIndex: 'req_ID',
                        key: 'req_ID',
                        fixed: true,

                    },
                    {

                        title: 'FromEmp',
                        dataIndex: 'emp_ID',
                        key: 'emp_ID',


                    },
                    {
                        key: 'agree',
                        title: 'Agree',
                        dataIndex: "agree",
                        render: (item, items, index) => {
                            let color = item?.length > 5 ? 'geekblue' : 'green';
                            if (item == "N") {
                                color = 'red';
                            } else if (item == "Y") {
                                color = 'green';
                            } else {
                                color = 'geekblue';
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
                        title: 'Create Date',
                        dataIndex: "createDate",
                        key: 'createDate',

                    },
                    {
                        title: 'Modify Date',
                        dataIndex: "modifyDate",
                        key: 'modifyDate',

                    }
                    ,
                    {
                        title: 'Delete Date',
                        dataIndex: "deleteDate",
                        key: 'deleteDate',

                    }

                    ,
                    {
                        title: 'oldID',
                        dataIndex: "oldID",
                        key: 'oldID',

                    },
                    {

                        title: 'Comment',
                        dataIndex: 'comment',
                        key: 'comment',
                        width: 500

                    },

                ]}
                dataSource={data}
                scroll={{ x: 'max-content' }}
            />
        </PageContainer>
    );
};

export default PageRespone;