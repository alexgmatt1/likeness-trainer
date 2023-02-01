import {axiosRequest} from './request.ts'

const getImages = async () => {
  try {
    const response = await axiosRequest.post('getImages')
    return response
  } catch (error) {
    return error.response.data
  }
}


const checkRegistered = async () => {
  try {
    const response = await axiosRequest.get('checkRegistered')
    return response
  } catch (error) {
    return error.response.data
  }
}


const recoverVotes = async () => {
  try {
    const response = await axiosRequest.post('recoverVotes')
    return response
  } catch (error) {
    return error.response.data
  }
}


const addUser = async () => {
  try {
    const response = await axiosRequest.post('addUser')
    return response
  } catch (error) {
    return error.response.data
  }
}


const submitVotes = async () => {
  try {
    const response = await axiosRequest.post('submitVotes')
    return response
  } catch (error) {
    return error.response.data
  }
}

export const userService =  {getImages, checkRegistered, recoverVotes, addUser, submitVotes}