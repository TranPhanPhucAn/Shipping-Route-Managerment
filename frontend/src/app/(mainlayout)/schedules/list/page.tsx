import {Divider, Tabs} from "antd";
import styles from "@/src/styles/Listpage.module.css";
import SchedulesList from "@/src/components/Schedules/ScheduleList";


export default function Scheduleslist() {
  return (
    <div className={styles.body}>
      <div className={styles.Title}>Schedules</div>
      {/* <div className={styles.subtitle}>
        Search our extensive routes to find the schedule which fits your supply
        chain.
      </div> */}
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <SchedulesList />
    </div>
  );
}
