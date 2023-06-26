import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { GetColors } from "../constants";

ChartJS.register(ArcElement, Tooltip, Legend);

function EpisodesPerPodcast(props) {
  // Episodes Per Podcast
  let episodesPerPodcast = {};
  for (let r of props.inputData) {
    if (episodesPerPodcast[r.podcast]) {
      episodesPerPodcast[r.podcast] += r.length;
    } else {
      episodesPerPodcast[r.podcast] = r.length;
    }
  }

  // Sorting needs to occur here before we split up the array

  const myLabels = Object.keys(episodesPerPodcast);
  const myValues = Object.values(episodesPerPodcast);
  const myColors = GetColors(myLabels);

  let data = {
    labels: myLabels,
    datasets: [
      {
        label: "Minutes",
        data: myValues,
        backgroundColor: myColors,
        hoverOffset: 4,
        cutout: 100,
        borderWidth: 0,
      },
    ],
  };
  const options = {
    legend: {
      display: false,
    },
  };

  return <Doughnut data={data} options={options} />;
}

export default EpisodesPerPodcast;
