import React from "react";
import Header from "../components/layout/Header";
import FooterApp from "../components/layout/Footer";
import "./(mainlayout)/layoutmain.scss";
import "./homepage.scss";
import Image from "next/image";
import GridListView from "../components/GridListView/GridListView";
import GridCardList from "../components/GridCardList/GridCardList";
import { QUERY_USER } from "../graphql/queries/query";
import styles from "@/src/styles/Detailpage.module.css";

const HomePage: React.FC = async () => {
  const imageTech: string[] = [
    "/logotechno/nest.png",
    "/logotechno/next2.png",
    "/logotechno/postgres.png",
    "/logotechno/graphql.png",
    "/logotechno/docker.png",
  ];
  const refsTech: string[] = [
    "https://nestjs.com/",
    "https://nextjs.org/",
    "https://www.postgresql.org/",
    "https://graphql.org/",
    "https://www.docker.com/",
  ];
  const imageCompany: string[] = [
    "/logocom/one.png",
    "/logocom/binex.png",
    "/logocom/ilcs.jpg",
    "/logocom/westsports.jpg",
    "/logocom/symphony.jpg",
  ];
  const refsCompany: string[] = [
    "https://www.one-line.com/en",
    "https://binexline.com/",
    "https://www.ilcs.co.id/",
    "https://www.westportsholdings.com/",
    "https://www.scs71.com",
  ];
  return (
    <>
      <div className="layoutmain">
        <Header />
        <div className="home">
          <Image
            src={"/bg3.jpg"}
            alt="background image"
            fill
            // objectFit="cover"
            quality={100}
            className="background-image"
          />
          <div className="content-home">
            <div className={styles.mainTitle}>See how truly integrated</div>
            <div className={styles.mainTitle}>logistics delivers</div>
            <p className={styles.subTitle}>
              With truly integrated logistics there’s always a new way to keep
              your goods moving and your business growing.
            </p>
          </div>
        </div>
        <div className="content">
          <div className="logistics-home-heading">
            <div className={styles.Title}>Logistics solutions</div>
            <p className="sub-header-logistics" className={styles.infortext}>
              From the farm to your fridge, or the warehouse to your wardrobe,
              CLV is developing solutions that meet customer needs from one end
              of the supply chain to the other.
            </p>
          </div>
          <div className="page-section" style={{ marginBottom: 35 }}>
            <GridListView />
          </div>
          <div className={styles.Title}>Technologies</div><br/>
          <div
            className="page-section"
            style={{ marginBottom: 35, marginTop: 15 }}
          >
            <GridCardList images={imageTech} refs={refsTech} />
          </div>
          <div className={styles.Title}>Global Customers</div><br/>
          <div
            className="page-section"
            style={{ marginBottom: 35, marginTop: 15 }}
          >
            <GridCardList images={imageCompany} refs={refsCompany} />
          </div>
        </div>
        <FooterApp />
      </div>
    </>
  );
};

export default HomePage;
