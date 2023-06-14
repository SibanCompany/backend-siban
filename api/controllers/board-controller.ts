import express, { Request, Response, Router } from "express"

import { BoardService, AuthService } from "api/services"
import {
  CreateRequestBody,
  UpdateRequestBody,
  DeleteRequestBody  
} from "../models/type"

interface GetPostsRequest extends Request {
  query: {
    boardType: string
  }
}

export default class BoardController {
  constructor(
    private boardService: BoardService,
    private authService: AuthService
  ) { }

  async getPosts(req: GetPostsRequest, res: Response) {
    const { boardType } = req.query    
    
    const result = await this.boardService.getPosts(boardType)
    return res.status(200).json({ data: result })
  }

  async getPostById(req: GetPostsRequest, res: Response) {
    try {
      const { boardType } = req.query
      const { postId } = req.params
  
      const result = await this.boardService.getPostById(boardType, parseInt(postId))
      return res.status(200).json({ data: result })
    } catch(err: any) {
      return res.status(400).json({ message: err.message })
    }
  }

  async createPost(req: GetPostsRequest, res: Response) {
    try {
      const { boardType } = req.query
      const data:CreateRequestBody = req.body

      if ( !data.title || !data.content ) throw new Error("Check your title or content")
      
      const isEmailValidated = await this.authService.validateEmail(data.email)
      const isPasswordValidated = await this.authService.validatePassword(data.password)
      if ( !isEmailValidated ) throw new Error("Invalid Email Format")
      if ( !isPasswordValidated ) throw new Error("Invalid Password Format")
        
      await this.boardService.createPost(boardType, data)
      
      return res.status(201).json({ message: "Created" })
    } catch(err: any) {
      return res.status(400).json({ message : err.message })
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const { postId } = req.params
      const { email, password, title, content }: UpdateRequestBody = req.body
      
      if ( !title && !content ) throw new Error("Nothing Changed")
  
      const isEmailValidated = await this.authService.validateEmail(email)
      const isPasswordValidated = await this.authService.validatePassword(password)
      if ( !isEmailValidated ) throw new Error("Invalid Email Format")
      if ( !isPasswordValidated ) throw new Error("Invalid Password Format")
  
      const user = await this.authService.getUserByEmail(email)
      if ( !user ) throw new Error("Not Authorized!")
      
      const isVerifiedPassword = await this.authService.verifyPassword(email, password)
      if ( !isVerifiedPassword ) throw new Error("Invalid Auth Information")

      await this.boardService.updatePost(parseInt(postId), user.id, title, content)
  
      return res.status(200).json({ message: "Updated" })
    } catch(err: any) {
      return res.status(400).json({ message: err.message })
    }
  }
  
  async deletePost(req: Request, res: Response) {
    try {
      const { postId } = req.params
      const { email, password }: DeleteRequestBody = req.body
      
      const isEmailValidated = await this.authService.validateEmail(email)
      const isPasswordValidated = await this.authService.validatePassword(password)
      if ( !isEmailValidated ) throw new Error("Invalid Email Format")
      if ( !isPasswordValidated ) throw new Error("Invalid Password Format")
  
      const user = await this.authService.getUserByEmail(email)
      if ( !user ) throw new Error("Not Authorized!")

      const isVerifiedPassword = await this.authService.verifyPassword(email, password)
      if ( !isVerifiedPassword ) throw new Error("Invalid Auth Information")

      await this.boardService.deletePost(parseInt(postId), user.id)
  
      return res.status(200).json({ message: "Deleted"})
    } catch (err: any) {
      return res.status(400).json({ message: err.message })
    }
}

  createEndpoints() {
    const router: Router = express.Router()

    router.get("/", (req: GetPostsRequest, res: Response) => this.getPosts(req, res))
    router.get("/:postId", (req: GetPostsRequest, res: Response) => this.getPostById(req, res))
    router.post("/", (req: GetPostsRequest, res: Response) => this.createPost(req, res))
    router.patch("/:postId", (req: Request, res: Response) => this.updatePost(req, res))
    router.delete("/:postId", (req: Request, res: Response) => this.deletePost(req, res))

    return router
  }
}