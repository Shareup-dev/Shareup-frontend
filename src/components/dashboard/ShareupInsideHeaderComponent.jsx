import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import AuthService from '../../services/auth.services';
import Form from 'react-bootstrap/Form';
import FriendsService from '../../services/FriendService';
import UserService from '../../services/UserService';
import { BiUserPlus } from "react-icons/bi";
import settings from '../../services/Settings';
import NewNotificationService from '../../services/NewNotificationService';
import fileStorage from "../../config/fileStorage";
import { useSelector } from "react-redux"
import moment from 'moment';
import { over } from 'stompjs';
import { notification } from "antd";
// import "antd/dist/antd.css";
import { store } from "../../app/store";

import { setSearchTerm } from "../../app/searchSlice";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { Client } from '@stomp/stompjs';

import { grey } from '@mui/material/colors';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { testScript } from "../../js/script";
let stompClient = null;

// toast-configuration method,
// it is compulsory method.
 toast.configure();

export const handleSendNotification = (to, content, userFirstName, userLastname, email, action, applyOnId) => {
  console.log("inside send notification", stompClient);

  var notificationVar = {
    from_email: email,
    to_id: to,
    content: content,
    first_name: userFirstName,
    Last_name: userLastname,
    Action: action,
    Apply_on_id: applyOnId
  };

  stompClient.send("/app/private-notification", {}, JSON.stringify(notificationVar));

  // handleDbnotification(to,content,email)
};
export const handleDbnotification = async (to_id, action, from_email) => {
  const formData = new FormData();
  formData.append(`from`, from_email);
  formData.append(`message`, action);
  await NewNotificationService.sendNotification(to_id, formData).then(res => {
  })
}

