"use client";
import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, message, Select, DatePicker } from "antd";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../graphql/mutations/Auth";
import styles from "../../styles/Auth.module.css";
import {
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { client } from "@/src/graphql/Provider";
import { QUERY_USER } from "@/src/graphql/queries/query";
import { useSession } from "next-auth/react";

const { Option } = Select;

const UpdateUserModal = (props: any) => {
  const { data: session, status, update } = useSession();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState(props);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState<any>(null);
  const [gender, setGender] = useState("");
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER, {
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    // console.log("alo: ", props);
    if (props.userProfile) {
      form.setFieldsValue({
        email: props.userProfile.email,
        username: props.userProfile.username,
        address: props.userProfile.address,
        phoneNumber: props.userProfile.phone_number,
        gender: props.userProfile.gender,
      });
      setEmail(props.userProfile.email);
      setUsername(props.userProfile.username);
      setPhoneNumber(props.userProfile.phone_number);
      setAddress(props.userProfile.address);
      setGender(props.userProfile.gender);
      if (props.userProfile.birthday) {
        form.setFieldsValue({ birthday: dayjs(props.userProfile.birthday) });
        setBirthday(dayjs(props.userProfile.birthday));
      }
    }
  }, [props.userProfile, form]);
  const handleUpdateUser = async () => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email) || !username || !address) {
      if (!re.test(email)) message.error("Email is not valid!");
      else {
        message.error("Username is required");
      }
      return;
    }
    try {
      const res = await updateUser({
        variables: {
          updateUserInput: {
            id: props.userProfile.id,
            email: email,
            username: username,
            address: address,
            birthday: birthday?.toISOString() || "",
            phone_number: phoneNumber || "",
            gender: gender || "",
          },
        },
        refetchQueries: [
          {
            query: QUERY_USER,
            variables: { id: props.userProfile.id },
          },
        ],
      });
      await update({
        user: { ...session?.user, username: res?.data.updateUser.username },
      });
      form.resetFields();
      setVisible(false);
      message.success("Update user successfully");
    } catch (err) {
      console.error("Error update user:", err);
      message.error("Failed to update user");
    }
  };
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Update Profile
      </Button>
      <Modal
        title="Update User Profile"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleUpdateUser}
          layout="vertical"
          className={styles.mainBox}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              // className={styles.input}
              placeholder="Username"
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input your phone!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              // className={styles.input}
              placeholder="Phone"
              value={phoneNumber}
              onChange={(e: any) => setPhoneNumber(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
              {
                type: "email",
                message: "Email is not a valid email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              // className={styles.input}
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="address"
            rules={[
              {
                required: true,
                message: "Please input your address!",
              },
            ]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder="Address"
              // className={styles.input}
              value={address}
              onChange={(e: any) => setAddress(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            // rules={[{ required: true, message: "Please select gender!" }]}
          >
            <Select
              value={gender}
              onChange={(value: string) => setGender(value)}
              placeholder="Select Gender"
            >
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
              <Option value="OTHER">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Birthday"
            name="birthday"
            // rules={[{ required: true, message: "Please select birthday!" }]}
          >
            <DatePicker
              // showTime
              value={birthday}
              onChange={(value: any) => setBirthday(value)}
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
          {error && <p style={{ color: "red" }}>{error.message}</p>}
        </Form>
      </Modal>
    </>
  );
};

export default UpdateUserModal;
