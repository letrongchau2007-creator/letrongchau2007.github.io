
const http = require("http");

let sensorData = {
    temperature: 0,
    humidity: 0
};

const server = http.createServer((req, res) => {

    // Cau hinh CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Xu ly OPTIONS
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // Kiem tra Server
    if (req.method === "GET" && req.url === "/health") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            status: "ok"
        }));

        return;
    }

    // ESP32 gui du lieu
    if (req.method === "POST" && req.url === "/api/sensor") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);

                // Kiem tra du lieu
                if (
                    typeof data.temperature !== "number" ||
                    typeof data.humidity !== "number" ||
                    !Number.isFinite(data.temperature) ||
                    !Number.isFinite(data.humidity)
                ) {
                    res.writeHead(400);
                    res.end("Invalid sensor data");
                    return;
                }

                // Cap nhat du lieu
                sensorData.temperature = data.temperature;
                sensorData.humidity = data.humidity;

                console.log("Sensor data:", sensorData);

                // Phan hoi ESP32
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Da nhan du lieu"
                }));

            } catch (error) {
                res.writeHead(400);
                res.end("Invalid JSON");
            }
        });

        return;
    }

    
    if (req.method === "GET" && req.url === "/api/sensor") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(sensorData));

        return;
    }

    
    res.writeHead(404);
    res.end("Not Found");

});


const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log("Server listening on port " + PORT);
});
