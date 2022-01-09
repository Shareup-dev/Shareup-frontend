import React, { useState, useEffect, useContext } from 'react';
import Example from './Country';

import "./Modal.css";






function DetailsModal({setDetailsModalOpen ,setRelationshipStatus, homeTown, currentTown,relationshipStatus, setCurrentTown,setHomeTown,updateProfile, clrAboutMe}) {


  


  return (
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
                setDetailsModalOpen(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>Write Your Details</h1>
        </div>
        <div className="body d-flex flex-column align-items-start ">


            





        {/* country */}

<Example homeTown={homeTown} setHomeTown={setHomeTown} currentTown={currentTown} setCurrentTown={setCurrentTown}  />

                    <p>Relationship status?</p>

                    <select className=" mb-3 text-dark" style={{ width:'90%', height:'40px' , borderColor:'#033347'}} aria-label=".form-select-lg example" onChange={(e) => {const selectedRelationship = e.target.value;setRelationshipStatus(selectedRelationship);}}>
                    <option value={relationshipStatus? relationshipStatus :'Select relationship'} selected style={{background:'#033347', color:'white' }}>{relationshipStatus? relationshipStatus :'Select country'}</option>

                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Seperated">Seperated</option>
                    </select>



{/* country */}





{/* 
                    <p>Relationship status?</p>

                    <select className=" mb-3 text-dark" style={{ width:'90%', height:'40px' , borderColor:'#033347'}} aria-label=".form-select-lg example" onChange={(e) => {const selectedRelationship = e.target.value;setRelationshipStatus(selectedRelationship);}}>
                    <option value={relationshipStatus? relationshipStatus :'Select relationship'} selected style={{background:'#033347', color:'white' }}>{relationshipStatus? relationshipStatus :'Select country'}</option>

                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Seperated">Seperated</option>
                    </select> */}





        </div>
        <div className="footer">
          <button
            onClick={() => {
                setDetailsModalOpen(false);

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

export default DetailsModal;
