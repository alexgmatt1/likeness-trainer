import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate ,HashRouter as Router} from "react-router-dom";
import {userService} from "./services/userService.ts"
import ImageTable from "./Components/ImageTable/ImageTable"
import Header from "./Components/Header/Header"
import LoginPage from "./pages/LoginPage.tsx"
import VotingPage from "./pages/VotingPage.tsx"
import './index.scss'

function App() {


  {/*

  const [images,setImages] = useState(null)

  useEffect(() => {
    const getImages = async () => {
  const resp = await userService.getImages()
  console.log(resp.images)
  setImages(resp.images);
}
if (!images) {
getImages()
}}
, [])
  */}


  return (
    <div className="App">

    <Header/>
    


    <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path = '/voting' element = {<VotingPage/>}/>
    </Routes>
  
    


    </div>
  );
}

export default App;
