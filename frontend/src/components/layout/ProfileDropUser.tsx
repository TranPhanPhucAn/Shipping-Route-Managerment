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
import { UserOutlined } from "@ant-design/icons";

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
  const items: MenuProps["items"] = [
    {
      label: <Link href={"/profile"}>{session?.user?.username}</Link>,
      key: "1",
    },
    {
      label: <Link href={"/profile"}>My Profile</Link>,
      key: "2",
    },
    {
      label: <span>Log Out</span>,
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
    <div>
      {session ? (
        <Dropdown menu={menuProps} trigger={["click"]} placement="bottomRight">
          <span className="icon">
            {/* <UserIcon /> */}
            <Avatar
              size={50}
              src={
                // "https://lh3.googleusercontent.com/a/ACg8ocKiM0UBkOMdSqXTKoS9FlLPYPbZHT8AvLxLF9egAQHNYzmOWA=s96-c"
                "https://shippingroutes.blob.core.windows.net/fileupload/4bb564f9-623c-466b-bc5c-578d98aa3aa0.jpg"
              }
            ></Avatar>
          </span>
        </Dropdown>
      ) : (
        <>
          <span className="icon" onClick={() => handleClick("/login")}>
            <UserIcon />
          </span>
        </>
      )}
    </div>
  );
};

export default ProfileDropUser;
