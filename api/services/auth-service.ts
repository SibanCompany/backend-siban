import bcrypt from "bcrypt"

import AuthDao from "api/models/auth-dao"

export default class AuthService {
  constructor( private authDao: AuthDao ) {
    
  }

  async validateEmail(email: string) {
    const EMAIL_REGEX = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
    
    return !!EMAIL_REGEX.test(email)
  }
  
  async validatePassword(password: string) {
    const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/  

    return !!PASSWORD_REGEX.test(password)
  }

  async getUserByEmail(email: string) {
    return await this.authDao.getUserByEmail(email)
  }

  async verifyPassword(email: string, password: string) {
    const user = await this.authDao.getUserByEmail(email)
    const userPassword = user.password

    return await bcrypt.compare(password, userPassword.toString())
  } 
}