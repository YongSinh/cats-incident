import React from "react";
import PageContainer from "../../container/PageContainer";
import "./PageRequested.css";
import { Button, message, Space, Table, Tag } from "antd";
import { useState, useEffect } from "react";
import { EyeOutlined, CommentOutlined } from "@ant-design/icons";
import { request } from "../../../config/api.config";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import ModalForm from "./ModalForm";
import UserService from "../../../UserService/UserService";
import { ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";
import "react-toastify/dist/ReactToastify.css";
import { Config } from "../../../config/config";
import { isEmptyOrNull } from "../../../config/service";
import getColumnSearchProps from "../../../component/search/ColumnSearchProps";
import "antd-button-color/dist/css/style.css";

const PageClientReport = () => {
  const [createDate, setcreateDate] = useState(dayjs());
  const [mailFrom, setFrom] = useState([]);
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [EmHander, setEmHander] = useState([]);
  const [monthyear, setmonthyear] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [month, setmonth] = useState("");
  const [year, setyear] = useState("");
  const [sec, setSec] = useState();
  const [Department, setDepartment] = useState();

  const onClickEditBtn = (param) => {
    setItems(param);
    setVisibleModal(true);
  };
  //   const onChangeDate = (date, dateString) => {
  //     // Parse the date string and create a date object.
  //     const parsedDate = dayjs(dateString);

  //     // Format the date object and return the month as a string.
  //     const month = parsedDate.format("M");
  //     const year = parsedDate.format("YYYY");
  //     setmonth(month);
  //     setyear(year);
  //     setmonthyear(dateString);
  //   };

  const onCloseModalForm = () => {
    setVisibleModal(false);
    setItems(null);
  };

  useEffect(() => {
    getList();
    getmailFrom();
    getEmInfor();
  }, []);

  const [items, setItems] = useState("");
  const getList = async () => {
    setLoading(true);
    request("get", "requests/getEmReqByDept", {}).then((res) => {
      if (res.status == 200) {
        var data = res.data;
        var arrTmpS = [];
        const filtered = data.data.filter((item) => {
          return item.proId === "Completed";
        });
        setdata(filtered);
        setTickets(filtered);

        data.data.map((item) => {
          arrTmpS.push({
            label: item.handler,
            value: item.handler,
          });
        });
        setEmHander(arrTmpS);
        setLoading(false);
      }
    });
  };

  const onFilterDate = (dateString) => {
    const parsedDate = dayjs(dateString);
    const month = parsedDate.format("M");
    const year = parsedDate.format("YYYY");
    setmonth(month);
    setyear(year);
    if (!isEmptyOrNull(dateString)) {
      request("get", "requests/getEmReqByDept", {}).then((res) => {
        if (res.status == 200) {
          var data = res.data;
          const filtered = data.data.filter((item) => {
            return (
              dayjs(item.createDate).format("YYYY-MM") ===
                parsedDate.format("YYYY-MM") && item.proId == "Completed"
            );
          });
          setdata(filtered);
          setLoading(false);
        }
      });
    } else
      request("get", "requests/getEmReqByDept", {}).then((res) => {
        if (res.status == 200) {
          var data = res.data;
          setdata(data.data);
          var arrTmpS = [];
          const filtered = data.data.filter((item) => {
            return item.proId === "Completed";
          });
          setdata(filtered);

          data.data.map((item) => {
            arrTmpS.push({
              label: item.handler,
              value: item.handler,
            });
          });
          setEmHander(arrTmpS);
          setLoading(false);
        }
      });
  };

  const UserId = localStorage.getItem("Id");

  const getmailFrom = async () => {
    setLoading(true);
    request("get", "Em/getEmEmail/" + UserId, {}).then((res) => {
      if (res.status == 200) {
        var data = res.data;
        setFrom(data.data);
        setLoading(false);
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
      }
    });
  };

  const navigate = useNavigate();

  const handOnClick = () => {
    navigate("/request");
  };

  const getEmInfor = () => {
    setLoading(true);
    request("get", "Em/getEmById/" + UserId, {}).then((res) => {
      if (res.status == 200) {
        var data = res.data;
        setDepartment(data.data.poDepartment);
        setSec(data.data.poSection);
        setLoading(false);
      }
    });
  };

  const handleGetReport = () => {
    setLoading(true);
    var param =
      "report/getReportByStatus?" +
      "month" +
      "=" +
      month +
      "&" +
      "year" +
      "=" +
      year +
      "&" +
      "sec" +
      "=" +
      sec +
      "&" +
      "Dept" +
      "=" +
      Department +
      "&" +
      "status=" +
      3;
    //console.log(param)
    request("get", param, {})
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
          toast.success("File downloaded succesfully!", {
            position: toast.POSITION.TOP_CENTER,
          });
          window.open(`${Config.baseUrl}${param}`, "_blank");
        } else if (!res.ok) {
          setLoading(false);
          if (isEmptyOrNull(monthyear)) {
            toast.warning("Please select the date before download!", {
              position: toast.POSITION.TOP_CENTER,
            });
          } else {
            toast.warning(
              "There is no data to download on that date: " + monthyear,
              {
                position: toast.POSITION.TOP_CENTER,
              }
            );
          }
          throw new Error(`error With Status`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSearch = (text) => {
    setLoading(true);
    var param = "";
    if (!isEmptyOrNull(text)) {
      param = "requests/findById/" + text; // query parameter
      request("get", param, {}).then((res) => {
        setLoading(false);
        if (res.status == 200) {
          setLoading(false);
          var data = res.data;
          setdata([data.data]);
        }
      });
      // param += "&from_date=2023-05-02&to_date=2023-05-02" // YYYY-MM-DD
    } else {
      getList();
    }
  };

  return (
    <>
      <ToastContainer />
      <PageContainer
        btnRight="New Incident Ticket"
        onClickBtnRight={handOnClick}
        pageTitle="Report"
        loading={loading}
        onChangeDate={onFilterDate}
        onConfirm={handleGetReport}
        btnFilter={true}
        search={{
          title: "Req ID",
          allowClear: true,
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
                    {/* onClick={() => onClickEditBtn(items)} */}
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
    </>
  );
};

export default PageClientReport;
