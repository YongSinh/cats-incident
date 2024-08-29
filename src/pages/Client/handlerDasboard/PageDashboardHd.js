import React from 'react';
import { Avatar, Select, Col, Button, Space, Row, Spin, DatePicker, Popconfirm } from 'antd';
import { useNavigate } from "react-router-dom"
import { UserOutlined, PlayCircleOutlined, FieldTimeOutlined, CheckCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import "./PageDashboardHd.css"
import { HdChart } from '../../../component/chart/Handler/HdChart';
import { HdServicePieChart } from '../../../component/chart/Handler/HdServicePieChart';
import { useEffect, useState } from "react";
import { request } from "../../../config/api.config";
import { Config } from '../../../config/config';
import { isEmptyOrNull } from '../../../config/service';
import { ToastContainer, toast } from 'react-toastify';
import UserService from '../../../UserService/UserService';
import dayjs from "dayjs";
let date = new dayjs()
let date2 = new Date();
const HomeScreenHd = () => {

  let firstDay = new Date(date2.getFullYear(), date2.getMonth(), 1);
  let lastDay = new Date(date2.getFullYear(), date2.getMonth() + 1, 0);

  firstDay = dayjs(firstDay).format("MMM D")
  lastDay = dayjs(lastDay).format("MMM D")
  var month1 = dayjs(date).format("M")
  var year1 = dayjs(date).format("YYYY")
  const [data, setdata] = useState([])
  const [sec, setSection] = useState();
  const [monthyear, setmonthyear] = useState("");
  const [month, setmonth] = useState("");
  const [year, setyear] = useState("");
  const [Department, setDepartment] = useState()
  const [status, setstatus] = useState();
  useEffect(() => {
    getList()
    getEmInfor()
  }, [])
  const [loading, setLoading] = useState(false)
  const getList = async () => {
    setLoading(true)
    request("get", "report/getTotalStatusByDeptAndSec?" + "year=" + year1 + "&" + "month=" + month1, {}).then(res => {
      setLoading(false)
      if (res.status == 200) {
        var data = res.data
        setdata(data.data)
      }
    })
  }

  const getEmInfor = () => {
    setLoading(true)
    request("get", "Em/getEmById/" + UserService.getUsername(), {}).then(res => {
      setLoading(false)
      if (res.status == 200) {
        var data = res.data
        setDepartment(data.data.poDepartment)
        setSection(data.data.poSection)
      }
    })
  }


  const onChange = (date, dateString) => {
    // Parse the date string and create a date object.
    const parsedDate = dayjs(dateString);
    const month2 = parsedDate.format("M");
    const year = parsedDate.format("YYYY");
    setmonth(month2)
    setyear(year)
    setmonthyear(dateString)
  };

  const onchangeStatus = (value) => {
    setstatus(value)
  }


  const handleGetReport = () => {
    setLoading(true);
    var param = ""
    if (isEmptyOrNull(status)) {
      param = "report/getReportBySec?" + "month" + "=" + month + "&" + "year" + "=" + year + "&" + "sec" + "=" + sec + "&" + "Dept" + "=" + Department
    }
    else {
      param = "report/getReportByStatusTo?" + "month" + "=" + month + "&" + "year" + "=" + year + "&" + "sec" + "=" + sec + "&" + "Dept" + "=" + Department + "&" + "status=" + status
    }
   // console.log(param)
    request("get", param, {}).then(res => {
      if (res.status == 200) {
        setLoading(false)
        window.open(`${Config.baseUrl}${param}`, "_blank")
      }
      else if (!res.ok) {
        setLoading(false)
        if (isEmptyOrNull(monthyear)) {
          toast.warning("Please select the date before download!", {
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

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <ToastContainer />
      <Spin spinning={loading}>
        <div>
          <Row className='titlehd'>
            <Col span={12}><div className='txt-title1'>Ticket Summary of {dayjs(date).format("MMMM")}</div></Col>
            {/* <Col span={12}>
              <Space className='btn-Hd'>
                <DatePicker allowClear={true} onChange={onChange} picker="month" />
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
                  <Button type="primary" icon={<DownloadOutlined />}> Download</Button>

                </Popconfirm>

              </Space>
            </Col> */}
          </Row>
          <Row gutter={30}>
            {data.map((item, index) => <>
              <Col span={8}>

                <div className='card'>
                  <div class="card-body">
                    <Row>
                      <Col span={18}
                      >
                        <h6 class="m-b-25">Not Start</h6>
                        <h3 class="f-w-700 text-c-red">{item.not_Started}</h3>
                        <p class="m-b-0">{firstDay + ' - ' + lastDay + ' ' + `(${year1})`}</p>
                      </Col>
                      <Col
                        className='icon-align'
                        span={6}>

                        <Avatar
                          size={64}
                          style={{
                            backgroundColor: '#d10000',
                          }}
                          icon={<PlayCircleOutlined />} />

                      </Col>
                    </Row>
                  </div>
                </div>

              </Col>
              <Col span={8}>
                <Row>
                  <div className='card'>
                    <div class="card-body">
                      <Row>
                        <Col span={18}>
                          <h6 class="m-b-25">In Progress</h6>
                          <h3 class="f-w-700 text-c-green">{item.in_Progress}</h3>
                          <p class="m-b-0">{firstDay + ' - ' + lastDay + ' ' + `(${year1})`}</p>
                        </Col>
                        <Col span={6}
                          className='icon-align'
                        >
                          <Avatar
                            size={64}
                            style={{
                              backgroundColor: '#109618',
                            }}
                            icon={<FieldTimeOutlined />} />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Row>
              </Col>
              <Col span={8}>

                <div className='card'>
                  <div class="card-body">
                    <Row>
                      <Col span={18}>
                        <h6 class="m-b-25">Completed</h6>
                        <h3 class="f-w-700 text-c-blue">{item.completed}</h3>
                        <p class="m-b-0">{firstDay + ' - ' + lastDay + ' ' + `(${year1})`}</p>
                      </Col>
                      <Col
                        className='icon-align'
                        span={6}>

                        <Avatar
                          size={64}
                          style={{
                            backgroundColor: '#3366CC',
                          }}
                          icon={<CheckCircleOutlined />} />

                      </Col>
                    </Row>
                  </div>
                </div>

              </Col>
            </>
            )}

          </Row>
          <Row gutter={[10]}>
            <Col span={12}>
              <HdServicePieChart />
            </Col>
            <Col span={12}>
              <HdChart />
            </Col>
          </Row>

        </div>
      </Spin>
    </>
  )

};

export default HomeScreenHd;