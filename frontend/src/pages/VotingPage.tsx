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
import Toggle from 'react-toggle'

const ethnicities = [
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
	const [age,setAge] = useState(null)
	const [userVotes,setUserVotes] = useState(null)
	const [votesToDo,setVotesToDo] = useState(null)
	//const [newVotes, setNewVotes] = useState(null)
	const [pairs2Votes,setPairs2Votes] = useState(null)
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



	const [genderDisabled,setGenderDisabled] = useState(false)
	const [ageDisabled,setAgeDisabled] = useState(false)
	const [countryDisabled,setCountryDisabled] = useState(false)
	const [ethnicityDisabled,setEthnicityDisabled] = useState(false)
	const [allInputError,setAllInputError] = useState(false)

	const [alreadyVoted,setAlreadyVoted] = useState(false)


	useEffect(() => {
		if (!alreadyVoted) {
			return
		}
		saveData()
		setAlreadyVoted(false)

	} , [alreadyVoted])

	

	const voteImage = (choice) => {
		console.log("vote")
		if (loading) {
			return // prevents voting happening during cooldown, e.g with key buttons
		}
		let currentPair = votesToDo[pageIdx]
		let currentVote = pairs2Votes[currentPair]
		currentVote != null && setAlreadyVoted(true)
		setNewVotes(currentPair,currentPair[choice === 'left' ? 0 : 1])
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


			let votedData = Object.entries(pairs2Votes).filter(([pair,vote]) => vote != null).map(([pair,vote]) => {

				return [vote, pair.split(',').filter(fn => fn != vote)[0]]
			})
			setSaving(true)
			const resp = userService.submitVotes(username,votedData)
			console.log("saved", votedData)
			setSavedText(true)
			setSaving(false)
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
		const allPairs = resp.images.map(triple => [triple[1],triple[2]])
		//const allPairs = [["100_1_1.png","100_1_2.png"], ["100_1_1.png","100_1_3.png"], ["100_1_2.png","100_1_3.png"]]
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
		console.log(age,gender,country,region,ethnicity)
		if (!age && !ageDisabled || !gender && !genderDisabled || !country && !countryDisabled || !region && !countryDisabled || !ethnicity && !ethnicityDisabled) {
			setAllInputError(true)
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
					{!genderDisabled &&
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
					</RadioGroup> }
					<div className = 'preferNotToSay'>
					       <Toggle
									id = 'ageToggle'
								  defaultChecked={genderDisabled}
								  onChange={()=> setGenderDisabled(!genderDisabled)} />
								<label htmlFor = 'ageToggle' >Prefer Not To Say</label>
								</div>


				</div>
				<div className = 'registerField'>
					<h4> Age: </h4>
					{!ageDisabled &&
					<Slider
					                min={0}
					                max={99}
					                step={1}
					                value={age? age : 21}
					                onChange={value => setAge(+value)}

					              />
					            }
					          <div className = 'preferNotToSay'>
					       <Toggle
									id = 'ageToggle'
								  defaultChecked={ageDisabled}
								  onChange={()=> setAgeDisabled(!ageDisabled)} />
								<label htmlFor = 'ageToggle' >Prefer Not To Say</label>
								</div>

				</div>
				<div className = 'registerField'>
				<h4> Current Address: Country and Region </h4>
				{!countryDisabled &&
					<>
				<CountryDropdown
          value={country}
          onChange={(val) => setCountry(val)} />
        <RegionDropdown
          country={country}
          value={region}
          onChange={(val) => setRegion(val)} />
          </>}
          <div className = 'preferNotToSay'>
					       <Toggle
									id = 'ageToggle'
								  defaultChecked={countryDisabled}
								  onChange={()=> {setCountryDisabled(!countryDisabled)}} />
								<label htmlFor = 'ageToggle' >Prefer Not To Say</label>
								</div>

        </div>
        <div className = 'registerField'>
        <h4> Ethnicity: </h4>
				{!ethnicityDisabled &&

				<Dropdown options={ethnicities} onChange={(eth) => setEthnicity(eth.value)} value={ethnicity} placeholder="Select an option" /> }
				 <div className = 'preferNotToSay'>
					       <Toggle
									id = 'ageToggle'
								  defaultChecked={ethnicityDisabled}
								  onChange={()=> {setEthnicityDisabled(!ethnicityDisabled)}} />
								<label htmlFor = 'ageToggle' >Prefer Not To Say</label>



        </div>
				</div>
					<div>
				<button className = 'btn_primary' onClick = {registerUser} > Confirm </button>
				{allInputError && <h4 className = 'error'> Not all fields entered. </h4>}
				</div>
				
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
		console.log(pairs2Votes,userVotes,"votes")
		if (!pairs2Votes) {
			return 0
		}

		return Object.values(pairs2Votes).filter(val => val != null).length + userVotes.length
	}

	const VotingGrid = () => {

		if (!votesToDo) {
			return
		}

		let currentPair = votesToDo[pageIdx]
		let originalId = currentPair[0].split('-')[2]
		let originalFile = process.env.PUBLIC_URL + '/assets/FairFace/' + originalId + '.jpg'
		let drawing1 = process.env.PUBLIC_URL + '/assets/1008/output/' + currentPair[0]
		let drawing2 = process.env.PUBLIC_URL + '/assets/1008/output/' + currentPair[1]

		let currentVote = pairs2Votes[currentPair]
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
				<img src = {originalFile}/>
				<h4> Original Image </h4>
				</div>
				<div className = {drawing1Style} >
				<img onClick = {()=> {voteImage("left")}} className = 'votingGrid__drawing' src = {drawing1}/>
				<h4> Drawing 1 </h4>
				</div>
				<div className = {`imgDiv ${currentVote === currentPair[1] && "drawingSelected"}`}>
				<img onClick = {()=> {voteImage("right")}}  className = 'votingGrid__drawing' src = {drawing2} />
				<h4> Drawing 2 </h4>
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
		{(pairs2Votes == null) || (votesToDo == null) || (userVotes == null) ? <></> :
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