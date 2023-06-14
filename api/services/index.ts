import { DataSource } from "typeorm";

import * as model from "../models"
import PingService from "./ping-service";
import BoardService from "./board-service";
import AuthService from "./auth-service";
import ArtistService from "./artsit-service";

class ServiceHandler {
  pingService: PingService
  boardService: BoardService
  authService: AuthService
  artistService: ArtistService

  constructor(database: DataSource) {
    this.pingService = new PingService(new model.PingDao(database))
    this.boardService = new BoardService(new model.BoardDao(database))
    this.authService = new AuthService(new model.AuthDao(database))
    this.artistService = new ArtistService(new model.ArtistDao(database))
  }
}

export {
  ServiceHandler,
  PingService,
  BoardService,
  AuthService,
  ArtistService
}