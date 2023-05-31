import express, { Request, Response, Router } from "express"

import * as service from "api/services"
import PingController from "./ping-controller"
import BoardController from "./board-controller"

class ControllerHandler {
  pingController: PingController
  boardController : BoardController

  constructor(service: service.ServiceHandler) {
    this.pingController = new PingController(service.pingService)
    this.boardController = new BoardController(service.boardService, service.authService)
  }

  createRoutes(): Router {
    const router: Router = express.Router()

    router.use("/ping", (req: Request, res: Response) => this.pingController.ping(req, res))
    router.use("/boards", this.boardController.createEndpoints())
    
    return router
  }
}

export {
  ControllerHandler,
  PingController,
  BoardController
}