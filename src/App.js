import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import './css/main.min.css';
import './css/style.css';
import './css/slider.css';

import './css/color.css';
import './css/responsive.css';
import './css/fontawesome/css/all.min.css';
import './css/styleguide.css';
import './css/notifications.css';
import './css/globals.css';
import './css/emojionearea.min.css';
import AuthService from './services/auth.services'

import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';

import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import HeaderComponent from './components/dashboard/HeaderComponent';
import FooterComponent from './components/dashboard/FooterComponent';
import AddFriendsComponent from './components/user/AddFriendsComponent';
import FriendsComponent from './components/user/FriendsComponent';
import NewsfeedComponent from './components/user/NewsfeedComponent';
import ChatComponent from './components/chat/ChatComponent';
import Index from './components/user/Index';
import UserService from './services/UserService';
import UserContext from './contexts/UserContext';
import GroupListComponent from './components/group/GroupListComponent';
import ProfileComponent from './components/user/ProfileComponent';
import ViewGroupComponent from './components/group/ViewGroupComponent';
import ViewGroupComponent1 from './components/group/ViewGroupComponent1';

import AboutComponent from './components/user/AboutComponent';
import PrivacyPolicyComponent from './components/user/PrivacyPolicyComponent';
import { testScript } from './js/script';
import ProtectedRoute from './components/ProtectedRoute';
import CreateGroupComponent from './components/group/CreateGroupComponent';
import OtherProfileComponent from './components/user/OtherProfileComponent';
import RegisterSuccessfulComponent from './components/user/RegisterSuccessfulComponent';
import CreateGroupComponentMain from './components/group/CreateGroupComponentMain';
import GuideComponent from './components/user/GuideComponent';
import NotificationChatComponent from './components/user/NotificationChatComponent';
import ShareFeedComponent from './components/user/ShareFeedComponent';
import SwapFeedComponent from './components/user/SwapFeedComponent';
import ReelFeedComponent from './components/user/ReelFeedComponent';
import ActivityComponent from './components/user/ActivityComponent';
import SecuritySettingsComponent from './components/AccountSettings/SecuritySettingsComponent';
import HangGiftComponent from './components/Hang/HangGiftComponent';
import ShippingComponent from './components/Hang/ShippingComponent';
import CheckoutComponent from './components/Hang/CheckoutComponent';
import EditProfileComponent from './components/user/EditProfileComponent';
import SwapComponent from './components/SwapPoint/SwapComponent';
import PayConfirmComponent from './components/Hang/PayConfirmComponent';
import SavedSharesComponent from './components/post/SavedSharesComponent';
import ShareItemComponent from './components/share/ShareItemComponent';
import ChatTestComponent from './components/ChatTest/ChatTestComponent';
import DisplayComponent from './components/Stories/DisplayComponent';
import MessagesComponent from './components/Messages/MessagesComponent';
import LocationComponent from './components/AccountSettings/LocationComponent';
import SearchFeedComponent from './components/user/SearchFeedComponent';
import EditGroupComponent from './components/group/EditGroupComponent';
import StoriesFeedComponent from './components/Stories/StoriesFeedComponent'

import Loader from './components/loader/loader'


import Giphy from './components/Giphy';
import NotificationFeedComponent from './components/Notification/NotificationFeedComponent';
import URLpostComponent from './components/post/URLPostComponent';
import URLPostComponent from './components/post/URLPostComponent';


