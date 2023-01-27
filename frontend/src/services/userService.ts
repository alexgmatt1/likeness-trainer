import {axiosRequest} from './request.ts'

const getImages = async () => {
  try {
    const response = await axiosRequest.post('getImages')
    return response
  } catch (error) {
    return error.response.data
  }
}

export const userService =  {getImages}