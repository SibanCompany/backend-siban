import bcrypt from "bcrypt"

import { BoardDao } from "api/models";
import { CreateRequestBody } from "../models/type"

export default class BoardService {
  constructor( private boardDao: BoardDao ) { }

  private async maskEmail(email: string): Promise<string> {
    const maskedEmail = email.replace(
      /^(.{3})(.*)(@.*)$/,
      (whole: string, firstChars: string, secondChars: string, domain: string): string => {
      const maskedChars = '*'.repeat(secondChars.length)
      return firstChars + maskedChars + domain
    })
    
    return maskedEmail
  }
  
  async getPosts(boardType?: string) {
    return this.boardDao.getPosts(boardType)
  }

  async getPostById(postId: number, boardType?: string) {
    const response = await this.boardDao.getPostById(postId, boardType)
    const { email } = response.user
      
    response.user.email = await this.maskEmail(email)
    return response
  }
  
  async createPost(data: CreateRequestBody, boardType?: string) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    data.hashedPassword = hashedPassword

    return await this.boardDao.createPost(data, boardType)
  }

  async updatePost(postId: number, userId: number, title: string, content: string) {
    return this.boardDao.updatePost(postId, userId, title, content)
  }
  async deletePost(postId: number, userId: number) {
    return this.boardDao.deletePost(postId, userId)
  }
}
