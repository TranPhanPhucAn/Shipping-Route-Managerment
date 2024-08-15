"use client";
import React from "react";
import Header from "../components/layout/Header";
import FooterApp from "../components/layout/Footer";
import "./(mainlayout)/layoutmain.scss";
import "./homepage.scss";
import Image from "next/image";
import GridListView from "../components/GridListView/GridListView";
const HomePage: React.FC = () => {
  return (
    <>
      <div className="layoutmain">
        <Header />
        <div className="home">
          <Image
            src={"/bg3.jpg"}
            alt="background image"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="background-image"
          />
          <div className="content-home">
            <div className="title">See how truly integrated</div>
            <div className="title">logistics delivers</div>
            <p>
              With truly integrated logistics there’s always a new way to keep
              your goods moving and your business growing.
            </p>
          </div>
        </div>
        <div className="content">
          <div className="logistics-home-heading">
            <div className="header-logistics">Logistics solutions</div>
            <p className="sub-header-logistics">
              From the farm to your fridge, or the warehouse to your wardrobe,
              CLV is developing solutions that meet customer needs from one end
              of the supply chain to the other.
            </p>
          </div>
          <div className="page-section" style={{ marginBottom: 35 }}>
            <GridListView />
          </div>
        </div>

        <FooterApp />
      </div>
    </>
  );
};

export default HomePage;
