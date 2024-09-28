"use client";
import { useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { useMutation } from "@apollo/client";
import { UPDATE_AVATAR } from "../../graphql/mutations/Auth";
import { QUERY_USER } from "@/src/graphql/queries/query";
import { Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useSession } from "next-auth/react";

const UpdateAvatarModal = (props: any) => {
  const [visible, setVisible] = useState(false);
  const { data: session, status, update } = useSession();

  const [uploadImage, { loading, error }] = useMutation(UPDATE_AVATAR, {
    fetchPolicy: "no-cache",
  });
  //   useEffect(() => {
  //     // console.log("alo: ", props);
  //     console.log(new Date(props.userProfile.birthday));
  //     if (props.userProfile) {
  //       form.setFieldsValue({
  //         email: props.userProfile.email,
  //       });
  //       setEmail(props.userProfile.email);
  //     }
  //   }, [props.userProfile, form]);
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: props.userProfile?.image_url,
    },
  ]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    console.log("new list: ", newFileList[0]);
    setFileList(newFileList);
  };

  // const onPreview = async (file: UploadFile) => {
  //   let src = file.url as string;
  //   if (!src) {
  //     src = await new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj as FileType);
  //       reader.onload = () => resolve(reader.result as string);
  //     });
  //   }
  //   const image = new Image();
  //   image.src = src;
  //   const imgWindow = window.open(src);
  //   imgWindow?.document.write(image.outerHTML);
  // };
  const handleUpdateAvatar = async () => {
    try {
      // const res = await uploadImage({
      //   variables: {
      //     file: fileList[0].originFileObj,
      //     id: props.userProfile.id,
      //   },

      //   refetchQueries: [
      //     {
      //       query: QUERY_USER,
      //       variables: { id: props.userProfile.id },
      //     },
      //   ],
      // });
      // console.log("res: ", res);
      // console.log("antd: ", fileList[0].originFileObj);
      // const res = await client2.mutate({
      //   mutation: UPDATE_AVATAR,
      //   variables: {
      //     file: fileList[0].originFileObj,
      //     id: props.userProfile.id,
      //   },
      // });
      // console.log("res: ", res);
      if (!fileList.length) {
        message.error("Please, select file you want to upload");
      }
      const formData = new FormData();
      const file = fileList[0].originFileObj;
      console.log("id: ", props.userProfile.id);
      formData.append("file", file as Blob);
      formData.append("id", props.userProfile.id);
      const resFetch = await fetch(
        `http://localhost:5000/api/v1/auth-api/upload-image`,
        {
          body: formData,
          method: "POST",
        }
      );
      const res = await resFetch.json();
      if (res.upload) {
        await update({
          user: { ...session?.user, avatar_url: res.upload },
        });
        props.refetchUser();
      }

      setVisible(false);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Update Avatar
      </Button>
      <Modal
        title="Update User Avatar"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        {/* <Form
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

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
          {error && <p style={{ color: "red" }}>{error.message}</p>}
        </Form> */}
        <ImgCrop rotationSlider>
          <Upload
            // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            // onPreview={onPreview}
          >
            {fileList.length < 1 && "+ Upload"}
          </Upload>
        </ImgCrop>
        <Button type="primary" loading={loading} onClick={handleUpdateAvatar}>
          Update
        </Button>
        <Button type="primary" loading={loading}>
          Remove
        </Button>
      </Modal>
    </>
  );
};

export default UpdateAvatarModal;
