import React from 'react';
import { Avatar, DatePicker, Col, Form, Card, Row } from 'antd';
import { useNavigate } from "react-router-dom"
import { UserOutlined, PlayCircleOutlined, FieldTimeOutlined, CheckCircleOutlined  } from '@ant-design/icons';
import "./PageDashboardHead.css"
import { HeadChart } from '../../component/chart/Head/HeadChart';
import { HeadServicePieChart } from '../../component/chart/Head/HeadServicePieChart';
import { useEffect, useState } from "react";
import { request } from "../../config/api.config";
import dayjs from "dayjs";
let date = new dayjs()
let date2 = new Date();

const PageDashboardHead = () => {
  var currentMonth = dayjs(date2).format("M")
  var currentYear = dayjs(date2).format("YYYY")

  const [data, setdata] = useState([])
  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)
  useEffect(() => {
    getList()
  }, [])
  
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  let firstDay = new Date(currentYear, currentMonth - 1, 1);
  let lastDay = new Date(currentYear, currentMonth, 0);
  firstDay = dayjs(firstDay).format("MMM D")
  lastDay = dayjs(lastDay).format("MMM D")

  const getList = async () => {
    request("get", "report/getTotalStatusByDept?" + "year=" + currentYear + "&" + "month=" + currentMonth, {}).then(res => {
      if (res.status === 200) {
        var data = res.data
        setdata(data.data)
      }
    })
  }


  return (
    <div>
      <div className='txt-title'>Ticket Summary of {dayjs(date).format("MMMM")}</div>
      {/* <DatePicker onChange={onChange} picker="month" /> */}
      <Row gutter={30}>
        {data.map((item, index) =>
          <>
          <Col span={8}>

            <div className='card'>
              <div class="card-body">
                <Row>
                  <Col span={18}
                  >
                    <h6 class="m-b-25">Not Start</h6>
                    <h3 class="f-w-700 text-c-red">{item.not_Started}</h3>
                    <p class="m-b-0">{firstDay + ' - ' + lastDay + ' ' + `(${year})`}</p>
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
                        <p class="m-b-0">{firstDay + ' - ' + lastDay + ' ' + `(${year})`}</p>
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
                      <p class="m-b-0">{firstDay + ' - ' + lastDay + ' ' + `(${year})`}</p>
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
          <HeadChart />
        </Col>
        <Col span={12}>
          <HeadServicePieChart />
        </Col>
      </Row>

    </div>

  )

};

export default PageDashboardHead;