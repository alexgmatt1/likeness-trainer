import axios from "axios";
import CONFIG from "app/config"

//axios.defaults.withCredentials = true


const API_URL = CONFIG['backend']

const axiosRequestFunc = () => {
  const instance = axios.create({
    baseURL: API_URL,
  })

  // NO TOKENS NEEDED
  // instance.interceptors.request.use(config => {
  //   const tokens = JSON.parse(localStorage.getItem('tokens'))
  //   if (tokens) {
  //     config.headers.Authorization = `Bearer ${tokens.accessToken}`
  //   }
  //   return config
  // })

  instance.interceptors.response.use(response => response.data)

  return instance
}



const axiosRequest = axiosRequestFunc();


export {axiosRequest}

