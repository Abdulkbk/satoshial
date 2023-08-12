import { Express, Request, Response } from "express"


function routes(app: Express) {
    app.get("/api/healthcheck", (req: Request, res: Response) => res.sendStatus(404))

    app.get("/api", (req: Request, res: Response) => res.status(200).send({ message: "Api is running!" }))
}

export default routes

