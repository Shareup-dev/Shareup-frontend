import React, { useState, useEffect, useContext,useRef,  } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import { testScript } from '../../js/script';
import FriendsService from '../../services/FriendService';
import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';


function MessagesComponent() {
   
    let history = useHistory();
    const { user } = useContext(UserContext)
  
    // const []
  
    // const inputRef = createRef();
  
    
   
    const [friendsList, setFriendsList] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [stories, setStories] = useState([]);
    const [refresh, setRefresh] = useState(null)
    const [userR, setUserR] = useState(null);
    const [searchedUser, setSearchedUser] = useState([]);
    
    const handleChat = (userM)=>{
     setUserR(userM)
     console.log(userM) 
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
  
    useEffect(() => {
        getAllUser()
        getFriendsList()
        testScript()
    },[])
    
    
    return (<>
<ShareupInsideHeaderComponent/>
<div className="central-message">
        <div className="left-message">
          <div className="msgHead">
            
          <a href={`/profile/${user.email}`} title={`${user.email}`}><img className="msgprof" style={{objectFit:'cover'}} src={user.profilePicturePath} alt="" /><span style={{paddingLeft:'10px',fontWeight:'bold',fontSize:'15px'}}>{`${user.firstName} ${user.lastName}`}</span>
          <span  style={{paddingLeft:'20px',fontWeight:'900'}}><img src="/assets/images/msgarrw.svg"/></span></a>
          </div>
          <div class="search-container">
            <i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Users" name="s" onChange={handleSearchedUser} />
        </div>
        <div class="cntnrScrll">
        <ul>
        
                {searchedUser.map(
                    userM =>
                    (user.id !== userM.id) ?
                        <li key={userM.id} className="friends-card">
                        <a href="#!" onClick={() => handleChat(userM)}> <div className="grid-container">
                                {/* <figure> */}
                                <div class="item1">
                                    <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{objectFit:'cover'}} src={userM.profilePicturePath} alt="" /></a>
                                    {/* </figure> */}
                                    
                                </div>
                                <div class="item2"><p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                                <div class="item5 actv">Active 2 mints ago</div>
                                </div>
                                {/* <div className="  "> */}
                              </div></a>
                        </li>
                         :null
                )}
            </ul></div>
        </div>

        <div className="right-message ">
        <div style={{height:'10%'}}><div className="msgTop">
        {userR ?
            <a href={`/profile/${userR.email}`} title={`${userR.email}`}><img className="msgprof" style={{objectFit:'cover'}} src={userR.profilePicturePath} alt="" /><span style={{paddingLeft:'10px',fontWeight:'bold',fontSize:'15px'}}>{`${userR.firstName} ${userR.lastName}`}</span>
            </a>:<a href="#" title="user"><img className="msgprof" style={{objectFit:'cover'}} src="https://freeiconshop.com/wp-content/uploads/edd/many-people-outline.png" alt="" /><span style={{paddingLeft:'10px',fontWeight:'bold',fontSize:'15px'}}>User</span>
            </a>}
            <div className="msgic"><div style={{paddingRight:'10px',display:'inline'}}><img src="/assets/images/callicon.svg"/></div><div style={{paddingRight:'10px',display:'inline'}}><img src="/assets/images/videoicon.svg"/></div></div>
            </div>
            
            </div>
            <div className="AreaMsg"></div>
            <div className="txtAreaMsg"><input className="chat-text"  placeholder="Type message" name="s" >
               
                </input>
               <div className="add-microphicon"> <img width="20" src="/assets/images/picmsg.svg"/></div>
               <div className="add-stckricon"> <img  width="20" src="/assets/images/stckrmsg.svg"/></div>
               <div className="add-picicon"> <img  width="20" src="/assets/images/mic.svg"/></div>
               </div>
        </div>

      </div>
        

      
     </>
     
        );
    }

export default MessagesComponent;