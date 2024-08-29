import { useEffect, useState } from "react";
import { request } from "../../config/api.config";
import {
  Button,
  Tag,
  Space,
  Table,
  Input,
  DatePicker,
  message,
  Popconfirm,
} from "antd";
import {
  DeleteFilled,
  EditFilled,
  SaveFilled,
  FilterOutlined,
} from "@ant-design/icons";
import { formatDateForClient } from "../../config/service";
import PageContainer from "../container/PageContainer";
import ModalForm from "./ModalForm";
import dayjs from "dayjs";
import { isEmptyOrNull } from "../../config/service";
import "./PageService.css";
const PageService = () => {
  const [items, setItems] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isouser, setIsouser] = useState([]);

  const onClickBtnRight = () => {
    setVisibleModal(true);
  };
  const handleOpenModal = () => {
    setVisibleModal(true);
  };
  const onCloseModalForm = () => {
    setVisibleModal(false);
    setItems(null);
  };
  useEffect(() => {
    getList();
  }, []);

  const onClickEditBtn = (param) => {
    setItems(param);
    setVisibleModal(true);
  };

  //em_hanler
  const onSearch = (text) => {
    setLoading(true);
    var param = "admin/service";
    if (!isEmptyOrNull(text)) {
      request("get", param, {}).then((res) => {
        setLoading(false);
        if (res.status == 200) {
          setLoading(false);
          var data = res.data;
          const filtered = data.data.ServiceDetail.filter((item) => {
            return item.em_hanler == text;
          });
          setdata(filtered);
        }
      });
    } else {
      request("get", "admin/service", {}).then((res) => {
        setLoading(false);
        if (res.status == 200) {
          var data = res.data;
          setdata(data.data.ServiceDetail);
          // console.log(data.data.length)
          //console.log(data)

          var arrTmp = [];
          data.data.ISOUser.map((item) => {
            arrTmp.push({
              label: item.username,
              value: item.em_ID,
            });
          });
          setIsouser(arrTmp);
          //console.log(arrTmp)
        }
      });
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "service_id",
      key: "No",
    },

    {
      title: "Handler Name",
      dataIndex: "em_hanler",
      key: "em_hanler",
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      key: "dept",
      title: "Dapartment",
      dataIndex: "dept",
    },
    {
      title: "Section",
      dataIndex: "sec",
      key: "sec",
    },
    {
      title: "Problem",
      dataIndex: "problem",
      key: "problem",
      render: (item, items, index) => {
        let color = "geekblue";
        return (
          <Tag color={color} key={item}>
            {item.join(", ")}
          </Tag>
        );
      },
    },
    {
      title: "Effective Date",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      render: (item) => formatDateForClient(item),
    },
    {
      title: "Exprie Date",
      dataIndex: "expDate",
      key: "expDate",
      render: (item) => formatDateForClient(item),
    },
    {
      title: "Action",
      key: "Action",
      render: (item, items, index) => {
        return (
          <Space>
            <Popconfirm
              placement="topRight"
              title={"Delete"}
              description={"Are sure to remove this customer"}
              onConfirm={() => onClickDeleteBtn(items.service_id)}
              okText="Delete"
              cancelText="No"
            >
              <Button danger={true} size="small">
                <DeleteFilled />
              </Button>
            </Popconfirm>
            <Button
              onClick={() => onClickEditBtn(items)}
              size="small"
              type="primary"
            >
              <EditFilled />
            </Button>
          </Space>
        );
      },
    },
  ];

  const getList = () => {
    setLoading(true);
    request("get", "admin/service", {}).then((res) => {
      setLoading(false);
      if (res.status == 200) {
        var data = res.data;
        setdata(data.data.ServiceDetail);
        // console.log(data.data.length)
        //console.log(data)

        var arrTmp = [];
        data.data.ISOUser.map((item) => {
          arrTmp.push({
            label: item.username,
            value: item.em_ID,
          });
        });
        setIsouser(arrTmp);
      }
    });
  };

  const onClickDeleteBtn = (id) => {
    setLoading(true);
    request("delete", "admin/service/delete/" + id, {}).then((res) => {
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
    let sec = item.section;
    var body = {
      service_id: item.service_id,
      serviceName: item.serviceName,
      em_handler: item.em_handler,
      effectiveDate: dayjs(item.effectiveDate).format("YYYY-MM-DD"),
      expDate: dayjs(item.expDate).format("YYYY-MM-DD"),
      dept: item.department.toUpperCase(),
      sec: sec.toUpperCase(),
      problem: item.problem,
    };
    console.log(body);
    var method = "post";
    var url = "admin/service/add";
    if (items != null) {
      method = "put";
      url = "admin/service/update/" + body.service_id;
      body.service_id = body.service_id;
      // form.append("service_id",items.service_id)
    }

    request(method, url, body).then((res) => {
      if (res.status == 200) {
        message.success(res.data.message);
        setItems(null);
        getList();
      }
    });
  };

  return (
    <>
      <PageContainer
        pageTitle="Service"
        btnRight="New Service"
        loading={loading}
        onClickBtnRight={onClickBtnRight}
        onSearch={onSearch}
        search={{
          title: "Handler Name",
          allowClear: true,
        }}
      >
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: "max-content" }}
        />
        <ModalForm
          items={items}
          list_isouser={isouser}
          open={visibleModal}
          title={items != null ? "Update Service" : "New Service"}
          onCancel={onCloseModalForm}
          onFinish={onFinish}
        />
      </PageContainer>
    </>
  );
};

export default PageService;