function ShareupInsideHeaderComponent() {
  let history = useHistory();
  let counter = 0;
  let notificaionflag = false;
  const [total, setTotal] = useState(0);
  const [unreadCounter, setUnreadCounter] = useState(0);

  const [newListinerFlag, setNewListinerFlag] = useState(false);
  const [newNotificationFlag, setNewNotificationFlag] = useState(false);
  const [NewNotifications, setNewNotifications] = useState([]);
  const [Notifications, setNotifications] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(AuthService.getCurrentUser().username);
  const [Message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [to, setTo] = useState("");
  const [user, setUser] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [searchedFriendsList, setSearchedFriendsList] = useState([]);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [dbNotifications, setDbNotifications] = useState([]);
  const searchTerm = useSelector((state) => state.search)
  const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    console.log('toggle class');
    setActive(!isActive);
    handlegetNotifications();
  };
  const connect = () => {
    var sock = new SockJS('https://api.shareup.qa/ws');
    stompClient = Stomp.over(sock);
    sock.onopen = function () {
      console.log('open');
    }
    stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      stompClient.subscribe('/user/' + AuthService.getCurrentUser().username + '/notification',
        onPrivateNotification);
    });
    //    let endpoint ='https://api.shareup.qa/ws'
    //  let Sock = new SockJS(endpoint);
    //  var stompClient = over(Sock);
    // stompClient.connect({},onConnected, onError);

  }

  const onConnected = () => {

    stompClient.subscribe('/user/' + AuthService.getCurrentUser().username + '/notification', onPrivateNotification);

  }

  const onError = (err) => {
    console.log(err);

  }
  const KeyPressHandler = (event) => {
    if (event.key === 'Enter' && event.target.value !== '') {
      history.push("/searchFeed")


    }
  }

  const currentUserGet = async () => {
    await UserService.getUserByEmail(AuthService.getCurrentUser().username).then(res => {
      setUser(res.data)
    })
  }

  const getFriendsList = async () => {
    await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
      setFriendsList(res.data)
    })
  }

  const handleShowFriendsList = (event) => {
    if (event.target.value === "") {
      setSearchedFriendsList([])
    } else {
      let temp = []
      friendsList.map(u => {
        const email = u.email.toLowerCase()
        const firstname = u.firstName.toLowerCase()
        const lastname = u.lastName.toLowerCase()
        const searchedvalue = event.target.value.toLowerCase()
        if (email.includes(searchedvalue) || firstname.includes(searchedvalue) || lastname.includes(searchedvalue)) {
          temp.push(u)
        }
      })
      setSearchedFriendsList(temp)
      console.log(temp)
    }
  }

  const handleLogout = (event) => {
    AuthService.logout()
    history.push("/")
  }
  useEffect(() => {
    console.log("total", total);

    if (total > 0) {
      updateUnopendCounter(AuthService.getCurrentUser().username, total)

    }
  }, [total]);

  useEffect(() => {
    getFriendsList()
  }, [searchedFriendsList])

  useEffect(() => {
    currentUserGet()
    setLoggedInUser(AuthService.getCurrentUser().username);
    connect();
    handleGetUnopendCounter(AuthService.getCurrentUser().username);
  }, [])

  const onUnfocus = () => {
    if (showUserSettings === true) {
      setShowUserSettings(false)
    }
  }

  const onPrivateNotification = (payload) => {
    console.log("got message");
    console.log(payload)
    var json = JSON.parse(payload.body);
   /* notification.config({
      placement: "bottomLeft",
    });

    notification.open({
      message: (
        <div>
          <b>{json.userdata.firstName} {json.userdata.lastName}</b>  {json.content}
        </div>
      )
    });*/
    toast(displayToastnotification(json),{position: toast.POSITION.BOTTOM_LEFT})   
    setTotal(prevTotal => prevTotal + 1)
    setNewNotificationFlag(true);
  }


  const handlegetNotifications = async () => {
    console.log("handlegetNotifications", AuthService.getCurrentUser().username)
    await NewNotificationService.getNotifications(AuthService.getCurrentUser().username).then(res => {
      setDbNotifications(res.data)
      setUnreadCounter(0)
      let user_unread_notification = 0;
      res.data.map(notification => {
        if (notification.readFlag === true) {

        } else {

          user_unread_notification = user_unread_notification + 1;
        }
      })
      setUnreadCounter(prevUnreadCounter => prevUnreadCounter + user_unread_notification)
      console.log("database notification", res.data)
    })
    updateUnopendCounter(AuthService.getCurrentUser().username, 0);
    setTotal(0);

  };


  const handleReadNotifications = async (id) => {
    console.log("handleReadNotifications", id)
    await NewNotificationService.readNotification(id).then(res => {

    })

  };

  const handleGetUnopendCounter = async (email) => {
    await NewNotificationService.getUnopenedNotificationsCount(email).then(res => {
      setTotal(res.data)
      console.log("unopend notification counter ", res.data)
      return res.data;
    })

  };


  const updateUnopendCounter = async (email, count) => {
    const formData = new FormData();
    formData.append(`unopened_notification`, count)
    await NewNotificationService.updateUnopenedNotificationsCount(email, formData).then(res => {

    })

  };

  const displayNotification = (content) => {

    return (
      <span >{content}</span>
    )
  }
  const displayToastnotification =(item)=>
  {
    return ( 
      <ul className="drops-menu">
      <li key={item.toString()} style={{ color: "black", fontSize: "16px"}} onClick={() => handleReadNotifications(item.id)} >
      <a >
      <img src={item.userdata.profilePicturePath} alt="" />
     
      <div className="mesg-meta" style={{ color: "black",fontSize: "18px"}}>
        <h6>{item.userdata.firstName} {item.userdata.lastName} </h6>
        {displayNotification(item.content)}
        <div style={{ color: "black", fontSize: "12px"}} >
          <span>{moment(item.notificationDate).fromNow()}</span>
        </div>
      </div>
    </a>
 </li>
 </ul>
   )
  }

  return (
    <div className="topbar stick">

      <div className="container">
        <div className="main-area"><ul className="main-menu">
          <li><a className="top-home" href="/newsfeed" title="Home"> <i className="las la-home" aria-hidden="true" /><span>Feed</span></a></li>
          <li><a className="top-friends" href="/friends" title="Friends"><i className="las la-user-plus" aria-hidden="true" /><span>Friends</span></a></li>
          <li><a className="top-groups" href="/groups" title="GROUPS"><i className="la la-users" aria-hidden="true" /><span>Groups</span></a></li>
          {/* <li><a className="top-profile" href="/profile" title="Profile"><i className="la la-user" aria-hidden="true" /><span>Profile</span></a></li> */}
          <li><a className="top-sharepoint" href="/shareFeed" title="SharePoint"><i className="la la-share-alt" aria-hidden="true" /><span>Share</span></a></li>
          <li>
            <a className="top-swappoint" href="/swapFeed" title="SwapPoint">
              <i className="las la-sync-alt" aria-hidden="true" />
              <span>Swap</span>
            </a>
          </li>
        </ul></div>
        <div className="logo-inside">
          {/* <a title="notif" href="/newsfeed"><img src="../assets/images/shareup.png" alt="" style={{marginTop: '13px'}}/></a> */}
          <a title="notif" href="/newsfeed"><img src="../assets/images/Mainlogo.png" alt="" style={{ marginTop: '5px' }} /></a>
          {/* <a title="notif" href="/newsfeed"><img src="../assets/images/shareup_logo2.png" width="50" alt="" /></a> */}
        </div>
        <div className="top-area">
          <ul className="setting-area">
            {
            }
            <li>
              <input type="text" className="searchTerm"
                placeholder="Search Shareup Members..." name="search"
                value={searchTerm}
                onChange={(event) => store.dispatch(setSearchTerm(event.target.value))}
                onKeyUp={KeyPressHandler}

              />
            </li>

            <li>
              <div className="noti" onClick={() => handlegetNotifications()}  >

                {total ? (<div className="counternotification">
                  <span style={{ color: 'white' }}>{total}</span>
                </div>) : ('')}
                <a  title="Notification" data-ripple>
                  <i className="ti-bell" />
                </a>
                <div className="dropdowns">
                  <span>{unreadCounter} Unread Notifications</span>
                  <ul className="drops-menu">
                    {dbNotifications && dbNotifications.map(item => {

                      return (

                        <li key={item.toString()} style={{ color: "red" }} onClick={() => handleReadNotifications(item.id)} >
                          <a >
                            <img src={item.userdata.profilePicturePath} alt="" />

                            <div className="mesg-meta" >
                              <h6>{item.userdata.firstName} {item.userdata.lastName} </h6>
                              {displayNotification(item.content)}
                              <div >
                                <span>{moment(item.notificationDate).fromNow()}</span>
                              </div>
                            </div>
                          </a>
                          {item.readFlag ? ("") : (<span className="tag green">unread</span>)}

                        </li>)

                    }
                    )}
                  </ul>

                  <a href="/notificationsFeed" title="notif" className="more-mesg">view more77</a>
                </div>
              </div>
            </li>
            <li>
              <div className="mssg">

                <a  title="Messages" data-ripple><i className="ti-comment" /> </a>
                <div className="counternotification"><span style={{ color: 'white' }}>12</span></div>
                <div className="dropdownsmsg">
                  <span>5 New Messages</span>
                  <ul className="drops-menu">
                    <li>
                      <a href="/notifications" title="notif">
                        <img src="../assets/images/resources/thumb-1.jpg" alt="" />
                        <div className="mesg-meta">
                          <h6>sarah Loren</h6>
                          <span>Hi, how r u dear ...?</span>
                          <i>2 min ago</i>
                        </div>
                      </a>
                      <span className="tag green">New</span>
                    </li>
                    <li>
                      <a href="/notifications" title="notif">
                        <img src="../assets/images/resources/thumb-2.jpg" alt="" />
                        <div className="mesg-meta">
                          <h6>Jhon doe</h6>
                          <span>Hi, how r u dear ...?</span>
                          <i>2 min ago</i>
                        </div>
                      </a>
                      <span className="tag red">Reply</span>
                    </li>
                    <li>
                      <a href="/notifications" title="notif">
                        <img src="../assets/images/resources/thumb-3.jpg" alt="" />
                        <div className="mesg-meta">
                          <h6>Andrew</h6>
                          <span>Hi, how r u dear ...?</span>
                          <i>2 min ago</i>
                        </div>
                      </a>
                      <span className="tag blue">Unseen</span>
                    </li>
                    <li>
                      <a href="/notifications" title="notif">
                        <img src="../assets/images/resources/thumb-4.jpg" alt="" />
                        <div className="mesg-meta">
                          <h6>Tom cruse</h6>
                          <span>Hi, how r u dear ...?</span>
                          <i>2 min ago</i>
                        </div>
                      </a>
                      <span className="tag">New</span>
                    </li>
                    <li>
                      <a href="/notifications" title="#">
                        <img src="../assets/images/resources/thumb-5.jpg" alt="" />
                        <div className="mesg-meta">
                          <h6>Amy</h6>
                          <span>Hi, how r u dear ...?</span>
                          <i>2 min ago</i>
                        </div>
                      </a>
                      <span className="tag">New</span>
                    </li>
                  </ul>
                  <a href="/messages" title="notif" className="more-mesg">view more</a>
                </div>
              </div>
            </li>
            {/* <li><a href="#" title="Languages" data-ripple><i className="fa fa-globe" /></a> 
            <div className="dropdowns languages">
              <a href="#" title="notif"><i className="ti-check" />English</a>
              <a href="#" title="notif">Arabic</a>
              <a href="#" title="notif">Dutch</a>
              <a href="#" title="notif">French</a>
            </div>
          </li> */}
          </ul>
          <div className="user-img">
            <img onClick={() => setShowUserSettings(!showUserSettings)} src={user.profilePicturePath} style={{ maxWidth: '51.5px', maxHeight: '51.5px', width: '51.5px', height: '51.5px' }} alt="" />
            <span className="status f-online" />
            {
              showUserSettings && (
                <div className="user-setting active">
                  <a href="#!" title="notif"><span className="status f-online" />online</a>
                  <a href="#" title="notif"><span className="status f-away" />away</a>
                  <a href="#" title="notif"><span className="status f-off" />offline</a>
                  <a href={`/profile/${AuthService.getCurrentUser().username}`}><i className="ti-user" /> view profile</a>
                  <a href="/editprofile" title="notif"><i className="ti-pencil-alt" />edit profile</a>
                  <a href="Activity" title="notif"><i className="ti-target" />activity log</a>
                  <a href="Security" title="notif"><i className="ti-settings" />account setting</a>
                  <a href="#!" title="Logout" onClick={handleLogout}><i className="ti-power-off" />log out</a>
                </div>
              )
            }
          </div>




        </div>
      </div>
      
    </div>
  );
}

export default ShareupInsideHeaderComponent;