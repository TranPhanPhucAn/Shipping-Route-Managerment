"use client";
import { useEffect, useState } from "react";
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
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    if (props.userProfile?.image_url) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: props.userProfile?.image_url,
        },
      ]);
    }
  }, [props?.userInfor?.image_url]);
  // if (props.userProfile?.image_url) {
  //   setFileList([
  // {
  //   uid: "-1",
  //   name: "image.png",
  //   status: "done",
  //   url: props.userProfile?.image_url,
  // },
  //   ]);
  // }

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    console.log("new list: ", newFileList[0]);
    setFileList(newFileList);
  };

  const handleUpdateAvatar = async () => {
    try {
      if (!fileList.length) {
        message.error("Please, select image you want to update");
      }
      const formData = new FormData();
      const file = fileList[0].originFileObj;
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
  const handleRemoveAvatar = async () => {
    try {
      const resFetch = await fetch(
        `http://localhost:5000/api/v1/auth-api/remove-image/${props.userProfile.id}`,
        {
          method: "DELETE",
        }
      );
      const res = await resFetch.json();
      if (res.message) {
        await update({
          user: { ...session?.user, avatar_url: "" },
        });
        setFileList([]);
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <ImgCrop rotationSlider>
            <Upload
              // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              // onPreview={onPreview}
              // showUploadList={{ showRemoveIcon: false }}
            >
              {fileList.length < 1 && "+ Upload"}
            </Upload>
          </ImgCrop>
        </div>
        <Button type="primary" loading={loading} onClick={handleUpdateAvatar}>
          Update
        </Button>
        <Button type="primary" loading={loading} onClick={handleRemoveAvatar}>
          Remove
        </Button>
      </Modal>
    </>
  );
};

export default UpdateAvatarModal;
