import React, { useState, useEffect, useContext } from 'react';

import "./Modal.css";





function HobiesModal({ setHobiesModalOpen , updateProfile,interests, setInterest,clrAboutMe}) {
    // const [interests, setInterests]=useState([])


  return (
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setHobiesModalOpen(false);
            //   clrAboutMe()
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>Update Your relationship! </h1>


        </div>
        <div className="body d-flex flex-column align-items-start">
        <p>Relationship status?</p>

                    <select className=" mb-3 text-dark" style={{width:'90%', height:'40px', borderColor:'#033347'}} aria-label=".form-select-lg example"  onChange={(e) =>
                        {const selectedInterest = e.target.value;
                            setInterest(selectedInterest);
                            console.log("SET HOME TOWN WORKING", interests)
                        
                        }}>
                            {interests ? 
                    <option selected value={interests}>{interests}</option>
                    :

                    <option selected>Select interest</option>

                            
                        }
                    <option value="Listening Music">Listening Music</option>
                    <option value="Travelling">Travelling</option>
                    <option value="Reading Books">Reading Books</option>
                    <option value="Videos Game">Video Games</option>
                    <option value="Watching Movies">Watching Movies</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Driving">Driving</option>


                 
                    </select> 

{/* <textarea style={{border:'1px solid blue', borderRadius:'2%', height:'120px', fontSize:'12px'}} ></textarea> */}





        </div>
        <div className="footer">
          <button
            onClick={() => {
              setHobiesModalOpen(false);
            //   clrAboutMe()

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

export default HobiesModal;
