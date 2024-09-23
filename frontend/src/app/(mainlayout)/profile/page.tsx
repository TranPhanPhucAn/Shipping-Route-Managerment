"use client";
import React, { useEffect, useState } from "react";
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

const Profile = () => {
  const { data: session, status, update } = useSession();
  const id = session?.user?.id;
  const { loading, error, data } = useQuery(QUERY_USER, {
    variables: { id: id },
  });
  console.log("id: ", id);
  console.log("data: ", data);
  const userInfor = data?.user || {};
  // return <>{data ? data?.user?.username : ""}</>;
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
              {userInfor.phone}
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
              20/04/2015
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
              20/04/2003
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;
