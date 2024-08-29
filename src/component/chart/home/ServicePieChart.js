import React from "react";
import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import { request } from "../../../config/api.config";
import dayjs from "dayjs";
let date = new dayjs()

export const options = {
  title: "Monthly Incident Ticket of "+ dayjs(date).format("MMMM"),
};

export function ServicePieChart() {
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

  const getList = async () => {
    request("get", "report/getReportChart?" + "year=" + year + "&" + "month=" + month, {}).then(res => {
      if (res.status == 200) {
        var data = res.data
        setdata(data.data)
      }
    })
  }
  let temp = [];
  temp.push(["Service", "Monthly", { role: "style" }]);
  data1.map(
    (item) => temp.push([item.name, item.total, ""]));

  return (
    <Chart
      chartType="PieChart"
      data={temp}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  );
}
