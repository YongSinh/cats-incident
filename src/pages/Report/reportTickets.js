import React from "react";
import PageContainer from "../container/PageContainer";
import { Button, Input, Space, Table, Tag, Spin, Popconfirm, DatePicker, Select } from "antd"
import { useState, useEffect } from 'react';
import { EyeOutlined, InfoCircleFilled } from "@ant-design/icons";
import { request } from "../../config/api.config";
import { isEmptyOrNull, formatDateForClient } from "../../config/service";
import { Config } from "../../config/config";
import { useParams, Link } from "react-router-dom"
import UserService from "../../UserService/UserService";
import { ToastContainer, toast } from 'react-toastify';
import dayjs from "dayjs";
import 'react-toastify/dist/ReactToastify.css'
import 'antd-button-color/dist/css/style.css'
const { Search } = Input;
const ReportTickets = () => {

    const [Section, setSection] = useState("")
    const [Dept, setDept] = useState("")
    const [list, setlist] = useState([])
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState(null)
    const [ServiceDetail, setServiceDetail] = useState([])
    const [ServiceDetail1, setServiceDetail1] = useState([])
    const [tickets, setTickets] = useState([]);
    const [monthyear, setmonthyear] = useState("");
    const [month, setmonth] = useState("");
    const [year, setyear] = useState("");
    const [sec, setSec] = useState([]);
    const [Department, setDepartment] = useState([])
    const [status, setstatus] = useState();
    useEffect(() => {
        getList()
        getListService()
        getSection()
        getDepartment()
    }, [])

    const onchangeStatus = (value) =>{
        setstatus(value)
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
                setDepartment(arrTmpS)
            }
        })
    }

    const getList = () => {
        setLoading(true)
        request("get", "requests", {}).then(res => {
            if (res.status == 200) {
                setLoading(false)
                var data = res.data
                setlist(data.data)
                //console.log(data)
            }
        })
    }

    const getListService = () => {
        setLoading(true)
        request("get", "admin/service", {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data
                setServiceDetail1(data.data.ServiceDetail)
                var arrTmpS = []
                data.data.ServiceDetail.map((item) => {
                    arrTmpS.push({
                        label: item.serviceName,
                        value: item.service_id
                    })
                })
                setServiceDetail(arrTmpS)
            }
        })
    }

    const getSection = () => {
        setLoading(true)

    }

    const onChangeDepartment = (value) => {
        setDept(value)
        request("get", "Em/adminGetSecOfDept/" + value, {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data
                //console.log(data)
                var arrTmpS = []
                data.data.map((item) => {
                    arrTmpS.push({
                        label: item.Section,
                        value: item.Section
                    })
                    setSec(arrTmpS)
                })
            }
        })
    }

    const onChange = (date, dateString) => {
        // Parse the date string and create a date object.
        const parsedDate = dayjs(dateString);
        const month = parsedDate.format("M");
        const year = parsedDate.format("YYYY");
        setmonth(month)
        setyear(year)
        setmonthyear(dateString)
        var param = ""
        if (!isEmptyOrNull(dateString)) {
            param = "/report?" + "month" + "=" + month + "&" + "year" + "=" + year// query parameter
        }
        request("get", "requests" + param, {}).then(res => {
            if (res.status == 200) {
                setLoading(false)
                var data = res.data
                setlist(data.data)
            }
        })
    };

    const onFilterDate = (value) => {
        setSection(value)
        setLoading(true);
       // console.log(value)
        var param = ""
        if (!isEmptyOrNull(value) && !isEmptyOrNull(monthyear)) {
            param = "/report?" + "month" + "=" + month + "&" + "year" + "=" + year// query parameter
            // query parameter
            request("get", "requests" + param, {}).then(res => {
                if (res.status == 200) {
                    setLoading(false)
                    var data = res.data
                    const filtered = data.data.filter(item => {
                        return item.toDept === Dept && item.toGroup == value;
                    });
                    setlist(filtered)
                }
            })
        }
        else {
            request("get", "requests", {}).then(res => {
                if (res.status == 200) {
                    setLoading(false)
                    var data = res.data
                    setlist(data.data)
                }
            })
        }

    };


    const handleGetReport = () => {
        setLoading(true);
        if(!isEmptyOrNull(status) && isEmptyOrNull(Section)){
            var  param="report/getReportDeptByStatus?" + "month" + "=" + month + "&" + "year" + "=" + year + "&" + "dept" + "=" + Dept +"&"+"status="+status
        }
        else if(!isEmptyOrNull(status) && !isEmptyOrNull(Section)){
            var  param="report/getReportByStatusTo?" + "month" + "=" + month + "&" + "year" + "=" + year + "&" + "sec" + "=" + Section + "&" + "Dept" + "=" + Dept+"&"+"status="+status
        }
        else if (isEmptyOrNull(Section) && isEmptyOrNull(Dept) && !isEmptyOrNull(status)){
            var  param="report/getAllReportByStatus?" + "month" + "=" + month + "&" + "year" + "=" + year +"&"+"status="+status
        }
        else if (!isEmptyOrNull(Section) && !isEmptyOrNull(Dept)) {
            var param = "report/getReportBySec?" + "month" + "=" + month + "&" + "year" + "=" + year + "&" + "sec" + "=" + Section + "&" + "Dept" + "=" + Dept
        }
        else if (isEmptyOrNull(Section) && !isEmptyOrNull(Dept)) {
            var param = "report/getReportByDept?" + "month" + "=" + month + "&" + "year" + "=" + year + "&" + "Dept" + "=" + Dept
        }
        else {
            var param = "report/getReport?" + "month" + "=" + month + "&" + "year" + "=" + year
        }
        request("get", param, {}).then(res => {
            if (res.status == 200) {
                setLoading(false)
                window.open(`${Config.baseUrl}${param}`, "_blank")
            }
            else if (!res.ok) {
                setLoading(false)
                if (isEmptyOrNull(monthyear)) {
                    toast.warning("Please select the date or section before download!", {
                        position: toast.POSITION.TOP_CENTER
                    })
                }
                else {
                    toast.warning("There is no data to download on that date: " + monthyear, {
                        position: toast.POSITION.TOP_CENTER
                    })
                }
                throw new Error(`error With Status`);
            }
        })
            .catch(err => {
                console.log(err);
            });
    };
    const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    return (
        <>
            <ToastContainer />
            <Spin spinning={loading}>

                <div>
                    <Space
                        style={{
                            marginBottom: 16,
                        }}
                    >

                        <DatePicker allowClear={true} onChange={onChange} picker="month" />

                        <Select
                            showSearch
                            onChange={onChangeDepartment}
                            allowClear
                            style={{
                                width: 150,
                            }}
                            placeholder="Department"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={Department}
                        />
                        <Select
                            showSearch
                            onChange={onFilterDate}
                            allowClear
                            style={{
                                width: 150,
                            }}
                            placeholder="Section"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={sec}
                        />

                        <Select
                            showSearch
                            placeholder="Select a status"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            allowClear={true}
                            onChange={onchangeStatus}
                            style={{
                                width: 150,
                            }}
                            options={[
                                {
                                    value: '1',
                                    label: 'Not Started',
                                },
                                {
                                    value: '2',
                                    label: 'In Progress',
                                },
                                {
                                    value: '3',
                                    label: 'Completed',
                                },
                            ]} />

                        <Popconfirm
                            title="Download the Report"
                            description="Are you sure to Download this Report?"
                            onConfirm={handleGetReport}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button>Download</Button>

                        </Popconfirm>
                    </Space>
                </div>

                <Table
                    //   rowKey={'id'}
                    columns={[
                        {
                            title: "No",
                            render: (item, items, index) => index + 1,
                            key: "No",
                            fixed: true,

                        },
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
                                else {
                                    color = 'green';
                                }
                                return (
                                    <Tag color={color} icon={<InfoCircleFilled />}>
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
                                else {
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
                            title: 'Categorization',
                            dataIndex: "cateoId",
                            key: 'cateoId',
                            render: (item, items, index) => {
                                let color = item?.length > 5 ? 'geekblue' : 'green';
                                if (item == "Hight") {
                                    color = 'red';
                                } else if (item == "Low") {
                                    color = 'green';
                                } else if (item == "Medium") {
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
                                if (items.status == 1) {
                                    color = 'red'
                                    value = 'Not Resolve'

                                }
                                else if (items.status == 2) {
                                    color = 'red'
                                    value = 'Not Resolve'
                                }
                                else {
                                    color = 'geekblue'
                                    value = 'Resolve'
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

                            render: (item, items, index) => {

                                return (

                                    <Space>

                                        <Link to={`/requestRep/${items.id}`}>
                                            <Button type="primary" size='small'><EyeOutlined /></Button>
                                        </Link>
                                    </Space>


                                )
                            }

                        },


                    ]}
                    dataSource={list}
                    scroll={{ x: 'max-content' }}
                />
            </Spin>
        </>


    )
};

export default ReportTickets;