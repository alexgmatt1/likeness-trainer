import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hook.ts";
import {useNavigate} from "react-router-dom";
import './votingPage.scss'
import Slider from "rc-slider";
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import 'rc-slider/assets/index.css';
import {userService} from '../services/userService.ts'
import {setIsRegistered} from "../state/userSlice.ts";



const VotingPage = () => {

	const {username, isRegistered} = useAppSelector(state=>state.user)
	const [gender,setGender] = useState(null);
	const [age,setAge] = useState(21)
	const navigate = useNavigate()
	const dispatch = useAppDispatch()


	useEffect(() => {
		if (username == '') {
			navigate('/')
		}
	}, []
	)

	const registerUser = async () => {
		if (!age || !gender) {
			return
		}
		//const resp = await userService.registerUser({"gender":gender,"age": age, "username": username})
		await dispatch(setIsRegistered(true));
		console.log(isRegistered,"ir")
	}

	console.log(isRegistered)

	const registerDiv = () => {
		return (

			<div className = 'registerDiv'>
				<h3> Background Info </h3>
				<div className = 'registerField'>
					<h4> Gender: </h4>
					<RadioGroup onChange={ (val) => setGender(val) } horizontal>
					  <RadioButton rootColor = {'black'}  pointColor = {'green'} value="male">
					    Male
					  </RadioButton>
					  <RadioButton rootColor = {'black'}  pointColor = {'green'} value="female">
					    Female
					  </RadioButton>
					  <RadioButton rootColor = {'black'} pointColor = {'green'} value="Other">
					    Other
					  </RadioButton>
					</RadioGroup>


				</div>
				<div className = 'registerField'>
					<h4> Age: </h4>
					<Slider
					                min={0}
					                max={99}
					                step={1}
					                value={age? age : 21}
					                onChange={value => setAge(+value)}

					              />
				</div>

				<button className = 'btn_primary' onClick = {registerUser} > Confirm </button>
				
			</div>

			)
	}


	const getUserVotes = async () => {
		return
	}

	return (
		<section className = 'container votingPage'>
		{!isRegistered ?
			registerDiv() 
			: false}
		</section>
		)
}

export default VotingPage