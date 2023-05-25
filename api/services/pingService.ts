import { Request, Response } from "express"

import { PingDao } from "api/models/pingDao"

export class PingService {
  pingDao: PingDao

  constructor(pingDao: PingDao) {
    this.pingDao = pingDao
  }

  async ping() {
    return this.pingDao.ping()
  }
}
