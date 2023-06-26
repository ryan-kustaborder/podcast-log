import "./App.css";
import CumulativeTime from "./Charts/CumulativeTime";
import MinutesPerPodcast from "./Charts/MinutesPerPodcast";
import TotalTimeListened from "./Charts/TotalTimeListened";

import records from "./records.json";

function App() {
  return (
    <>
      <header>
        <h1>Podcast Log</h1>
      </header>
      <div id="dashboard">
        <div id="dashboard-left">
        <CumulativeTime inputData={records["data"]} />

        </div>
        <div id="dashboard-right">

        <TotalTimeListened inputData={records["data"]} />
        <MinutesPerPodcast inputData={records["data"]} />
        </div>
      </div>
    </>
  );
}

export default App;
