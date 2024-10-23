import { Divider } from "antd";
import styles from "@/src/styles/Listpage.module.css";
import SchedulesList from "@/src/components/Schedules/ScheduleList";

export default function Scheduleslist() {
  return (
    <div className={styles.body}>
      <div className={styles.Title}>Schedules</div>
      <div className={styles.subtitle}>
        Manage and view information about all available schedules.
      </div>
      <Divider style={{ borderColor: "#334155" }}></Divider>
      <SchedulesList />
    </div>
  );
}
