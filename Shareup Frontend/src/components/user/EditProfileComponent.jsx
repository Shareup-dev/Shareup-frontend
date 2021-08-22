import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import AuthService from '../../services/auth.services';
import SimpleReactLightbox from 'simple-react-lightbox'
import { testScript } from '../../js/script';

import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import Layout from '../LayoutComponent';

export default function EditProfileComponent() {
  let history = useHistory();
  const [DescribeYourself, setDescribeYourself] = useState("")
  const { user } = useContext(UserContext)
  const handleDescribeYourself = (event) => { setDescribeYourself(event.target.value) }
  const [temp, setTemp] = useState("")
  const [profilePicture, setProfilePicture] = useState(null)
  const [profileRender, setProfileRender] = useState(null)
  const [showProfilePicture, setShowProfilePicture] = useState(false)
  const [userProfile, setUserProfile] = useState([])
  const [refresh, setRefresh] = useState(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [aboutme, setAboutme] = useState("")
  const [job, setJob] = useState("")
  const [homeTown, setHomeTown] = useState("")
  const [gender, setGender] = useState("")
  const [currentTown, setCurrentTown] = useState("")
  const [relationshipStatus, setRelationshipStatus] = useState("")
  const [interests, setInterests] = useState("")

  const [show, setShow] = useState('overview')
  const handleProfileImage = (event) => {
    let validated = false
    setProfilePicture(event.target.files[0])
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileRender(reader.result)
      }
    }
    reader.readAsDataURL(event.target.files[0])
    setShowProfilePicture(true)
  }
  const currentUserGet = async () => {
    await UserService.getUserByEmail(AuthService.getCurrentUser().username).then(res => {
      console.log(JSON.stringify(res.data))
      setUserProfile(res.data)
      setFirstName(res.data.firstName)
      setLastName(res.data.lastName)
      setEmail(res.data.email)
      setRole(res.data.role)
      setAboutme(res.data.aboutme)
      setJob(res.data.job)
      setHomeTown(res.data.hometown)
      setGender(res.data.gender)
      setCurrentTown(res.data.currenttown)
      setRelationshipStatus(res.data.relationshipstatus)
      setInterests(res.data.interests)
      //
      

    })
  }
  const updateProfile = async () => {
    let updateduser = {
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      aboutme: aboutme,
      job: job,
      gender:gender,
      hometown: homeTown,
      currenttown:currentTown,
      relationshipstatus: relationshipStatus,
      interests: interests,

    }
    UserService.editProfile(user.email, updateduser).then(res => {
      setUserProfile(res.data)
    })
  }
  const handleAboutme = (event) => { setAboutme(event.target.value) }
  const handleHomeTown = (event) => { setHomeTown(event.target.value) }
  const handleCurrentTown = (event) => { setCurrentTown(event.target.value) }
  const handleRelationshipStatus = (event) => { setRelationshipStatus(event.target.value) }
  const handleInterests = (event) => { setInterests(event.target.value) }
  const handleGender = (event) => { setGender(event.target.value) }

  const uploadProfilePicture = async () => {
    if (profilePicture === "") {
      console.log("cant be null")
      return
    }
    const formData = new FormData();
    formData.append('profilePicture', profilePicture)
    await UserService.uploadProfilePicture(user.email, formData).then(res => {
      window.location.reload();
    })
  }
  useEffect(() => {
    currentUserGet()
    

  }, [refresh])



  const changeView = () => {
    if (show === 'overview') {
      return (
        <div className="right-edit-profile">
          <div className="right-edit-profile-content">
            <div className="right-edit-profile-image">
            <label className="fileContainer ">
                     
                     <div className="add-prof mrgnFileCntnrEdtProf" >
                     +
       </div>
                       <input id="file-input" type="file" name="profile_image" accept="image/*" onChange={handleProfileImage}></input>

                     </label>
                     
            {
                        showProfilePicture ?
                          <><img id="preview profprvw"  src={profileRender} /><div><a style={{fontWeight:'bold'}}href="#!" id="submit" name="submit"  onClick={uploadProfilePicture}>Upload</a></div> </> :
                          <> <img src={userProfile.profilePicturePath ? userProfile.profilePicturePath: "	http://192.168.100.2:3000/data/user/default/profile_picture/default.png"}></img> </>
                      }
                     

                        {/* <form className="edit-phto"> */}
                        
                          {/* <i className="fa fa-camera-retro"></i> */}
                          
                        {/* </form> */}
            </div>
            <div className="right-edit-profile-bio">
              <div className="right-edit-profile-bio-top">
                <p>Bio</p>
                <p><a href="#" className="text-color" onClick={updateProfile}>Save</a></p>
              </div>
              <div className="right-edit-profile-bio-after">
            
                <input type="text" className="inpt" id="DescribeYourself" placeholder="DescribeYourself" value={aboutme} onChange={handleAboutme}
                    />
              </div>
            </div>
            <div className="right-edit-profile-bio">
              <div className="right-edit-profile-bio-top">
                <p>Details</p>
                <p><a href="#" className="text-color" onClick={updateProfile}>Save</a></p>
              </div>
              <div className="right-edit-profile-details">
                <ul>
                {/* <span className="text-color-2">Current town / city</span> */}
                  <li><p><i className="las la-home" aria-hidden="true" /> <input type="text" className="inpt" id="DescribeYourself" placeholder="Current town/City" value={currentTown} onChange={handleCurrentTown}></input></p></li>
                  {/* <input type="text" className="inpt" id="Current town/city" placeholder="Current town/city" */}
                  {/* <span className="text-color-2">Home town</span> */}
                  <li><p><i class="las la-map-marker"></i><input type="text" className="inpt" id="DescribeYourself" placeholder="Home town" value={homeTown} onChange={handleHomeTown}></input></p></li>
                  {/* <span className="text-color-2">Relationship status</span> */}
                  <li><p><i class="lab la-gratipay"></i> <input type="text" className="inpt" id="DescribeYourself" placeholder="Relationship status" value={relationshipStatus} onChange={handleRelationshipStatus}></input></p></li>
                </ul>
              </div>
            </div>
            <div className="right-edit-profile-bio">
              <div className="right-edit-profile-bio-top">
                <p>Hobbies</p>
                <p><a href="#" className="text-color" onClick={updateProfile}>Save</a></p>
              </div>
              <div className="right-edit-profile-details">
                <div className="right-edit-profile-bio-after">
                <input type="text" className="inpt" id="DescribeYourself" placeholder="Add Your Hobbies" value={interests} onChange={handleInterests}></input>
                  {/* <p><span className="text-color-2">Add your hobbies...</span></p> */}
                </div>
              </div>
            </div>
            <div className="right-edit-more-details">
              <p><span className="text-color">Switch to Professional account</span></p>
            </div>
            <div className="right-edit-more-details">
              <p><span className="text-color">Professional information settings</span></p>
            </div>
          </div>
        </div>
      )
    }
    if (show === "personal information") {
      return (
        <div className="right-edit-profile">
          <div className="right-edit-profile-content">
            <div className="right-edit-personal-information-top">
              <h1>Personal information</h1>
            </div>
            <div className="right-edit-personal-information">
              <p>Provide your Personal information, even if the account is used for a bussiness ,
                a pet or something else. This wont be part of your public profile</p>
                <div className="right-edit-profile-details padding">
              <ul>
                <li>
                  <div style={{flex:1, textAlign: 'left'}}><p>Email Address</p></div>
                  <div className="right-edit-details-input">{userProfile.email}</div>
                </li>
                <li>
                  <div style={{flex:1, textAlign: 'left'}}><p>Phone Number</p></div>
                  <div className="right-edit-details-input"><input type="text" /></div>
                </li>
                <li>
                <div style={{flex:1, textAlign: 'left'}}><p>Gender</p></div>
                <div className="right-edit-details-input"><input type="text" value={gender} onChange={handleGender} /></div>
                </li>
                <li>
                <div style={{flex:1, textAlign: 'left'}}><p>Date of Birth</p></div>
                <div className="right-edit-details-input"><input type="text" /></div>
                </li>
              </ul>
              
            </div>
           <div style={{textAlign:'center',padding:'5px'}}> <a href="#" className="text-color" onClick={updateProfile}>Save</a></div>
            </div>
          </div>
        </div>
      )
    }
    if (show === "your details") {
      return (
        <div className="right-edit-profile">
          <div className="right-edit-profile-content">
            <div className="right-edit-personal-information-top">
              <h1>Your Details</h1>
            </div>
            <div className="right-edit-profile-details padding">
              <ul>
                <li>
                  <div style={{flex:1, textAlign: 'left'}}><p><i className="las la-home" aria-hidden="true" /><span className="text-color-2">Current town / city</span></p></div>
                  <div className="right-edit-details-input"><input type="text" value={currentTown} onChange={handleCurrentTown}/></div>
                </li>
                <li>
                  <div style={{flex:1, textAlign: 'left'}}><p><i class="las la-map-marker"></i><span className="text-color-2">Home town</span></p></div>
                  <div className="right-edit-details-input"><input type="text"  value={homeTown} onChange={handleHomeTown}/></div>
                </li>
                <li>
                <div style={{flex:1, textAlign: 'left'}}><p><i class="lab la-gratipay"></i><span className="text-color-2">Relationship status</span></p></div>
                <div className="right-edit-details-input"><input type="text" value={relationshipStatus} onChange={handleRelationshipStatus}/></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
    if (show === "basic contact info") {
      return (
        <div className="right-edit-profile">
          <div className="right-edit-profile-content">
            <div className="right-edit-personal-information-top">
              <h1>Basic Contact Info</h1>
            </div>
            <div className="right-edit-profile-details padding">
              <ul>
              <li>
                  <div style={{flex:1, textAlign: 'left'}}><p>Email Address</p></div>
                  <div className="right-edit-details-input">{userProfile.email}</div>
                </li>
                <li>
                  <div style={{flex:1, textAlign: 'left',lineHeight: '2'}}><p>Phone Number</p></div>
                  <div className="right-edit-details-input"><input type="text" /></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
    return (<div className="right-edit-profile"></div>)
  }
  return (
    <>
      <ShareupInsideHeaderComponent />
      <div className="central-edit-profile">
        <div className="left-edit-profile">
          <div>
            <h1>Edit Profile</h1>
            {
              show === "overview" ? <div className="edit-profile-list active" onClick={() => setShow('overview')}><p>Overview</p></div> : <div className="edit-profile-list" onClick={() => setShow('overview')}><p>Overview</p></div>
            }
            {
              show === "personal information" ? <div className="edit-profile-list active" onClick={() => setShow('personal information')}><p>Personal Information</p></div> : <div className="edit-profile-list" onClick={() => setShow('personal information')}><p>Personal Information</p></div>
            }
            {
              show === "your details" ? <div className="edit-profile-list active" onClick={() => setShow('your details')}><p>Your Details</p></div> : <div className="edit-profile-list" onClick={() => setShow('your details')}><p>Your Details</p></div>
            }
            {
              show === "basic contact info" ? <div className="edit-profile-list active" onClick={() => setShow('basic contact info')}><p>Basic Contact Info</p></div> : <div className="edit-profile-list" onClick={() => setShow('basic contact info')}><p>Basic Contact Info</p></div>
            }

          </div>
        </div>
        {
          changeView()
        }
      </div>
    </>
  );
}