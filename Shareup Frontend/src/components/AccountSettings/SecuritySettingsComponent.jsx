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
import DropdownComponent from './DropdownPrivacyComponent';
import DropdownOnComponent from './DropdownOnComponent';
import DropdownLimitsComponent from './DropdownLimitsComponent';

import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import Layout from '../LayoutComponent';

export default function SecuritySettingsComponent() {
    const { user } = useContext(UserContext)
    const [show, setShow] = useState('general')
    const [showField, setshowField] = useState('')
    const [showS, setshowS] = useState('')
    const [searchedUser, setSearchedUser] = useState([]);
    const [allUser, setAllUser] = useState([]);
   
    
  
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




    const addfield = () => {
      if (showField === 'editname') {
        return (<>
          <li className="bckgrnd"> <div style={{flex:1, textAlign: 'center',paddingTop:'10px',fontSize:'14px'}}><p >Name</p></div>
                  <div className="right-settings-details-input"><input type="text" /></div>
                  </li>
                  <li className="bckgrnd"><div className="scrtySave"><a href="#">Save</a></div>
                  </li>
                  
            </>
        )
      }
    }
      const adduname = () => {
      if (showField === 'username'){
        return (<>
<li className="bckgrnd"> <div style={{flex:1, textAlign: 'center',paddingTop:'10px',fontSize:'14px'}}><p >User Name</p></div>
                  <div className="right-settings-details-input"><input type="text" /></div>
                  </li>
                  <li className="bckgrnd"><div className="scrtySave"><a href="#">Save</a></div>
                  </li>

        </>
        )
      }
    }
    const addph = () => {
      if (showField === 'phno'){
        return (<>
<li className="bckgrnd"> <div style={{flex:1, textAlign: 'center',paddingTop:'10px',fontSize:'14px'}}><p >Mobile</p></div>
                  <div className="right-settings-details-input"><input type="text" /></div>
                  </li>
                  <li className="bckgrnd"><div className="scrtySave"><a href="#">Save</a></div>
                  </li>

        </>
        )
      }
    }
    const forgotpwd = () => {
      if (showField === 'frgtpswd'){
        return (<>
<li className="bckgrnd"> <div style={{flex:1, textAlign: 'center',paddingTop:'10px',fontSize:'14px'}}><p >Current Password</p></div>
                  <div className="right-settings-details-input"><input type="text" /></div>
                  </li>
                  <li className="bckgrnd"> <div style={{flex:1, textAlign: 'center',paddingTop:'10px',fontSize:'14px'}}><p >New Password</p></div>
                  <div className="right-settings-details-input"><input type="text" /></div>
                  </li>
                  <li className="bckgrnd"> <div style={{flex:1, textAlign: 'center',paddingTop:'10px',fontSize:'14px'}}><p >Repeat Password</p></div>
                  <div className="right-settings-details-input"><input type="text" /></div>
                  </li>
                  <li className="bckgrnd"><div className="scrtySave"><a href="#">Save</a></div>
                  </li>

        </>
        )
      }
    }
    const loginInfo = () => {
      if (showField === 'logininfo'){
        return (<>
<li className="bckgrnd"> <div className="buttnScrty"><button className="buttonLoginInfo active" >Save Your Login Info</button></div>
                  </li>
                  <li className="bckgrnd"><div className="buttnScrty"> <button className="buttonLoginInfo" >Remove Account</button></div>
                  </li>
                  

        </>
        )
      }
    }
    const notif = () => {
      if (showField === 'notif'){
        return (<>
                  
                  <li className="bckgrnd pdngLft"> <input type="radio" value="Male" name="gender" /> Male</li>
                  <li className="bckgrnd pdngLft">  <input type="radio" value="Female" name="gender" /> Female</li>
                  <li className="bckgrnd pdngLft"> <input type="radio" value="Other" name="gender" /> Other</li>

        </>
        )
      }
    }
    const frndSrch = () => {
      if (showField === 'frndSrch'){
        return (<>
                  
                  <li className="bckgrnd"> <div className="buttnScrty">Choose the friend you trust to help you when you have trouble in logging</div></li>
                  <li className="bckgrnd">  <div className="buttnScrty"><div class="friends-search-container-Scrty">
            <i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Users" name="s" onChange={handleSearchedUser} />
        </div></div></li>
                 

        </>
        )
      }
    }
    const changeView = () => {
      if (show === 'general') {
        return (
          <div className="right-settings settngPadding">
            <div className="right-settings-content">
            <div className="right-settings-bio-top">
                  <p className="clrHead">General Settings</p>
                </div>
          
             
         
                <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">Name</p>
                  <div className="right-settings-details">
                  <ul>
                  <li><p className="secrtySec">name</p>   {
              showField === "editname" ?<p className="secrtyEdt active" onClick={() => setshowField('editname')}>Edit</p>:
              <p className="secrtyEdt" onClick={() => setshowField('editname')}>Edit</p>}
              </li>
              {addfield()}
                  </ul></div>
                 
                </div>
                </div>
                
                <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">UserName</p>
                  <div className="right-settings-details">
                  <ul>
                  <li><p className="secrtySec">https://shareup.qa/name<br/></p> {
              showField === "editname" ?<p className="secrtyEdt active" onClick={() => setshowField('username')}>Edit</p>:
              <p className="secrtyEdt" onClick={() => setshowField('username')}>Edit</p>}</li>
                  {adduname()}
                  </ul></div>
                 
                </div>
                </div>
                <div className="right-settings-bio firstElement">
                <div className="right-settings-bio-top">
                  <p className="clr">Phone Number</p>
                  <div className="right-settings-details">
                  <ul>
                  <li ><p className="secrtySec">number<br/></p> {
              showField === "editname" ?<p className="secrtyEdt active" onClick={() => setshowField('phno')}>Edit</p>:
              <p className="secrtyEdt" onClick={() => setshowField('phno')}>Edit</p>}</li>
                  {addph()}
                  </ul></div>
                 
                </div>
                </div>
              
              </div>
          </div>
        )
      }
      if (show === "security") {
        return (
          <div className="right-settings settngPadding">
            <div className="right-settings-content">
            <div className="right-settings-bio-top">
                  <p className="clrHead">Security Settings</p>
                </div>
          
              <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">Login</p>
                  <div className="right-settings-details">
                  <ul>
                  <li className="firstElement"><p className="secrtySec">Change Password<br/><span className="scnd">Use Strong Password</span></p> {
              showField === "editname" ?<p className="secrtyEdt active" onClick={() => setshowField('frgtpswd')}>Edit</p>:
              <p className="secrtyEdt" onClick={() => setshowField('frgtpswd')}>Edit</p>}</li>
                  {forgotpwd()}
                  
                  <li><p className="secrtySec">Save your login info<br/><span className="scnd">It will only be saved on the browsers and devices you choose</span></p> {
              showField === "editname" ?<p className="secrtyEdt active" onClick={() => setshowField('logininfo')}>Edit</p>:
              <p className="secrtyEdt" onClick={() => setshowField('logininfo')}>Edit</p>}</li>
                  {loginInfo()}
                  
                  </ul></div>
                 
                </div>
                </div>
                <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">Setting Up Extra Security</p>
                  <div className="right-settings-details">
                  <ul>
                  <li className="firstElement"><p className="secrtySec">Get alerts about unrecognized logins<br/><span className="scnd">We'll let you know if anyone logs in from a device or browser you don't usually use</span></p>
                  {
              showField === "editname" ?<p className="secrtyEdt active" onClick={() => setshowField('notif')}>Edit</p>:
              <p className="secrtyEdt" onClick={() => setshowField('notif')}>Edit</p>}</li>
                  {notif()}
                  <li><p className="secrtySec">Choose 3 to 5 friends to contact if you get locked out<br/><span className="scnd">Your trusted contacts can send a code and URL from ShareUp to help you log back in</span></p>
                  {
              showField === "editname" ?<p className="secrtyEdt active" onClick={() => setshowField('frndSrch')}>Edit</p>:
              <p className="secrtyEdt" onClick={() => setshowField('frndSrch')}>Edit</p>}</li>
                  {frndSrch()}
                  </ul></div>
                 
                </div>
                </div>
                <div className="right-settings-bio">
                  <p className="clrHead pdngbtm">Privacy Settings</p>
                </div>
         
                <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">Activity</p>
                  <div className="right-settings-details">
                  <ul>
                  <li className="firstElement"><p className="secrtySec">Who can see your future posts?<br/></p>
                  <DropdownComponent/>
                  </li>
            
                  <li className="firstElement"><p className="secrtySec">Limit the audience for posts you've shared with friends of friends or Public?<br/></p>
                  <DropdownLimitsComponent/>
                  </li>
                  <li><p className="secrtySec">Who can see the people, Pages and lists you follow?<br/></p>
                  <DropdownComponent/>
                  </li>
                  
                  </ul></div>
                 
                </div>
                </div>
                
                <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">Activity</p>
                  <div className="right-settings-details">
                  <ul>
                  <li className="firstElement"><p className="secrtySec">Who can send you friend requests?<br/></p>
                  <DropdownComponent/>
                  </li>
                  <li className="firstElement"><p className="secrtySec">Who can see your friends list?<br/></p>
                  <DropdownComponent/>
                  </li>
                  <li className="firstElement"><p className="secrtySec">Who can look you up using the email address you provided?<br/></p>
                  <DropdownComponent/>
                  </li>
                  <li><p className="secrtySec">Who can look you up using the phone number you provided?<br/></p>
                  <DropdownComponent/>
                  
                  </li>

                  </ul></div>
                 
                </div>
                </div>
                
              
              </div>
          </div>
        )
      }
      if (show === "location") {
        return (
          <div className="right-settings settngPadding">
          <div className="right-settings-content">
          <div className="right-settings-bio-top">
                <p className="clrHead">Location Settings</p>
              </div>
        
           
       
              <div className="right-settings-bio firstElement">
              <div className="right-settings-bio-top">
                <p className="clr">Location</p>
                <div className="right-settings-details">
                <ul>
                <li><p className="secrtySec">Turn on Location for your mobile devices?</p>
                <DropdownOnComponent/>
                </li>
                
                </ul></div>
               
              </div>
              </div>
              
              
            </div>
        </div>
        )
      }
      if (show === "language") {
        return (
          <div className="right-settings settngPadding">
            <div className="right-settings-content">
            <div className="right-settings-bio-top">
                  <p className="clrHead">Language and Region Settings</p>
                </div>
          
             
         
                <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">Shareup Language</p>
                  <div className="right-settings-details">
                  <ul>
                  <li><p className="secrtySec">Language for buttons, titles and other text from Shareup for this account.</p><p className="secrtyEdt">English(UK)</p></li>
                  
                  </ul></div>
                 
                </div>
                </div>
                
                <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">Posts from friends and Pages</p>
                  <div className="right-settings-details">
                  <ul>
                  <li className="firstElement"><p className="secrtySec">Language into which you’d like to have posts translated<br/></p><p className="secrtyEdt">English</p></li>
                  <li className="firstElement"><p className="secrtySec">Languages for which you don’t want to be offered translations<br/></p><p className="secrtyEdt">English, Indonesian,
Arabic</p></li>
<li><p className="secrtySec">Languages that you don’t want to be automatically translated<br/></p><p className="secrtyEdt">English, Indonesian,
Arabic</p></li>
                  </ul></div>
                 
                </div>
                </div>
                <div className="right-settings-bio firstElement">
                <div className="right-settings-bio-top">
                  <p className="clr">Multilingual posts</p>
                  <div className="right-settings-details">
                  <ul>
                  <li ><p className="secrtySec">A feature that lets you post multiple language versions
of a status.<br/></p>
<DropdownOnComponent/>
</li>
                  
                  </ul></div>
                 
                </div>
                </div>
              
              </div>
          </div>
        )
      }
      if (show === "profile") {
        return (
          <div className="right-settings settngPadding">
            <div className="right-settings-content">
            <div className="right-settings-bio-top">
                  <p className="clrHead">Profile and Tagging Settings</p>
                </div>
          
             
         
                <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">Viewing and Sharing</p>
                  <div className="right-settings-details">
                  <ul>
                  <li className="firstElement"><p className="secrtySec">Who can post on your profile?</p><DropdownComponent/></li>
                  <li className="firstElement"><p className="secrtySec">Who can see what others post on your profile?</p><DropdownComponent/></li>
                  <li className="firstElement"><p className="secrtySec">Allow others to share your posts to their story?</p><DropdownOnComponent/></li>
                  <li><p className="secrtySec">Who can see what others post on your profile?</p><DropdownOnComponent/></li>
                  </ul></div>
                 
                </div>
                </div>
                
                <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">Posts from friends and Pages</p>
                  <div className="right-settings-details">
                  <ul>
                  <li className="firstElement"><p className="secrtySec">Who can see posts that you're tagged in on your profile?<br/></p><DropdownComponent/></li>
                  <li><p className="secrtySec">When you're tagged in a post, who do you want to add to the audience of the post if they can't already see it?<br/></p><DropdownComponent/></li>
  </ul></div>
                 
                </div>
                </div>
                <div className="right-settings-bio firstElement">
                <div className="right-settings-bio-top">
                  <p className="clr">Reviewing</p>
                  <div className="right-settings-details">
                  <ul>
                  <li className="firstElement"><p className="secrtySec">Review posts that you're tagged in before the post appears on your profile?<br/></p><DropdownOnComponent/></li>
                  <li className="firstElement"><p className="secrtySec">Review what other people see on your profile.<br/></p><DropdownOnComponent/></li>
                  <li ><p className="secrtySec">Review tags that people add to your posts before the tags appear on Shareup?<br/></p><DropdownOnComponent/></li>
                  </ul></div>
                 
                </div>
                </div>
              
              </div>
          </div>
        )
      }
      if (show === "publicpost") {
        return (
          <div className="right-settings settngPadding">
            <div className="right-settings-content">
            <div className="right-settings-bio-top">
                  <p className="clrHead">Public Post Filters and Tools</p>
                </div>
          
             
         
                <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">Who Can Follow Me</p>
                  <div className="right-settings-details">
                  <ul>
                  <li className="firstElement"><p className="secrtySec">Followers see your posts in NewsFeed. Friends follow your posts 
by default, but you can also allow people who are not your friends
 to follow your public posts. Use this setting to chose who can 
follow you </p><DropdownComponent/></li>
                  <li className="firstElement"><p className="secrtySec">Allow others to share your posts to their story?</p><DropdownOnComponent/></li>
                  <li className="firstElement"><p className="secrtySec">Who can see what others post on your profile?</p><DropdownComponent/></li>
                  <li><p className="secrtySec">Who can see what others post on your profile?</p><DropdownOnComponent/></li>
                  </ul></div>
                 
                </div>
                </div>
                
                <div className="right-settings-bio">
                <div className="right-settings-bio-top">
                  <p className="clr">Public Post Comments</p>
                  <div className="right-settings-details">
                  <ul>
                  <li className="firstElement"><p className="secrtySec">Who can comment on your public posts? Public<br/></p><DropdownComponent/></li>
                  <li><p className="secrtySec">When you're tagged in a post, who do you want to add to the audience of the post if they can't already see it?<br/></p><DropdownComponent/></li>
  </ul></div>
                 
                </div>
                </div>
                <div className="right-settings-bio firstElement">
                <div className="right-settings-bio-top">
                  <p className="clr">Off-Shareup Previews</p>
                  <div className="right-settings-details">
                  <ul>
                  <li className="firstElement"><p className="secrtySec">Who can like or comment on your public profile pictures
and other profile info? Friends<br/></p><DropdownComponent/></li>
                  <li className="firstElement"><p className="secrtySec">Get Notifications from public<br/></p><DropdownOnComponent/></li>
                  <li ><p className="secrtySec">Review tags that people add to your posts before the tags appear on Shareup?<br/></p><DropdownOnComponent/></li>
                  </ul></div>
                 
                </div>
                </div>
              
              </div>
          </div>
        )
      }
      return (<div className="right-settings"></div>)
    }
    return (
      <>
      <ShareupInsideHeaderComponent />
      <div className="central-settings">
        <div className="left-settings settngPadding">
          <div>
            <h1>Settings</h1>
            {
              show === "general" ? <div className="settings-list active" onClick={() => setShow('general')}><img src="assets/images/gnrlstng.svg"/><p>General</p></div> : <div className="settings-list" onClick={() => setShow('general')}><img src="assets/images/gnrlstng.svg"/><p>General</p></div>
            }
            {
              show === "security" ? <div className="settings-list active" onClick={() => setShow('security')}><img src="assets/images/scrtyStng.svg"/><p>Security and Privacy</p></div> : <div className="settings-list" onClick={() => setShow('security')}><img src="assets/images/scrtyStng.svg"/><p>Security and Privacy</p></div>
            }
            {
              show === "location" ? <div className="settings-list brdrbtmEdtprf active" onClick={() => setShow('location')}><img src="assets/images/locstng.svg"/><p>Location</p></div> : <div className="settings-list brdrbtmEdtprf" onClick={() => setShow('location')}><img src="assets/images/locstng.svg"/><p>Location</p></div>
            }
            
            
            {
              show === "language" ? <div className="settings-list active" onClick={() => setShow('language')}><img src="assets/images/langstng.svg"/><p>Language and region</p></div> : <div className="settings-list" onClick={() => setShow('language')}><img src="assets/images/langstng.svg"/><p>Language and region</p></div>
            }
            
            {
              show === "profile" ? <div className="settings-list active" onClick={() => setShow('profile')}><img src="assets/images/userstng.svg"/><p>Profile and Tags</p></div> : <div className="settings-list" onClick={() => setShow('profile')}><img src="assets/images/userstng.svg"/><p>Profile and Tags</p></div>
            }
            

{
              show === "publicpost" ? <div className="settings-list active" onClick={() => setShow('publicpost')}><img style={{height:'22px'}} src="assets/images/pblcstng.svg"/><p>Public Posts</p></div> : <div className="settings-list" onClick={() => setShow('publicpost')}><img style={{height:'22px'}} src="assets/images/pblcstng.svg"/><p>Public Posts</p></div>
            }

          </div>
        </div>

        {
          changeView()
        }

      </div>
</>
    )
}