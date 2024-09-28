"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

// import { getServerSession } from "next-auth/next";
// import { getServerSessionFromApp } from "@/src/lib/customGetSession";
// import { client } from "@/src/graphql/Provider";
import { QUERY_USER } from "@/src/graphql/queries/query";
import { useQuery } from "@apollo/client";
import "./profile.scss";
import Image from "next/image";
import imageDefalt from "../../../../public/profiledefault.jpg";
import {
  CalendarFilled,
  HomeFilled,
  MailFilled,
  PhoneFilled,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FaBirthdayCake, FaTransgender } from "react-icons/fa";
import UpdateUserModal from "@/src/components/UserProfile/UpdateUserModal";
import UpdateAvatarModal from "@/src/components/UserProfile/UpdateAvatarModal";

const Profile = () => {
  const { data: session, status, update } = useSession();
  const id = session?.user?.id;
  const { loading, error, data, refetch } = useQuery(QUERY_USER, {
    variables: { id: id },
  });
  // console.log("data: ", data);
  const userInfor = data?.user || {};
  const joiningDate = new Date(userInfor.createdAt).toLocaleDateString("en-GB");
  const birthDate = userInfor.birthday
    ? new Date(userInfor.birthday).toLocaleDateString("en-GB")
    : "";
  // return <>{data ? data?.user?.username : ""}</>;
  if (loading) return <p>Loading...</p>;
  // const fileInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="container-profile">
        <div className="header-profile">Personal Information</div>
        <div className="content-infor">
          <div className="avatar">
            <Image
              alt="profile default"
              src={userInfor.image_url ?? imageDefalt}
              width={320}
              height={270}
              style={{
                maxWidth: "100%",
                height: "auto",
                // objectFit: "cover",ppppp
                // borderRadius: "50%",
              }}
            />
            <UpdateAvatarModal userProfile={userInfor} refetchUser={refetch} />
            {/* <input
              type="file"
              ref={fileInput}
              onChange={() => {
                console.log("file: ", fileInput?.current?.files?.[0]);
              }}
            /> */}
          </div>
          <div className="user-information-left">
            <div className="detail">
              <UserOutlined
                style={{
                  color: "#334155",
                  fontSize: "27px",
                  marginRight: "12px",
                }}
              />
              <span style={{ fontWeight: 600 }}>Full Name: </span>
              {userInfor.username}
            </div>
            <div className="detail">
              <PhoneFilled
                style={{
                  color: "#334155",
                  fontSize: "27px",
                  marginRight: "12px",
                }}
              />
              <span style={{ fontWeight: 600 }}>Phone: </span>
              {userInfor.phone_number}
            </div>
            <div className="detail">
              <MailFilled
                style={{
                  color: "#334155",
                  fontSize: "27px",
                  marginRight: "12px",
                }}
              />
              <span style={{ fontWeight: 600 }}>Email: </span>
              {userInfor.email}
            </div>
            <div className="detail">
              <FaTransgender
                style={{
                  color: "#334155",
                  fontSize: "27px",
                  marginRight: "12px",
                }}
              />
              <span style={{ fontWeight: 600 }}>Gender: </span>
              {userInfor.gender}
            </div>
            <div className="detail">
              <HomeFilled
                style={{
                  color: "#334155",
                  fontSize: "27px",
                  marginRight: "12px",
                }}
              />
              <span style={{ fontWeight: 600 }}>Address: </span>
              {userInfor.address}
            </div>
          </div>
          <div className="user-information-right">
            <div className="detail">
              <TeamOutlined
                style={{
                  color: "#334155",
                  fontSize: "27px",
                  marginRight: "12px",
                }}
              />
              <span style={{ fontWeight: 600 }}>Role: </span>
              {userInfor.role?.name}
            </div>
            <div className="detail">
              <CalendarFilled
                style={{
                  color: "#334155",
                  fontSize: "27px",
                  marginRight: "12px",
                }}
              />
              <span style={{ fontWeight: 600 }}>Joining Date: </span>
              {joiningDate}
            </div>
            <div className="detail">
              <FaBirthdayCake
                style={{
                  color: "#334155",
                  fontSize: "27px",
                  marginRight: "12px",
                }}
              />
              <span style={{ fontWeight: 600 }}>Birth Date: </span>
              {birthDate}
            </div>
            {userInfor && <UpdateUserModal userProfile={userInfor} />}
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;
