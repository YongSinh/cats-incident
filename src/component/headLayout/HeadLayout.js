import {
    useNavigate, Outlet
} from "react-router-dom"
import UserService from "../../UserService/UserService";
import {
    AreaChartOutlined,
    GroupOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    DiffOutlined,
    HomeOutlined,
    DownOutlined,
    FileDoneOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Dropdown } from 'antd';
import { useState } from 'react';
import "./styleLayout.css"
import { faBriefcase, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const logo = require('../../asset/image/logo.png'); // with require'


const HeadLayout = () => {

    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const profile = localStorage.getItem("profile");

    const navigate = useNavigate();
    const handleChangeMenu = (item) => {
        navigate(item.key)
    }


    const handleLogout = () => {
        window.location.href = 'https://www.cats.com.kh/apps/sso/logout';
        //UserService.doLogout({ redirectUri: 'https://www.cats.com.kh/apps/'});
        //UserService.doLogout({ redirectUri: 'https://www.cats.com.kh/apps/sso/logout'});
        localStorage.setItem("is_login", "0")
    }


    const handleProfile = () => {
        UserService.account()
    }


    const {
        token: { colorBgContainer },
    } = theme.useToken();


    let items;
    items = [
        {
            key: 'sub1',
            icon: <UserOutlined />,
            label: "Requester Menu",
           // type: 'group',
            children: [
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
            ],
        },
        {
            key: 'sub2',
            icon: <FontAwesomeIcon icon={faBriefcase} />,
            label: "Head Menu",
            //type: 'group',
            children: [
                {
                    key: '/dashboard',
                    icon: <AreaChartOutlined />,
                    label: 'Dashboard',

                },
                {
                    key: '/HeadDepartment',
                    icon: <GroupOutlined />,
                    label: 'All tickets',
                },
              
            ]
        }
    ]

    const menuUser = [

        {
            key: "1",
            label:'Profile',
            onClick: handleProfile
        },
        {
            key: "2",
            label: 'Logout',
            onClick: handleLogout

        }
    ]
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider style={{ backgroundColor: '#000c64', }} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>

                <div className="logo2">
                    <img src={logo} alt="Logo" />
                </div>
                    <Menu
                        theme="dark"
                        className="menu2"
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        defaultSelectedKeys={[location.pathname]}
                        defaultOpenKeys={['sub1', 'sub2']}
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
                    <div className="headerLayoutTwo">
                        <MenuUnfoldOutlined
                            style={{ fontSize: 26, paddingLeft: 20 }}
                            onClick={() => setCollapsed(!collapsed)} />
                        <div>
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
                        margin: '0 16px',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            padding: 24,
                            minHeight: '100%',
                            background: colorBgContainer,
                        }}
                    >
                        {/* {props.children} */}
                        <Outlet />
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                         padding: '13px 45px'
                    }}
                >
                    Cambodia Air Traffic Services CO. LTD ©2023 
                </Footer>
            </Layout>
        </Layout>

    );
};
export default HeadLayout;