import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import "./chatStyle.css";
import "./chat.js";
import { useJwt } from "react-jwt";

function ChatComponent() {
  let history = useHistory();

  const { user } = useContext(UserContext)

  // const []

  const [allUser, setAllUser] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);



  const addFriendsId = (uid,fid) => {
    console.log("uid: " + uid + " fid: " + fid)
    FriendsService.addFriends(uid,fid).then(res => {
      window.location.reload();
    })
  }

  const removeFriend = (uid,fid) => {
    console.log("uid: " + uid + " fid: " + fid)
    FriendsService.removeFriends(uid,fid).then(res => {
      window.location.reload();
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

  const getsadasd = (event) => {
    console.log(event.target.value)
  }

  const handleSearchedUser = (event) => {
    if(event.target.value === ""){
      setSearchedUser(allUser) 
    }else{
      let temp = []
      allUser.map(u => {
        if(u.email.includes(event.target.value)){
          temp.push(u)
        }
      })
      setSearchedUser(temp)
      console.log(temp)
    }
    
  }

  useEffect(() => {
    getAllUser()
    getFriendsList()
    console.log("Users = " + allUser)
    console.log("Friends = " + friendsList)
  }, [])

  return (
    <div className="container clearfix">
    <div className="people-list" id="people-list">
      <div className="search">
        <input id="userName" placeholder="search" type="text" />
        <button onclick="registration()">Enter the chat</button>
        <button onclick="fetchAll()">Refresh</button>
      </div>
      <ul className="list" id="usersList">
      </ul>
    </div>
    <div className="chat">
      <div className="chat-header clearfix">
        <img alt="avatar" height="55px" src="https://w7.pngwing.com/pngs/643/454/png-transparent-business-game-avatar-computer-program-google-smart-object-game-child-face.png" width="55px" />
        <div className="chat-about">
          <div className="chat-with" id="selectedUserId" />
          <div className="chat-num-messages" />
        </div>
        <i className="fa fa-star" />
      </div> {/* end chat-header */}
      <div className="chat-history">
        <ul>
        </ul>
      </div> {/* end chat-history */}
      <div className="chat-message clearfix">
        <textarea id="message-to-send" name="message-to-send" placeholder="Type your message" rows={3} defaultValue={""} />
        <i className="fa fa-file-o" /> &nbsp;&nbsp;&nbsp;
        <i className="fa fa-file-image-o" />
        <button id="sendBtn">Send</button>
      </div> {/* end chat-message */}
    </div> {/* end chat */}
  </div>

  );
}
export default ChatComponent;