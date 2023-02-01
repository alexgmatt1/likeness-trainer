import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	username:"",
	isRegistered: false
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
  	}
  }
})

export const {setUsername, setIsRegistered} = userSlice.actions
export const userReducer = userSlice.reducer