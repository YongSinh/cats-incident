import { useEffect, useState } from "react";
import { request } from "../../config/api.config"
import { Button, Space, Table, Tag, message } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { formatDateForClient,isEmptyOrNull } from "../../config/service"
import PageContainer from "../container/PageContainer"
const Allrequest = () => {
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState("");
 
    useEffect(() => {
        getList()
    }, [])

    const getList = async () => {
        setLoading(true)
        request("get", "requests", {}).then(res => {
            if (res.status == 200) {
                setLoading(false)
                var data = res.data
                // setdata(data.data)
                // console.log(data)
                // console.log(data.data.length)
                // console.log(data)
                const filtered = data.data.filter(item => {
                    return item.toDept === "MIS" && item.toGroup === "NFS";
                  });
                setdata(filtered)
            }
        })
    }

    const list = [data];
    const onSearch = (text) => {
        setLoading(true)
        var param = ""
        if(!isEmptyOrNull(text)){
            param = "findByEmpId/"+text // query parameter
            // param += "&from_date=2023-05-02&to_date=2023-05-02" // YYYY-MM-DD
        }

        request("get","requests/"+param,{}).then(res=>{
            setLoading(false)
            if(res.status == 200){
                setLoading(false)
                var data = res.data
                setdata(data.data)
            }
        })
    }


    return (
        <PageContainer
            pageTitle='All Requested'
            loading={loading}
            search={{
                title: "find By Employees",
                allowClear: true
            }}
            onSearch={onSearch}
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
                        dataIndex: 'id',
                        key: 'id',
                        fixed: true,

                    },
                    {

                        title: 'FromEmp',
                        dataIndex: 'fromEmp',
                        key: 'fromEmp',


                    },
                    {
                        key: 'FromDept',
                        title: 'FromDept',
                        dataIndex: "fromDept",


                    }
                    ,
                    {
                        title: 'FromLocal',
                        dataIndex: "fromLocal",
                        key: 'fromLocal',

                    }
                    ,
                    {
                        title: 'FromDept',
                        dataIndex: 'fromDept',
                        key: 'FromDept',
                    }
                    ,
                    {
                        title: 'FromGroup',
                        dataIndex: "fromGroup",
                        key: 'FromGroup',
                        width: 120
                    }
                    ,
                    {
                        title: 'Type',
                        dataIndex: "type",
                        key: 'Type',
                        width: 120
                    }
                    ,
                    {
                        title: 'Other',
                        dataIndex: "other",
                        key: 'other',
                    }
                    ,
                    {
                        title: 'Expiry date',
                        dataIndex: "expDate",
                        key: 'expDate',
                        render: (item) => formatDateForClient(item),
                        width: 200
                    },
                    {
                        title: 'Description',
                        dataIndex: "description",
                        key: 'Description',
                        width: 700

                    }
                    ,
                    {
                        title: 'Purpose',
                        dataIndex: "purpose",
                        key: 'purpose',
                        width: 400
                    }
                    ,
                    {

                        title: 'To Emp',
                        dataIndex: 'toEmp',
                        key: 'toEmp',


                    },
                    {
                        key: 'toDept',
                        title: 'To Dept',
                        dataIndex: "toDept",


                    }
                    ,
                    {
                        title: 'To Local',
                        dataIndex: "toLocal",
                        key: 'toLocal',

                    }
                    ,
                    {
                        title: 'To Group',
                        dataIndex: 'toGroup',
                        key: 'FrotoGroupmDept', width: 100
                    }
                    ,
                    {
                        title: 'To Sup',
                        dataIndex: "toSup",
                        key: 'toSup',

                    }
                    ,
                    {
                        title: 'To Head',
                        dataIndex: "toHead",
                        key: 'toHead',

                    }

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

                    }
                    ,
                    {
                        title: 'Service',
                        dataIndex: "serviceID",
                        key: 'serviceID',

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
                            else{
                                color = 'geekblue';
                            }
                            return (
                                <Tag color={color}>
                                    {item}
                                </Tag>

                            )
                        }

                    }




                ]}
                dataSource={data}
                scroll={{ x: 'max-content' }}
            />
        </PageContainer>
    );
};

export default Allrequest;