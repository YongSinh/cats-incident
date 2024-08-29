import React, {  useState } from "react";
import "./layout.css";
import {
    useNavigate, Outlet
} from "react-router-dom"

import {
    FormOutlined,
    FileDoneOutlined,
    AppstoreOutlined,
    UserOutlined,
    PieChartOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
    DiffOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Dropdown, Divider } from 'antd';
import UserService from "../../UserService/UserService";
import { useLocation } from "react-router-dom";
const { Header, Sider, Content } = Layout;
const logo = require('../../asset/image/logoBlue.png'); // with require

const LayoutOne = () => {
    const profile = localStorage.getItem("profile");
    const navigate = useNavigate();
    const handleChangeMenu = (item) => {
        navigate(item.key)
    }
    const location = useLocation();
    const handleLogout = () => {
        window.location.href = 'https://www.cats.com.kh/apps/sso/logout';
        //UserService.doLogout({ redirectUri: 'https://www.cats.com.kh/apps/'});
        //UserService.doLogout({ redirectUri: 'https://www.cats.com.kh/apps/sso/logout'});
        localStorage.setItem("is_login", "0")

    }
    const handleBack = () => {
        navigate('/home')
    }

    const handleProfile = () => {
        UserService.account()
    }

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const role = localStorage.getItem("role")
    localStorage.setItem("role2", role)

    const items=[
        {
            key: '/admin',
            icon: <PieChartOutlined />,
            label: 'Dashboard',
        },
        {
            icon: <UserOutlined />,
            key: '/admin-isouser',
            label: 'Handler',
        },
        {
            key: '/admin-service',
            icon: <AppstoreOutlined />,
            label: 'Service',
        },
        {
            key: '/admin-categorization',
            icon: <FormOutlined />,
            label: 'Categorization',
        },

        {
            key: '/admin-priority',
            icon: <FormOutlined />,
            label: 'Priority',
        },
        {
            key: '/admin-report',
            icon: <DiffOutlined />,
            label: 'Report',
        },

        {
            key: '/admin-process',
            icon: <FileDoneOutlined />,
            label: 'Process',
        },
    ]
    const menuUser = [
        {
            key: "1",
            label: 'Profile',
            onClick: handleProfile
        },
        {
            key: "2",
            label: 'Back Normarl',
            onClick: handleBack

        },
        {
            key: "3",
            label:'Logout',
            onClick: handleLogout

        },
       
    ]



    return (


        <Layout style={{height:'100vh'}}>
            <Sider className="sider" style={{ background: colorBgContainer }} trigger={null} collapsible collapsed={collapsed}>

                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <Divider />
                <div className="demo-logo-vertical" />
          
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[location.pathname]}
                    selectedKeys={[location.pathname]}
                    items={items}
                    onClick={handleChangeMenu}
                    />

            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <div className="headerLayoutOne">
                        <MenuUnfoldOutlined
                            style={{ fontSize: 26, paddingLeft: 20 }}
                            onClick={() => setCollapsed(!collapsed)} />
                        <div className="headerLayoutOne">

                            <div> <h2>Incident Management System</h2></div>
                        </div>
                        <div>
                          
                            <Dropdown
                                style={{ width: 150 }}
                                menu={{
                                    items: menuUser,
                                }}
                                placement="bottomLeft"
                            >
                                <Button type="link" className={"iconProfile"}>
                                    <UserOutlined />
                                    {profile}
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                </Header>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: colorBgContainer,
                    }}
                    className="mainBody"
                >
                    {/* {props.children} */}
                        <Outlet />
                    
                </Content>


            </Layout>
        </Layout>
    );
};
export default LayoutOne;