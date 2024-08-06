import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import Provider from "../graphql/Provider";
import StyledComponentsRegistry from "../lib/antd.registry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shipping route management",
  description: "Shipping route management web application",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <Provider>{children}</Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
