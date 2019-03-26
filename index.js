const express = require("express");
const helmet = require("helmet");

const zooRoutes = require("./routers/zooRoutes");

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.get("/", (req, res) => {
  res.send("<h1>WebDB II</h1>");
});
server.use("/api/zoos", zooRoutes);

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
