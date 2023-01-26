import {axiosRequest} from './request'

const fetchImages = async () => {
  try {
    const response = await axiosRequest.post('getImages')
    return response
  } catch (error) {
    return error.response.data
  }
}
