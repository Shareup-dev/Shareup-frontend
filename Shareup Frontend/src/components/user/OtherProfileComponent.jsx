import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory, useParams } from "react-router-dom";
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import Layout from '../LayoutComponent';
import { testScript } from '../../js/script';
import FriendsService from '../../services/FriendService';
import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import PostComponent from '../post/PostComponent';
import PostService from '../../services/PostService';
import PostProfileComponent from '../Profile/PostProfileComponent';
import FriendProfileComponent from '../Profile/FriendProfileComponent';


function OtherProfileComponent() {
    const { email: user_email } = useParams();
    console.log(user_email + " HEEHAHEAHEAH")
    let history = useHistory();

    const { user } = useContext(UserContext)

    const [temp, setTemp] = useState("")
    const [profilePicture, setProfilePicture] = useState(null)
    const [profileRender, setProfileRender] = useState(null)
    const [showProfilePicture, setShowProfilePicture] = useState(false)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [aboutme, setAboutme] = useState("")
    const [job, setJob] = useState("")
    const [homeTown, setHomeTown] = useState("")
    const [relationshipStatus, setRelationshipStatus] = useState("")
    const [interests, setInterests] = useState("")

    const [friendsList, setFriendsList] = useState([]);
	const [following, setFollowing] = useState([]);
	const [followers, setFollowers] = useState([]);

  const [userPost, setUserPost] = useState([]);
  const [refresh, setRefresh] = useState(null)
  const [show, setShow] = useState("timeline")

  const [myPost, setMyPost] = useState([]);

  const handleFirstName = (event) => { setFirstName(event.target.value) }
  const handleLastName = (event) => { setLastName(event.target.value) }
  const handleAboutme = (event) => { setAboutme(event.target.value) }
  const handleJob = (event) => { setJob(event.target.value) }
  const handleHomeTown = (event) => { setHomeTown(event.target.value) }
  const handleRelationshipStatus = (event) => { setRelationshipStatus(event.target.value) }
  const handleInterests = (event) => { setInterests(event.target.value) }

    const [userProfile, setUserProfile] = useState([])
    const [searchedUser, setSearchedUser] = useState([]);
    const [friendRequestRecieved, setFriendRequestRecieved] = useState([]);
    const [friendRequestSent, setFriendRequestSent] = useState([]);
    const [allUser, setAllUser] = useState([]);

    const currentUserGet = async () => {
        await UserService.getUserByEmail(user_email).then(res => {
            console.log("WHAT THIS IS IT " + JSON.stringify(res.data))
            setUserProfile(res.data)
            //
            setFirstName(res.data.firstName)
            setLastName(res.data.lastName)
            setEmail(res.data.email)
            setRole(res.data.role)
            setAboutme(res.data.aboutme)
            setJob(res.data.job)
            setHomeTown(res.data.hometown)
            setRelationshipStatus(res.data.relationshipstatus)
            setInterests(res.data.interests)

        })
    }

    const getPostForUser = async () => {
      await PostService.getPostForUser(AuthService.getCurrentUser().username).then(res => {
        const uniquePost = Array.from(new Set(res.data.map(a => a.id)))
          .map(id => {
            return res.data.find(a => a.id === id)
          })
          let mypost = []
          uniquePost.map(post => {
            if(post.user.email === user_email) {
              mypost.push(post)
            }
          })
          setMyPost(mypost)
      })
      
      
    }

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

    const uploadProfilePicture = async () => {
        if (profilePicture === "") {
            console.log("cant be null")
            return
        }
        const formData = new FormData();
        formData.append('profilePicture', profilePicture)
        await UserService.uploadProfilePicture(user_email, formData).then(res => {
            window.location.reload();
        })
    }

    const handleOnChange = () => {
        console.log("HEHE")
    }

    

	

	

  const acceptFriendRequest = (uid, fid) => {
		FriendsService.acceptRequest(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}

	const declineFriendRequest = (uid, fid) => {
		FriendsService.declineRequest(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}

	const unsendFriendRequest = (uid, fid) => {
		FriendsService.unsendRequest(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}

	const sendFriendRequest = (uid, fid) => {
		FriendsService.sendRequest(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}
  const removeFriend = (uid, fid) => {
		console.log("uid: " + uid + " fid: " + fid)
		FriendsService.removeFriends(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}
  const handleFollow = (uid) => {
		UserService.follow(user.email, uid).then(res => {
			setRefresh(res.data)
		})
	}

	const handleUnfollow = (uid) => {
		UserService.unfollow(user.email, uid).then(res => {
			setRefresh(res.data)
		})
	}

   const getAllUser = async () => {
		await UserService.getUsers().then(res => {
			setAllUser(res.data)
			setSearchedUser(res.data)
		})
		console.log(user.email + " This is the users")
	}

	const getFriendsList = async () => {
		await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
			setFriendsList(res.data)
		})
	}

	const getAllFollowing = async () => {
		await UserService.getFollowing(AuthService.getCurrentUser().username).then(res => {
			setFollowing(res.data)
		})
	}

	const getAllFollowers = async () => {
		await UserService.getFollowers(AuthService.getCurrentUser().username).then(res => {
			setFollowers(res.data)
		})
	}

	const getAllFriendRequestSent = async () => {
		await UserService.getFriendRequestSent(AuthService.getCurrentUser().username).then(res => {
			setFriendRequestSent(res.data)
		})
	}

	const getAllFriendRequestRecieved = async () => {
		await UserService.getFriendRequestRecieved(AuthService.getCurrentUser().username).then(res => {
			setFriendRequestRecieved(res.data)
		})
	}

	const handleSearchedUser = (event) => {
		if (event.target.value === "") {
			setSearchedUser(allUser)
		} else {
			let temp = []
			allUser.map(u => {
				const email = u.email.toLowerCase()
				const firstname = u.firstName.toLowerCase()
				const lastname = u.lastName.toLowerCase()
				const searchedvalue = event.target.value.toLowerCase()
				if (email.includes(searchedvalue) || firstname.includes(searchedvalue) || lastname.includes(searchedvalue)) {
					temp.push(u)
				}
			})
			setSearchedUser(temp)
			console.log(temp)
		}

	}

 


    useEffect(() => {
        currentUserGet()
        getAllUser()
    getFriendsList()
		getAllFollowing()
		getAllFollowers()
		getAllFriendRequestSent()
		getAllFriendRequestRecieved()
        getPostForUser()
    }, [])

    const handleShow = () => {
      if(show === "timeline") {
        return(
        <PostProfileComponent posts={myPost} setRefresh={setRefresh}/>
        )
      }
      if(show === "about") {
        return profileAboutComponent()
      }
      
      if(show === "friends") {
        return(
        <FriendProfileComponent />
        )
      }
      else{
        return (null)
      }
    }


    const updateProfile = async () => {
      let updateduser = {
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        aboutme: aboutme,
        job: job,
        hometown: homeTown,
        relationshipstatus: relationshipStatus,
        interests: interests,
  
      }
      UserService.editProfile(user.email, updateduser).then(res => {
        setUserProfile(res.data)
      })
    }




    const profileAboutComponent = () => {
      return (
        <div className="container">
          <div className="row">
                <div className="col-lg-4">
                  <div style={{background: 'white', border: '1px solid #ececec', borderRadius: '10px', boxShadow: '0 1px 3px rgb(0 0 0 / 20%)', margin: '0 20px 20px 0' }}>
                    <div><span style={{ float: 'right' }}><i class="las la-ellipsis-v"></i></span></div>
                    
                    <div className="admin-name">
                      <h5>{`${userProfile.firstName} ${userProfile.lastName}`}</h5>
                      <span>{`${userProfile.email}`}</span>
                    </div>
  
  
  
                    <div className="edit-area">
  
  
  
  
  
                      <div className="form-group2">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-inpt" id="fullName" placeholder="Click to add"
                          value={firstName} onChange={handleFirstName} />
                      </div>
  
  
  
  
                      <div className="form-group2">
                        <label htmlFor="firstName">Last Name</label>
                        <input type="text" className="form-inpt" id="lastName" placeholder="Click to add"
                          value={lastName} onChange={handleLastName} />
                      </div>
  
  
  
  
  
  
                      <div className="form-group2">
                        <label htmlFor="firstName">About Me</label>
                        <input type="text" className="form-inpt" id="About" placeholder="Click to add" value={aboutme} onChange={handleAboutme} />
                      </div>
  
  
  
  
  
                      <div className="form-group2">
                        <label htmlFor="firstName">Job</label>
                        <input type="text" className="form-inpt" id="About" placeholder="Click to add"
  
                          value={job} onChange={handleJob} />
                      </div>
  
  
  
  
  
                      <div className="form-group2">
                        <label htmlFor="firstName">Email</label>
                        <p>{userProfile.email} </p>
                      </div>
  
  
  
  
  
                      <div className="form-group2">
                        <label htmlFor="firstName">Role</label>
                        <input disabled={true} className="form-inpt" type="url" id="interests" placeholder="No Role" style={{ color: "red" }}
                          value={userProfile.role} onChange={handleOnChange} />
                      </div>
  
  
  
  
  
  
                      <div className="form-group2">
                        <label htmlFor="firstName">Home Town</label>
                        <input type="text" className="form-inpt" id="About" placeholder="Click to add"
  
                          value={homeTown} onChange={handleHomeTown} />
                      </div>
  
  
  
  
  
                      <div className="form-group2">
                        <label htmlFor="firstName">Relationship Status</label>
                        <input type="text" className="form-inpt" id="Relationship Status" placeholder="Click to add"
                          value={relationshipStatus} onChange={handleRelationshipStatus} />
                      </div>
  
  
  
  
  
  
                      <div className="form-group2">
                        <label htmlFor="firstName">Interests</label>
                        <input type="text" className="form-inpt" id="Interests" placeholder="Click to add" value={interests} onChange={handleInterests} />
                      </div>
  
  
  
  
                      <br></br>
  
  
                      <div style={{ display: 'inline', margin: '10px 0' }}>
                        <button id="submit" name="submit" className="shareIn-btn2" type="button" onClick={temp}>
                          <span>Cancel</span>
                        </button>
                        {/* <button type="button" id="submit" name="submit" className="btn btn-secondary" onClick={temp} >Cancel</button> */}
                        <button id="submit" name="submit" className="shareIn-btn2" type="button" onClick={updateProfile}>
                          <span>Save</span>
                        </button>
                        {/* <button type="button" id="submit" name="submit" className="btn btn-primary" onClick={updateProfile}>Save</button> */}
                      </div>
  
  
                    </div>
  
                  </div>
                </div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
          
          <div className="widget-prof">
          <ul><li className="head-widgt">Privacy</li>
          <li><div className="row"><input type="checkbox"/><p>Include my profile in ShareUp search</p></div></li>
          <li><div className="row"><input type="checkbox"/><p>Allow my contacts to see my contacts</p></div></li>
      <li><div className="row"><input type="checkbox"/><p>Allow my contacts to download photos I share to my ShareTime</p></div></li>
      
      </ul>
          </div>
          </div>
          </div>
              </div>
      );
    }
  
    const profileFriendComponent = () => {
      return (
        <div className="container">
          <div className="tab-pane active fade show " id="frends">
          <ul className="nearby-contct">
            {searchedUser.map(
              userM =>
                <li key={userM.id}>
                  <div className="nearly-pepls">
                    <figure>
                      <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img src={userM.profilePicturePath} alt="" /></a>
                    </figure>
                    <div className="pepl-info">
                      <h4><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.firstName} ${userM.lastName}`}</a></h4>
                      <p><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.email}`}</a></p>
                      <span>Engr</span>
                      {
                        (user.id !== userM.id) ?
                          (!friendsList.some(el => el.id === userM.id)) ?
                            friendRequestRecieved.some(el => el.id === userM.id)
                              ?
                              <>
                                <a href="#!" title="#" className="add-butn" style={{ color: "#fff" }} data-ripple onClick={() => acceptFriendRequest(user.id, userM.id)}>Accept Friend Request</a>
                                <p><a style={{ display: "block", float: "right", color: "gray" }} href="#" onClick={() => declineFriendRequest(user.id, userM.id)}>Decline Friend Request</a></p>
                                <br></br>
                                <br></br>
                              </>
                              :
                              friendRequestSent.some(el => el.id === userM.id)
                                ?
                                <p><a href="#!" title="#" className="add-butn" style={{ color: "#fff" }} data-ripple onClick={() => unsendFriendRequest(user.id, userM.id)}>Unsend Friend Request</a></p>
                                :
                                <p><a href="#!" title="#" className="add-butn" style={{ color: "#fff" }} data-ripple onClick={() => sendFriendRequest(user.id, userM.id)}>Send Friend Request</a></p>
                            :
                            <>
                              <a href="#" title="#!" className="add-butn more-action" data-ripple onClick={() => removeFriend(user.id, userM.id)}>unfriend</a>
                              <p>Already a friend</p>
                            </>
                          :
                          <p style={{ float: "right" }}>Your own profile</p>
                      }
                      {
                        (user.id !== userM.id) ?
                          (!following.some(el => el.id === userM.id)) ?
                            <p><a style={{ display: "block", float: "right" }} href="#!" onClick={() => handleFollow(userM.id)} >Follow</a></p>
                            :
                            <p><a style={{ display: "block", float: "right", color: "red" }} href="#!" onClick={() => handleUnfollow(userM.id)}>Unfollow</a></p>
                          :
                          null
                      }
  
  
                    </div>
                  </div>
                </li>
            )}
          </ul>
          <div className="lodmore"><button className="btn-view btn-load-more" /></div>
        </div>
              </div>
      );
    }

    return (
      <>
      <div>
      <ShareupInsideHeaderComponent />
      

         
            <div className="row merged">

              <section>
                <div className="feature-photo">
                <div className="container pdng1">
        
                  <div className="row">
                  <div className="col-lg-3">
                 
                      {
                        showProfilePicture ?
                          <img id="preview" src={profileRender} /> :
                          userProfile.profilePicturePath ? <img className="border-gradient" src={userProfile.profilePicturePath}></img> : <p>	Edit Display Photo</p>
                      }

                       
                     
                      
                      
            </div>
            <div className="col-lg-6">
                      
            <h5>{`${userProfile.firstName} ${userProfile.lastName}`}</h5>
                      {/* <span>{`${userProfile.email}`}</span> */}
                 <div className="profsts">
                      <ul>
                        <li><span style={{textAlign:'center'}}>0</span><span>Posts</span></li>
                        <li><span style={{textAlign:'center'}}>0</span><span>Folowers</span></li>
                        <li><span style={{textAlign:'center'}}>0</span><span>Following</span></li>
                    </ul>
                    <span>Feeling happy to share and find my soul</span>
                    </div></div>
                    <div className="col-lg-3">
                      </div>
{/*                      
                    <div className="add-btn">
                      <span>1205 followers</span>
                      <a href="#" title="" data-ripple="">Add Friend</a>
                    </div>
                    <form className="edit-phto">
                      <i className="fa fa-camera-retro"></i>
                      <label className="fileContainer">
                        Edit Cover Photo
				<input type="file" />
                      </label>
                    </form> */}
                 
                    

                  
                  </div>
                  {/* <div className="user-avatar">
                   
                      {
                        showProfilePicture ?
                          <img id="preview" src={profileRender} /> :
                          userProfile.profilePicturePath ? <img src={userProfile.profilePicturePath}></img> : <p>	Edit Display Photo</p>
                      }
                      <form className="edit-phto">
                        <i className="fa fa-camera-retro"></i>
                        <label className="fileContainer">
                          <input id="file-input" type="file" name="profile_image" accept="image/*" onChange={handleProfileImage}></input>
                        </label>
                      </form>
                    
                    <button type="button" id="submit" name="submit" className="btn btn-primary" onClick={uploadProfilePicture}>Upload</button>
                  </div> */}
                  <div><div className="stories">
    
    <ul>
      <li>
        <a href="#">
          <div className="stories-card">
            <div className="stories-img"><img src="/assets/images/vector-34@2x.png" alt="img" /></div>
            <div className="add-storie">
              +
            </div>
            <div className="stories-by">
              <h5>Create Story</h5>
            </div>
          </div>
        </a>
      </li>
     
    </ul>
  </div></div>
<div className="timeline-info">
                  <div className="row">

                    <div className="col">
                    <a className={(show === "timeline" ? "active button" : "button")} style={{}} title="" data-ripple="" onClick={() => setShow("timeline")}><i class="las la-rss"></i></a></div>
                    <div className="col brdrmid"><a className={(show === "photos" ? "active button" : "button")} title="" data-ripple="" onClick={() => setShow("photos")}><i class="las la-icons"></i></a></div>
                    <div className="col"><a className={(show === "friends" ? "active button" : "button")} title="" data-ripple="" onClick={() => setShow("friends")}><i class="las la-user-tag"></i></a></div>
                      {/* <a className={(show === "timeline" ? "active" : "")} title="" data-ripple="" onClick={() => setShow("timeline")}>time line</a>
                      <a className={(show === "photos" ? "active" : "")} title="" data-ripple="" onClick={() => setShow("photos")}>Photos</a>
                      <a className={(show === "videos" ? "active" : "")} title="" data-ripple="" onClick={() => setShow("videos")}>Videos</a>
                      <a className={(show === "friends" ? "active" : "")} title="" data-ripple="" onClick={() => setShow("friends")}>Friends</a>
                      <a className={(show === "groups" ? "active" : "")} title="" data-ripple="" onClick={() => setShow("groups")}>Groups</a>
                      <a className={(show === "about" ? "active" : "")} title="" data-ripple="" onClick={() => setShow("about")}>about</a>
                      <a className={(show === "more" ? "active" : "")} data-ripple="" onClick={() => setShow("more")}>more</a> */}
                    
                  </div>
                </div>
                </div>
            
         
            </div>
                
                <div className="container pdng1">
                

                {/*  */}
                <div className="changethis" style={{ overflow: 'auto' }}>


                  {

                    handleShow()
                  }







                </div>

                </div>

              </section>
            

      </div>
    </div>








      {/* <div>
      <ShareupInsideHeaderComponent />
      <div className="container">
        <div style={{ marginLeft: '5%', marginRight: '5%' }}>

          <div className="container-fluid eighty">
            <div className="row merged">
              
              <div>
                <div className="feature-photo">
                  <figure><img className='coverImg borderR' src="../assets/images/reg.jpg" alt="" />
                  <div className="add-btn">
                    <span>1205 followers</span>
                    <a href="#" title="" data-ripple="">Add Friend</a>
                  </div>
                  <form className="edit-phto">
                    <i className="fa fa-camera-retro"></i>
                    <label className="fileContainer">
                      Edit Cover Photo
				<input type="file" />
                    </label>
                  </form>
                  <div className="align-avatar">
            <div class="user-avatar">{
                        showProfilePicture ?
                          <img  id="preview" src={profileRender} /> :
                          userProfile.profilePicturePath ? <img className="border-gradient" src={userProfile.profilePicturePath}></img> : <p>	Edit Display Photo</p>
                      }
                       
                       
                      </div></div> 
                      <div className="admin-name">
                    <h5>{`${userProfile.firstName} ${userProfile.lastName}`}</h5>
                    <span>{`${userProfile.email}`}</span>
                  </div>
                      
                  </figure>
                  {/* <div className="user-avatar">
                   
                      {
                        showProfilePicture ?
                          <img id="preview" src={profileRender} /> :
                          userProfile.profilePicturePath ? <img src={userProfile.profilePicturePath}></img> : <p>	Edit Display Photo</p>
                      }
                      <form className="edit-phto">
                        <i className="fa fa-camera-retro"></i>
                        <label className="fileContainer">
                          <input id="file-input" type="file" name="profile_image" accept="image/*" onChange={handleProfileImage}></input>
                        </label>
                      </form>
                    
                    <button type="button" id="submit" name="submit" className="btn btn-primary" onClick={uploadProfilePicture}>Upload</button>
                  </div> *
                  
                  </div>
                <div className="timeline-info">
                  <ul>

                    <li>
                      <a className={(show === "timeline" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("timeline")}>time line</a>
                      <a className={(show === "photos" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("photos")}>Photos</a>
                      <a className={(show === "videos" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("videos")}>Videos</a>
                      <a className={(show === "friends" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("friends")}>Friends</a>
                      <a className={(show === "groups" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("groups")}>Groups</a>
                      <a className={(show === "about" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("about")}>about</a>
                      <a className={(show === "more" ? "active" : "")}  data-ripple="" onClick={() => setShow("more")}>more</a>
                    </li>
                  </ul>
                </div>

                {/*  *
               <div className="changethis" style={{boxShadow: '0 1px 3px rgb(0 0 0 / 20%)', padding:'40px 0px'}}>
                 
                  
                   {
                     
                  handleShow()
                }
                 
                
                
				

        
				
				</div>
				
                

              </div>
            </div>
          </div>
        </div>

      </div>
    </div> */}</>
    );
  


}
export default OtherProfileComponent;

