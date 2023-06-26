import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { GetColors, SortNumericalDict } from "../util";

ChartJS.register(ArcElement, Tooltip, Legend);

function MinutesPerPodcast(props) {
  // Aggregate data
  let minutesPerPodcast = {};

  for (let r of props.inputData) {
    if (minutesPerPodcast[r.podcast]) {
      minutesPerPodcast[r.podcast] += r.length;
    } else {
      minutesPerPodcast[r.podcast] = r.length;
    }
  }

  // Sort descending
  minutesPerPodcast = SortNumericalDict(minutesPerPodcast);

  // Separate values for passing into chart
  const chartPodcasts = Object.keys(minutesPerPodcast);
  const chartMinutes = Object.values(minutesPerPodcast);
  const chartColors = GetColors(chartPodcasts);

  // Create data object to send to the chart
  let data = {
    labels: chartPodcasts,
    datasets: [
      {
        label: "Minutes",
        data: chartMinutes,
        backgroundColor: chartColors,
        hoverOffset: 4,
        cutout: 80,
        borderWidth: 0,
      },
    ],
  };

  // Hide native legend
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Generate new Legend
  let legend = [];
  let keys = Object.keys(minutesPerPodcast);
  for (let i = 0; i < 10; i++) {
    legend.push(
      <li className="legend-row" key={"minutes per podcast " + i}>
        <span className="legend-row-label">{keys[i]}</span>
        <span className="legend-row-value">{minutesPerPodcast[keys[i]]}</span>
      </li>
    );
  }

  return (
    <div id="perPodcast" className="dashboard-section">
      <h2>Per Podcast Statistics</h2>
    </div>
  );

  return (
    <div>
      <Doughnut id="pie-per-podcast" data={data} options={options} />
      <ol className="legend">{legend}</ol>
    </div>
  );
}

export default MinutesPerPodcast;
