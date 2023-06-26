console.log("Fetching data from Notion");
fetch("http://localhost:8000/")
    .then((response) => response.json())
    .then((payload) => {
        console.log("Writing data to JSON file");
        const fs = require("fs");

        const content = { data: payload };
        const json = JSON.stringify(content);

        fs.writeFile("../podcast-log-app/src/records.json", json, (err) => {
            if (err) {
                console.error(err);
            }
            console.log("File written successfully");
        });
    });
