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
import {useSelector} from "react-redux"
import moment from 'moment';
import {
  Popover,
  Badge,
  List,
  notification,
  Typography,
  Input,
  Button,
} from "antd";
import "antd/dist/antd.css";
import Icon from '@ant-design/icons';
import {store} from "../../app/store";
import { setSearchTerm } from "../../app/searchSlice";
import {toast} from 'react-toastify';
import UserContext from "../../contexts/UserContext";

// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
import { grey } from '@mui/material/colors';
 
 // toast-configuration method,
 // it is compulsory method.
toast.configure();

export const handleSendNotification = async (to,action,apply_on,userFirstName,userLastname,email) => {
  const formData = new FormData();
  let message =userFirstName + ' ' + userLastname + ' ' +action + ' your ' + apply_on;
  formData.append(`from`,email);
  formData.append(`apply_on`,apply_on);
  formData.append(`action`,action);
  formData.append(`message`,message);
  await NewNotificationService.sendNotification(to,formData).then(res => {
  })	
};
function ShareupInsideHeaderComponent() {
 
  let history = useHistory();
let counter =0;
  const[total,setTotal]=useState(0);
  const [unreadCounter,setUnreadCounter] =useState(0);
  const [readflag,setReadflag] =useState(false);
  const[newListinerFlag,setNewListinerFlag]= useState(false);
  const[newNotificationFlag,setNewNotificationFlag]= useState(false);
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

 
  const KeyPressHandler = (event) => {
    if(event.key === 'Enter' && event.target.value !=='') {
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
    console.log("total",total);
    if(total > 0) {
      updateUnopendCounter(AuthService.getCurrentUser().username,total)
    }
  }, [total]);

  useEffect(() => {
    getFriendsList()
  }, [searchedFriendsList])
 
  useEffect(() => {
    currentUserGet()
    setLoggedInUser(AuthService.getCurrentUser().username);
    if(newListinerFlag === false)
    {
      initListener();
      setNewListinerFlag(true);
    }
    handleGetUnopendCounter(AuthService.getCurrentUser().username);
    console.log('I was triggered during use effect init lisner',newListinerFlag)
  }, [])

  
 
  const onUnfocus = () => {
    if (showUserSettings === true) {
      setShowUserSettings(false)
    }
  }

 const initListener = () => {
    const eventSource = new EventSource("https://cors-everywhere.herokuapp.com/http://shareup-env.eba-em9v8zqj.us-east-1.elasticbeanstalk.com/subscription");

    eventSource.onopen = (e) => console.log("open connection ");

    eventSource.onerror = (e) => {
      if (e.readyState === EventSource.CLOSED) {
        console.log(" listner close error");
        
      } else {
        console.log("listner",e);
      }
      initListener();
    };
   // eventSource.onmessage = e => getRealtimeData(JSON.parse(e.data));
    eventSource.addEventListener(
      loggedInUser,
      handleServerEvent,
      false
    );
  }

  const handleServerEvent = (e) => {
    
    const json = JSON.parse(e.data);
    let newNotifications = NewNotifications;
    newNotifications.unshift({
      from: json.from,
      message: json.message,
     
      isRead: false,
    });
    setNewNotifications(newNotifications);
    notification.config({
      placement: "bottomLeft",
    });

    notification.open({
      message: (
        <div>
          <b>{json.from}</b>  {json.message} 
        </div>
      ),
    });

    setTotal(prevTotal => prevTotal +1)
    setNewNotificationFlag(true);
  };

   
  
    const handlegetNotifications = async () => {
      console.log("handlegetNotifications",AuthService.getCurrentUser().username)
	  	await NewNotificationService.getNotifications(AuthService.getCurrentUser().username).then(res => {	
			setDbNotifications(res.data)
      setUnreadCounter(0)
      let user_unread_notification =0;
      res.data.map(notification =>{
        if(notification.read_flag === true)
        {
        
        }else{
         
          user_unread_notification= user_unread_notification+1;
        }
      })
      setUnreadCounter(prevUnreadCounter => prevUnreadCounter+user_unread_notification)
			console.log("database notification",res.data)
    })
    updateUnopendCounter(AuthService.getCurrentUser().username,0);
    setTotal(0);
	};


    const handleReadNotifications = async (id) => {
      console.log("handleReadNotifications",id)
      await NewNotificationService.readNotification(id).then(res => {	
      
      })

    };

    const handleGetUnopendCounter = async (email) => {
        await NewNotificationService.getUnopenedNotificationsCount(email).then(res => {	
          setTotal(res.data)
          console.log("unopend notification counter ",res.data)
          return res.data;
        })
  
      };


    const updateUnopendCounter = async (email,count) => {
        const formData = new FormData();
        formData.append(`unopened_notification`,count)
        await NewNotificationService.updateUnopenedNotificationsCount(email,formData).then(res => {	  
          
          })
    
        };

    const displayNotification=(actionType,actionOn)=> {
      let action ;
      let applyOn ="default";

      if(actionType === 'Like'){
        action ="Like"
      }else if(actionType === 'mention'){
        action ="mention"
      }else if(actionType=== 'comment'){
        action ="comment"
      }else if(actionType=== 'reply'){
        action ="reply"
      }else if(actionType=== 'share'){
        action ="share"
      }else if(actionType=== 'friend_request'){
        action ="sent friendrequest"
      }else if(actionType=== 'invite_to_group'){
        action ="invited you to group"
      }
      
      if(actionOn === 'post'){
        applyOn ="post"
      }else if(actionOn === 'comment'){
        applyOn ="comment"
      }else if(actionOn=== 'reply'){
        applyOn ="reply"
      }else if(actionOn=== 'share'){
        applyOn ="share"
      }else if(actionOn=== 'group'){
        applyOn =""
      }else if(actionOn=== 'Empty'){
        applyOn =""
      }
      
      var result = `${action} your ${applyOn}`; 
      return (
        <span >{result}</span>
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
                <input  type="text" className="searchTerm"
                 placeholder="Search Shareup Members..." name="search"
                value={searchTerm}
                onChange={(event) => store.dispatch(setSearchTerm(event.target.value))}
                 onKeyUp={KeyPressHandler}
                 
                />
            </li>
          
            <li>
              <div className="noti" onClick={() =>handlegetNotifications()}>
              {total?(<div className="counter">
                <span style={{color: 'white'}}>{total}</span>
                   </div>): ('')}
                <a href="#" title="Notification" data-ripple>
                  <i className="ti-bell" />
                </a>
                  <div className="dropdowns" >
                   <span>{unreadCounter} Unread Notifications</span>
                    <ul className="drops-menu">
                    {dbNotifications && dbNotifications.map(item => {
                      return (
                        
                      <li key={item.id} style={{color: "red"}} onClick={() =>handleReadNotifications(item.id)} >
                      <a >
                      <img src={item.userdata.profilePicturePath} alt="" />
                     
                      <div className="mesg-meta" >
                        <h6>{item.userdata.firstName} {item.userdata.lastName} </h6>
                        {displayNotification(item.notificationType,item.applyOnType)}
                        <div >
                          <span>{moment(item.notification_date).fromNow()}</span>
                        </div>
                      </div>
                    </a>
                    {item.read_flag?(""):(<span className="tag green">unread</span>)}
                    
                    </li>)
                   
                    }
 ) }
</ul>
                  
                  <a href="/notifications" title="notif" className="more-mesg">view more</a>
                </div>
              </div>
            </li>
            <li>
              <div className="mssg">
             
                <a href="#" title="Messages" data-ripple><i className="ti-comment" /> </a> 
                <div className="counter"><span style={{color: 'white'}}>12</span></div>
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
                  <a href="messages.html" title="notif" className="more-mesg">view more</a>
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
            <img onClick={() => setShowUserSettings(!showUserSettings)} src={user.profilePicturePath } style={{ maxWidth: '51.5px', maxHeight: '51.5px', width: '51.5px', height: '51.5px' }} alt="" />
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