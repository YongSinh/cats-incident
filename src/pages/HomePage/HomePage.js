import React from "react";
import PageContainer from "../container/PageContainer";
import { Button, Col, Divider, Form, Image, Input, InputNumber, Modal, Radio, Row, Select, Space } from "antd"
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Homepage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const navigate = useNavigate()
    const handleChangeMenu = () => {
        navigate('/admin-service')
    }

    return (
        <>
            <Button type="primary" onClick={handleChangeMenu}>
                Forward Ticket
            </Button>
    
        </>
    )
};

export default Homepage;