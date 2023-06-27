import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
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
  minutesPerPodcast = SortNumericalDict(minutesPerPodcast, true);

  // Separate values for passing into chart
  const chartPodcasts = Object.keys(minutesPerPodcast);
  const chartMinutes = Object.values(minutesPerPodcast);
  const chartColors = GetColors(chartPodcasts);

  return (
    <div id="PerPodcastStatistics" className="dashboard-section">
      <div className="dashboard-section-header">
        <h2>Per Podcast Statistics</h2>
      </div>
      <div className="dashboard-section-content">
        <TreeMap
          data={chartMinutes}
          labels={chartPodcasts}
          colors={chartColors}
        />
      </div>
    </div>
  );
}

export default MinutesPerPodcast;

function TreeMap(props) {
  const [rectangles, setRectangles] = useState([]);

  const svgRef = useRef();

  const inputData = props.data;
  const inputLabels = props.labels;

  useLayoutEffect(() => {
    const { width, height } = svgRef.current.getBoundingClientRect();

    // Map the data to match the SVG dimensions
    const inputArea = inputData.reduce((a, b) => a + b);

    let mappedData = [];
    for (let d in inputData) {
      mappedData.push({
        rawVal: inputData[d],
        mapVal: (inputData[d] * width * height) / inputArea,
        label: inputLabels[d],
      });
    }

    const treemap = genTreeMap(mappedData, width, height);

    // Generate the visual structure from svg components
    let xPos = 0;
    let yPos = 0;

    let colorIter = 0;
    let newRectangles = [];

    for (let row of treemap) {
      let xOff = 0;
      let yOff = 0;

      let isWide = width - xPos > height - yPos;

      let rowWidth = 0;
      let rowHeight = 0;

      for (let rect of row) {
        rowWidth += rect.width;
        rowHeight += rect.height;
      }

      // Genereate DOM elements for display
      for (let r of row) {
        newRectangles.push(
          <TreemapRect
            x0={xPos + xOff}
            y0={yPos + yOff}
            width={r.width}
            height={r.height}
            color={props.colors[colorIter++ % props.colors.length]}
            value={r.rawVal}
            label={r.label}
            key={r.label + " - " + r.rawVal}
          />
        );

        // Check if label is too big

        // Increment the offset for this row
        xOff += isWide ? 0 : r.width;
        yOff += isWide ? r.height : 0;
      }

      // Increment the top left position
      xPos += isWide ? row[0].width : 0;
      yPos += isWide ? 0 : row[0].height;
    }

    setRectangles(newRectangles);
  }, [inputData]);

  return (
    <div id="Treemap-container">
      <svg id="Treemap" ref={svgRef}>
        {rectangles}
      </svg>
    </div>
  );
}

function genTreeMap(data, width, height) {
  // If no more data, we are done
  if (data.length <= 0) {
    return [];
  }

  // Flag for if the inner area is wider than it is tall
  let isWide = width > height;

  // Select the edge we are using
  let mainEdge = isWide ? height : width;

  let row = [];
  let sqRatio = 100000;

  // Try to add new data points until no more to add or square ratio is worse
  while (data.length > 0) {
    let newVal = data[data.length - 1];

    // Get total area needed
    let totalArea = newVal.mapVal + row.reduce((acc, r) => acc + r.mapVal, 0);

    // Calculate opposite edge size
    let oppEdge = totalArea / mainEdge;

    // Copy the rects from the row
    let potentialRow = row.map((r) => {
      return {
        rawVal: r.rawVal,
        mapVal: r.mapVal,
        label: r.label,
        width: isWide ? oppEdge : r.mapVal / oppEdge,
        height: isWide ? r.mapVal / oppEdge : oppEdge,
      };
    });

    // Add the new rectangle
    let newestRect = {
      rawVal: newVal.rawVal,
      mapVal: newVal.mapVal,
      label: newVal.label,
      width: isWide ? oppEdge : newVal.mapVal / oppEdge,
      height: isWide ? newVal.mapVal / oppEdge : oppEdge,
    };

    potentialRow.push(newestRect);

    // Get the new ratio
    let newSQRatio = newestRect.width / newestRect.height;

    // If new ratio is closer to 1 (more square-like)
    if (Math.abs(newSQRatio - 1) < Math.abs(sqRatio - 1)) {
      // Remove the data point from the queue
      data.pop();

      // Update the trackers
      sqRatio = newSQRatio;
      row = potentialRow;
    }

    // If new ratio is worse, discard the copy and finalize the row, then call the function again with new bounds
    else {
      return [
        row,
        // Recursively call with remaining space
        ...genTreeMap(
          data,
          isWide ? width - row[0].width : width,
          isWide ? height : height - row[0].height
        ),
      ];
    }
  }

  // When no more data points left, return
  return [row];
}

function TreemapRect({ x0, y0, width, height, color, value, label }) {
  return (
    <g>
      <rect
        x={x0}
        y={y0}
        width={width}
        height={height}
        style={{ fill: color }}
      />
      <text
        x={x0 + width / 2}
        y={y0 + height / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="16px"
        fontWeight="600"
        fill="white"
      >
        {value}
      </text>
      <text
        x={x0 + width / 2}
        y={y0 + height / 2 + 16}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="12px"
        fill="white"
      >
        {label}
      </text>
    </g>
  );
}
