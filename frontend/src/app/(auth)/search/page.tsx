"use client";
import React, { useState } from "react";
import { Calendar, Printer, Download } from "lucide-react";
import {
  Input,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/UI";
import { LuShip } from "react-icons/lu";
import { LiaShipSolid } from "react-icons/lia";

const ScheduleSearch: React.FC = () => {
  const [vesselName, setVesselName] = useState("GLASGOW EXPRESS");
  const [dateFrom, setDateFrom] = useState("01/10/2024");
  const [activeTab, setActiveTab] = useState("vessel-schedules");

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl font-bold mb-2">Schedules</h1>
      <p className="text-gray-600 mb-6">
        Search our extensive routes to find the schedule which fits your supply
        chain.
      </p>

      <Tabs>
        <TabsList>
          <TabsTrigger
            isActive={activeTab === "point-to-point"}
            onClick={() => setActiveTab("point-to-point")}
          >
            Point-to-Point
          </TabsTrigger>
          <TabsTrigger
            isActive={activeTab === "port-calls"}
            onClick={() => setActiveTab("port-calls")}
          >
            Port Calls
          </TabsTrigger>
          <TabsTrigger
            isActive={activeTab === "vessel-schedules"}
            onClick={() => setActiveTab("vessel-schedules")}
          >
            Vessel Schedules
          </TabsTrigger>
        </TabsList>

        <TabsContent isActive={activeTab === "vessel-schedules"}>
          <div className="flex mt-6">
            <div className="w-1/3 pr-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Vessel name
                </label>
                <div className="relative">
                  <Input
                    value={vesselName}
                    onChange={(e) => setVesselName(e.target.value)}
                    className="pr-8"
                  />
                  {vesselName && (
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setVesselName("")}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Date from
                </label>
                <div className="relative">
                  <Input
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="pr-8"
                  />
                  <Calendar
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
              <Button className="w-full bg-blue-900 hover:bg-blue-800">
                Search
              </Button>
            </div>
            <div className="w-2/3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Search results for GLASGOW EXPRESS
                </h2>
                <div>
                  <Button variant="ghost" className="p-2">
                    <Printer size={20} />
                  </Button>
                  <Button variant="ghost" className="p-2">
                    <Download size={20} />
                  </Button>
                </div>
              </div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2">TEU (Nominal)</td>
                    <td className="py-2">-</td>
                    <td className="py-2">Built</td>
                    <td className="py-2">2002</td>
                    <td className="py-2">IMO Number</td>
                    <td className="py-2">9232589</td>
                  </tr>
                  <tr>
                    <td className="py-2">Call Sign</td>
                    <td className="py-2">ZCHC8</td>
                    <td className="py-2">Class</td>
                    <td className="py-2">-</td>
                    <td className="py-2">Flag</td>
                    <td className="py-2">Bermuda Island (BM)</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-6">
                <div className="flex items-center mb-2">
                  <div className="w-1/3 font-semibold text-blue-600">
                    Luanda
                  </div>
                  <div className="w-1/3">SOPORTOS</div>
                  <div className="w-1/3">
                    <div>Arrival - 431E</div>
                    <div>01 Oct 2024 10:00</div>
                  </div>
                </div>
                <div className="flex items-center mb-2 ml-8">
                  <div className="w-2/3"></div>
                  <div className="w-1/3">
                    <div>
                      {" "}
                      <LuShip />
                      <LiaShipSolid/>
                      Departure - 431E
                    </div>
                    <div>02 Oct 2024 10:00</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/3 font-semibold text-blue-600">Genoa</div>
                  <div className="w-1/3">Genoa Port Terminal</div>
                  <div className="w-1/3">
                    <div>Arrival - 443W</div>
                    <div>27 Oct 2024 19:30</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleSearch;
