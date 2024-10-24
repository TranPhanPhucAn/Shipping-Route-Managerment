"use client";
import { Row, Col, Card } from "antd";
import Image from "next/image";
import React from "react";
import "./about.scss";
import style from "@/src/styles/Detailpage.module.css";
const About: React.FC = () => {
  return (
    <>
      <div className="about">
        <Image
          src={"/bg.jpg"}
          alt="background image"
          fill
          // objectFit="cover"
          quality={100}
          className="background-image"
        />
        <div className="content-home">
          <div className={style.mainTitle}>
            Improving life for all 
          </div>
          <div className={style.mainTitle}>
          by integrating the world
          </div>
          
          <p className={style.subTitle}>
            There’s a reason we strive to go all the way, every day, to deliver
            a more connected, agile and sustainable future for global logistics.
            It is our purpose. See why it gets us up in the morning.
          </p>
        </div>
      </div>
      <div className="content-about">
        <div className="content-left">
          <div className={style.Title}>Our organisation</div>
          <hr />
          <p className={style.infortext}>We are CyberLogitec Vietnam</p>
          <p className={style.infortext}>
            As an Off-shore Development Center in Vietnam, CyberLogitec
            specializes in providing cutting-edge IT solutions for various
            industries. With expertise in shipping, terminal, forwarding, and
            research into new technologies like machine learning, web, mobile,
            and virtual reality, we have been delivering high-quality IT
            outsourcing services for over 13 years to our global customers
            across 10+ countries.
          </p>
          <p className={style.infortext}>
            Spark brilliance through the synergy of visionary thinking & clever
            tech
          </p>
          <p className={style.infortext}>
            CyberLogitec Vietnam is an established Off-shore Development Center
            (ODC) that provides a comprehensive range of IT outsourcing
            services, including Software Development, Quality Assurance, and
            Global Service Desk. Our focus is centered on delivering
            cutting-edge IT solutions designed specifically for the logistics
            industry, with particular expertise in shipping, terminal,
            forwarding, and yard solutions. We continually pursue research on
            emerging technologies, such as machine learning, computer vision,
            chatbot, web, mobile, and virtual reality, to provide our clients
            with the latest and most innovative IT solutions.
          </p>
        </div>
        <div className="content-right">
          <div className={style.subTitle}>About CLV</div>
          <div className="content-about-right">
            <ul className={style.infortext}>
              <li>
                CLV was created in 2010 on the occasion of the first European
                Council held in Maastricht.
              </li>
              <li>
                We are supported by the EU Member States and the European
                Commission.
              </li>
              <li>
                We are supported by the EU Member States and the European
                Commission.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* section information */}
      <div className={style.body}>
      <div className={style.Title}>Group member</div>
      <hr/>

      <br />
          <Row>
            <Col span={11}>
              <Card
                title={
                  <div
                    className={style.subTitle}
                    style={{ textAlign: "center" }}
                  >
                    Thu Hoa
                  </div>
                }
                className={style.card}
              >
                <Row>
                  <Col span={11}>
                  <Image
                  src={"/avatar1.jpg"}
                  alt="avatar image"
                  width={270}
                  height={300}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                ></Image>

                  </Col>
                  <Col span={12} offset={1}>
                  <div className={style.infortext}>
                  <b>Backend:</b> Route Service
                </div>
                <div className={style.infortext}>
                  <b>Frontend:</b> Manage routes, schedules, vessels, ports, search and
                  handle business logic.
                </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={11} offset={2}>
              <Card
                title={
                  <div
                    className={style.subTitle}
                    style={{ textAlign: "center" }}
                  >
                    Phuc An
                  </div>
                }
                className={style.card}
              >
                <Row>
                  <Col span={11}>
                  <Image
                  src={"/avatar2.jpg"}
                  alt="avatar image"
                  width={270}
                  height={300}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                ></Image>
                  </Col>
                  <Col span={12} offset={1}>
                  <div className={style.infortext}>
                  <b>Backend:</b> Auth Service, Notification Service.
                </div>
                <div className={style.infortext}>
                  <b>Frontend:</b> authentication and authorization, manage
                  user, role, permissions, homepage, about us, contact us.
                </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <br/>
          <br/>
          <br/>
          <br/>
          {/* section project information */}
          <div className={style.Title}>About our project</div>
          <hr/>
          <br/>
          <Row>
            <Col span={11}>
              <Card
                title={
                  <div
                    className={style.subTitle}
                    style={{ textAlign: "center" }}
                  >
                    Shipping Route Management System
                  </div>
                }
              >
                <div className={style.subTitle}>
                  Overview:
                  <div className={style.mainfeature}>
                    <ul>
                      {" "}
                      Manage routes, transports, locations, schedules in the
                      sea.
                    </ul>
                  </div>
                </div>
                <div className={style.subTitle}>
                  Main feature:
                  <ul>
                    <li className={style.mainfeature}>Manage permissions</li>
                    <li className={style.mainfeature}>Manage roles</li>
                    <li className={style.mainfeature}>Manage users</li>
                    <li className={style.mainfeature}>Manage locations</li>
                    <li className={style.mainfeature}>Manage transport</li>
                    <li className={style.mainfeature}>Manage routes</li>
                    <li className={style.mainfeature}>Manage schedules</li>
                  </ul>
                </div>
              </Card>
            </Col>
            {/* Architechture diagram */}
            <Col span={12} offset={1}>
              <Card
                title={
                  <div
                    className={style.subTitle}
                    style={{ textAlign: "center" }}
                  >
                    Architechture diagram
                  </div>
                }
                className={style.card}
                style={{ minHeight: "620px" }}
              >
                <Image
                  src={"/AD.png"}
                  alt="avatar image"
                  width={650}
                  height={400}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                ></Image>
              </Card>
            </Col>
          </Row>
        </div>
      <br />
    </>
  );
};
export default About;
