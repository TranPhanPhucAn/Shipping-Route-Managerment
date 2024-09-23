"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// import { getServerSession } from "next-auth/next";
// import { getServerSessionFromApp } from "@/src/lib/customGetSession";
// import { client } from "@/src/graphql/Provider";
import { QUERY_USER } from "@/src/graphql/queries/query";
import { useQuery } from "@apollo/client";
import "./profile.scsss";

const Profile = () => {
  const { data: session, status, update } = useSession();
  const id = session?.user?.id;
  const { loading, error, data } = useQuery(QUERY_USER, {
    variables: { id: id },
  });

  // return <>{data ? data?.user?.username : ""}</>;
  return (
    <>
      {session ? session?.user?.username : ""}
      <div className="container-profile">
        <div>
          <div className="avatar"></div>
          <div className="">
            <div className="username">{data.user.username}</div>
            <div className=""></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;
