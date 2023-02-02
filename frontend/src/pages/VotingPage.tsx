import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hook.ts";
import {useNavigate} from "react-router-dom";
import './votingPage.scss'
import Slider from "rc-slider";
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import 'rc-slider/assets/index.css';
import {userService} from '../services/userService.ts'
import {setIsRegistered} from "../state/userSlice.ts";
import ProgressBar from "@ramonak/react-progress-bar";
import ArrowKeysReact from 'arrow-keys-react';



const VotingPage = () => {

	const {username, isRegistered} = useAppSelector(state=>state.user)
	const [gender,setGender] = useState(null);
	const [age,setAge] = useState(21)
	const [userVotes,setUserVotes] = useState(null)
	const [votesToDo,setVotesToDo] = useState(null)
	//const [newVotes, setNewVotes] = useState(null)
	const [pairs2Votes,setPairs2Votes] = useState(null)
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [pageIdx,setPageIdx] = useState(0);
	const [numCompletedVotes,setNumCompletedVotes] = useState(0)
	const inputRef = useRef(null);

	const voteImage = (choice) => {
		console.log("vote")
		let currentPair = votesToDo[pageIdx]
		setNewVotes(currentPair,currentPair[choice === 'left' ? 0 : 1])
		setPageIdx(Math.min(votesToDo.length - 1, pageIdx + 1))
	}

	ArrowKeysReact.config({
      left: () => {
     
        voteImage("left")
      },
      right: () => {
      	 voteImage("right")
        
      },
      
    });

    useEffect(()=> {
	    console.log('Component Did Mount .............');
	    inputRef.current.focus();
	  } , [pageIdx])



	const getUserVotes = async () => {
		//const resp = await userService.recoverVotes({"username":username})
		//const userVotes = resp.votes
		const votes = [["100_1_3.png","100_1_2.png"]]
		await setUserVotes(votes)
		setNumCompletedVotes(votes.length)
		console.log(numCompletedVotes,"numcompleted")
	}

	const getAllPairs = async () => {
		//const resp = await userService.getImages();
		const allPairs = [["100_1_1.png","100_1_2.png"], ["100_1_1.png","100_1_3.png"], ["100_1_2.png","100_1_3.png"]]
		return allPairs

	}

	const getVotesToDo = async () => {
		const allPairs = await getAllPairs()
		//now filter allPairs by removing all already voted
		const filteredPairs = allPairs.filter((data) => {
			let [image_1,image_2] = data
			
			return userVotes.map((pair)=> pair.includes(image_1) && pair.includes(image_2)).some(item => item) ?
				false : true
			
		})

		await setVotesToDo(filteredPairs)
	}

	const convert2Fn = (original,artist,variant) => {
		return `Artist${artist}_Drawing${variant}_${original}.png`

	}



	const convertVotesToFileNames = (votes) => {
		let converted = []
		return votes.map((pair) => {
			let [voted,other] = pair
			console.log(voted)
			let [original,artist,variant] = voted.split('_')
			let variant_id = variant.split('.')[0]
			let votedFilename = convert2Fn(original,artist,variant_id)
			let [original2,artist2,variant2] = other.split('_')
			variant2 = variant2.split('.')[0]
			let otherFilename = convert2Fn(original2,artist2,variant2)
			return [votedFilename,otherFilename]
		})

	}


	useEffect(() => {
		if (username == '') {
			navigate('/')
		}
		getUserVotes();
		

	}, []
	)

	useEffect(()=>{
		getVotesToDo();
		console.log(votesToDo, userVotes, "test123")
	},[userVotes])

	useEffect( () => {

		if(!votesToDo) {
			return
		}

		let pairs2VotesTemp = {}
		votesToDo.map(pair => {
			pairs2VotesTemp[pair] = null
		})
		setPairs2Votes(pairs2VotesTemp)}
	, [votesToDo])

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

	const setNewVotes = (pair,vote) => {
		let pairs2VotesTemp = pairs2Votes
		pairs2VotesTemp[pair] = vote
		setPairs2Votes({...pairs2VotesTemp})
		setNumCompletedVotes(numCompletedVotes + 1)

		console.log("pairs2VotesTemp",pairs2VotesTemp, numCompletedVotes)
	}

	const getNumCompletedVotes = () => {
		return Object.values(pairs2Votes).filter(val => val != null).length + userVotes.length
	}

	const VotingGrid = () => {

		if (!votesToDo) {
			return
		}

		let currentPair = votesToDo[pageIdx]
		let originalId = currentPair[0].split('_')[0]
		let originalFile = process.env.PUBLIC_URL + '/assets/FairFace/' + originalId + '.jpg'
		let drawing1 = process.env.PUBLIC_URL + '/assets/Drawings/' + currentPair[0]
		let drawing2 = process.env.PUBLIC_URL + '/assets/Drawings/' + currentPair[1]

		let currentVote = pairs2Votes[currentPair]
		let drawing1_selected = currentVote === currentPair[0]

		console.log(`imgDiv ${drawing1_selected ? "drawingSelected" : false}`)
		let drawing1Style = `imgDiv ${drawing1_selected ? "drawingSelected" : "hello"}`

		return (
			<>
			{console.log(drawing1Style,"d1se")}

			<div  className = 'votingGrid'>
				<div className = 'imgDiv'>
				<img src = {originalFile}/>
				<h4> Original Image </h4>
				</div>
				<div className = {drawing1Style} >
				<img onClick = {()=> {setNewVotes(currentPair,currentPair[0]); setPageIdx(Math.min(votesToDo.length - 1, pageIdx + 1))}} className = 'votingGrid__drawing' src = {drawing1}/>
				<h4> Drawing 1 </h4>
				</div>
				<div className = {`imgDiv ${currentVote === currentPair[1] && "drawingSelected"}`}>
				<img onClick = {()=> {setNewVotes(currentPair,currentPair[1]); setPageIdx(Math.min(votesToDo.length - 1, pageIdx + 1))}}  className = 'votingGrid__drawing' src = {drawing2} />
				<h4> Drawing 2 </h4>
				</div>

			</div>
			<div className = 'backButtonDiv'>
			<button disabled = {!pageIdx} onClick = {()=>setPageIdx(Math.min(votesToDo.length - 1, pageIdx - 1))} className = 'btn_primary'> Previous </button>
			<h5> Comparison: {pageIdx+1} / {votesToDo.length} </h5>
			</div>
			</>

			)
	}


	
	return (
		<section ref = {inputRef} {...ArrowKeysReact.events} tabIndex = "-1" className = 'container votingPage focus:outline-0'>
		{!isRegistered ?
			registerDiv() 
			: 
			<>
			<div className = 'progressDiv'>
			<ProgressBar labelClassName="label" bgColor = 'lightgreen' completed={Math.round(100*getNumCompletedVotes()/(votesToDo.length + userVotes.length))} />
			<h4> Votes completed: {getNumCompletedVotes()} / {votesToDo.length + userVotes.length} </h4> 
			</div>
			<h2> Select the drawing that you believe captures the most resemblance to the original image. </h2>
			<h4> Press the left arrow key to select drawing 1, and the right arrow key for drawing 2. You can also use the mouse to select. </h4>
			<h2>Comparison: {pageIdx+1} / {votesToDo.length} </h2>
			{VotingGrid()}
			</>}
		</section>
		)
}

export default VotingPage