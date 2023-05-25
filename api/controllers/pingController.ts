import { Request, Response } from "express"

import { PingService } from "api/services/pingService"

export class PingController {
  pingService: PingService

  constructor(service: PingService) {
    this.pingService = service
  }

  async ping(req: Request, res: Response) {
    const response = await this.pingService.ping()
    return res.status(200).json({ message: response})
  }

}