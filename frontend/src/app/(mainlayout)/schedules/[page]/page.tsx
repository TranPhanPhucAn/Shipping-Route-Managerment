
import {Tabs, Divider,} from "antd";
import styles from "@/src/styles/Listpage.module.css";
import SchedulesList from "@/src/components/Schedules/ScheduleList";
import ScheduleSearch from "@/src/components/Schedules/ScheduleSearch";

export default function SchedulesPage() {
  
  const items = [
    {
      key: '1',
      label: 'Port Call',
      children: <ScheduleSearch />,
    },
    {
      key: '2',
      label: 'Vessel Schedules',
      children: <SchedulesList />,
    },  
  ];
  return (
    <div className={styles.body}>
       <div className={styles.Title}>Schedules</div>
      <div className={styles.subtitle}>
       Search our extensive routes to find the schedule which fits your supply chain.
      </div>
      <div className={styles.container} >
      <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
}
