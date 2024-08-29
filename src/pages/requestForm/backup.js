import React from "react";
import {
    Button, Col, Spin,
    Form, Image, Input, Progress, Modal, Radio,
    Row, Select, Space, DatePicker, Upload, message
} from "antd"
import {
    DownCircleOutlined, MailTwoTone, UploadOutlined, SolutionOutlined, EditOutlined,
    SaveOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import "./requestForm.css"
import { request } from "../../config/api.config";
import { useParams, Link, useNavigate } from "react-router-dom"
import dayjs from "dayjs";
import locale from "antd/locale/en_US";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import UserService from "../../UserService/UserService";
const { TextArea } = Input;
const MyFormItemContext = React.createContext([]);
const logo = require('../../asset/image/logoBlue.png'); // with require


const RequsetPage = () => {


    const [createDate, setcreateDate] = useState(dayjs());
    const [value, setValue] = useState("NEW");

    const today = new Date();
    const [date1, setdate1] = useState(); // return current date
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState("")
    const [ServiceDetail, setServiceDetail] = useState([])
    const [ServiceDetail1, setServiceDetail1] = useState([])
    const [categorization, setcategorization] = useState([])
    const [priority, setpriority] = useState([])
    const [EmInfor, setEmInfor] = useState([])
    const [EmInforReq, setEmInforReq] = useState([])
    const [form] = Form.useForm();
    const [id, setid] = useState("")
    const [value1, setValue1] = useState("Y");
    const [imgObj, setImgObj] = useState(null)
    const [imgFile, setImgFile] = useState(null)
    const [componentDisabled, setComponentDisabled] = useState(true);
    const [buttonDisabled, setbuttonDisabled] = useState(true);
    const [buttonEdit, setbuttonEdit] = useState('1');
    const [fileList, setFileList] = useState([]);


    const navigate = useNavigate();

    useEffect(() => {
        getList()
        getListService()
        getListCategorization()
        getListPriority()
        getID()
        getEmInfor()

    }, [])

    const handleClear = () => {
        form.resetFields([
            'reqForMyEmId', 'reqForDept', 'reqForSec',
            'service_ID', 'Handler', 'DepartmentHandler',
            'SectionHandler', 'other', 'expDate', 'cateo_ID',
            'priorityID', 'emailToEm', 'ccEmailTo', 'purpose',
            'handlerContact'
        ]);// This will reset the value of the `title` field.
    }

    const onChangeReqFor = (event) => {
        // setLoading(true)
        if (event.target.value != null) {
            request("get", "Em/getEmById/" + event.target.value, {}).then(res => {
                // setLoading(false)
                if (res.status == 200) {
                    var data = res.data
                    //console.log(data)
                    form.setFieldsValue({
                        reqForDept: data.data.poDepartment,
                        reqForSec: data.data.poSection
                    });
                }
            })
        }

    };

    // feature auto fill into text box by loop from api
    const onServiceChange = (value) => {
        const service = ServiceDetail1;
        service.map((requests) => {
            if (requests.service_id.includes(value)) {
                form.setFieldsValue({
                    Handler: `${requests.isOusers.em_ID}`,
                    DepartmentHandler: `${requests.dept_handler}`,
                    SectionHandler: `${requests.sec_handler}`
                });
                request("get", "Em/getEmById/" + requests.isOusers.em_ID, {}).then(res => {
                    setLoading(false)
                    if (res.status == 200) {
                        var data = res.data
                        form.setFieldsValue({
                            handlerContact: 'Handler Contact: ' + `${data.data.fullName}` + ', ' + 'Phone Number: ' + `${data.data.phoneNumber}`
                        });
                    }
                })

                request("get", "Em/getAllEmAndShEmail/" + requests.isOusers.em_ID, {}).then(res => {
                    setLoading(false)
                    if (res.status == 200) {
                        var data = res.data
                        form.setFieldsValue({
                            ccEmailTo: `${data.data.ShEmail}`,
                            emailToEm: `${data.data.EmEmail}`
                        });
                    }
                })
            }
        });

    };

    const UserId = localStorage.getItem("Id");

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

    const getEmInfor = () => {
        setLoading(true)
        request("get", "Em/getEmById/" + UserId, {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data
                setEmInfor(data.data)
                form.setFieldsValue({
                    userContact: 'Your Full Name: ' + `${data.data.fullName}` + ', ' + 'Phone Number: ' + `${data.data.phoneNumber}`
                });
            }
        })
    }

    const getListCategorization = () => {
        setLoading(true)
        request("get", "admin/categorization", {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data

                var arrTmpC = []
                data.data.map((item) => {
                    arrTmpC.push({
                        label: item.cateo_name,
                        value: item.cate_id
                    })
                })
                setcategorization(arrTmpC)
            }
        })
    }

    const getListPriority = () => {
        setLoading(true)
        request("get", "admin/priority", {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data

                var arrTmpP = []
                data.data.map((item) => {
                    arrTmpP.push({
                        label: item.prio_name,
                        value: item.prio_id,

                    })
                })
                setpriority(arrTmpP)
            }
        })
    }


    const getList = async () => {
        setLoading(true)
        request("get", "requests", {}).then(res => {
            if (res.status == 200) {
                setLoading(false)
                var data = res.data
                setdata(data.data)
            }
        })
    }


    const getID = async () => {
        setLoading(true)
        request("get", "requests/getId", {}).then(res => {
            if (res.status == 200) {
                setLoading(false)
                var data = res.data
                setid(data.data)

            }
        })
    }




    const handClickEdit = () => {
        setbuttonDisabled(false)
        setbuttonEdit('2')
    }
    const handClickSave = () => {
        setbuttonDisabled(true)
        setbuttonEdit('1')
    }

    const onChangeEm = (e) => {
        request("get", "Em/getEmById/" + e.target.value, {}).then(res => {
            setLoading(false)
            if (res.status == 200) {
                var data = res.data
                setEmInforReq([data.data])

            }
        })
    };

    const onReset = () => {
        setComponentDisabled(true)
        form.resetFields(['reqForMyEmId', 'reqForDept', 'reqForSec']);// This will reset the value of the `title` field.
    };

    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };



    const onFinish = async (item) => {
        setLoading(true)
        // console.log(item)
        var body = {
            "saveRequestDto": {
                "fromEmp": EmInfor.emId,
                "fromDept": EmInfor.poDepartment,
                "fromLocal": EmInfor.emWorksite,
                "fromGroup": EmInfor.poSection,
                "type": value,
                "other": item.other,
                "expDate": item.expDate,
                "description": item.purpose,
                "purpose": item.purpose,
                // "toLocal": "VDPP",
                // "toSup": "2331",
                // "toHead": "0021",
                "noteNum": item.noteNum,
                "status": "1",
                // "createDate": today,
                "priorityID": item.priorityID,
                "cateo_ID": item.cateo_ID,
                "pro_ID": "1",
                "service_ID": item.service_ID,
                "userContact": item.userContact
            },
            "requestDetail": {
                "reqForMySelf": value1,
                "reqForMyEmId": item.reqForMyEmId,
                "ccEmailTo": item.ccEmailTo,
                "emailToEm": item.emailToEm,
                "reqForDept": item.reqForDept,
                "reqForSec": item.reqForSec,
            },
        }
        //console.log(body)
        //this code covert bodyJson to formData
        const json = JSON.stringify(body);
        const blob = new Blob([json], {
            type: 'application/json'
        });

        const formData = new FormData();
        formData.append("body", blob);

        fileList.forEach((file) => {
            formData.append('file', file);
        });

        // if (imgObj != null) {
        //     formData.append("file", imgObj, imgObj.name)
        // }

        var method = "post"
        var url = "requests/create"

        request(method, url, formData).then(res => {
            if (res.status == 200) {
                setLoading(false)
                var data = res.data
                message.success(data.message)
                setItems(null)
                setImgFile(null)
                setImgObj(null)
                getList()
                setFileList([])
                window.location.href = '/apps/incident/pending'
            }
        })

    };
    const onChange = (e) => {
        //console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };
    const onChangeYN = (e) => {
        //console.log('radio checked', e.target.value);
        setValue1(e.target.value);
    };
    const onChnageFile = (e) => {
        setImgObj(e.target.files[0])
        setImgFile(window.webkitURL.createObjectURL(e.target.files[0]))
        // setImgFile( URL.createObjectURL(e.target.files[0]))  
    }


    return (
        <>
            <Spin spinning={loading}>
                <div className="center">
                    <Form

                        //  ref={formRef}
                        layout="vertical"
                        //name="basic"
                        form={form}
                        labelCol={{
                            span: 8,
                        }}
                        initialValues={{
                            remember: 1,
                        }}
                        onFinish={onFinish}
                    // autoComplete="off"
                    >
                        <Row>
                            <Col span={14} style={{ margin: "auto" }}>
                                <h1 className="title_requset">INCIDENT REQUEST</h1>
                                <Row>
                                    <Col span={12} className="classA">
                                        <p>INCIDENT NO:</p>
                                        <Form.Item
                                        //name="ID"
                                        >
                                            <Input className="classB" bordered={false} value={id} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} className="classA">
                                        <p>Date:</p>
                                        <Form.Item
                                        >
                                            <Input className="classB"
                                                value={dayjs(createDate).format("YYYY-MM-DD h:mm A")}
                                                onChange={(event) => {
                                                    setcreateDate(event.target.value);
                                                }}
                                                bordered={false} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={10}>
                                <Progress
                                    type="circle"
                                    percent={0}
                                    style={{
                                        marginRight: 8,
                                        float: "right"
                                    }}
                                />
                            </Col>


                        </Row>

                        <Row className="part" >
                            <Col span={24} className="part_incident">INCIDENT REQUESTER PART </Col>
                        </Row>


                        <Row gutter={16}>
                            <Col span={6} >
                                <Form.Item
                                    style={{ width: '100%' }}
                                    label="ID"

                                >
                                    <Input value={EmInfor.emId} style={{ width: '100%' }} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={6} >
                                <Form.Item
                                    labelCol={{ style: { width: '100%' } }}
                                    label="Department"
                                >
                                    <Input
                                        value={EmInfor.poDepartment}
                                        style={{ width: '100%' }}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={6} >
                                <Form.Item
                                    labelCol={{ style: { width: 200 } }}
                                    label="Section"
                                >
                                    <Input
                                        value={EmInfor.poSection}
                                        style={{ width: '100%' }}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6} >
                                <Form.Item
                                    labelCol={{ style: { width: 200 } }}
                                    label="Local"
                                >
                                    <Input
                                        value={EmInfor.emWorksite}
                                        style={{ width: '100%' }}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={20}>
                                <Form.Item
                                    labelCol={{ style: { width: 200 } }}
                                    name="userContact"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please',
                                        },
                                    ]}
                                >
                                    <Input disabled={buttonDisabled} placeholder="default size" prefix={<SolutionOutlined />} />
                                </Form.Item>

                            </Col>
                            <Col span={4}>
                                <Form.Item

                                    wrapperCol={{
                                        span: 10,
                                    }}
                                >
                                    {buttonEdit == 1 ?
                                        (
                                            <Button type="primary" onClick={handClickEdit}>
                                                <EditOutlined />Edit Your Contact
                                            </Button>
                                        )
                                        :
                                        (
                                            <Button type="primary" onClick={handClickSave}>
                                                <SaveOutlined /> Save Your Contact
                                            </Button>
                                        )
                                    }

                                </Form.Item>
                            </Col>


                            <Col span={6} >
                                <Form.Item
                                    labelCol={{ style: { width: 200 } }}
                                    label="Service"
                                    name="service_ID"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        onChange={onServiceChange}
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="Search to Select"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={ServiceDetail}
                                    />
                                </Form.Item>
                            </Col>

                            <>
                                <Col span={6}>

                                    <Form.Item
                                        labelCol={{ style: { width: 200 } }}
                                        label="Handler ID"
                                        name="Handler"
                                    >
                                        <Input disabled style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        labelCol={{ style: { width: 200 } }}
                                        label="Department Handler"
                                        name="DepartmentHandler"
                                    >
                                        <Input disabled style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col><Col span={6}>
                                    <Form.Item
                                        labelCol={{ style: { width: 200 } }}
                                        label="Section Handler"
                                        name="SectionHandler"
                                    >
                                        <Input disabled style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        labelCol={{ style: { width: 200 } }}
                                        locale="Handler Contact info"
                                        name="handlerContact"
                                    >
                                        <Input disabled placeholder="Handler Contact" prefix={<SolutionOutlined />} />
                                    </Form.Item>

                                </Col>

                            </>

                            <Col span={12} >
                                <Form.Item
                                    name="type"
                                >
                                    <Radio.Group onChange={onChange} name="radiogroup" value={value} defaultValue="NEW">
                                        <Space size={70}>
                                            <Radio value="NEW" > Requset for New </Radio>
                                            <Radio value="CHECK"> Requset for Check </Radio>
                                            <Radio value="OTHER"> Other </Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col span={6} >
                                <Form.Item
                                    labelCol={{ style: { width: 200 } }}
                                    name="other"
                                >
                                    <Input style={{ width: '100%' }} placeholder="Other" />
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Form.Item
                                    name={"expDate"}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input Expect Date!',
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="Expected Date"
                                        startDate={date1}
                                        endDate={date1} // add the endDate to your startDate DatePicker now that it is defined
                                        onChange={date1 => setdate1(date1)}
                                    />
                                    {/* <DatePicker
                                        placeholderText="Expected Date"
                                        className="datepicker"
                                        selected={date1}
                                        selectsStart
                                        startDate={date1}
                                        endDate={date1} // add the endDate to your startDate DatePicker now that it is defined
                                        onChange={date1 => setdate1(date1)}
                                    /> */
                                    }

                                </Form.Item>
                            </Col>

                            <Col span={12} >
                                <Form.Item
                                    name="reqForMySelf"
                                >
                                    <Radio.Group onChange={onChangeYN} name="radiogroup" value={value1} defaultValue="Y">
                                        <Space size={121}>
                                            <Radio value="Y" onChange={onReset}> Requset for myself </Radio>
                                            <Radio value="N" onChange={(e) => setComponentDisabled(false)}> Requset for other </Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>


                            <Col span={12} >
                                <Row
                                    gutter={16}
                                >
                                    <Col span={8} >
                                        <Form.Item
                                            name="reqForMyEmId"
                                        >
                                            <Input disabled={componentDisabled} onChange={onChangeReqFor} style={{ width: '100%' }} placeholder="ID" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} >
                                        <Form.Item
                                            name="reqForDept"
                                        >
                                            <Input disabled={componentDisabled} style={{ width: '100%' }} placeholder="Department" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} >
                                        <Form.Item
                                            name="reqForSec"

                                        >
                                            <Input disabled={componentDisabled} style={{ width: '100%' }} placeholder="Section" />
                                        </Form.Item>
                                    </Col>

                                </Row>
                            </Col>
                            <Col span={12}>
                                <p className="incidentp1">Please incident categorization and prioritization</p>
                            </Col>
                            <Col span={12}>
                                <p className="incidentp1">Emaill to Management</p>
                            </Col>

                            <Col span={6} >
                                <Form.Item
                                    labelCol={{ style: { width: 200 } }}
                                    label="Categorization"
                                    name="cateo_ID"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch

                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="Search to Select"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={categorization}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={6} >
                                <Form.Item
                                    labelCol={{ style: { width: 200 } }}
                                    label="Prioritization"
                                    name="priorityID"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch

                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="Search to Select"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={priority}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={6} >
                                <Form.Item
                                    labelCol={{ style: { width: '100%' } }}
                                    label="Email to:"
                                    name="emailToEm"
                                >
                                    <Input
                                        style={{ width: '100%' }} prefix={< MailTwoTone />} />
                                </Form.Item>
                            </Col>

                            <Col span={6} >
                                <Form.Item
                                    labelCol={{ style: { width: '100%' } }}
                                    label="CC Email to:"
                                    name="ccEmailTo"
                                >
                                    <Input
                                        style={{ width: '100%' }} prefix={< MailTwoTone />} />
                                </Form.Item>
                            </Col>

                            < Col span={24}>
                                <Form.Item>
                                    <Upload {...props}>
                                        <Button icon={<UploadOutlined />}>Select File</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{ style: { width: 200 } }}
                                    label="Purpose"
                                    name="purpose"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your purpose!',
                                        },
                                    ]}
                                >
                                    <TextArea
                                        showCount
                                        maxLength={300}
                                        style={{
                                            height: 120,
                                            marginBottom: 24,
                                        }}
                                    />
                                </Form.Item>

                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    wrapperCol={{
                                        span: 10,
                                    }}
                                >
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            Requset
                                        </Button>
                                        <Button onClick={handleClear} danger >
                                            Clear
                                        </Button>

                                    </Space>
                                </Form.Item>
                            </Col>

                        </Row>
                    </Form>
                </div>
            </Spin>
        </>


    )
};

export default RequsetPage;
