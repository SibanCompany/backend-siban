import express, { Request, Response, Router } from "express"

import * as service from "api/services"
import PingController from "./ping-controller"
import BoardController from "./board-controller"
import ArtistController from "./artist-controller"

class ControllerHandler {
  pingController: PingController
  boardController : BoardController
  artistController: ArtistController

  constructor(service: service.ServiceHandler) {
    this.pingController = new PingController(service.pingService)
    this.boardController = new BoardController(service.boardService, service.authService)
    this.artistController = new ArtistController(service.artistService)
  }

  createRoutes(): Router {
    const router: Router = express.Router()

    router.use("/ping", (req: Request, res: Response) => this.pingController.ping(req, res))
    router.use("/boards", this.boardController.createEndpoints())
    router.use("/artists", this.artistController.createEndpoints())

    return router
  }
}

export {
  ControllerHandler,
  PingController,
  BoardController
}