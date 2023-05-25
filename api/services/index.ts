import { DataSource } from "typeorm";

import * as model from "../models"
import PingService from "./ping-service";

class ServiceHandler {
  pingService: PingService
  
  constructor(database: DataSource) {
    this.pingService = new PingService(new model.PingDao(database))
  }
}

export {
  ServiceHandler,
  PingService
}