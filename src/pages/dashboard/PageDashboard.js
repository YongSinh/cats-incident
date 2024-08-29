import React from 'react';
import { Avatar, Checkbox, Col, Form, Card, Row } from 'antd';
import { useNavigate } from "react-router-dom"
import { UserOutlined, PlayCircleOutlined, FieldTimeOutlined, CheckCircleOutlined  } from '@ant-design/icons';
import "./PageDashboard.css"
import { SaleSummaryChart } from '../../component/chart/home/SaleSummaryChart';
import { ServicePieChart } from '../../component/chart/home/ServicePieChart';
import { useEffect, useState } from "react";
import { request } from "../../config/api.config";
import UserService from '../../UserService/UserService';
import dayjs from "dayjs";
let date = new dayjs()
let date2 = new Date();

const HomeScreen = () => {

  let firstDay = new Date(date2.getFullYear(), date2.getMonth(), 1);
  let lastDay = new Date(date2.getFullYear(), date2.getMonth() + 1, 0);

  firstDay = dayjs(firstDay).format("MMM D")
  lastDay = dayjs(lastDay).format("MMM D")
  var month = dayjs(date).format("M")
  var year = dayjs(date).format("YYYY")
  const [data, setdata] = useState([])
  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    request("get", "report/getTotalStatus?" + "year=" + year + "&" + "month=" + month, {}).then(res => {
      if (res.status == 200) {
        var data = res.data
        setdata(data.data)
        // console.log(data)
      }
    })
  }


  return (
    <div>
      <div className='txt-title'>Ticket Summary of {dayjs(date).format("MMMM")}</div>

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
          <ServicePieChart />
        </Col>
        <Col span={12}>
          <SaleSummaryChart />
        </Col>
      </Row>

    </div>

  )

};

export default HomeScreen;