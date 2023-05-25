import { Request, Response } from "express"

import PingDao from "api/models/pingDao"

export default class PingService {
  constructor(private pingDao: PingDao) { }

  async ping() {
    return this.pingDao.ping()
  }
}
