import express, { Request, Response, Router } from "express"

import * as service from "api/services"
import PingController from "./pingController"

class ControllerHandler {
  pingController: PingController
  
  constructor(service: service.ServiceHandler) {
    this.pingController = new PingController(service.pingService)
  }

  createRoutes(): Router {
    const router: Router = express.Router()

    router.use("/ping", (req: Request, res: Response) => this.pingController.ping(req, res))

    return router
  }
}

export {
  ControllerHandler,
  PingController
}