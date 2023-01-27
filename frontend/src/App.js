import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import {userService} from "./services/userService.ts"
import ImageTable from "./Components/ImageTable/ImageTable"

function App() {

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


  return (
    <div className="App">
    <p> hello </p>
      {images?
      <ImageTable images = {images}/>
      : <p>Loading...</p>}
      }


      
    </div>
  );
}

export default App;
