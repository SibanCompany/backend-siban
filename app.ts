import 'dotenv/config'

import express from "express"
import cors from "cors"
import morgan from "morgan"
import { DataSource, DataSourceOptions } from "typeorm"

import { ServiceHandler } from "./api/services"
import { ControllerHandler } from "./api/controllers"

export default class App {
  private app: express.Application = express()
  private controllerHandler!: ControllerHandler
  private serviceHandler!: ServiceHandler
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
      process.env.DB_USERNAME,
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

    this._database = new DataSource(connectOption)
    
    return await this._database.initialize()
  }

  async createApp() {
    await this.getDBConnection()

    this.serviceHandler = new ServiceHandler(this._database)
    this.controllerHandler = new ControllerHandler(this.serviceHandler)

    this.app.use(morgan("dev"))
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(this.controllerHandler.createRoutes())
    
    return this.app
  }

  async close() {
    await this._database.destroy()
  }
}