import { DataSource } from "typeorm"
import bcrpyt from "bcrypt"

import { BoardType, CreateRequestBody, User } from "./type"

export class AllBoards {
  id: number
  title: string
  boardType: BoardType
  createdAt: Date
  updatedAt: Date
  user: User
  
  constructor(model: Record<string, any>){
    this.id = model["id"]
    this.title = model["title"]
    this.boardType = model["board_type"]
    this.createdAt = model["created_at"]
    this.updatedAt = model["deleted_at"]
    this.user = model["user"]
  }
}

export class Board extends AllBoards {
  content: string

  constructor(model: Record<string, any>){
    super(model)
    this.content = model["content"]
  }
}

export default class BoardDao {
  constructor(private db: DataSource) { }

  async getPosts(boardType?: string): Promise<AllBoards> {
    const boardTypeId: number = BoardType.id(boardType)

    const result = await this.db.query(`
      SELECT
        b.id,
        b.title,
        bt.name as board_type,
        b.created_at,
        b.updated_at,
        JSON_OBJECT(
          "id", u.id,
          "name", u.name,
          "email", u.email
        ) as user
      FROM boards b
      INNER JOIN users u ON b.user_id = u.id
      INNER JOIN board_types bt ON bt.id = b.board_type_id
      WHERE b.board_type_id = ? AND b.deleted_at IS NULL
      GROUP BY b.id
      ORDER BY b.created_at DESC;
    `, [ boardTypeId ])

    return result.length > 0
          ? result.map((model: Record<string, any>) => new AllBoards(model))
          : []
  }

  async getPostById(postId: number, boardType?: string): Promise<Board> {
    try {
      const boardTypeId: number = BoardType.id(boardType)

      const [ result ] = await this.db.query(`
        SELECT
          b.id,
          b.title,
          b.content,
          bt.name as board_type,
          b.created_at,
          b.updated_at,
          b.deleted_at,
          JSON_OBJECT(
            "id", u.id,
            "name", u.name,
            "email", u.email
          ) as user
        FROM boards b
        INNER JOIN users u ON b.user_id = u.id
        INNER JOIN board_types bt ON bt.id = b.board_type_id
        WHERE bt.id = ? AND b.id = ?
      `, [ boardTypeId, postId ])

      if (!result) throw new Error("Post Not Found")

      return new Board(result)
    } catch(err: any) {
      console.log(err)
      throw new Error(err.message)
    }
  }
  
  async createPost(data: CreateRequestBody, boardType?: string) {
    const { name, email, password, title, content, hashedPassword } = data

    const boardTypeId: number = BoardType.id(boardType)

    const queryRunner = this.db.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    
    try {
      const userTypeId:number  = 2

      const [res] = await queryRunner.query(`
        SELECT
          id,
          email,
          password
        FROM users WHERE email = ?
      `, [ email ])

      const isPasswordCheck = await bcrpyt.compare(password, res.password.toString())
      if ( !isPasswordCheck ) throw new Error("이미 존재하는 이메일 정보입니다. 비밀번호를 확인해주세요.")      

      const createdUser = await queryRunner.query(`
        INSERT INTO users (
          name,
          email,
          password,
          user_type_id
        ) VALUES (
          ?,
          ?,
          ?,
          ?
        )
      `, [ name, email, hashedPassword, userTypeId])

      const userId: number = createdUser.insertId

      await queryRunner.query(`
        INSERT INTO boards (
          title,
          content,
          user_id,
          board_type_id
        ) VALUES (
          ?,
          ?,
          ?,
          ?
        )
      `, [ title, content, userId, boardTypeId ])

      return await queryRunner.commitTransaction()
    } catch(err: any) {
      await queryRunner.rollbackTransaction()
      throw new Error(err.message)
    } finally {
      await queryRunner.release()
    }
  }

  async updatePost(postId: number, userId: number, title: string, content: string) {
    return await this.db.query(`
      UPDATE
        boards
      SET
        title = ?,
        content = ?
      WHERE
        id = ? AND user_id = ?
    `, [title, content, postId, userId])
  }
  
  async deletePost(postId: number, userId: number) {
    const result = await this.db.query(`
      UPDATE
        boards
      SET
        deleted_at = NOW()
      WHERE
        id = ? AND user_id = ?
    `, [postId, userId])
    
    if ( !result.affectedRows ) throw new Error("Invalid Post")

    return result
  }
}
