import { Request, Response } from "express"

import { ArtistDao } from "api/models"

export default class ArtistService {
  constructor(private artistDao: ArtistDao) { }

  async getArtist(artistName?: string) {
    const artist = await this.artistDao.getArtist(artistName)
    const artistList = await this.artistDao.getArtistList()

    const response = {
      artistList: artistList,
      artist: artist
    }
    return response
  }
}
