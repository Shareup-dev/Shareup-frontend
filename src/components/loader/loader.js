import React, { useState, useEffect, useContext } from 'react';
// import Logo from '../../../assets/images/Mainlogo.png'

export default function Loader() {
    return(
        <div className='loader'>
            <div className='loader-img'>

                <img src='../assets/images/Mainlogo.png' width="100px"/>
            </div>
        </div>
    )
}