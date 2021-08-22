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


export default function ActivityComponent() {
  let history = useHistory();
  const [refresh, setRefresh] = useState([]);
  const { user } = useContext(UserContext)

 const handleSearchedFollowers = (event) => {
		if (event.target.value === "") {
			setSearchedFollowers(followers)
		} else {
			let temp = []
			following.map(u => {
				if (u.email.includes(event.target.value)) {
					temp.push(u)
				}
			})
			setSearchedFollowers(temp)
			console.log(temp)
		}
	}
  const handleSearchedFollowing = (event) => {
		if (event.target.value === "") {
			setSearchedFollowing(following)
		} else {
			let temp = []
			following.map(u => {
				if (u.email.includes(event.target.value)) {
					temp.push(u)
				}
			})
			setSearchedFollowing(temp)
			console.log(temp)
		}

	}

  const [following, setFollowing] = useState([]);
	const [searchedFollowing, setSearchedFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
	const [searchedFollowers, setSearchedFollowers] = useState([]);
  // const [show, setShow] = useState('overview')

  // const changeView = () => {
  //   if (show === 'overview') {
  return (
    <>
    <ShareupInsideHeaderComponent />
      
  
    
    <div>
    
    <div className="notifications screen">
          <img className="bibell-VdoMpK" src="../assets/images/img/bi-bell@2x.png" />
          <h1 className="title-VdoMpK">Select a notification to open.</h1>
          <div className="frame-33-VdoMpK" />
          <div className="rectangle-1682-VdoMpK" />
          <div className="group-209-VdoMpK">
            <div className="there-no-activity-yet-rSPf4N">There no activity yet !</div>
            <div className="add-new-friends-more-about-them-rSPf4N">Add new friends to know more about them</div>
          </div>
          {/* <div className="user-profile-1st-page-VdoMpK">
            <div className="rectangle-1464-V4ot17" />
            <img className="ellipse-53-V4ot17" src="../assets/images/img/ellipse-53@2x.png" />
            <div className="share-up-team-V4ot17 roboto-normal-black-16px">Share up Team</div>
            <div className="rectangle-1610-V4ot17" />
            <div className="add-friend-V4ot17 roboto-medium-tuatara-16px">Add Friend</div>
          </div>
          <div className="user-profile-1st-page-GjCthK">
            <div className="rectangle-1464-vBxxsP" />
            <div className="share-up-team-vBxxsP roboto-normal-black-16px">Share up Team</div>
            <div className="rectangle-1610-vBxxsP" />
            <div className="add-friend-vBxxsP roboto-medium-tuatara-16px">Add Friend</div>
            <img className="vector-vBxxsP" src="../assets/images/img/vector@2x.png" />
          </div>
          <div className="user-profile-1st-page-MNeEP2">
            <div className="rectangle-1464-kKjnXx" />
            <div className="share-up-team-kKjnXx roboto-normal-black-16px">Share up Team</div>
            <div className="rectangle-1610-kKjnXx" />
            <div className="add-friend-kKjnXx roboto-medium-tuatara-16px">Add Friend</div>
            <img className="vector-kKjnXx" src="../assets/images/img/vector@2x.png" />
          </div>
          <div className="user-profile-1st-page-x3upxP">
            <div className="rectangle-1464-UdQAqF" />
            <div className="share-up-team-UdQAqF roboto-normal-black-16px">Share up Team</div>
            <div className="rectangle-1610-UdQAqF" />
            <div className="add-friend-UdQAqF roboto-medium-tuatara-16px">Add Friend</div>
            <img className="vector-UdQAqF" src="../assets/images/img/vector@2x.png" />
          </div> */}
          <div className="rectangle-1686-VdoMpK" />
          <div className="group-465-VdoMpK">
            <div className="group-465-81lO47">
              <div className="notifications-00uZrh">Notifications</div>
              <img className="bxbx-dots-horizontal-rounded-00uZrh" src="../assets/images/img/bx-bx-dots-horizontal-rounded@2x.png" />
            </div>
            <div className="group-460-81lO47">
              <div className="group-459-cBQymp">
                {/* <div className="search-bar-aFfxmK">
                  <div className="search-FJ4wsW">
                    <img className="search-bar-4aie67" src="../assets/images/img/search-bar@2x.png" /><img className="search-4aie67" src="../assets/images/img/search@2x.png" />
                  </div> */}
                  <input type="text" id="header-search" placeholder="Search Activities" name="s" onChange={handleSearchedFollowers} />
                  {/* <div className="search-groups-FJ4wsW">Search Groups</div> */}
                {/* </div> */}
                {/* <div className="group-458-aFfxmK">
                  <div className="group-456-Y01lOQ">
                    <div className="rectangle-1620-G95vhJ" />
                    <div className="requests-G95vhJ">Requests</div>
                  </div>
                  <div className="group-457-Y01lOQ">
                    <div className="rectangle-1621-0Rfoht" />
                    <div className="all-friends-0Rfoht">All Friends</div>
                  </div>
                </div> */}
              </div>
              <div className="group-455-cBQymp">
                <div className="group-463-3dZpgf">
                  <div className="group-461-CCng4z">
                    <img className="main-logo-dont-touch-or-edit-jQ9lQU" src="../assets/images/img/main-logo--dont-touch-or-edit-@2x.png" />
                    <div className="new-jQ9lQU">New</div>
                    <p className="youre-not-in-an-your-interests-jQ9lQU roboto-normal-black-16px">
                      You’re not in any groups yet. Join groups to find other people who share your interests.
                    </p>
                    <div className="x6-days-ago-jQ9lQU">6 days ago</div>
                  </div>
                </div>
                <div className="group-462-3dZpgf">
                  <img className="vector-3iiMAm" src="../assets/images/img/vector-3@2x.png" />
                  <div className="earlier-3iiMAm">Earlier</div>
                  <p className="youre-new-to-sh-nds-and-explore-3iiMAm roboto-normal-black-16px">
                    You’re new to shareup. Add friends and explore.
                  </p>
                  <div className="a-week-ago-3iiMAm">a week ago.</div>
                </div>
              </div>
            </div>
          </div>
         
        </div>
        
      </div>
     
  


  </>
  )
}