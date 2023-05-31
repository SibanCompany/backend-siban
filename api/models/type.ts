enum BoardType {
  NOTICE = 1,
  COMMUNITY = 2,
  LESSON_INQUIRY = 3,
  RENTAL_SPACE_INQUIRY = 4,
}

namespace BoardType {
  export const id = (boardType?: string): number => {
    const boardTypeEnumKey = boardType
                          ? boardType.replace(/([A-Z])/g, '_$1').toUpperCase()
                          : "NOTICE"
    
    return BoardType[boardTypeEnumKey as keyof typeof BoardType] as number
  } 
}

interface User {
  id: number
  name: string,
  email: string
}

interface CreateRequestBody {
  name: string,
  email: string,
  password: string,
  title: string,
  content: string
}
interface UpdateRequestBody {
  email: string,
  password: string,
  postId: number,
  title: string,
  content: string
}
interface DeleteRequestBody {
  email: string,
  password: string,
  postId: number
}


export {
  BoardType,
  User,
  CreateRequestBody,
  UpdateRequestBody,
  DeleteRequestBody
}