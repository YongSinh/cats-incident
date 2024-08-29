import { FileSearchOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button, Alert, Drawer, Form, Input, Popconfirm, Row, Select, Space,
} from "antd"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { Config } from "../../../config/config";
const { TextArea } = Input;

const DrawerForm = ({
  open = false,
  title = null,
  footer = null,
  onClose,
  onOk,
  RepDetail
}) => {



  return (
    <Drawer title="Information" placement="right" onClose={onClose} open={open}>
      <Form
        layout="vertical"
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item label="Handler ID">
          <Input value={RepDetail.emId} prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item label="Handler Name">
          <Input value={RepDetail.username} prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item label="Message">
          <TextArea rows={4} value={RepDetail.responseDetail} />
        </Form.Item>
        <Form.Item
          labelCol={{ style: { width: 200 } }}
          label="View File"
        >
          {RepDetail.responseFiles != '' ?
            (RepDetail.responseFiles && RepDetail.responseFiles.map((item, index) => (
              <Popconfirm
                title="View the File"
                description="Do you want view this File?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => window.open(`${Config.imagePath}${item.repFileName}`, "_blank")}
              >
                <Button style={{ marginRight: 10, marginBottom: 10}}><FileSearchOutlined />view file({index + 1})</Button>
              </Popconfirm>
            ))
            )
            :
            (
              <Alert message="No files have been uploaded here!" type="warning" showIcon />
            )}
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default DrawerForm;
