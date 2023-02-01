import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	username:""
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers : {
  	setUsername: (state, { payload }) => {
  		state.username = payload
  	}
  }
})

export const {setUsername} = userSlice.actions
export const userReducer = userSlice.reducer