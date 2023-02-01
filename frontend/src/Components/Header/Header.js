import React, { useEffect, useState, useRef } from "react";
import './header.scss'

import {useAppSelector} from '../../hook.ts'

const Header = () => {

	const {username} = useAppSelector(state => state.user);
	console.log(username)

	return (
		<header className = 'container header'>
			<div>
			<h4> {username ? "Logged in: " + username : ''} </h4>
			</div>
			<div>
			<h2> Likeness Trainer </h2>
			</div>
			<div className = 'header__logos'>
				<img className = 'header__logoImage' src = {process.env.PUBLIC_URL + '/assets/' + 'microsoft_logo.png'}/>
				<img className = 'header__logoImage' src = {process.env.PUBLIC_URL + '/assets/' + 'cambridge_logo.png'} />
			</div>
		</header>
		)
	
}

export default Header