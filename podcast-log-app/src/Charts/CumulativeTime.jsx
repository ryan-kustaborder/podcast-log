import React from "react";
import { GetColors, SortDataByDate } from "../util";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { VictoryChart, VictoryArea, VictoryTheme } from "victory";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function CumulativeTime(props) {
  let minutesPerDay = {};

  for (let r of props.inputData) {
    if (minutesPerDay[r.date]) {
      minutesPerDay[r.date] += r.length;
    } else {
      minutesPerDay[r.date] = r.length;
    }
  }

  // Separate values for passing into chart
  const chartDates = Object.keys(minutesPerDay);
  const chartMinutes = Object.values(minutesPerDay);

  return (
    <div id="listeningOverTime" className="dashboard-section">
      <h2>Listening Over Time</h2>
    </div>
  );

  return (
    <div>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryArea
          style={{ data: { fill: "#c43a31" } }}
          data={chartMinutes}
        />
      </VictoryChart>
    </div>
  );
}

export default CumulativeTime;
