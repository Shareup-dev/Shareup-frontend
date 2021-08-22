import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import { testScript } from '../../js/script';
import FriendsService from '../../services/FriendService';


function FriendSearchComponent() {
    let history = useHistory();
    const { user } = useContext(UserContext)
    const [friendsList, setFriendsList] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [refresh, setRefresh] = useState(null)
    const [userF, setUserF] = useState(null);
    const [searchedUser, setSearchedUser] = useState([]);
    


    const handleTag = (userM)=>{
        setUserF(userM)
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
        return (
            <div>
                  <div class="search-container">
            <i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Users" name="s" onChange={handleSearchedUser} />
        </div>
        <div class="cntnrScrll">
        <ul>
        
                {searchedUser.map(
                    userM =>
                    (user.id !== userM.id) ?
                        <li key={userM.id} className="friends-card">
                        <a href="#!" onClick={() => handleTag(userM)}> <div className="grid-container">
                                {/* <figure> */}
                                <div class="item1">
                                    <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{objectFit:'cover'}} src={userM.profilePicturePath} alt="" /></a>
                                    {/* </figure> */}
                                    
                                </div>
                                <div class="item2"><p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                                </div>
                                {/* <div className="  "> */}
                              </div></a>
                        </li>
                         :null
                )}
            </ul></div>   
            </div>
        )
   
}
export default FriendSearchComponent;