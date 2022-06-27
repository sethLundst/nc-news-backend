const apiRouter = require("express").Router();
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const votesRouter = require("./votesRouter");
const fs = require("fs").promises;

apiRouter
  .use("/articles", articlesRouter)
  .use("/comments", commentsRouter)
  .use("/topics", topicsRouter)
  .use("/users", usersRouter)
  .use("/votes", votesRouter);

apiRouter.get("/", async function getAPI(_req, res) {
  const data = await fs.readFile("./src/routes/endpoints.json");
  const endpoints = JSON.parse(data);
  res.status(200).send({ endpoints });
});

module.exports = apiRouter;
