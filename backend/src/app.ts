import express from "express"
import config from "config";
import createServer from "./utils/server";
import logger from "./utils/logger";

const port = config.get<number>("port")

const app = createServer()

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

})