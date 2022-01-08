import React, { useState, useEffect, useContext } from 'react';

import "./Modal.css";





function AboutmeModal({ setOpenModal ,handleAboutme, updateProfile,Fvalue, clrAboutMe}) {




  return (
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
              // clrAboutMe()
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>Write about yourself</h1>
        </div>
        <div className="body d-flex flex-column align-items-start">
         
         <p>About me...</p>
            <textarea name='textf' style={{border:'1px solid #033347', borderRadius:'2%', height:'150px', fontSize:'1.2rem', fontWeight:'300'}} onChange={handleAboutme} value={Fvalue}  >

            </textarea>



        </div>
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
              // clrAboutMe()

            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button onClick={updateProfile}>Continue</button>
        </div>
      </div>
  );
}

export default AboutmeModal;
