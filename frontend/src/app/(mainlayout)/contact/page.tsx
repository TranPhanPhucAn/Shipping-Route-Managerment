import "./contact.scss";
import styles from "@/src/styles/Detailpage.module.css";
import Image from "next/image";
import image from "../../../../public/bgtest.jpg";
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
const Contact = () => {
  return (
    <>
      <div className="contact">
        <br/>
        <div className={styles.Title} style={{ textAlign: "center" }}>Contact us</div>
        <div className={styles.infortext} style={{ textAlign: "center" }}>
          Our dedicated team of logistics experts is here for you. Whether you
          have inquiries about cargo status or want to know more about our
          solutions, please don't hesitate to contact us, and we will be
          delighted to assist you.
        </div>
        <br/>
        <br/>
        <div className="contact-content">
          <div className="contact-content-left">
            <Image
              src={image}
              alt="background image"
              sizes="100%"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </div>
          <div className="contact-content-right">
            <div className={styles.Title} style={{ textAlign: "center" }}>Get in touch</div>
            <div className="icon-contact-infor" className={styles.infortext}>
              <EnvironmentOutlined style={{ marginRight: 7 }} />
              SCETPA Building, 19A Cong Hoa Street, Ward 12, Tan Binh District,
              HCMC, Vietnam
            </div>
            <div className="icon-contact-infor" className={styles.infortext}>
              <EnvironmentOutlined style={{ marginRight: 7 }} />
              TSA Building, 77 Le Trung Nghia, Ward 12, Tan Binh District, HCMC,
              Vietnam
            </div>
            <div className="icon-contact-infor" className={styles.infortext}>
              <EnvironmentOutlined style={{ marginRight: 7 }} />
              TOAN KY Building, 11 Le Trung Nghia, Ward 12, Tan Binh District,
              HCMC, Vietnam
            </div>
            <div className="icon-contact-infor" className={styles.infortext}>
              <PhoneOutlined style={{ marginRight: 7 }} />
              (+84) 28 38 132 967
            </div>
            <div className="icon-contact-infor" className={styles.infortext}>
              <MailOutlined style={{ marginRight: 7 }} />
              sales.vn@cyberlogitec.com
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Contact;
