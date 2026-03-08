import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

const useRegistrationStats = (view, year) => {
  const [chartData, setChartData] = useState({
    agent: null,
    employer: null,
    worker: null,
    summry: null,
    selfWorker: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${config.API_BASE_URL}/api/view/registrations?type=${view}&year=${year}`
        );

        const roles = { Agent: [], Employer: [], Worker: [], SelfWorker: [] };
        const dateSet = new Set();

        res.data.data.forEach((roleGroup) => {
          roleGroup.data.forEach(({ date, count }) => {
            roles[roleGroup._id]?.push({ date, count });
            dateSet.add(date);
          });
        });

        const sortedDates = [...dateSet].sort();

        const formatRoleData = (role) => {
          const map = new Map(roles[role]?.map((d) => [d.date, d.count]));
          return sortedDates.map((date) => map.get(date) || 0);
        };

        setChartData({
          labels: sortedDates,
          agent: {
            labels: sortedDates,
            datasets: [{ label: "Agents", data: formatRoleData("Agent"), borderColor: "#3e95cd" }],
          },
          employer: {
            labels: sortedDates,
            datasets: [{ label: "Employers", data: formatRoleData("Employer"), backgroundColor: "#8e5ea2" }],
          },
          worker: {
            labels: sortedDates,
            datasets: [{ label: "Workers", data: formatRoleData("Worker"), borderColor: "#3cba9f" }],
          },
          selfWorker: {
            labels: sortedDates,
            datasets: [{ label: "SelfWorkers", data: formatRoleData("SelfWorker"), borderColor: "#9faeb8ff" }],
          },
          summry: {
            labels: ["Agent", "Employer", "SelfWorkers", "Worker"],
            datasets: [
              {
                data: [
                  res.data.summary.Agent,
                  res.data.summary.Employer,
                  res.data.summary.SelfWorker,
                  res.data.summary.Worker,
                  res.data.summary.Total,
                ],
                backgroundColor: ["#3cba9f", "#e8c3b9", "#3e95cd", "#9faeb8ff"],
              },
            ],
          },
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchData();
  }, [view, year]);   // 👈 now reacts to year change

  return chartData;
};

export default useRegistrationStats;


