import React, { useEffect, useState, useRef } from "react";
import InputText from '../Components/InputText/InputText.tsx'
import {userService} from '../services/userService.ts'
import "./loginPage.scss"
import {useNavigate} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hook.ts";
import {setUsername, setIsRegistered, setBackgroundInfo} from "../state/userSlice.ts";

const LoginPage = () => {

	const [username, setUsernameField] = useState('')
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [isValidUsername,setIsValidUsername] = useState(true)
	const [loading,setLoading] = useState(false)

	const login = async () => {
		console.log(username)
		setLoading(true)
		const resp = await userService.checkRegistered(username);
		setLoading(false)
		const alreadyRegistered = resp.isRegistered;
		const backgroundInfo = resp.backgroundInfo

		const valid = alreadyRegistered;
		setIsValidUsername(valid);
		await dispatch(setIsRegistered(valid));
		await dispatch(setBackgroundInfo(backgroundInfo))


		if (!valid) {
			return
		}

		dispatch(setUsername(username));

		navigate('/voting');
	}

	const verifyUsername = () => {
		return true
	}

	console.log("username",username)

	return(
		<>
		<section className = 'container loginDiv'>
			<h1> Likeness Trainer </h1>
			{loading ? <img className = 'loading' src = {process.env.PUBLIC_URL + '/assets/' + 'spinner.gif'}/>
			:
			<>
			<h4> Please enter your access code </h4>
			<div className = 'inputDiv'>
			<InputText value = {username} setValue = {(e)=>setUsernameField(e.target.value)}/>
			</div>
			{!isValidUsername && <h4 className = 'error'> Access code does not exist! Please try again or get in contact </h4>}
			<div className = 'loginButton'>
				<button className = 'btn_primary' onClick = {()=> login()}> Log in </button>
			</div>
			</>}

		</section>
		</>
		

		)

}

export default LoginPage