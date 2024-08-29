import React from "react";
import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import { request } from "../../../config/api.config";
import UserService from "../../../UserService/UserService";
import { isEmptyOrNull } from "../../../config/service";
import dayjs from "dayjs";
let date = new dayjs()

export const options = {
  title: "Monthly Incident Ticket of "+ dayjs(date).format("MMMM"),
};

export function HdServicePieChart(

) {
  var month = dayjs(date).format("M")
  var year = dayjs(date).format("YYYY")
  const [data1, setdata] = useState([])
  const [Section, setSection] = useState('');
  const [loading, setLoading] = useState(false)
  const [Department, setDepartment] = useState('')
  

  useEffect(() => {
    getList()
    getEmInfor()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
        getList()
        getEmInfor()
    }, 10000); //set your time here. repeat every 10 seconds
  
    return () => clearInterval(interval);
  }, []);
  



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

  const getList = async () => {
    setLoading(true)
    var param = "month=" + month + "&" + "year=" + year 
    //console.log(param)
    request("get","report/getReportChartByDeptAndSec?"+ param, {})
    .then(res => {
      setLoading(false)
      if (res.status == 200) {
        var data = res.data
        setdata(data.data)
        // console.log(data)
      }
    })
  }

  let temp = [];
  temp.push(["Service", "Monthly", { role: "style" }]);
  data1.map(
    (item) => temp.push([item.name, item.total, ""]));

  return (
    <>
    <Chart
      chartType="PieChart"
      data={temp}
      options={options}
      width={"100%"}
      height={"400px"}
    />
    </>
  );
}
