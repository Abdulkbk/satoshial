import express from "express"
import config from "config";
import createServer from "./utils/server";
import logger from "./utils/logger";
import router from "./routes";

const port = config.get<number>("port")

const app = createServer()

app.use(router)

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

})