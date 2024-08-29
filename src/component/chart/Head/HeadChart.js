import React from "react";
import { Chart } from "react-google-charts";
import { useEffect, useMemo, useState } from "react";
import { request } from "../../../config/api.config";
import { ColorPicker, Row, Col, Space } from "antd";
import UserService from "../../../UserService/UserService";
import dayjs from "dayjs";

let date = new dayjs()

export const options = {
  title: "Monthly Incident Ticket of " + dayjs(date).format("MMMM"),
  curveType: "function",
  legend: { position: "bottom" },
};


export function HeadChart() {
  var month = dayjs(date).format("M")
  var year = dayjs(date).format("YYYY")
  const [data1, setdata] = useState([])
  useEffect(() => {
    getList()
    getEmInfor()
  }, [])


  const [colorHex, setColorHex] = useState('#3366cc');
  const hexString = useMemo(
    () => (typeof colorHex === 'string' ? colorHex : colorHex.toHexString()),
    [colorHex],
  );

  const [formatHex, setFormatHex] = useState('hex');
  const [sec, setSec] = useState();
  const [Department, setDepartment] = useState()
  const [list, setList] = useState([])
  const getList = async () => {
    var param = "report/getReportChartByDept?" + "month=" + month + "&" + "year=" + year 
    request("get", param, {})
    .then(res => {
      if (res.status == 200) {
        var data = res.data
        setdata(data.data)
      }
    })
  }

  const getEmInfor = () => {
    request("get", "Em/getEmById/" + UserService.getUsername(), {}).then(res => {
        if (res.status == 200) {
            var data = res.data  
            setDepartment(data.data.poDepartment)
            setSec(data.data.poSection)
        }
    })
}
  let temp = [];
  temp.push(["Service", "Service Total",   { role: "style" }]);
  data1.map(
    (item) => temp.push([item.name, item.total, hexString]));
    // data1.map((key, index) => 
    // Object.values(key)
    return (
      <>
        <Row align="middle">
          <Space
            style={
              {
                margin: "auto"
              }
            }
          >
            <Col>
              <ColorPicker
                format={formatHex}
                value={colorHex}
                onChange={setColorHex}
                onFormatChange={setFormatHex}
              />
            </Col>
            <Col>
              Change Color
            </Col>
            </Space>
        </Row>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={temp}
          options={options} />
  
      </>
  
    );
  }