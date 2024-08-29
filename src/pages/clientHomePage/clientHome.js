import React from "react";
import {
    useNavigate,
    Link
} from "react-router-dom"
import {
    PieChartOutlined,
    FileProtectOutlined,
    FileDoneOutlined,
    FieldTimeOutlined,
} from '@ant-design/icons';
import { faClipboardCheck, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Col, Row, FloatButton } from 'antd';
import UserService from "../../UserService/UserService";
//import css or less
import 'antd-button-color/dist/css/style.css'; // or 'antd-button-color/dist/css/style.less'
import "./ClientHome.css"
import { useEffect, useState } from 'react';
const { Meta } = Card;

const problemsolving = require('../../asset/image/problem-solving.png'); // with require
const ClientHome = () => {
    const navigate = useNavigate();


    const onClick = (item) => {
        UserService.doLogin()
    }
    const gridStyle = {
        width: '25%',
        textAlign: 'center',
    };

    return (
        <>
            <div style={{ padding: 20 }}>
                <Row gutter={50} style={{ marginBottom: 30 }}>
                    <Col span={12}>
                        <Card
                            hoverable
                            style={{
                                width: '100%',
                                padding: 20,
                            }}
                            cover={<FileDoneOutlined className="icon" />}
                        >

                            <span className="process" style={{ backgroundColor: "#1890ff" }}>1</span>
                            <Meta className="meta" title="Preparation" description="
                                 This step involves outlining everyone’s responsibility, hardware, tools, documentation, etc. and taking steps to reduce the possibility of an incident happening.
                                " />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            hoverable
                            style={{
                                width: '100%',
                                padding: 20,
                            }}
                            cover={<PieChartOutlined className="icon" />}
                        >

                            <span className="process" style={{ backgroundColor: "#FD8D14" }}>2</span>
                            <Meta className="meta" title="Detection & Analysis" description="In this phase, the team analyzes all the symptoms reported and confirms whether or not the situation would be classified as an incident." />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={50}>
                    <Col span={12}>
                        <Card
                            hoverable
                            style={{
                                width: '100%',
                                padding: 20,
                            }}
                            cover={<FieldTimeOutlined className="icon" />}
                        >
                            <span className="process" style={{ backgroundColor: "#17a2b8" }}>3</span>
                            <Meta className="meta" title="Containment, Eradication, and Recovery" description="
                            In this phase, The team now gathers intel and create signatures that will help them identify each compromised system. With this information, the organization can mitigate the impact of incidents by containing them and countermeasures can be put in place to neutralize the attacker and restore systems/data back to normal.
                            " />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            hoverable
                            style={{
                                width: '100%',
                                padding: 20,

                            }}
                            cover={<FileProtectOutlined className="icon" />}
                        >
                            <span className="process" style={{ backgroundColor: "#28a745" }}>4</span>
                            <Meta className="meta" title="Post-incident Activities" description="
                            This is more of a ‘lesson learned’ phase. Its goal is to improve the overall security posture of the organization and to ensure that similar incidents won’t happen in the future.
                            " />
                        </Card>
                    </Col>
                </Row>
            </div></>
    )
};

export default ClientHome;