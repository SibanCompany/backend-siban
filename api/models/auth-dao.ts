import { DataSource } from "typeorm";

export class User {
  id: number
  name: string
  email: string
  password: string
  
  constructor( model: Record<string, any> ) {
    this.id = model["id"]
    this.name = model["name"]
    this.email = model["email"]
    this.password = model["password"]
  }
}

export default class AuthDao {
  constructor( private db: DataSource ) { }

  async getUserByEmail(email: string): Promise<User> {
    const [result] = await this.db.query(`
      SELECT
        id,
        name,
        email,
        password
      FROM users
      WHERE email = ?
    `, [ email ])

    return new User(result)
  }
}