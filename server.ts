import "dotenv/config"
import express, {
  Express,
  Request,
  Response,
  NextFunction
} from 'express'

import App from "./app"

const startServer = async () => {
  const port: number = (process.env.PORT! || 8080) as number
  const app: App = new App()

  const initializeDB = await app.getDBConnection()
  const initializeApp = await app.createApp()
  
  const errorHandler  = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    
    res.status(500).send("Error: " + err.message)
  }

  initializeDB.initialize()
    .then(() => {
      console.log("Initialized Database Succesfully")
    })
    .catch(err => {
      console.error("Failed to connecting Database " + err )
    })

  initializeApp.listen(port, () => {
    console.log(`Listening to port :: ${port}`)
  })

}

startServer()