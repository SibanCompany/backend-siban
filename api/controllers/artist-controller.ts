import express, { Request, Response, Router } from "express"

import { ArtistService } from "api/services"

interface GetAritstRequset extends Request {
  query: {
    artistName?: string
  }
}

export default class ArtistController {
  constructor(private artistService: ArtistService) { }

  async getArtist(req: GetAritstRequset, res: Response) {
    const { artistName } = req.query

    const response = await this.artistService.getArtist(artistName)
    return res.status(200).json({ data: response })
  }


  createEndpoints() {
    const router: Router = express.Router()

    router.get("/", (req: GetAritstRequset, res: Response) => this.getArtist(req, res))

    return router
  }
}