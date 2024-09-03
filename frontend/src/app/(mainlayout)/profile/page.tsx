"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

// import { getServerSession } from "next-auth/next";
// import { getServerSessionFromApp } from "@/src/lib/customGetSession";
// import { client } from "@/src/graphql/Provider";
import { QUERY_USER } from "@/src/graphql/queries/query";
import { useQuery } from "@apollo/client";

const Profile = () => {
  const { data: session, status, update } = useSession();
  // const session = await getServerSessionFromApp();
  const id = session?.user?.id;
  const { loading, error, data } = useQuery(QUERY_USER, {
    variables: { id: id },
  });

  // console.log("server session: ", session);
  // console.log("request", req);
  // console.log("data:", data);

  return <>{data?.user.username}</>;
};
export default Profile;