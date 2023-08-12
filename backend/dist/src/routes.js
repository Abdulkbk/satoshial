"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function routes(app) {
    app.get("/healthcheck", (req, res) => res.sendStatus(404));
    app.get("/", (req, res) => res.status(200).send({ message: "Api is running!" }));
}
exports.default = routes;
