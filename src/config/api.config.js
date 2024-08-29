import axios from "axios";
import { message } from "antd";
import { Config } from "./config";
import UserService from "../UserService/UserService";
// const baseUrl = "http://localhost:8080/api/cats/"

export const request = async (method = "", url = "", data = {}) => {
  var access_token = localStorage.getItem("access_token");

  var header = { 'Content-Type': 'application/json', "accept": "*/*" }
  if (data instanceof FormData) {
    header = {
      "Content-Type": "multipart/form-data",
      accept: "application/json",
    };
  }

  if (access_token !== null && access_token !== "") {
    header = {
      ...header,
      Authorization: `Bearer ${access_token}`,
    };
  }

  return axios({
    url: Config.baseUrl + url,
    method: method,
    data: data,
    headers: header,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      var status = err.response?.status;
      if (err.code == "ERR_NETWORK") {
        message.error(
          "Can not connect to server. Plase contact administration!"
        );
      } else if (status === 500) {
        message.error(err.message);
      } else if (status === 401) {
        message.warning("401 Unauthorized!");
        UserService.doLogin();
      } else if (status === 403) {
        message.warning("You don't have permission to access this resource!");
      } else {
        // UserServicere.doLogin()
        message.error(err.message);
      }
      return false;
    });
};
