import React from "react";
import {
  Button,
  Col,
  Alert,
  Tag,
  Form,
  Spin,
  Input,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  message,
  Progress,
  List,
  Avatar,
} from "antd";
import {
  DownCircleOutlined,
  MailTwoTone,
  DownloadOutlined,
  CalendarOutlined,
  UserOutlined,
  RollbackOutlined,
  FileSearchOutlined,
  EyeFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { Config } from "../../../config/config";
import { request } from "../../../config/api.config";
import dayjs from "dayjs";
import { useParams, Link, useNavigate } from "react-router-dom";
import UserService from "../../../UserService/UserService";
import { faCheckToSlot, faEject } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "antd-button-color/dist/css/style.css";
import DrawerForm from "../Responsible/Drawer";
import jsPDF from "jspdf";
import { isEmptyOrNull } from "../../../config/service";
import { toJpeg, toPng, toSvg } from "html-to-image";
import { toast, ToastContainer } from "react-toastify";

const { TextArea } = Input;

const MyFormItemContext = React.createContext([]);
const logo = require("../../../asset/image/logoBlue.png"); // with require

const PageCloseTicket = () => {
  const reportTemplateRef = useRef(null);
  const elementRef = useRef(null);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const params = useParams();
  const [RepDetail, setRepDetail] = useState([]);
  const [closeDetail, setCloseDetail] = useState([]);
  const [handlerInfo, sethandlerInfo] = useState([]);
  const [lIstFile, setLIstFile] = useState([]);
  const [close, setclose] = useState([]);
  const [DisableForm, setDisableForm] = useState(false);
  const [data, setdata] = useState([]);
  const [data1, setdata1] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(null);
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [responseDetail, setresponseDetail] = useState([]);
  const [ButtonDisabled, setButtonDisabled] = useState(true);
  const [processvalue, setProcessvalue] = useState("");
  const [agree, setAgree] = useState("");
  const [date1, setdate1] = useState();
  const [date2, setdate2] = useState();
  useEffect(() => {
    getList();
    getList2();
    getListFile();
    getCloseList();
    getListResponseDetail();
    getListCloseDetail();
  }, []);

  const htmlToImageConvert = () => {
    setLoading(true);
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        //link.click();

        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        if (height == pdfHeight) {
          pdf.addPage();
        }
        window.open(pdf.output("bloburl"));
        setLoading(false);

        toast.success("File downloaded succesfully!", {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((err) => {
        toast.error("File downloaded error!", {
          position: toast.POSITION.TOP_CENTER,
        });
        console.log(err);
      });
  };

  const today = new Date();

  const onChange = (event) => {
    console.log(`checked = ${event.target.checked}`);
  };

  const getRepDetailBy1 = async (id) => {
    setLoading(true);
    request("get", "responseDetail/getResponseDetailById/" + id, {}).then(
      (res) => {
        if (res.status == 200) {
          setLoading(false);
          var data = res.data;
          setRepDetail(data.data);
        }
      }
    );
  };

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

  const singleUserApiUrl = `${params.id}`;

  const getList = async () => {
    setLoading(true);
    request("get", "requests/findById/" + singleUserApiUrl, {}).then((res) => {
      if (res.status == 200) {
        setLoading(false);
        var data = res.data;
        setdata(data.data);
        if (data.data.status === 3) {
          setButtonDisabled(false);
        }
        const date1 = new Date(data.data.incidentDate);
        let  date2 = ""
        if(!isEmptyOrNull(data.data.deleteDate)){
          date2 =  new Date(data.data.deleteDate);
        }
        setdate1(date1)
        setdate2(date2)
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
          if (data.code === 200) {
            setdata1([data.data]);
          }
        }
      }
    );
  };

  const handleAccept = () => {
    setProcessvalue(3);
    setAgree("Y");
  };

  const handleReject = () => {
    setProcessvalue(2);
    setAgree("N");
  };

  const onFinish = async (item) => {
    setLoading(true);
    var text = "";
    if (agree == "Y") {
      text = "The user have accepted: ";
    } else {
      text = "The user has rejected: ";
    }

    var body = {
      updateRequestDto: {
        reason: text + item.reason,
        proId: processvalue,
      },
      close1: {
        createDate: today,
        agree: agree,
      },
    };

    var method = "put";
    var url = "requests/close/" + singleUserApiUrl;

    request(method, url, body).then((res) => {
      if (res.status == 200) {
        setLoading(false);
        var data = res.data;
        setItems(null);
        getList();
        getListCloseDetail();
        if (agree == "Y") {
          message.success(data.message);
        } else {
          message.success("Not Accepted");
        }
      }
    });
  };

  const navigate = useNavigate();

  const onClick = () => {
    navigate(-1);
  };
  const getCloseList = async () => {
    setLoading(true);
    request("get", "close/findById/" + singleUserApiUrl, {}).then((res) => {
      if (res.status == 200) {
        setLoading(false);
        var data = res.data;
        setclose(data.data);
        if (data.code === 200) {
          if (data.data.agree === "Y") {
            setDisableForm(true);
            setComponentDisabled(true);
          }
        }
      }
    });
  };

  // Order by Rep and close by date
  responseDetail.sort((a, b) => new Date(a.dateRep) - new Date(b.dateRep));
  closeDetail.sort((a, b) => new Date(a.dateRep) - new Date(b.dateRep));

  const isClose = DisableForm; // true

  const files = lIstFile.map((item, index) => {
    return item.fname;
  });

  const onRelaod = () => {
    setLoading(true);
    getList();
    getList2();
    getListFile();
    getListResponseDetail();
    getListCloseDetail();
    //getRepDetailBy1();
  };
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
      <ToastContainer />
      <div
        style={{
          marginBottom: 10,
        }}
      >
        <Space>
          <Button onClick={onClick} type="info">
            <RollbackOutlined />
            Back
          </Button>
          <Button onClick={onRelaod} type="success">
            <ReloadOutlined />
            Relaod
          </Button>
          <Button onClick={htmlToImageConvert} type="primary">
            <DownloadOutlined />
            Download Form
          </Button>
        </Space>
      </div>

      <Spin spinning={loading}>
        <DrawerForm open={open} onClose={onClose} RepDetail={RepDetail} />
        <div className="center" ref={elementRef}>
          <>
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
                    percent={req.percent}
                    style={{
                      marginRight: 8,
                      float: "right",
                    }}
                  />
                </Col>
                <Col span={18}>
                  <Form.Item
                    labelCol={{ style: { width: "100%" } }}
                    style={{ width: "15%" }}
                    label="Type Of Requset"
                  >
                    <Input value={req.cateoId} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: "100%", textAlign: "end" } }}
                    label="Total handle ticket"
                  >
                    <Input style={{ textAlign: "end" }} value={totalHandle()} />
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
                  <Form.Item
                    style={{ width: "100%" }}
                    label="ID"
                    rules={[
                      {
                        required: true,
                        message: "Please input your ID!",
                      },
                    ]}
                  >
                    <Input value={req.fromEmp} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: "100%" } }}
                    label="Department"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Department!",
                      },
                    ]}
                  >
                    <Input value={req.fromDept} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: 200 } }}
                    label="Section"
                    //name="fromGroup"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Section!",
                      },
                    ]}
                  >
                    <Input value={req.fromGroup} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ style: { width: 200 } }}
                    label="Location"
                    //name="fromLocal"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Local!",
                      },
                    ]}
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
                    <Input value={req.serviceID} />
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
                        "Handler Contact: " +
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

                {data1 &&
                  data1.map((reqd) => (
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
                    {files.length !== 0 ? (
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
            >
              <Row className="part">
                <Col span={24} className="part_incident">
                  Response
                </Col>
              </Row>

              <Col span={24}>
                <Form.Item labelCol={{ style: { width: 200 } }} label="Comment">
                  {responseDetail.length != 0 ? (
                    responseDetail &&
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
                            <Tag icon={<CalendarOutlined />} color="#3b5999">
                            Response Date: {dayjs(rep.dateRep).format("MMM D, YYYY h:mm A")}
                            </Tag>
                          </>
                        }
                        showIcon
                      />
                    ))
                  ) : (
                    <Alert
                      message="There is no message or comments here!"
                      type="warning"
                      showIcon
                    />
                  )}
                </Form.Item>
              </Col>
            </Form>

            <Form
              layout="vertical"
              name="basic"
              labelCol={{
                span: 8,
              }}
              style={{
                maxWidth: "100%",
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              {req.status === 3 ? (
                isClose ? (
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        labelCol={{ style: { width: 200 } }}
                        label="Reason"
                      >
                        {closeDetail &&
                          closeDetail.map((col) =>
                            col.closeDetail.includes("rejected") ? (
                              <Alert
                                message={col.closeDetail}
                                type="error"
                                action={
                                  <>
                                    <Tag
                                      icon={<UserOutlined />}
                                      color="#3b5999"
                                    >
                                      ID: {col.emId} / {col.username}
                                    </Tag>
                                    <Tag
                                      icon={<CalendarOutlined />}
                                      color="#3b5999"
                                    >
                                     Rejected Date: {dayjs(col.dateRep).format(
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
                                    <Tag
                                      icon={<UserOutlined />}
                                      color="#3b5999"
                                    >
                                      ID: {col.emId} / {col.username}
                                    </Tag>
                                    <Tag
                                      icon={<CalendarOutlined />}
                                      color="#3b5999"
                                    >
                                     Close Date: {dayjs(col.dateRep).format(
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
                                    <Tag
                                      icon={<UserOutlined />}
                                      color="#3b5999"
                                    >
                                      ID: {col.emId} / {col.username}
                                    </Tag>
                                    <Tag
                                      icon={<CalendarOutlined />}
                                      color="#3b5999"
                                    >
                                     Close Date: {dayjs(col.dateRep).format(
                                        "MMM D, YYYY h:mm A"
                                      )}
                                    </Tag>
                                  </>
                                }
                                showIcon
                              />
                            )
                          )}
                      </Form.Item>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col span={24}>
                      <div className="colMeassage">
                        {closeDetail &&
                          closeDetail.map((col) =>
                            col.closeDetail.includes("rejected") ? (
                              <Alert
                                message={col.closeDetail}
                                type="error"
                                action={
                                  <>
                                    <Tag
                                      icon={<UserOutlined />}
                                      color="#3b5999"
                                    >
                                      ID: {col.emId} / {col.username}
                                    </Tag>
                                    <Tag
                                      icon={<CalendarOutlined />}
                                      color="#3b5999"
                                    >
                                     Rejected Date: {dayjs(col.dateRep).format(
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
                                    <Tag
                                      icon={<UserOutlined />}
                                      color="#3b5999"
                                    >
                                      ID: {col.emId} / {col.username}
                                    </Tag>
                                    <Tag
                                      icon={<CalendarOutlined />}
                                      color="#3b5999"
                                    >
                                     Close Date: {dayjs(col.dateRep).format(
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
                                    <Tag
                                      icon={<UserOutlined />}
                                      color="#3b5999"
                                    >
                                      ID: {col.emId} / {col.username}
                                    </Tag>
                                    <Tag
                                      icon={<CalendarOutlined />}
                                      color="#3b5999"
                                    >
                                    Close Date: {dayjs(col.dateRep).format(
                                        "MMM D, YYYY h:mm A"
                                      )}
                                    </Tag>
                                  </>
                                }
                                showIcon
                              />
                            )
                          )}
                      </div>
                      <Form.Item
                        labelCol={{ style: { width: 200 } }}
                        label="Reason"
                        name={"reason"}
                        rules={[
                          {
                            required: true,
                            message: "Please input the reason!",
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
                          onChange={onChange}
                          // placeholder="can resize"
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
                          <Button
                            disabled={ButtonDisabled}
                            onClick={handleAccept}
                            type="success"
                            htmlType="submit"
                          >
                            <Space>
                              <FontAwesomeIcon icon={faCheckToSlot} />
                              Accept
                            </Space>
                          </Button>

                          <Button
                            type="primary"
                            disabled={ButtonDisabled}
                            danger
                            onClick={handleReject}
                            htmlType="submit"
                          >
                            <Space>
                              <FontAwesomeIcon icon={faEject} /> Reject
                            </Space>
                          </Button>
                        </Space>
                      </Form.Item>
                    </Col>
                  </Row>
                )
              ) : (
                <Form.Item labelCol={{ style: { width: 200 } }} label="Reason">
                  <Alert
                    message="There is no message or reason here!"
                    type="warning"
                    showIcon
                  />
                </Form.Item>
              )}
            </Form>
          </>
        </div>
      </Spin>
    </>
  );
};

export default PageCloseTicket;
