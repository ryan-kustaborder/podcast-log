import React from "react";

function TotalTimeListened(props) {
  // Aggregate the data
  let sum = 0;
  for (let r of props.inputData) {
    sum += parseInt(r.length);
  }

  const label = "minutes";

  return (
    <div id="TotalTimeListened" className="dashboard-section">
      <div className="dashboard-section-header">
        <h2>Total Time Listened</h2>
      </div>
      <div className="dashboard-section-content">
        <h1 id="TotalTimeListened-value">{sum}</h1>
        <h2 id="TotalTimeListened-label">{label}</h2>
      </div>
    </div>
  );
}

export default TotalTimeListened;
