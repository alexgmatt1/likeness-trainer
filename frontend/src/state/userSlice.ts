import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	username:"",
	isRegistered: false,
  backgroundInfo: false,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers : {
  	setUsername: (state, { payload }) => {
  		state.username = payload
  	},
  	setIsRegistered : (state, {payload}) => {
  		state.isRegistered = payload
  	},
    setBackgroundInfo: (state, {payload}) => {
      state.backgroundInfo = payload
  }
}})

export const {setUsername, setIsRegistered, setBackgroundInfo} = userSlice.actions
export const userReducer = userSlice.reducer