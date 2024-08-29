import { SaveFilled, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  theme,
  Input,
  Modal,
  Tooltip,
  Select,
  Space,
  Tag,
} from "antd";

import React from "react";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const tagInputStyle = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: "top",
};
const ModalForm = ({
  open = false,
  title = null,
  footer = null,
  onCancel,
  onOk,
  onFinish,
  items,
  list_isouser,
}) => {
  const [form] = Form.useForm(); //
  const today = new Date();

  const [date1, setdate1] = useState(today); // return current date
  const [date2, setdate2] = useState(today); // return current date
  const [emId, setemId] = useState("");
  const { token } = theme.useToken();
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    //console.log(newTags);
    setTags(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };
  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };
  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };
  const tagPlusStyle = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: "dashed",
    marginTop: 10,
  };

  React.useEffect(() => {
    if (items != null) {
      const str = items.problem;
      setemId(items.em_hanler);
      setTags(str);
      form.setFieldsValue({
        service_id: items.service_id,
        serviceName: items.serviceName,
        effectiveDate: dayjs(items.effectiveDate).format("YYYY-MM-DD"),
        expDate: dayjs(items.expDate).format("YYYY-MM-DD"),
        // problem: str,
        department: items.dept,
        section: items.sec,
        em_handler: items.em_hanler,
      });
    }
  }, [items]);

  const handleCancel = () => {
    form.resetFields(); // clear data in form
    onCancel();
    setTags([]);
  };

  const onFinish2 = (items) => {
    form.resetFields();
    let value = {
      service_id: items.service_id,
      serviceName: items.serviceName,
      effectiveDate: items.effectiveDate,
      expDate: items.expDate,
      problem: tags.join(", "),
      department: items.department,
      section: items.section,
      em_handler: items.em_handler,
    };
    //console.log(value)
    onFinish(value);
    setTags([]);
  };

  return (
    <Modal
      open={open}
      title={title}
      onCancel={handleCancel}
      onOk={onOk}
      footer={footer}
      maskClosable={false}
      //width={"50%"}
    >
      <Form
        form={form}
        name="form_category"
        layout="vertical"
        onFinish={onFinish2}
        initialValues={{
          status: 1,
        }}
      >
        <Divider />
        <Form.Item
          label={"Service ID"}
          name={"service_id"}
          rules={[
            {
              required: true,
              message: "Please input Service ID!",
            },
          ]}
        >
          <Input placeholder="Service ID" />
        </Form.Item>

        <Form.Item
          label={"Service Name"}
          name={"serviceName"}
          rules={[
            {
              required: true,
              message: "Please input Service Name!",
            },
          ]}
        >
          <Input placeholder="Service Name" />
        </Form.Item>

        <Form.Item
          label={"handler"}
          name={"em_handler"}
          rules={[
            {
              required: true,
              message: "Please input handler Id!",
            },
          ]}
        >
          <Select
            placeholder="Please select a category"
            options={list_isouser}
          />
        </Form.Item>

        <Form.Item
          label={"Department"}
          name={"department"}
          rules={[
            {
              required: true,
              message: "Please input department!",
            },
          ]}
        >
          <Input placeholder="department" />
        </Form.Item>

        <Form.Item
          label={"Section"}
          name={"section"}
          rules={[
            {
              required: true,
              message: "Please input Section !",
            },
          ]}
        >
          <Input placeholder="Section" />
        </Form.Item>

        <Form.Item label={"Problem"} name={"problem"}>
          {/* <Input placeholder="Problem title" /> */}
          {tags.map((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={editInputRef}
                  key={tag}
                  size="small"
                  style={tagInputStyle}
                  value={editInputValue}
                  onChange={handleEditInputChange}
                  onBlur={handleEditInputConfirm}
                  onPressEnter={handleEditInputConfirm}
                />
              );
            }
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable
                style={{
                  userSelect: "none",
                }}
                onClose={() => handleClose(tag)}
              >
                <span
                  onDoubleClick={(e) => {
                    if (index !== 0) {
                      setEditInputIndex(index);
                      setEditInputValue(tag);
                      e.preventDefault();
                    }
                  }}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </span>
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
          {inputVisible ? (
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={tagInputStyle}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          ) : (
            <Tag
              style={tagPlusStyle}
              icon={<PlusOutlined />}
              onClick={showInput}
            >
              New Tag
            </Tag>
          )}
        </Form.Item>

        <Form.Item label={"effectiveDate"} name={"effectiveDate"}>
          <DatePicker
            className="datepicker"
            selected={date1}
            selectsStart
            startDate={date1}
            endDate={date1} // add the endDate to your startDate DatePicker now that it is defined
            onChange={(date1) => setdate1(date1)}
          />
        </Form.Item>

        <Form.Item label={"expDate"} name={"expDate"}>
          <DatePicker
            className="datepicker"
            selected={date2}
            selectsStart
            startDate={date2}
            endDate={date2} // add the endDate to your startDate DatePicker now that it is defined
            onChange={(date2) => setdate2(date2)}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              <SaveFilled />
              {items != null ? "Update" : "Save"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
