import { Avatar, Button, Dropdown, message, Space, Tooltip } from "antd";
import type { MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import UserIcon from "./UserIcon";
import "./ProfileDropUser.scss";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import { signOut, useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "@/src/graphql/mutations/Auth";
import { LogoutOutlined, ProfileFilled, UserOutlined } from "@ant-design/icons";
import styles from "@/src/styles/Detailpage.module.css";

const ProfileDropUser: React.FC = () => {
  const handleMenuClick: MenuProps["onClick"] = async (e) => {
    //   message.info("Click on menu item.");
    console.log("click", e);
    if (e.key === "3") {
      await handleSignOut();
    }
  };
  // const [singedIn, setSignedIn] = useState(false);
  const router = useRouter(); // Initialize useRouter
  const { data: session, status, update } = useSession();
  const [logoutUser, { loading, error }] = useMutation(LOGOUT_USER);
  const handleSignOut = async () => {
    console.log("get");
    await signOut({ callbackUrl: "/login", redirect: true });
    try {
      await logoutUser();
    } catch (e) {
      console.log("error: ", e);
    }
  };
  // console.log("session: ", session);
  const items: MenuProps["items"] = [
    // {
    //   label: <Link href={"/profile"}>{session?.user?.username}</Link>,
    //   key: "1",
    // },
    {
      label: (
        <Link href={"/profile"}>
          <ProfileFilled
            style={{
              color: "#334155",
              marginRight: "5px",
              fontSize: "17px",
            }}
          />
          My Profile
        </Link>
      ),
      key: "2",
    },
    {
      label: (
        <span>
          <LogoutOutlined
            style={{
              color: "#334155",
              marginRight: "5px",
              fontSize: "17px",
            }}
          />
          Log Out
        </span>
      ),
      key: "3",
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const handleClick = (route: string) => {
    router.push(route);
  };
  return (
    <div style={{ display: "flex" }}>
      <div className="icon">
        {session ? (
          <Dropdown
            menu={menuProps}
            trigger={["click"]}
            placement="bottomRight"
          >
            {/* <span className="icon"> */}
            {/* <UserIcon /> */}
            {session?.user?.avatar_url ? (
              <Avatar size={45} src={session.user?.avatar_url}></Avatar>
            ) : (
              <Avatar size={45} style={{ backgroundColor: "#334155" }}>
                <UserOutlined />
              </Avatar>
            )}
            {/* </span> */}
          </Dropdown>
        ) : (
          <>
            <span className="icon" onClick={() => handleClick("/login")}>
              <UserIcon />
            </span>
          </>
        )}
      </div>
      <div style={{ paddingLeft: "5px" }} className={styles.username}>
        {session?.user?.username}
      </div>
    </div>
  );
};

export default ProfileDropUser;