// import StoriesComponentMain from './components/Stories/StoriesComponent';
function App() {
  testScript()
  let history = useHistory();

  const [jwtUser, setJwtUser] = useState(AuthService.getCurrentUser())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const userAuthenticator = async () => {
    await AuthService.setCurrentUser(jwtUser)
    let user = null
    if (jwtUser) {  
      setLoading(true);
      UserService.getUserByEmail(jwtUser.username).then(res => {
        setUser(res.data);
     }).finally(_=> setLoading(false));
    }
    
  }

  useEffect(() => {
    // window.scrollTo(0, 0);
    userAuthenticator()
  }, [jwtUser]);

  // useEffect(() => {
  //   AuthService.setCurrentUser(jwtUser)
  // }, []);
  
  const logout = () => {
    AuthService.logout();
  }

Giphy();


  return (
    <UserContext.Provider value={{ user }}>
    {
      loading ? <Loader />:(      
      <Router>
        <HeaderComponent />
          <Switch>
          <Route path="/" exact><Index set={setJwtUser} setUser={setUser}/></Route>
          <Route path="/about">
            <AboutComponent/>
          </Route>
          <Route path="/privacyPolicy">
            <PrivacyPolicyComponent/>
          </Route>
          <ProtectedRoute path="/newsfeed" component={NewsfeedComponent}></ProtectedRoute>
          <ProtectedRoute path="/shareFeed" component={ShareFeedComponent}></ProtectedRoute>
          <ProtectedRoute path="/notifications" component={NotificationChatComponent}></ProtectedRoute>
          <ProtectedRoute path="/new-user" component={GuideComponent}></ProtectedRoute>
          <ProtectedRoute path="/group/create" component={CreateGroupComponentMain}></ProtectedRoute>
          <ProtectedRoute path="/groups/:id/edit" component={EditGroupComponent}></ProtectedRoute>
          <ProtectedRoute path="/groups/:id" component={ViewGroupComponent1}></ProtectedRoute>
          <ProtectedRoute path="/groups/" component={GroupListComponent}></ProtectedRoute>
          <ProtectedRoute path="/profile/:email" component={OtherProfileComponent}></ProtectedRoute>
          <ProtectedRoute path="/profile" component={ProfileComponent}></ProtectedRoute>
          <ProtectedRoute path="/Addfriends" component={AddFriendsComponent}></ProtectedRoute>
          <ProtectedRoute path="/friends" component={FriendsComponent}></ProtectedRoute>
          <ProtectedRoute path="/chat" component={ChatComponent}></ProtectedRoute>
          <ProtectedRoute path="/messages" component={MessagesComponent}></ProtectedRoute>
          {/* <ProtectedRoute path="/swappoint" component={SwappointComponent}></ProtectedRoute> */}
		  <ProtectedRoute path="/shareFeed" component={ShareFeedComponent}></ProtectedRoute>
      <ProtectedRoute path="/share" component={ShareItemComponent}></ProtectedRoute>
      <ProtectedRoute path="/Activity" component={ActivityComponent}></ProtectedRoute>
      <ProtectedRoute path="/Security" component={SecuritySettingsComponent}></ProtectedRoute>
      <ProtectedRoute path="/HangGift" component={HangGiftComponent}></ProtectedRoute>
      <ProtectedRoute path="/shipping" component={ShippingComponent}></ProtectedRoute>
      <ProtectedRoute path="/checkout" component={CheckoutComponent}></ProtectedRoute>
      <ProtectedRoute path="/editprofile" component={EditProfileComponent}></ProtectedRoute>
      <ProtectedRoute path="/swap" component={SwapComponent}></ProtectedRoute>
      <ProtectedRoute path="/swapFeed" component={SwapFeedComponent}></ProtectedRoute>
      <ProtectedRoute path="/savedShares" component={SavedSharesComponent}></ProtectedRoute>
      <ProtectedRoute path="/swappost" component={SwapFeedComponent}></ProtectedRoute>
      <ProtectedRoute path="/PaymentConfirmation" component={PayConfirmComponent}></ProtectedRoute>
      <ProtectedRoute path="/chatTest" component={ChatTestComponent}></ProtectedRoute>
      <ProtectedRoute path="/stry" component={DisplayComponent}></ProtectedRoute>
      <ProtectedRoute path="/loc" component={LocationComponent}></ProtectedRoute>
      <ProtectedRoute path="/searchFeed" component={SearchFeedComponent}></ProtectedRoute>
      <ProtectedRoute path="/reelFeed" component={ReelFeedComponent}></ProtectedRoute>
      <ProtectedRoute path="/storiesFeed" component={StoriesFeedComponent}></ProtectedRoute>
      <ProtectedRoute path="/notificationsNew" component={NotificationFeedComponent}></ProtectedRoute>
      <ProtectedRoute path="/post/:postID" component={URLPostComponent}></ProtectedRoute>


    
      
      {/* <ProtectedRoute path="/stories" component={StoriesComponent}></ProtectedRoute> */}
        </Switch>
      </Router>
      )
    }
    </UserContext.Provider>
  );
}

export default App;
