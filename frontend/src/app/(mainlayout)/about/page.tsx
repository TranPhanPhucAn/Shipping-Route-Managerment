import Image from "next/image";
import React from "react";
import "./about.scss";
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
          <div className="title">
            Improving life for all by integrating the world
          </div>
          <p>
            There’s a reason we strive to go all the way, every day, to deliver
            a more connected, agile and sustainable future for global logistics.
            It is our purpose. See why it gets us up in the morning.
          </p>
        </div>
      </div>
      <div className="content-about">
        <div className="content-left">
          <div className="title">Our organisation</div>
          <hr />
          <p>We are CyberLogitec Vietnam</p>
          <p>
            As an Off-shore Development Center in Vietnam, CyberLogitec
            specializes in providing cutting-edge IT solutions for various
            industries. With expertise in shipping, terminal, forwarding, and
            research into new technologies like machine learning, web, mobile,
            and virtual reality, we have been delivering high-quality IT
            outsourcing services for over 13 years to our global customers
            across 10+ countries.
          </p>
          <p>
            Spark brilliance through the synergy of visionary thinking & clever
            tech
          </p>
          <p>
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
          <div className="title">About CLV</div>
          <div className="content-about-right">
            <ul>
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
    </>
  );
};
export default About;
