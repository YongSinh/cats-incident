import React from 'react';
import {
    UserOutlined,
    DiffOutlined,
    HomeOutlined,
    DownOutlined,
    FileDoneOutlined
} from '@ant-design/icons';
import { ConfigProvider, Layout, Menu, theme, Button, Dropdown } from 'antd';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from "react-router-dom";
import UserService from '../../UserService/UserService';
import "./styleLayout.css"
const { Header, Content, Sider } = Layout;
const logo = require('../../asset/image/logo.png'); // with require'
const UserLayout = (props) => {
    const {
        token: {
            colorBgContainer,
        },
    } = theme.useToken();
    const location = useLocation();
    const navigate = useNavigate();
    const handleChangeMenu = (item) => {
        navigate(item.key)
    }

    const handleProfile = () => {
        UserService.account()
    }
    const handleLogout = () => {
        window.location.href = 'https://www.cats.com.kh/apps/sso/logout';
        //UserService.doLogout({ redirectUri: 'https://www.cats.com.kh/apps/'});
        //UserService.doLogout({ redirectUri: 'https://www.cats.com.kh/apps/sso/logout'});
        localStorage.setItem("is_login", "0")
    }
    const profile = localStorage.getItem("profile");
    const items = [
        {
            key: '/home',
            icon: <HomeOutlined />,
            label: 'Home',
        },
        {
            key: '/request',
            icon: <DiffOutlined />,
            label: 'New Ticket',
        },
        {
            key: '/report',
            icon: <FileDoneOutlined />,
            label: 'Report',
        },
        {
            key: '/pending',
            icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
            label: 'Pending',
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
            label: 'Logout',
            onClick: handleLogout

        },
    ]


    // useEffect(() => {
    //     if (!items.find((item) => item.key === location.pathname)) {
    //         const currentSubItem = items.find((item) => item.children?.find((item) => item.key === location.pathname));
    //         if (currentSubItem) setOpenKeys([currentSubItem.key]);
    //         return;
    //     }
    //     setOpenKeys([]);
    // }, [items, location.pathname]);


    return (
        <ConfigProvider
            theme={{
                token: {
                    // Seed Token

                },
            }}
        >
            <Layout
                style={{
                    minHeight: '100vh',
                }}
            >
              
                <Header className='header'>
                    <div className='LayOutUser'>
                        <img src={logo} alt="Logo" />

                        <div>
                            <h2>Incident Management System</h2>
                        </div>

                        <div className='profile'>
                            <Dropdown
                                style={{
                                    width: 100,
                                    color: '#ffff'
                                }}
                                menu={{
                                    items: menuUser,
                                }}
                                placement="bottomLeft"
                            >
                                <Button
                                    style={{
                                        color: '#ffff'
                                    }}
                                    type="link"
                                   
                                    >
                                    <UserOutlined />
                                    {profile}
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                </Header>

                <Layout
                 >
                    <Sider
                        width={180}
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={[location.pathname]}
                        items={items}
                        onClick={handleChangeMenu}
                        selectedKeys={[location.pathname]}
                    />
                    </Sider>
                    <Layout
                        style={{
                            padding: '0 24px 24px',
                        }}
                    >
                        <Content
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                                background: colorBgContainer,
                            }}
                        >
                            {props.children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};
export default UserLayout;