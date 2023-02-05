import {axiosRequest} from './request.ts'

const getImages = async () => {
  try {
    const response = await axiosRequest.post('getImages')
    return response
  } catch (error) {
    return error.response.data
  }
}


const checkRegistered = async (username) => {
  try {
    const response = await axiosRequest.post('checkRegistered', {username})
    return response
  } catch (error) {
    return error.response.data
  }
}


const recoverVotes = async (username) => {
  try {
    const response = await axiosRequest.post('recoverVotes', {username})
    return response
  } catch (error) {
    return error.response.data
  }
}


const addUser = async (username, age, gender) => {
  try {
    const response = await axiosRequest.post('addUser', {username, age, gender})
    return response
  } catch (error) {
    return error.response.data
  }
}


const submitVotes = async (username,votes) => {
  try {
    const response = await axiosRequest.post('submitVotes', {username,votes})
    return response
  } catch (error) {
    return error.response.data
  }
}

export const userService =  {getImages, checkRegistered, recoverVotes, addUser, submitVotes}