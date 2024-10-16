// import Header from "@/src/components/layout/Header";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layoutauth">
      {/* <Header /> */}
      {children}
    </div>
  );
}