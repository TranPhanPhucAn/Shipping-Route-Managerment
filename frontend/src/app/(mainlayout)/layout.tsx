import FooterApp from "@/src/components/layout/Footer";
import Header from "@/src/components/layout/Header";
import { Layout as LayoutAnt } from "antd";
import "./layoutmain.scss";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layoutmain">
      <Header />
      {children}
      <FooterApp />
    </div>
  );
}
