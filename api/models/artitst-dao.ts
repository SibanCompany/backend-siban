import { DataSource } from "typeorm";

export class ArtistList {
  name: string | string []

  constructor(model: Record<string, any>) {
    this.name = model["name"]
  }
}

export class Artist {
  id: number
  name: string
  email: string
  birthdate: string
  height: number
  weight: number
  profileImages: string|null[]
  socialUrl: string
  masterpieces: Record<string, object[]>

  constructor(model: Record<string, any>) {
    this.id = model["id"]
    this.name = model["name"]
    this.email = model["email"]
    this.birthdate = model["birthdate"]
    this.height = model["height"]
    this.weight = model["weight"]
    this.profileImages = model["profileImages"]
    this.socialUrl = model["socialUrl"]
    this.masterpieces = model["masterpieces"]
  }
}

export default class ArtistDao {
  constructor( private db: DataSource ) { }

  async getArtistList() {
    const [ result ] = await this.db.query(`
      SELECT
        JSON_ARRAYAGG(name) as name
      FROM
        artists
    `)

    return new ArtistList(result)
  }

  async getArtist(artistName?: string) {
    const condition = artistName ? `WHERE name = ?` : `WHERE name = '신락훈'`
    const [ result ] = await this.db.query(`
      SELECT
        a.id,
        a.name,
        a.email,
        a.birthdate,
        a.height,
        a.weight,
        a.specialty,
        ai.images AS profileImages,
        asl.url AS socialUrl,
        JSON_ARRAYAGG(mm.masterpieces) AS masterpieces
      FROM
        artists a
      LEFT JOIN artist_social_links asl ON a.id = asl.artist_id
      LEFT JOIN (
        SELECT
          artist_id AS aiArtistId,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              "id", id,
              "url", url
            )
          ) AS images
        FROM artist_images
        GROUP BY artist_id
      ) ai ON a.id = aiArtistId
      LEFT JOIN (
        SELECT
          am.artist_id AS mmArtistId,
          JSON_OBJECT (
            mc.name,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                "id", m.id,
                "title", m.title,
                "role", IFNULL(m.role, NULL),
                "period", IFNULL(m.period, NULL)
              )
            )
          )  AS masterpieces
        FROM
          artists_masterpieces am
        INNER JOIN masterpieces m ON am.masterpiece_id = m.id 
        INNER JOIN masterpiece_categories mc ON m.masterpiece_category_id = mc.id
        INNER JOIN artists a ON a.id = am.artist_id
        GROUP BY mmArtistId, mc.name
        ORDER BY m.id
      ) mm ON mmArtistId = a.id
      ${condition}
      GROUP BY a.id;
    `, [ artistName ])
    
    return new Artist(result)
  }
}