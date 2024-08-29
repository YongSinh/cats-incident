import React from "react";
import PageContainer from "../../container/PageContainer";
import { Button, message, Space, Table, Tag } from "antd";
import { useState, useEffect } from "react";
import { EyeOutlined, InfoCircleFilled } from "@ant-design/icons";
import { request } from "../../../config/api.config";
import { isEmptyOrNull, formatDateForClient } from "../../../config/service";
import { Link } from "react-router-dom";
import UserService from "../../../UserService/UserService";
import { faShareFromSquare, faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import { Config } from "../../../config/config";
import dayjs from "dayjs";
import ModalForm from "./ModalForm";
import getColumnSearchProps from "../../../component/search/ColumnSearchProps";
import "antd-button-color/dist/css/style.css";

const DepartmentWorkTask = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [department, setdepartment] = useState();
  const [list, setlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(null);
  const [ServiceDetail, setServiceDetail] = useState([]);
  const [ServiceDetail1, setServiceDetail1] = useState([]);
  const [UserId, setUserId] = useState();
  const [prior, setprior] = useState();
  const [sec, setSection] = useState();
  const [monthyear, setmonthyear] = useState("");
  const [month, setmonth] = useState("");
  const [year, setyear] = useState("");
  const [Department, setDepartment] = useState();
  const [status, setstatus] = useState();
  const [priority, setpriority] = useState([]);
  const onCloseModalForm = () => {
    setVisibleModal(false);
    setItems(null);
  };

  const onClickEditBtn = (param) => {
    setItems(param);
    setVisibleModal(true);
  };

  useEffect(() => {
    getList();
    getDepartment();
    getEmInfor();
    getListPriority();
  }, []);

  const getDepartment = async () => {
    setLoading(true);
    request("get", "Em/getAllDept", {}).then((res) => {
      if (res.status === 200) {
        var data = res.data;
        var arrTmpS = [];
        data.data.map((item) => {
          arrTmpS.push({
            label: item.Dept,
            value: item.Dept,
          });
        });
        setdepartment(arrTmpS);
        setLoading(false);
      }
    });
  };

  const getEmInfor = () => {
    setLoading(true);
    request("get", "Em/getEmById/" + UserService.getUsername(), {}).then(
      (res) => {
        setLoading(false);
        if (res.status === 200) {
          var data = res.data;
          setDepartment(data.data.poDepartment);
          setSection(data.data.poSection);
        }
      }
    );
  };

  const getListPriority = () => {
    setLoading(true);
    request("get", "admin/priority", {}).then((res) => {
      if (res.status === 200) {
        var data = res.data;

        var arrTmpP = [];
        data.data.map((item) => {
          arrTmpP.push({
            label: item.prio_name,
            value: item.prio_name,
          });
        });
        setpriority(arrTmpP);
        setLoading(false);
      }
    });
  };

  const onchangedepartment = (value) => {
    setLoading(true);
    request("get", "admin/service", {}).then((res) => {
      if (res.status === 200) {
        var data = res.data;
        setServiceDetail1(data.data.ServiceDetail);
        var arrTmpS = [];
        const filtered = data.data.ServiceDetail.filter((item) => {
          return item.dept === value;
        });

        filtered.map((item) => {
          arrTmpS.push({
            label: item.serviceName,
            value: item.service_id,
          });
        });
        setServiceDetail(arrTmpS);
        setLoading(false);
      }
    });
  };

  const getList = () => {
    setLoading(true);
    request("get", "requests/getReqForDeptAndSec", {}).then((res) => {
      if (res.status === 200) {
        var data = res.data;
        setlist(data.data);
        setLoading(false);
      }
    });
  };

  const onFinish = (item) => {
    setVisibleModal(false);
    setLoading(true);

    var body = {
      saveRequestDto: {
        service_ID: item.service_ID,
      },
    };

    var method = "put";
    var url = "requestDetail/forward/" + item.id;

    request(method, url, body).then((res) => {
      if (res.status === 200) {
        message.success(res.data.message);
        setItems(null);
        getList();
        setLoading(false);
      }
    });
  };

  const handleGetReport = () => {
    setLoading(true);
    var param = "";
    if (isEmptyOrNull(status)) {
      param =
        "report/getReportBySec?" +
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
        Department;
    } else {
      param =
        "report/getReportByStatusTo?" +
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
        status;
    }
    //console.log(param)
    request("get", param, {})
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
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

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const onChange = (date, dateString) => {
    // Parse the date string and create a date object.
    const parsedDate = dayjs(dateString);
    const month2 = parsedDate.format("M");
    const year = parsedDate.format("YYYY");
    setmonth(month2);
    setyear(year);
    setmonthyear(dateString);
    if (!isEmptyOrNull(dateString)) {
      const filtered = list.filter((item) => {
        return (
          dayjs(item.createDate).format("YYYY-MM") ===
          parsedDate.format("YYYY-MM")
        );
      });
      setlist(filtered);
    } else {
      getList();
    }
  };

  const onchangeStatus = (value) => {
    setstatus(value);
    console.log(value);
    if (!isEmptyOrNull(value)) {
      let status;
      switch (value) {
        case "1":
          status = "Not Started";
          break;
        case "2":
          status = "In Progress";
          break;
        default:
          status = "Completed";
          break;
      }
      const filtered = list.filter((item) => {
        return item.proId === status;
      });
      setlist(filtered);
    } else {
      getList();
    }
  };

  const onSearch = (text) => {
    setUserId(text);
    setLoading(true);
    var param = "requests/getReqForDeptAndSec";
    if (!isEmptyOrNull(text) && !isEmptyOrNull(prior)) {
      request("get", param, {}).then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setLoading(false);
          var data = res.data;
          const filtered = data.data.filter((item) => {
            return item.fromEmp === text && item.prioId === prior;
          });
          setlist(filtered);
        }
      });
    } else if (!isEmptyOrNull(text)) {
      request("get", param, {}).then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setLoading(false);
          var data = res.data;
          const filtered = data.data.filter((item) => {
            return item.fromEmp === text;
          });
          setlist(filtered);
        }
      });
    } else {
      request("get", param, {}).then((res) => {
        setLoading(false);
        if (res.status == 200) {
          setLoading(false);
          var data = res.data;
          setlist(data.data);
        }
      });
    }
  };

  const onChangePriority = (value) => {
    setprior(value);
    setLoading(true);
    var param = "requests/getReqForDeptAndSec";
    if (!isEmptyOrNull(value) && !isEmptyOrNull(UserId)) {
      request("get", param, {}).then((res) => {
        setLoading(false);
        if (res.status == 200) {
          setLoading(false);
          var data = res.data;
          const filtered = data.data.filter((item) => {
            return item.prioId == value && item.fromEmp == UserId;
          });
          setlist(filtered);
        }
      });
    } else if (!isEmptyOrNull(value)) {
      request("get", param, {}).then((res) => {
        setLoading(false);
        if (res.status == 200) {
          setLoading(false);
          var data = res.data;
          const filtered = data.data.filter((item) => {
            return item.prioId == value;
          });
          setlist(filtered);
        }
      });
    } else {
      request("get", param, {}).then((res) => {
        setLoading(false);
        if (res.status == 200) {
          setLoading(false);
          var data = res.data;
          setlist(data.data);
        }
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <PageContainer
        onChangeDate={onChange}
        onConfirm={handleGetReport}
        onchangePriority={onChangePriority}
        btnFilter={true}
        btnStatus={true}
        btntpriority={true}
        priority={priority}
        onchangeStatus={onchangeStatus}
        pageTitle="All Tickets"
        loading={loading}
        search={{
          title: "Search User ID",
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
            ,
            {
              title: "Req ID",
              dataIndex: "id",
              key: "id",
              fixed: true,
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
                return (
                  <Tag color={color} icon={<InfoCircleFilled />}>
                    {item}
                  </Tag>
                );
              },
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
              title: "Service Type",
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
              title: "Incident No",
              dataIndex: "incidentNo",
              key: "incidentNo",
              ...getColumnSearchProps("incidentNo"),
            },
            {
              title: "Craete Date",
              dataIndex: "createDate",
              key: "createDate",
              render: (item) => formatDateForClient(item),
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
              key: "Close",
              title: "Close",
              render: (item, items, index) => {
                let color;
                let value;
                if (items.status == 1) {
                  color = "red";
                  value = "Not Resolve";
                } else if (items.status == 2) {
                  color = "red";
                  value = "Not Resolve";
                } else {
                  color = "geekblue";
                  value = "Resolve";
                }

                return <Tag color={color}>{value}</Tag>;
              },
            },
            {
              title: "Action",
              key: "Action",
              fixed: "right",
              render: (item, items, index) => {
                return (
                  <Space>
                    <Link to={`/responsible/${items.id}`}>
                      <Button type="success" size="small">
                        <Space>
                          <FontAwesomeIcon icon={faReply} /> Response{" "}
                        </Space>
                      </Button>
                    </Link>

                    {item.status == "3" ? (
                      <Button
                        disabled={true}
                        onClick={() => onClickEditBtn(items)}
                        type="primary"
                        size="small"
                      >
                        <Space>
                          <FontAwesomeIcon icon={faShareFromSquare} />
                        </Space>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onClickEditBtn(items)}
                        type="primary"
                        size="small"
                      >
                        <Space>
                          <FontAwesomeIcon icon={faShareFromSquare} />
                        </Space>
                      </Button>
                    )}

                    <Link to={`/requestRep/${items.id}`}>
                      <Button type="primary" size="small">
                        <EyeOutlined />
                      </Button>
                    </Link>
                  </Space>
                );
              },
            },
          ]}
          dataSource={list.map((item) => ({
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
          title={"Forward Ticket"}
          onCancel={onCloseModalForm}
          ServiceDetail_list={ServiceDetail}
          autoFill={ServiceDetail1}
          onFinish={onFinish}
          department={department}
          onchangedepartment={onchangedepartment}
        />
      </PageContainer>
    </>
  );
};

export default DepartmentWorkTask;
