import React from "react";
import UserService from "./UserService/UserService";
import Keycloak from 'keycloak-js';
import ClientHome from "./pages/clientHomePage/clientHome";
import { LoginOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import './login.css'
import {
    useNavigate, Outlet, Link
} from "react-router-dom"
const logo = require('../src/asset/image/incident.jpg');
const logo2 = require('../src/asset/image/incident-management-workflow-process-1636556.jpg');
const { Meta } = Card;
const Login = () => {
    const navigate = useNavigate();
    const handleLogin = () => {
        localStorage.setItem("is_login", "1"); // is_login = 1
        navigate('/home')
        window.location.href = '/apps/incident/home';
        UserService.doLogin()
    }

    const handleSetting = () => {
        UserService.account()
    }

    return (
        <>
            <div className="body">


                <div className="box">
                    <Card
                        className="card"
                        style={{
                            width: "100%",
                            maxWidth: 500,
                            textAlign: "center"
                        }}
                        cover={
                            <img
                                alt="example"
                                src={logo}
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={handleSetting} />,
                            <LoginOutlined key="login" onClick={handleLogin} />,
                        ]}
                    >
                        <Meta
                            style={{
                                textAlign: "center"
                            }}
                            //avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                            title="Incident Management System"
                            description="An incident management system is the effective and systematic use of all resources available to an organization in order to respond to an incident, mitigate its impact, and understand its cause in order to prevent recurrence. It's a combination of people's efforts in utilizing processes and tools to manage incidents."
                        />
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Login;
