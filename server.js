const express = require("express");
const server = express();
const helmet = require("helmet")
const ProjectRouter = require('./data/routers/ProjectRouter');
const ActionRouter = require('./data/routers/ActionRouter');

server.use(express.json());
server.use(helmet());
server.use("/api/project", ProjectRouter);
server.use("/api/action", ActionRouter);



server.get("/", (req, res) => {
  res.status(200).json({api: "Up", message: "Hello World"})
})



module.exports = server;