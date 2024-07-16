import Image from "next/image";
import { Inter } from "next/font/google";
import { Button } from "antd";
import RoutesList from "../components/RoutesList";
const inter = Inter({ subsets: ["latin"] });

// pages/index.tsx

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Shipping Route Management
        </h1>
        <p className="text-gray-700 mb-4">
          Manage your shipping routes efficiently and effectively.
        </p>
        <Button type="primary" href="/routes">
          Get Started
        </Button>
        <div className="mt-8">
          <RoutesList />
        </div>
      </div>
    </div>
  );
};

export default Home;
