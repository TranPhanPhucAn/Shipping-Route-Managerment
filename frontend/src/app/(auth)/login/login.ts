"use server";

import { cookies } from "next/headers";

export default async function loginfetch(email: string, password: string) {
  const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URI!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
            mutation Login($loginInput: LoginInput!) {
              login(loginInput: $loginInput) {
                user {
                    id
                    email
                    username
                }
                expAccessToken
                }
            }
            `,
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    }),
    credentials: "include",
  });
  const parsedRes = await response.json();
  if (!response.ok) {
    return { cookiesList: "", parsedRes: parsedRes };
  }
  console.log("log cookies");

  const cookiesList = setAuthCookie(response);
  console.log("log herer");
  return { cookiesList: cookiesList, parsedRes: parsedRes };
}

const setAuthCookie = (response: Response) => {
  const setCookieHeader = response.headers.get("Set-Cookie");
  if (setCookieHeader) {
    const token = setCookieHeader.split(";")[0].split("=")[1];
    cookies().set({
      name: "access_token",
      value: token,
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });
  }
  return setCookieHeader;
};
