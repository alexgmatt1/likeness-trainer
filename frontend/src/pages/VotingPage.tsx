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
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const ethncities = [
  'Indian',
'Pakistani',
'Bangladeshi',
'Chinese',
'Other Asian background', 'Carribean', 'African', 'Other Black background', 'English' , 'Welsh', 'Scottish', 'Northern Irish', 'Irish', 'Gypsy', 'Other White background', 
'Arab', 'Other ethnic group']
;



const VotingPage = () => {

	const {username, isRegistered, backgroundInfo} = useAppSelector(state=>state.user)
	const [registeredInfo, setRegisteredInfo] = useState(backgroundInfo)
	const [gender,setGender] = useState(null);
	const [age,setAge] = useState(21)
	const [userVotes,setUserVotes] = useState(null)
	const [votesToDo,setVotesToDo] = useState(null)
	//const [newVotes, setNewVotes] = useState(null)
	const [combinations2Votes,setCombinations2Votes] = useState(null)
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [pageIdx,setPageIdx] = useState(0);
	const [numCompletedVotes,setNumCompletedVotes] = useState(0)
	const inputRef = useRef(null);
	const [newUpdates, setNewUpdates] = useState(0)
	const saveRate = 5 // save every 5 votes/updates
	const [savedText,setSavedText] = useState(false)
	const [saving, setSaving] = useState(false)
	const [country, setCountry] = useState(null)
	const [region, setRegion] = useState(null)
	const [ethnicity, setEthnicity] = useState(null)
	const [loading, setLoading] = useState(true)
	const [id2pair,setId2Pair] = useState(null)

	const defaultEthnicity = ethncities[0];

	console.log("combinations2Votes",combinations2Votes)

	const voteImage = (choice) => {
		console.log("vote")
		let currentPair = votesToDo[pageIdx]
		setNewVotes(currentPair,currentPair[choice])
		setLoading(true)
		setTimeout(()=> {setPageIdx(Math.min(votesToDo.length - 1, pageIdx + 1)); setLoading(false)}, 500)
		setNewUpdates(newUpdates+1)
		if (savedText) {
			setSavedText(false)
		}
	}

	const saveData = () => {

			//if (saving) {
			//	return
			//}


			let votedData = Object.entries(combinations2Votes).filter(([id,vote]) => vote != null).map(([id,vote]) => {


				return {"chosenImage":vote, "combinationID":id}
			})
			setSaving(true)
			const resp = userService.submitVotes(username,votedData)
			console.log("saved", votedData)
			setSavedText(true)
			setSaving(false)
	}

	ArrowKeysReact.config({
      left: () => {
     
        voteImage(0)
      },
      down: () => {
      	voteImage(1)
      },
      right: () => {
      	 voteImage(2)
        
      },
      
    });

    useEffect(()=> {
	    console.log('Component Did Mount .............');
	    inputRef.current.focus();
	  } , [pageIdx])

    useEffect(() => {
    	(newUpdates > 0 && newUpdates % saveRate == 0) && saveData()}
    , [newUpdates])



	const getUserVotes = async () => {
		const resp = await userService.recoverVotes(username)
		setLoading(false)
		const votes = resp.votes
		//const votes = [["100_1_3.png","100_1_2.png"]]
		await setUserVotes(votes)
		setNumCompletedVotes(votes.length)
		console.log(numCompletedVotes,"numcompleted")
	}

	const getAllPairs = async () => {
		const resp = await userService.getImages();
		const allPairs = resp.images
		

		console.log(resp)
		//const allPairs = [["100_1_1.png","100_1_2.png"], ["100_1_1.png","100_1_3.png"], ["100_1_2.png","100_1_3.png"]]
		return allPairs

	}

	const getVotesToDo = async () => {
		const allPairs = await getAllPairs()
		//now filter allPairs by removing all already voted
		console.log("uservotes",userVotes)
		const filteredPairs = allPairs.filter((data) => {
			let id = data.slice(-1)[0]
			console.log("id",id)
			
			return userVotes.map((pair)=> pair.slice(-1)[0] === id ).some(item => item) ?
				false : true
			
		})

		let id2pairTemp = {}
		for (const row of allPairs) {
			id2pairTemp[row.slice(-1)[0]] = row.slice(0,-1)
		}
		setId2Pair(id2pairTemp)

		console.log(filteredPairs,"filteredPairs")

		await setVotesToDo(filteredPairs)
	}

	const convert2Fn = (original,artist,variant) => {
		return `Artist${artist}_Drawing${variant}_${original}.png`

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

		let combinations2VotesTemp = {}
		console.log(votesToDo,"vtd")
		votesToDo.map(pair => {
			console.log(pair.slice(-1)[0])
			combinations2VotesTemp[pair.slice(-1)[0]] = null
		})
		console.log(combinations2VotesTemp,"temp")
		setCombinations2Votes(combinations2VotesTemp)}
	, [votesToDo])

	const registerUser = async () => {
		console.log(age,gender,country,region,ethnicity)
		if (!age || !gender || !country || !region || !ethnicity) {
			return
		}
		const resp = await userService.addUser(username,age,gender, country, region, ethnicity)
		//await dispatch(setIsRegistered(true));
		setRegisteredInfo(true)
		
	}





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
				<div className = 'registerField'>
				<h4> Current Address: Country and Region </h4>
				<CountryDropdown
          value={country}
          onChange={(val) => setCountry(val)} />
        <RegionDropdown
          country={country}
          value={region}
          onChange={(val) => setRegion(val)} />
        </div>
        <div className = 'registerField'>
        <h4> Ethnicity: </h4>
				<Dropdown options={ethncities} onChange={(eth) => setEthnicity(eth.value)} value={defaultEthnicity} placeholder="Select an option" />
				</div>
				<button className = 'btn_primary' onClick = {registerUser} > Confirm </button>
				
			</div>

			)
	}

	const setNewVotes = (pair,vote) => {
		let combinations2VotesTemp = combinations2Votes
		combinations2VotesTemp[pair.slice(-1)[0]] = vote
		setCombinations2Votes({...combinations2VotesTemp})
		setNumCompletedVotes(numCompletedVotes + 1)

		console.log("combinations2VotesTemp",combinations2VotesTemp, numCompletedVotes)
	}

	const getNumCompletedVotes = () => {
		console.log(combinations2Votes,userVotes,"votes")
		if (!combinations2Votes) {
			return 0
		}

		return Object.values(combinations2Votes).filter(val => val != null).length + userVotes.length
	}

	const VotingGrid = () => {

		if (!votesToDo) {
			return
		}

		let currentPair = votesToDo[pageIdx]
		//let originalId = currentPair[0].split('_')[0]
		let sketch = process.env.PUBLIC_URL + '/assets/Drawings (1)/' + currentPair[3]
		let image1 = process.env.PUBLIC_URL + '/assets/FairFace/' + currentPair[0]
		let image2 = process.env.PUBLIC_URL + '/assets/FairFace/' + currentPair[1]
		let image3 = process.env.PUBLIC_URL + '/assets/FairFace/' + currentPair[2]

		let currentVote = combinations2Votes[currentPair.slice(-1)[0]]
		let drawing1_selected = currentVote === currentPair[0]

		console.log(`imgDiv ${drawing1_selected ? "drawingSelected" : false}`)
		let drawing1Style = `imgDiv ${drawing1_selected ? "drawingSelected" : "hello"}`

		return (
			<>
			{console.log(drawing1Style,"d1se")}
			{loading ? 
				<div className = ''>
				<img className = 'loading' src = {process.env.PUBLIC_URL + '/assets/' + 'spinner.gif'}/>
				</div> :
				<>
			<div  className = 'votingGrid'>
				<div className = 'imgDiv'>
				<img src = {sketch}/>
				<h4> Sketch </h4>
				</div>
				<div className = {`imgDiv ${currentVote === currentPair[0] && "drawingSelected"}`} >
				<img onClick = {()=> {voteImage(0)}} className = 'votingGrid__drawing' src = {image1}/>
				<h4> Image 1 </h4>
				</div>
				<div className = {`imgDiv ${currentVote === currentPair[1] && "drawingSelected"}`}>
				<img onClick = {()=> {voteImage(1)}}  className = 'votingGrid__drawing' src = {image2} />
				<h4> Image 2 </h4>
				</div>
				<div className = {`imgDiv ${currentVote === currentPair[2] && "drawingSelected"}`} >
				<img onClick = {()=> {voteImage(0)}} className = 'votingGrid__drawing' src = {image3}/>
				<h4> Image 3 </h4>
				</div>

			</div>
			<div className = 'backButtonDiv'>
			<button disabled = {!pageIdx} onClick = {()=>setPageIdx(Math.max(0, pageIdx - 1))} className = 'btn_primary'> Previous </button>
			<button disabled = {pageIdx == votesToDo.length - 1} onClick = {()=>setPageIdx(Math.min(votesToDo.length - 1, pageIdx + 1))} className = 'btn_primary'> Next </button>
			<h5> Comparison: {pageIdx+1} / {votesToDo.length} </h5>
			</div>
			</>}
			</>

			)
	}


	
	return (
		<section ref = {inputRef} {...ArrowKeysReact.events} tabIndex = "-1" className = 'container votingPage focus:outline-0'>
		{(combinations2Votes == null) || (votesToDo == null) || (userVotes == null) ? <></> :
		!registeredInfo ?
			registerDiv() 
			: 
			<>
			<div className = 'progressDiv'>
			<ProgressBar labelClassName="label" bgColor = 'lightgreen' completed={Math.round(100*getNumCompletedVotes()/(votesToDo.length + userVotes.length))} />
			<h4> Votes completed: {getNumCompletedVotes()} / {votesToDo.length + userVotes.length} </h4> 

			{savedText && <h5> Autosaved! </h5>}
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