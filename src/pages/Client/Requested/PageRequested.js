import React from "react";
import PageContainer from "../../container/PageContainer";
import "./PageRequested.css";
import {
  Button,
  Popconfirm,
  message,
  Space,
  Table,
  Tag,
} from "antd";
import { useState, useEffect } from "react";
import {
  EyeOutlined,
  CommentOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { request } from "../../../config/api.config";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ModalForm from "./ModalForm";
import UserService from "../../../UserService/UserService";
import dayjs from "dayjs";
import { isEmptyOrNull } from "../../../config/service";
import getColumnSearchProps from "../../../component/search/ColumnSearchProps";
import "antd-button-color/dist/css/style.css";
const PageClientReq = () => {
  const UserId = localStorage.getItem("Id");
  const [createDate, setcreateDate] = useState(dayjs());
  const [mailFrom, setFrom] = useState([]);
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [EmHander, setEmHander] = useState([]);

  const [visibleModal, setVisibleModal] = useState(false);

  const onClickEditBtn = (param) => {
    setItems(param);
    setVisibleModal(true);
  };

  const onCloseModalForm = () => {
    setVisibleModal(false);
    setItems(null);
  };


  useEffect(() => {
    getList();
    getmailFrom();
  }, []);

  const [items, setItems] = useState("");

  const getList = async () => {
    setLoading(true);
    request("get", "requests/getEmReqByDept", {}).then((res) => {
      if (res.status == 200) {
        setLoading(false);
        var data = res.data;
        // setdata(data.data)
        var arrTmpS = [];
        const filtered = data.data.filter((item) => {
          return (
            item.proId === "In Progress" ||
            item.proId === "Not Started" ||
            item.proId == null
          );
        });
        setdata(filtered);

        data.data.map((item) => {
          arrTmpS.push({
            label: item.handler,
            value: item.handler,
          });
        });
        setEmHander(arrTmpS);
      }
    });
  };

  const getmailFrom = async () => {
    setLoading(true);
    request("get", "Em/getEmEmail/" + UserId, {}).then((res) => {
      if (res.status == 200) {
        setLoading(false);
        var data = res.data;
        setFrom(data.data);
      }
    });
  };

  const onClickDeleteBtn = (id) => {
    setLoading(true);
    request("delete", "requests/delete/" + id, {}).then((res) => {
      setLoading(false);
      if (res.status == 200) {
        message.success(res.data.message);
        getList();
      }
    });
  };

  const onFinish = (item) => {
    setVisibleModal(false);
    setLoading(true);
    var body = {
      subject: item.subject,
      body: item.body,
      mailTo: item.mailTo,
      from: item.from,
      createDate: createDate,
      req_id: item.id,
    };
    var method = "post";
    var url = "mail/add";

    request(method, url, body).then((res) => {
      if (res.status == 200) {
        message.success(res.data.message);
        setItems(null);
        getList();
        setLoading(false);
      }
    });
  };

  const navigate = useNavigate();

  const handOnClick = () => {
    navigate("/request");
  };

  const onSearch = (text) => {
    setLoading(true);
    var param = "";
    if (!isEmptyOrNull(text)) {
      param = "requests/findById/" + text; // query parameter
      request("get", param, {}).then((res) => {
        if (res.status == 200) {
          var data = res.data;
          setdata([data.data]);
          setLoading(false);
        }
      });
    } else {
        getList()
    }
  };

  return (
    <PageContainer
      btnRight="New Incident Ticket"
      onClickBtnRight={handOnClick}
      pageTitle="Pending"
      loading={loading}
      search={{
        title: "Req ID",
        allowClear: true,
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
          {
            title: "Req ID",
            dataIndex: "id",
            key: "id",
            fixed: true,
          },
          {
            title: "Req.EmID",
            dataIndex: "fromEmp",
            key: "fromEmp",
            ...getColumnSearchProps("fromEmp"),
          },
          {
            key: "FromDept",
            title: "Req.Dept",
            dataIndex: "fromDept",
          },
          {
            title: "Req.Sec",
            dataIndex: "fromGroup",
            key: "FromGroup",
          },
          {
            title: "Req.Location",
            dataIndex: "fromLocal",
            key: "fromLocal",
          },
          {
            key: "toDept",
            title: "Resp.Dept",
            dataIndex: "toDept",
          },
          {
            title: "Resp.Sec",
            dataIndex: "toGroup",
            key: "toGroup",
          },
          {
            title: "Service",
            dataIndex: "serviceID",
            key: "serviceID",
            ...getColumnSearchProps("serviceID"),
          },
          {
            title: "Prioritization",
            dataIndex: "prioId",
            key: "prioId",
            ...getColumnSearchProps("prioId"),
            render: (item, items, index) => {
              let color = item?.length > 5 ? "geekblue" : "green";
              if (items.prioId == "Hight") {
                color = "red";
              } else if (items.prioId == "Low") {
                color = "green";
              } else if (items.prioId == "Medium") {
                color = "geekblue";
              } else if (items.prioId == "Critical") {
                color = "red";
              } else {
                color = "green";
              }
              return <Tag color={color}>{item}</Tag>;
            },
          },
          {
            title: "Type of Requset",
            dataIndex: "cateoId",
            key: "cateoId",
            render: (item, items, index) => {
              let color;
              if (item == "Incident") {
                color = "geekblue";
              } else {
                color = "green";
              }
              return <Tag color={color}>{item}</Tag>;
            },
          },
          {
            key: "proId",
            title: "Status",
            dataIndex: "proId",
            ...getColumnSearchProps("proId"),
            render: (item, items, index) => {
              let color = item?.length > 5 ? "geekblue" : "green";
              if (item == "Not Started") {
                color = "red";
              } else if (item == "In Progress") {
                color = "green";
              } else if (item == "Completed") {
                color = "geekblue";
              } else {
                color = "geekblue";
              }
              return <Tag color={color}>{item}</Tag>;
            },
          },
          {
            title: "Incident No",
            dataIndex: "incidentNo",
            key: "incidentNo",
            ...getColumnSearchProps("incidentNo"),
          },
          {
            title: "Date",
            dataIndex: "createDate",
            key: "createDate",
            render: (item, items, index) => dayjs(item).format("YYYY-MM-DD"),
          },
          {
            title: "Action",
            key: "Action",
            fixed: "right",
            render: (item, items, index) => {
              return (
                <Space>
                  <Link to={`/acceptable/${items.id}`}>
                    <Button type="success" size="small">
                      <EyeOutlined />
                      view
                    </Button>
                  </Link>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => onClickEditBtn(items)}
                  >
                    <CommentOutlined />
                  </Button>
                  {items.fromEmp == UserService.getUsername() &&
                  items.status == 1 ? (
                    <Popconfirm
                      title="Cancel Ticket"
                      description="Do you want to cancel the tickets?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => onClickDeleteBtn(items.id)}
                    >
                      <Button type="primary" size="small" danger>
                        <CloseCircleOutlined />
                        Cancel
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Button disabled={true} type="primary" size="small" danger>
                      <CloseCircleOutlined />
                      Cancel
                    </Button>
                  )}
                </Space>
              );
            },
          },
        ]}
        dataSource={data.map((item) => ({
          ...item,
          incidentNo:
            dayjs(item.createDate).format("MMYYYY") +
            "~" +
            (item.runNumber === null ? "000" : item.runNumber),
        }))}
        scroll={{ x: "max-content" }}
      />

      <ModalForm
        items={items}
        open={visibleModal}
        title={"New Message"}
        onCancel={onCloseModalForm}
        onFinish={onFinish}
        mailFrom={mailFrom}
      />
    </PageContainer>
  );
};

export default PageClientReq;
