// import React from 'react'
import React, { useState, useEffect, useContext } from 'react';
import { BiWindows } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import LocationName from './LocationName';

// import './style.css';

// const button = document.querySelector("button");
// const yb = document.querySelector(".yahoobaba");
// const dl = document.querySelector(".d-location");

{/* <script src="https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.6/platform.min.js"></script> */}

function Locationbaba() {

    const link="https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.6/platform.min.js"

    const [currentLocation, setCurrentLocation]=useState('')
function locationFunction(){
    // const button = document.querySelector("button");
// const yb = document.querySelector(".yahoobaba");
//  const dl = document.querySelector(".d-location");

    console.log("hiiiiiiiiii........");
    if(navigator.geolocation){ 
        // button.innerText = "Allow to detect location";
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        // button.innerText = "Your browser not support";
        console.log('browser does not support')
    }
   
    
}

useEffect(() => {
    const getLoc = JSON.parse(localStorage.getItem("location"));
    if(getLoc){
        setCurrentLocation(getLoc[0]);
    }
    else{
        setCurrentLocation('')
    }


  }, [])

function onSuccess(position){
    // const button = document.querySelector("button");
    // const yb = document.querySelector(".yahoobaba");
    console.log("success runnig")
    // button.innerText = "Detecting your location...";
    // dl.innerText = "Detecting your location...";
    let {latitude, longitude} = position.coords; 
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=e8d150d563724e008f468869c3282dc1`)
    .then(response => response.json()).then(response =>{
        let allDetails = response.results[0].components; 
        console.table(allDetails);
        let {city, country} = allDetails; 
        // button.innerText = `${city}, ${road}, ${country}`; 
        // button.innerText = ' '; 
        // yb.innerText = `${city}, ${road}, ${country}`; 
        //  const lc=  `${city}, ${road}, ${country}`; 
         const lc=  `${city}, ${country}`; 
        // const lc=  `${city}, ${country}`; 
            console.log("country city", lc)
            setCurrentLocation(lc)
        localStorage.setItem("location", JSON.stringify([lc]))
    }).catch(()=>{ //if error any error occured
        // button.innerText = "Something went wrong";
    });
}

function onError(error){
    if(error.code == 1){ //if user denied the request
        // button.innerText = "You denied the request";
    }else if(error.code == 2){ //if location in not available
        // button.innerText = "Location is unavailable";
    }else{ //if other error occured
        // button.innerText = "Something went wrong";
    }
    // button.setAttribute("disabled", "true"); //disbaled the button if error occured
}

function changeFunction(){

  return    currentLocation ?  <a href='#' onClick={()=>{clearLocation(); console.log('try to call again')}}>Turn Off</a> : <a onClick={locationFunction}>Turn on</a>  


}

function clearLocation(){
    localStorage.removeItem("location");
    setCurrentLocation('');
    changeFunction();
// const yb = document.querySelector(".yahoobaba");

    // yb.innerText = ' '; 

}

//CURRENT BROWSER START HERE
let userAgent = navigator.userAgent;
let browser;
if(userAgent.match(/edg/i)){
  browser ="edge";
}else if(userAgent.match(/firefox|fxios/i)){
  browser = "firefox";
}else if(userAgent.match(/opr\//i)){
  browser = "opera";
}else if(userAgent.match(/chrome|chromium|crios/i)){
  browser = "chrome";
}else if(userAgent.match(/safari/i)){
  browser = "safari";
}else{
  alert("Other browser");
}

console.log("YOUR BROWSER IS YAHOO BABA", browser)

//CURRENT BROWSER END HERE
//CURRENT operating system
var userAgent1 = window.navigator.userAgent,
platform = window.navigator.platform,
macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
iosPlatforms = ['iPhone', 'iPad', 'iPod'],
os = null;

if (macosPlatforms.indexOf(platform) !== -1) {
os = 'Mac OS';
} else if (iosPlatforms.indexOf(platform) !== -1) {
os = 'iOS';
} else if (windowsPlatforms.indexOf(platform) !== -1) {
os = 'Windows';
} else if (/Android/.test(userAgent1)) {
os = 'Android';
} else if (!os && /Linux/.test(platform)) {
os = 'Linux';
}
console.log('YOURRRRRRRRRRRRRRRRRRRR OSSSSSSSSSS', os)
//CURRENT operating system

    return (
        <>
        <div>
            {changeFunction()}

            {/* {  currentLocation ?  <a href='#' onClick={()=>{localStorage.removeItem("location")}}>Turn Off</a>:<a onClick={locationFunction}>Turn on</a>  } */}
            
    {/* <button></button> */}
            {/* <h2 className="yahoobaba"></h2> */}
        </div>

          

        {
            currentLocation ?
            <div className="" style={{position: 'absolute', left:'45%', top:'35%'}}>
              <div className="right-settings-bio-top">
                <p className="" style={{color:'black', fontWeight:'bold'}}>Where You Loged in</p>
                <div className="right-settings-details border border-dark pl-2">
                <ul>
                <li><i class="fas fa-map-marked-alt mr-1"></i><p className="secrtySec ">{currentLocation}</p></li>
               
                <li><i class={`fab fa-${browser} mr-1`}></i> <p className="secrtySec windows-baba" id='getw'>{browser} .<span className='font-weight-bold' style={{color:'#00a400'}}> Active now</span></p></li>
                { os == "Windows" ?
                <li><i className="fab fa-windows mr-1"> </i> <p className="secrtySec windows-baba" id='getw'>{os} PC</p></li>
                :
                <li><i className="fab fa-apple mr-1"> </i> <p className="secrtySec windows-baba" id='getw'>{os} PC</p></li>
        }

                

                
                
            
    
                </ul>
                </div>
               
              </div>
              </div>
              : ""
              }
              {/* <p className=" d-location"></p> */}
        </>
    )
}

export default Locationbaba;
