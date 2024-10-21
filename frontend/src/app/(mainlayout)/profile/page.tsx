"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// import { getServerSession } from "next-auth/next";
// import { getServerSessionFromApp } from "@/src/lib/customGetSession";
// import { client } from "@/src/graphql/Provider";
import {
  QUERY_INFOR_BY_OWNER,
  QUERY_INFOR_VESSEL_TOTAL,
  QUERY_USER,
} from "@/src/graphql/queries/query";
import { useQuery } from "@apollo/client";
import "./profile.scss";
import Image from "next/image";
import imageDefault from "../../../../public/profiledefault.jpg";
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
import UpdatePasswordModal from "@/src/components/UserProfile/UpdatePasswordModal";
import { Card } from "antd";
import ListCardVessel from "@/src/components/UserProfile/ListCardVessel";
import styles from "@/src/styles/Listpage.module.css";
import { Divider } from "antd";

const Profile = () => {
  const { data: session, status, update } = useSession();
  const permissionUser = session?.user?.permissionNames;
  const id = session?.user?.id;
  const { loading, error, data, refetch } = useQuery(QUERY_USER, {
    variables: { id: id },
  });

  const userInfor = data?.user || {};
  const joiningDate = new Date(userInfor.createdAt).toLocaleDateString("en-GB");
  const birthDate = userInfor.birthday
    ? new Date(userInfor.birthday).toLocaleDateString("en-GB")
    : "";

  const {
    loading: loadingInforVessel,
    error: errorInforVessel,
    data: dataInforVessel,
  } = useQuery(QUERY_INFOR_BY_OWNER, {
    variables: { id },
    skip:
      !permissionUser?.includes("get:inforByOwner") ||
      permissionUser?.includes("get:inforVesselTotal") ||
      !id, // Skip query if permission or id is not present
  });
  let vesselTotal, available, inTransits, underMaintance;
  const {
    loading: loadingInforVesselTotal,
    error: errorInforVesselTotal,
    data: dataInforVesselTotal,
  } = useQuery(QUERY_INFOR_VESSEL_TOTAL, {
    skip: !permissionUser?.includes("get:inforVesselTotal") || !id, // Skip query if permission or id is not present
  });

  if (permissionUser?.includes("get:inforVesselTotal")) {
    vesselTotal = dataInforVesselTotal?.getInforVesselTotal.vesselTotal;
    available = dataInforVesselTotal?.getInforVesselTotal.available;
    inTransits = dataInforVesselTotal?.getInforVesselTotal.inTransits;
    underMaintance = dataInforVesselTotal?.getInforVesselTotal.underMaintance;
  } else {
    if (permissionUser?.includes("get:inforByOwner")) {
      vesselTotal = dataInforVessel?.getInforByOwner.vesselTotal;
      available = dataInforVessel?.getInforByOwner.available;
      inTransits = dataInforVessel?.getInforByOwner.inTransits;
      underMaintance = dataInforVessel?.getInforByOwner.underMaintance;
    }
  }
  console.log(
    "vesselTotal: ",
    vesselTotal,
    available,
    inTransits,
    underMaintance
  );
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="container-profile">
        <div className={styles.Title}>Personal Information</div>
        <div className={styles.subtitle}>View and update your profile</div>
        <Divider style={{ borderColor: "#334155" }}></Divider>
        <div className="content-infor">
          <div className="avatar">
            <Image
              alt="profile default"
              src={userInfor.image_url ? userInfor.image_url : imageDefault}
              width={320}
              height={270}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <UpdateAvatarModal userProfile={userInfor} refetchUser={refetch} />
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
            <UpdatePasswordModal />
          </div>
        </div>
        {(dataInforVessel?.getInforByOwner ||
          dataInforVesselTotal?.getInforVesselTotal) && (
          <ListCardVessel
            vesselTotal={vesselTotal}
            available={available}
            inTransits={inTransits}
            underMaintance={underMaintance}
          />
        )}
      </div>
    </>
  );
};
export default Profile;
