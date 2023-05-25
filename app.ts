import 'dotenv/config'
import express from "express"
import cors from "cors"
import morgan from "morgan"
import {
  DataSource,
  DataSourceOptions
} from "typeorm"

export default class App {
  private app: express.Application = express()
  private _database!: DataSource

  async getDBConnection() {
    const [
      DB_HOST,
      DB_PORT,
      DB_USERNAME,
      DB_PASSWORD,
      DB_NAME
    ] = [
      process.env.HOST,
      process.env.DB_PORT!,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      process.env.DB_NAME,
    ]
    
    const connectOption = {
      type     : "mysql",
      host     : DB_HOST,
      port     : parseInt(DB_PORT),
      username : DB_USERNAME,
      password : DB_PASSWORD,
      database : DB_NAME
    } as DataSourceOptions

    return new DataSource(connectOption)
  }
  
  async createApp() {
    this.app.use(cors())
    this.app.use(morgan("dev"))
    this.app.use(express.json())
    
    return this.app
  } 
}