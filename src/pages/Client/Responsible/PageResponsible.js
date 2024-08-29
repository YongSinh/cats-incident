import React from "react";
import {
  Button,
  Col,
  Spin,
  Alert,
  Tag,
  Form,
  Input,
  Popconfirm,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Progress,
  Upload,
  message,
  DatePicker,
} from "antd";
import {
  DownCircleOutlined,
  MailTwoTone,
  FileSearchOutlined,
  UserOutlined,
  UploadOutlined,
  RollbackOutlined,
  MinusOutlined,
  PlusOutlined,
  CalendarOutlined,
  EyeFilled,
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { formatDateForClient } from "../../../config/service";
import { isEmptyOrNull } from "../../../config/service";
import "antd-button-color/dist/css/style.css";
import { request } from "../../../config/api.config";
import { Config } from "../../../config/config";
import dayjs from "dayjs";
import { useParams, Link, useNavigate } from "react-router-dom";
import UserService from "../../../UserService/UserService";
import "./PageResponsible.css";
import DrawerForm from "./Drawer";
import { ToastContainer, toast } from "react-toastify";
const { TextArea } = Input;

const MyFormItemContext = React.createContext([]);
const logo = require("../../../asset/image/logoBlue.png"); // with require

const PageResponsible = () => {
  const date = new Date();
  const today = dayjs(date).format("YYYY-MM-DDTHH:mm:ss");

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [DisableForm, setDisableForm] = useState("");
  const [close, setclose] = useState([]);
  const params = useParams();
  const [lIstFile, setLIstFile] = useState([]);
  const [createDate, setcreateDate] = useState(dayjs());
  const [processvalue, setProcessvalue] = useState("");
  const [agree, setAgree] = useState("");
  const [agreeClose, setgreeClose] = useState("");
  const [data, setdata] = useState([]);
  const [detail, setdetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(null);
  const [responseDetail, setresponseDetail] = useState([]);
  const [closeDetail, setCloseDetail] = useState([]);
  const [form] = Form.useForm();
  const [handlerInfo, sethandlerInfo] = useState([]);
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [percent, setPercent] = useState(0);
  const [RepDetail, setRepDetail] = useState([]);
  const [disabledBtn, setdisabledBtn] = useState(true);
  const [disabledBtn2, setdisabledBtn2] = useState(true);
  const [date1, setdate1] = useState();
  const [date2, setdate2] = useState();
  const [responseDate, setResponseDate] = useState()
  useEffect(() => {
    getList();
    getList2();
    getListFile();
    getCloseList();
    getListResponseDetail();
    getListCloseDetail();
  }, []);

  const increase = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent + 10;
      if (newPercent > 100) {
        return 100;
      }
      return newPercent;
    });
  };
  const decline = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent - 10;
      if (newPercent < 0) {
        return 0;
      }
      return newPercent;
    });
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

  const onChange = (event) => {
    //console.log(`checked = ${event.target.value}`);
    //console.log(event)
    //event.target.value.length > 0 ? console.log(true) : console.log(false)
    event.target.value.length > 0
      ? setdisabledBtn2(false)
      : setdisabledBtn2(true);
  };

  const handleProcess = () => {
    setProcessvalue(2);
    setAgree("Y");
  };

  const handleCompletes = () => {
    setProcessvalue(3);
    setPercent(100);
    setAgree("Y");
    form.submit();
  };

  const singleUserApiUrl = `${params.id}`;

  const getListResponseDetail = async () => {
    setLoading(true);
    request(
      "get",
      "responseDetail/getResponseDetail/" + singleUserApiUrl,
      {}
    ).then((res) => {
      if (res.status == 200) {
        setLoading(false);
        var data = res.data;
        setresponseDetail(data.data);
      }
    });
  };

  const getListCloseDetail = async () => {
    setLoading(true);
    request("get", "closeDetail/getCloseDetail/" + singleUserApiUrl, {}).then(
      (res) => {
        if (res.status == 200) {
          setLoading(false);
          var data = res.data;
          setCloseDetail(data.data);
        }
      }
    );
  };

  const getList = async () => {
    setLoading(true);
    request("get", "requests/findById/" + singleUserApiUrl, {}).then((res) => {
      if (res.status == 200) {
        setLoading(false);
        var data = res.data;
        setdata(data.data);
        const date1 = new Date(data.data.incidentDate);
        let  date2 = ""
        if(!isEmptyOrNull(data.data.deleteDate)){
          date2 =  new Date(data.data.deleteDate);
        }
        setdate1(date1)
        setdate2(date2)
        setPercent(data.data.percent);

        request("get", "Em/getEmById/" + data.data.isoby, {}).then((res) => {
          setLoading(false);
          if (res.status == 200) {
            var data = res.data;
            sethandlerInfo(data.data);
          }
        });
      }
    });
  };




  const getRepDetailBy1 = async (id) => {
    setLoading(true);
    request("get", "responseDetail/getResponseDetailById/" + id, {}).then(
      (res) => {
        if (res.status == 200) {
          setLoading(false);
          var data = res.data;
          setRepDetail(data.data);
          //console.log(data)
        }
      }
    );
  };

  const getListFile = async () => {
    setLoading(true);
    request("get", "file/findFileById/" + singleUserApiUrl, {}).then((res) => {
      if (res.status == 200) {
        setLoading(false);
        var data = res.data;
        setLIstFile(data.data);
      }
    });
  };

  const getList2 = async () => {
    setLoading(true);
    request("get", "requestDetail/findById/" + singleUserApiUrl, {}).then(
      (res) => {
        if (res.status == 200) {
          setLoading(false);
          var data = res.data;
          setdetail([data.data]);
        }
      }
    );
  };

  const onFinish = async (item) => {
    //setLoading(true);

    var body = {
      updateRequestDto: {
        corrective: item.comment,
        comment: item.comment,
        noteNum: 0,
        proId: processvalue,
        isoby: UserService.getUsername(),
        percent: percent,
      },
      response: {
        createDate: today,
        agree: agree,
      },
    };
    const json = JSON.stringify(body);
    const blob = new Blob([json], {
      type: "application/json",
    });

    const formData = new FormData();
    formData.append("body", blob);

    fileList.forEach((file) => {
      formData.append("file", file);
    });

    //console.log(formData)
    var method = "post";
    var url = "requests/response/" + singleUserApiUrl;

    if(!isEmptyOrNull(responseDate)){
        var body = {
            deleteDate: dayjs(responseDate).format("YYYY-MM-DDTHH:mm:ss"),
          };
        request('put', "requests/finishTaskDate/" + singleUserApiUrl, body).then((res) => {
            if (res.status == 200) {
                console.log(true)
            }
          });
       // console.log(true)
    }
    
    request(method, url, formData).then((res) => {
      if (res.status == 200) {
        setLoading(false);
        var data = res.data;
        message.success(data.message);
        setItems(null);
        getList();
        getListResponseDetail();
        getCloseList();
        setFileList([]);
      }
    });
  };

  const getCloseList = async () => {
    setLoading(true);
    request("get", "close/findById/" + singleUserApiUrl, {}).then((res) => {
      if (res.status === 200) {
        setLoading(false);
        var data = res.data;
        setclose(data);
        setDisableForm(data.data);
        if (data.code === 200) {
          if (data.data.agree == "Y") {
            setComponentDisabled(true);
          }
        }
      }
    });
  };

  const handleClose = () => {
    setgreeClose("N");
  };

  const onFinishClose = async (item) => {
    // setLoading(true)
    //console.log(item)
    var body = {
      updateRequestDto: {
        reason: "This message form handler: " + item.reason,
      },
      close1: {
        createDate: today,
        agree: agreeClose,
      },
    };

    var method = "put";
    var url = "requests/close/" + singleUserApiUrl;

    request(method, url, body).then((res) => {
      if (res.status == 200) {
        var data = res.data;
        message.success(data.message);
        setItems(null);
        getList();
        getCloseList();
        getListResponseDetail();
        getListCloseDetail();
      }
    });
  };

  responseDetail.sort((a, b) => new Date(a.dateRep) - new Date(b.dateRep));
  closeDetail.sort((a, b) => new Date(a.dateRep) - new Date(b.dateRep));
  //console.log(responseDetail.map(o => o));

  const navigate = useNavigate();

  const onClick = () => {
    navigate(-1);
  };

  const onChangeDateFinish = (date, dateString) => {
    setResponseDate(date)
  };

  const files = lIstFile.map((item, index) => {
    return item.fname;
  });

  let req = data;
  const totalHandle = () => {
    const differenceMs = date2 - date1;
    const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
    let totalHandle = " ";
    if(!isEmptyOrNull(date2)){
      req.status === 3 ?  totalHandle =`${days} days, ${hours} hours and ${minutes} minutes.`: totalHandle = "";
    }
    return totalHandle
  };
  return (
    <>
      <DrawerForm open={open} onClose={onClose} RepDetail={RepDetail} />
      <div
        style={{
          marginBottom: 10,
        }}
      >
        <Button onClick={onClick} type="info">
          <RollbackOutlined />
          Back
        </Button>
      </div>
      <Spin spinning={loading}>
        <div className="center">
          <>
            <Form
              layout="vertical"
              //name="basic"
              form={form}
              labelCol={{
                span: 8,
              }}
              initialValues={{
                remember: 1,
              }}
            >
              <Row>
                <Col span={20} style={{ margin: "auto" }}>
                  <h1 className="title_requset">INCIDENT REQUEST</h1>
                  <Row>
                    <Col span={8} className="classA">
                      <p>INCIDENT NO:</p>
                      <Form.Item>
                        <Input
                          value={
                            dayjs(req.createDate).format("MMYYYY") +
                            "~" +
                            req.runNumber
                          }
                          className="classB"
                          bordered={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8} className="classA">
                      <p>Request Date:</p>
                      <Form.Item>
                        <Input
                          className="classB"
                          value={dayjs(req.createDate).format(
                            "YYYY-MM-DD h:mm A"
                          )}
                          onChange={(event) => {
                            setcreateDate(event.target.value);
                          }}
                          bordered={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8} className="classA">
                      <p>Incident Date:</p>
                      <Form.Item>
                        <Input
                          className="classB"
                          value={dayjs(req.incidentDate).format(
                            "YYYY-MM-DD h:mm A"
                          )}
                          bordered={false}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={4}>
                  <Progress
                    type="circle"
                    percent={percent}
                    style={{
                      marginRight: 8,
                      float: "right",
                    }}
                  />
                </Col>
                <Col span={18}>
                  <Form.Item
                    labelCol={{ style: { width: "100%"} }}
                    style={{ width: "15%" }}
                    label="Type Of Requset"
                  >
                    <Input value={req.cateoId} />
                  </Form.Item>
                </Col>
                <Col span={6}                >
                  <Form.Item
                    labelCol={{ style: { width: "100%", textAlign:'end'}}}
                    label="Total handle ticket"
                  >
                    <Input style={{textAlign:'end'}} value={totalHandle()}/>
                  </Form.Item>
                </Col>
              </Row>

              <Row className="part">
                <Col span={24} className="part_incident">
                  INCIDENT REQUESTER PART
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item style={{ width: "100%" }} label="ID">
                    <Input value={req.fromEmp} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: "100%" } }}
                    label="Department"
                  >
                    <Input value={req.fromDept} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: 200 } }}
                    label="Section"
                  >
                    <Input value={req.fromGroup} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: 200 } }}
                    label="Location"
                  >
                    <Input value={req.fromLocal} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label={"User Contact info"}>
                    <Alert
                      message={`${req.userContact}`}
                      type="info"
                      showIcon
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: 200 } }}
                    label="Service"
                  >
                    <Input value={req.serviceID}/>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: 200 } }}
                    label="Handler ID"
                  >
                    <Input value={req.isoby} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: 200 } }}
                    label="Department Handler"
                  >
                    <Input value={req.toDept} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: 200 } }}
                    label="Section Handler"
                  >
                    <Input value={req.toGroup} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label={"Hanlder Contact info"}>
                    <Alert
                      message={
                        "Handler Cproblelocationontact: " +
                        `${handlerInfo.fullName}` +
                        ", " +
                        "Phone Number: " +
                        `${handlerInfo.phoneNumber}`
                      }
                      type="info"
                      showIcon
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label={"Problem"}>
                    <Input
                      value={req.reqProblem}
                      style={{ width: "100%" }}
                      placeholder="Other"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ style: { width: 200 } }}
                    label="Other Problem"
                    name="other"
                  >
                    <Input
                      value={req.other}
                      style={{ width: "100%" }}
                      placeholder="Other"
                    />
                  </Form.Item>
                </Col>

                {detail &&
                  detail.map((reqd) => (
                    <>
                      <Col span={8}>
                        <Form.Item name="reqForMySelf">
                          <Radio.Group
                            name="radiogroup"
                            defaultValue={reqd.reqForMySelf}
                          >
                            <Space size={30}>
                              <Radio value="Y"> Requset for myself </Radio>
                              <Radio value="N"> Requset for other </Radio>
                            </Space>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item>
                              <Input
                                value={reqd.reqForMyEmId}
                                disabled={componentDisabled}
                                style={{ width: "100%" }}
                                placeholder="ID"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item>
                              <Input
                                value={reqd.reqForDept}
                                disabled={componentDisabled}
                                style={{ width: "100%" }}
                                placeholder="Department"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item disabled={componentDisabled}>
                              <Input
                                value={reqd.reqForSec}
                                disabled={componentDisabled}
                                style={{ width: "100%" }}
                                placeholder="Section"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={4}>
                        <Form.Item>
                          <Input
                            placeholder="Expected Date"
                            value={req.expDate}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <p className="incidentp1">
                          Please select incident prioritization
                        </p>
                      </Col>
                      <Col span={12}>
                        <p className="incidentp1">Emil to Management</p>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          label="Prioritization"
                          labelCol={{ style: { width: 200 } }}
                          //name="priorityID"
                          rules={[
                            {
                              required: true,
                              message: "Please",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            defaultValue={req.prioId}
                            style={{
                              width: "100%",
                            }}
                            placeholder="Search to Select"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? "").includes(input)
                            }
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.label ?? "").toLowerCase()
                                )
                            }
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          labelCol={{ style: { width: "100%" } }}
                          label="Email to:"
                        >
                          <Input
                            value={reqd.emailToEm}
                            style={{ width: "100%" }}
                            prefix={<MailTwoTone />}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          labelCol={{ style: { width: "100%" } }}
                          label="CC Email to:"
                        >
                          <Input
                            value={reqd.ccEmailTo}
                            style={{ width: "100%" }}
                            prefix={<MailTwoTone />}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  ))}

                <Col span={24}>
                  <Form.Item
                    labelCol={{ style: { width: 200 } }}
                    label="Download File"
                  >
                    {files.length != 0 ? (
                      data &&
                      lIstFile.map((item, index) => (
                        <Popconfirm
                          title="View the File"
                          description="Do you want view this File?"
                          okText="Yes"
                          cancelText="No"
                          onConfirm={() =>
                            window.open(
                              `${Config.imagePath}${item.fname}`,
                              "_blank"
                            )
                          }
                        >
                          <Button style={{ marginRight: 10 + "px" }}>
                            <FileSearchOutlined />
                            view file({index + 1})
                          </Button>
                        </Popconfirm>
                      ))
                    ) : (
                      <Alert
                        message="No files have been uploaded here!"
                        type="warning"
                        showIcon
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    labelCol={{ style: { width: 200 } }}
                    label="Purpose"
                  >
                    <Alert message={req.purpose} type="info" showIcon />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Form
              layout="vertical"
              name="basic"
              form={form}
              labelCol={{
                span: 8,
              }}
              initialValues={{
                remember: 1,
              }}
              onFinish={onFinish}
            >
              <Row className="part">
                <Col span={24} className="part_incident">
                  Response
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={18}>
                  <Form.Item name={"id"}>
                    <div className="repMeassage">
                      {responseDetail &&
                        responseDetail.map((rep) => (
                          <Alert
                            message={rep.responseDetail}
                            type="info"
                            action={
                              <>
                                <Tag
                                  icon={<EyeFilled />}
                                  color="#3b5999"
                                  onClick={(e) => {
                                    showDrawer();
                                    getRepDetailBy1(rep.id);
                                  }}
                                >
                                  view Detail
                                </Tag>
                                <Tag
                                  icon={<CalendarOutlined />}
                                  color="#3b5999"
                                >
                                  Response Date: {dayjs(rep.dateRep).format(
                                    "MMM D, YYYY h:mm A"
                                  )}
                                </Tag>
                              </>
                            }
                            showIcon
                          />
                        ))}
                    </div>
                  </Form.Item>
                  <Form.Item
                    label="Comment"
                    name={"comment"}
                    rules={[
                      {
                        required: true,
                        message: "Please input comment!",
                      },
                    ]}
                  >
                    <TextArea
                      showCount
                      maxLength={300}
                      style={{
                        height: 100,
                        marginBottom: 24,
                      }}
                      onChange={onChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: "100%" } }}
                    label="Progress"
                    name={"progress"}
                  >
                    <Progress
                      type="circle"
                      percent={percent}
                      style={{
                        marginRight: 8,
                      }}
                    />
                    <Button.Group>
                      <Button onClick={decline} icon={<MinusOutlined />} />
                      <Button onClick={increase} icon={<PlusOutlined />} />
                    </Button.Group>
                  </Form.Item>

                  <Form.Item>
                    <Upload {...props}>
                      <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    labelCol={{ style: { width: "100%" } }}
                    label="Date finish Response"
                  >
                    <DatePicker showTime onChange={onChangeDateFinish} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {req.status == 3 ? (
                    <Form.Item
                      wrapperCol={{
                        span: 10,
                      }}
                    >
                      <Space size={50}>
                        {req.status == 2 ? (
                          <Button
                            disabled={true}
                            type="success"
                            onClick={handleProcess}
                            htmlType="submit"
                          >
                            In Process
                          </Button>
                        ) : (
                          <Button
                            disabled={true}
                            type="info"
                            onClick={handleProcess}
                            htmlType="submit"
                          >
                            Progress
                          </Button>
                        )}

                        <Button disabled={true} type="primary">
                          Complete
                        </Button>
                      </Space>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      wrapperCol={{
                        span: 10,
                      }}
                    >
                      <Space size={50}>
                        {req.status == 1 ? (
                          <Button
                            type="success"
                            onClick={handleProcess}
                            disabled={disabledBtn2}
                            htmlType="submit"
                          >
                            In Process
                          </Button>
                        ) : (
                          <Button
                            type="info"
                            disabled={disabledBtn2}
                            onClick={handleProcess}
                            htmlType="submit"
                          >
                            Progress
                          </Button>
                        )}

                        <Popconfirm
                          title="Complete the ticket"
                          description="Please make sure you filled out the ticket completely."
                          onConfirm={handleCompletes}
                          okText="Yes"
                          cancelText="No"
                          disabled={disabledBtn2}
                        >
                          <Button type="primary" disabled={disabledBtn2}>
                            Complete
                          </Button>
                        </Popconfirm>
                      </Space>
                    </Form.Item>
                  )}
                </Col>
              </Row>
            </Form>

            {closeDetail.length != 0 ? (
              <Row>
                <Col span={24}>
                  {closeDetail &&
                    closeDetail.map((col) =>
                      col.closeDetail.includes("rejected") ? (
                        <Alert
                          message={col.closeDetail}
                          type="error"
                          action={
                            <>
                              <Tag icon={<UserOutlined />} color="#3b5999">
                                ID: {col.emId} / {col.username}
                              </Tag>
                              <Tag icon={<CalendarOutlined />} color="#3b5999">
                                {dayjs(col.dateRep).format(
                                  "MMM D, YYYY h:mm A"
                                )}
                              </Tag>
                            </>
                          }
                          showIcon
                        />
                      ) : col.closeDetail.includes("handler") ? (
                        <Alert
                          message={col.closeDetail}
                          type="info"
                          action={
                            <>
                              <Tag icon={<UserOutlined />} color="#3b5999">
                                ID: {col.emId} / {col.username}
                              </Tag>
                              <Tag icon={<CalendarOutlined />} color="#3b5999">
                                {dayjs(col.dateRep).format(
                                  "MMM D, YYYY h:mm A"
                                )}
                              </Tag>
                            </>
                          }
                          showIcon
                        />
                      ) : (
                        <Alert
                          message={col.closeDetail}
                          type="success"
                          action={
                            <>
                              <Tag icon={<UserOutlined />} color="#3b5999">
                                ID: {col.emId} / {col.username}
                              </Tag>
                              <Tag icon={<CalendarOutlined />} color="#3b5999">
                                {dayjs(col.dateRep).format(
                                  "MMM D, YYYY h:mm A"
                                )}
                              </Tag>
                            </>
                          }
                          showIcon
                        />
                      )
                    )}
                </Col>
              </Row>
            ) : (
              <Alert
                message="There is no message or reason here!"
                type="warning"
                showIcon
              />
            )}
          </>
        </div>
      </Spin>
    </>
  );
};

export default PageResponsible;
