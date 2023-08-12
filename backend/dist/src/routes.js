"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function routes(app) {
    app.get("/healthcheck", (req, res) => res.sendStatus(200));
}
exports.default = routes;
