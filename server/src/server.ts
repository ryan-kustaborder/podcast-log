require("dotenv").config();
import http from "http";
import { Client } from "@notionhq/client";

interface Episode {
    podcast: string;
    date: string;
    length: number;
    episode: string;
}

// Get Sectets
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const notionSecret = process.env.NOTION_SECRET;

if (!notionDatabaseId || !notionSecret) {
    throw Error("Must define NOTION_SECRET and NOTION_DATABASE_ID in env");
}

// Create Notion client
const notion = new Client({
    auth: notionSecret,
});

// Define our hosting constants
const host = "localhost";
const port = 8000;

// Define server routes
const server = http.createServer(async (req, res) => {
    console.log("Received request");
    res.setHeader("Access-Control-Allow-Origin", "*");

    switch (req.url) {
        // Default query
        case "/":
            let query;
            let cursor;
            let allResults: any[] = [];

            let index = 0;
            do {
                console.log("Fetching page " + index);
                // Query the database and wait for the result
                if (cursor) {
                    query = await notion.databases.query({
                        database_id: notionDatabaseId,
                        start_cursor: cursor,
                    });
                } else {
                    query = await notion.databases.query({
                        database_id: notionDatabaseId,
                    });
                }

                allResults = allResults.concat(query.results);

                cursor = query.next_cursor;
            } while (query.next_cursor);

            console.log("Collected all pages");

            const list: Episode[] = allResults.map((row) => {
                const podcastCell = row.properties["Podcast"];
                const dateCell = row.properties["Date Listened"];
                const lengthCell = row.properties["Length"];
                const episodeCell = row.properties["Episode #"];

                // Verify the types are correct
                const isPodcast = podcastCell.type === "select";
                const isDate = dateCell.type === "date";
                const isLength = lengthCell.type === "number";
                const isEpisode = episodeCell.type === "title";

                if (isPodcast && isDate && isLength && isEpisode) {
                    let podcast = podcastCell.select?.name as string;
                    let date = dateCell.date?.start as string;
                    let length = lengthCell.number as number;
                    let episode = dateCell.episode as string;

                    return { podcast, date, length, episode };
                }

                // Return empty if error
                return {
                    podcast: "none",
                    date: "none",
                    length: 0,
                    episode: "none",
                };
            });

            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.end(JSON.stringify(list));
            break;

        default:
            res.setHeader("Content-Type", "application/json");
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Resource not found" }));
    }
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
