import React from "react";
import { Chart } from "react-google-charts";
import { useEffect, useMemo, useState } from "react";
import { request } from "../../../config/api.config";
import { ColorPicker, Row, Col, Space } from "antd";
import dayjs from "dayjs";

let date = new dayjs()

export const options = {
  title: "Monthly Incident Ticket of " + dayjs(date).format("MMMM"),
  curveType: "function",
  legend: { position: "bottom" },
};


export function SaleSummaryChart() {
  var month = dayjs(date).format("M")
  var year = dayjs(date).format("YYYY")
  const [data1, setdata] = useState([])
  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
        getList()
    }, 10000); //set your time here. repeat every 10 seconds
  
    return () => clearInterval(interval);
  }, []);


  const [colorHex, setColorHex] = useState('#3366cc');
  const hexString = useMemo(
    () => (typeof colorHex === 'string' ? colorHex : colorHex.toHexString()),
    [colorHex],
  );

  const [formatHex, setFormatHex] = useState('hex');

  const getList = async () => {
    request("get", "report/getReportChart?" + "year=" + year + "&" + "month=" + month, {}).then(res => {
      if (res.status == 200) {
        var data = res.data
        setdata(data.data)
      }
    })
  }

  let temp = [];
  temp.push(["Service", "Service Total", { role: "style" }]);
  data1.map(
    (item) => temp.push([item.name, item.total, hexString]));


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