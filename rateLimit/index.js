import http from "http";
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// import { rateLimiterFixedWindow } from "./rateLimiterFix.js";
// import { rateLimitersSliCou } from "./rateLimiterSli.js";
// import { leakyBucket } from "./leakyBucket.js";

const PORT = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "view", "index.html");

const server = http.createServer((req, res) => {
    // leakyBucket(req, res, () => {
    //     if(req.url === "/") {
    //         return res.end(JSON.stringify({
    //             data: "Hello World" 
    //         }));
    //     }
    // });
    if(req.url === "/") {
        
        fs.readFile(filePath, (err, data) => {
            if(err) {
                res.writeHead(404, {"content-type": "text/html"}); 
                return res.end("404 not found");
            }
            else {
                res.writeHead(200, {"content-type": "text/html"});
                return res.end(data);
            }
        })
    }
    else if(req.url === "/api") {
        // rate limiter test logic
    }
});

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
