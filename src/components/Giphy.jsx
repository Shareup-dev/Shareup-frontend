import React, {  useEffect, useState } from 'react';
// import Giphy from "./Giphy";
import axios from "axios";





const Giphy = () => { 

const [data, setData]= useState([])
  
    useEffect(() => {
        const fetchData = async () => {
            const results =await axios( "https://api.giphy.com/v1/gifs/trending",
                {
                    params: {
                        api_key:"wSh4lI2wrKhHzWZiEqB7gkYNGBA1vLz5"
                    }
                }
                );
                console.log(results);
                setData(results.data.data);

        };
        fetchData()
    },[]);



const renderGifs =() =>{

    return data.map(el =>{
        return (
        <div 
         key={el.id} className="giphy" >
            <img src={el.images.fixed_height.url}/>
        </div>
        )
    })
}



return<div >{renderGifs()}</div>

};
export default Giphy;


