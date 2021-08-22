import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import AuthService from '../../services/auth.services';
import Form from 'react-bootstrap/Form';
import FriendsService from '../../services/FriendService';
import UserService from '../../services/UserService';
import { BiUserPlus } from "react-icons/bi";



function ShareupInsideHeaderComponent() {
  let history = useHistory();

  const [user, setUser] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [searchedFriendsList, setSearchedFriendsList] = useState([]);
  const [showUserSettings, setShowUserSettings] = useState(false);

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
    getFriendsList()
  }, [searchedFriendsList])

  useEffect(() => {
    currentUserGet()
  }, [])

  const onUnfocus = () => {
    console.log("hello")
    if(showUserSettings === true){
      setShowUserSettings(false)
    }
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
          <li><a className="top-swappoint" href="/swapFeed" title="SwapPoint"><i className="las la-sync-alt" aria-hidden="true" /><span>Swap</span></a></li>
        </ul></div>
        <div className="logo-inside">
      {/* <a title="notif" href="/newsfeed"><img src="../assets/images/shareup.png" alt="" style={{marginTop: '13px'}}/></a> */}
      <a title="notif" href="/newsfeed"><img src="../assets/images/Mainlogo.png" alt="" style={{marginTop: '5px'}}/></a>
        {/* <a title="notif" href="/newsfeed"><img src="../assets/images/shareup_logo2.png" width="50" alt="" /></a> */}
      </div>
      <div className="top-area">
        <ul className="setting-area">
          {/* <li>
            <a href="#" title="Home" data-ripple><i className="ti-search" /></a>
            <div className="searched" style={{backgroundColor:"white !important"}}>
              <Form method="post" className="form-search" >
                <input type="text" placeholder="Search Friend" onChange={handleShowFriendsList}/>
                <button data-ripple><i className="ti-search" /></button>
                <ul id="people-list">
                {searchedFriendsList.slice(0, 4).map(friend =>
                    <li key={friend.id}>
                        <figure>
                            <img src={friend.profilePicturePath} alt="" onClick={() => history.push(`profile/${friend.email}`)}/>
                            {/* <span className="status f-online" />
                        </figure>
                        <div className="friendz-meta">
                            <a href={`/profile/${friend.email}`}>{`${friend.firstName} ${friend.lastName}`}</a>
                        </div>
                    </li>
                )}
            </ul>
              </Form>
            </div>
          </li> */}
          <li>
          <div className="search">
  <input type="text" className="searchTerm" placeholder="Search Shareup Members..." />
</div>

          </li>
          <li>
             <div className="noti">
            <a href="#" title="Notification" data-ripple>
              <i className="ti-bell" /><span>20</span>
            </a>
            <div className="dropdowns">
              <span>4 New Notifications</span>
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
                  <a href="/notifications" title="notif">
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
              <a href="/notifications" title="notif" className="more-mesg">view more</a>
            </div>
            </div>
          </li>
          <li>
          <div className="mssg">
            <a href="#" title="Messages" data-ripple><i className="ti-comment" /><span>12</span></a>
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
          <img onClick={() => setShowUserSettings(!showUserSettings)} src={user.profilePicturePath ? user.profilePicturePath : "../assets/images/resources/admin.jpg"} style={{maxWidth: '51.5px', maxHeight: '51.5px', width: '51.5px', height: '51.5px'}} alt="" />
          <span className="status f-online" />
          {
            showUserSettings && (
              <div className="user-setting active">
              <a href="#!" title="notif"><span className="status f-online" />online</a>
              <a href="#" title="notif"><span className="status f-away" />away</a>
              <a href="#" title="notif"><span className="status f-off" />offline</a>
              <a href="/profile"><i className="ti-user"  /> view profile</a>
              <a href="/editprofile" title="notif"><i className="ti-pencil-alt" />edit profile</a>
              <a href="Activity" title="notif"><i className="ti-target" />activity log</a>
              <a href="Security" title="notif"><i className="ti-settings" />account setting</a>
              <a href="#!" title="Logout" onClick={handleLogout}><i className="ti-power-off"/>log out</a>
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