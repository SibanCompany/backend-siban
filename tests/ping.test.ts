import request from "supertest"
import express from "express"

import App from "../app"

describe("App", () => {
  let app: express.Application
  const appInstance = new App()

  beforeAll(async () => {
    app = await appInstance.createApp()
  })

  afterAll(async () => {
    await appInstance.close()
  })

  test("ping 엔드포인트로 접속 시 pong 메시지를 반환한다.", async () => {
    const response = await request(app).get("/ping")

    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual({ pong: "pong"})
  })
})
