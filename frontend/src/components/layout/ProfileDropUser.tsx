import { Button, Dropdown, message, Space, Tooltip } from "antd";
import type { MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import UserIcon from "./UserIcon";
import "./ProfileDropUser.scss";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import { signOut, useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "@/src/graphql/mutations/Auth";

const handleMenuClick: MenuProps["onClick"] = (e) => {
  //   message.info("Click on menu item.");
  console.log("click", e);
};

const ProfileDropUser: React.FC = () => {
  // const [singedIn, setSignedIn] = useState(false);
  const router = useRouter(); // Initialize useRouter
  const { data: session, status, update } = useSession();
  const [logoutUser, { loading, error }] = useMutation(LOGOUT_USER);
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login", redirect: true });

    const response = await logoutUser();
  };
  const items: MenuProps["items"] = [
    {
      label: <Link href={"/about"}>{session?.user?.username}</Link>,
      key: "1",
    },
    {
      label: <Link href={"/about"}>My Profile</Link>,
      key: "2",
    },
    {
      label: <span onClick={handleSignOut}>Log Out</span>,
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
            <UserIcon />
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
