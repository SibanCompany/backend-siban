import { DataSource } from "typeorm"

export class Ping {
  constructor( private pong: string ) { }
}

export default class PingDao {
  constructor(db: DataSource) { }

  async ping() {
    return new Ping("pong")
  }
}
