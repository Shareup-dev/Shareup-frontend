import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import AuthService from "../../services/auth.services";
import SimpleReactLightbox from "simple-react-lightbox";
import { testScript } from "../../js/script";
import GroupService from "../../services/GroupService";
import StoriesService from "../../services/StoriesService";
import Carousel from "react-bootstrap/Carousel";
import settings from "../../services/Settings";
import Modal from "react-modal";
import Popup from "reactjs-popup";
import fileStorage from "../../config/fileStorage";





function StoriesComponent({ story, setRefresh }) {
  let history = useHistory();
  const { user } = useContext(UserContext);
  // const []
  // const inputRef = createRef();
  const [index, setIndex] = useState(0);
  const [storiesForUser, setStoriesForUser] = useState([]);
  const [storiesForUserFriends, setStoriesForUserFriends] = useState([]);
  const [FriendsStories, setFriendsStories] = useState([]);

  const [stories, setStories] = useState([]);
  const [userR, setUserR] = useState([]);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const getStoriesForUser = async () => {
    await StoriesService.getStoriesForUser(
      AuthService.getCurrentUser().username
    ).then((res) => {
      const sorting = res.data.sort(function (a, b) {
        let dateA = new Date(a.date),
          dateB = new Date(b.date);
        return dateB - dateA;
      });
      const uniqueStories = Array.from(new Set(sorting.map((a) => a.id))).map(
        (id) => {
          return res.data.find((a) => a.id === id);
        }
      );
      setStoriesForUser(uniqueStories);
    });
  };

  const getUser = async () => {
    if (user === null) {
      await UserService.getUserByEmail(
        AuthService.getCurrentUser().username
      ).then((res) => {
        setUserR(res.data);
      });
    } else {
      setUserR(user);
    }
  };

const checkPop=()=>{
  console.log('popup working');
}

  useEffect(() => {
    getUser();
    getStoriesForUser();
    testScript();
  }, [stories]);

  return (
    <div className="strysggstion-card">
      <div className="strysggstion-Profimg" style={{borderColor:'blue'}}>
        <img src={fileStorage.baseUrl + story.user.profilePicturePath} alt="" />
      </div>
      
      <div
        className="strysggstion-Profimg1 text-light text-center font-weight-bold d-flex align-items-center justify-content-center"
        style={{
          marginLeft: "4rem",
          marginTop: "0.7rem",
          borderRadius: "none !important",
          background: "#03b2cb",
          borderRadius: "0.1rem",
          boxShadow: " 0 3px 6px rgb(84 84 84 / 41%)",
        }}
      >
        {/* <span>{storiesForUser.length - 1}</span> */}
        <span>{storiesForUser.length}</span>
      </div>
      {/* <span style={{display:'inline-block', width:'25px', height:'15px' position:'absolute', left:'10px'}}>{storiesForUser.length}</span> */}
      <a href="#">
        {/* {story.storiesImagePath} data-lightbox={`image-user-${story.user.id}`} */}
        <div className="strysggstion-imgStry" id="stry-number-hover">
          <a href="#!">
            {/* <img src={fileStorage.baseUrl + story.storiesImagePath} alt="" /> */}
            <img src={fileStorage.baseUrl + story.storiesImagePath} alt="" className='zoom-story-img'/>
          </a>
          <div className="strysggstion-imgStry-overlay">
          </div>
          <div className="strysggstion-imgStry-number d-flex align-items-end" onClick={checkPop}>
            {/* <span className='mb-4 text-light'>{storiesForUser.length}</span> */}
            <span className=' text-light p-2' style={{fontSize:'0.8rem'}}>{story.user.firstName} {story.user.lastName}</span>

          </div>
        </div>
      </a>
    </div>

    
  );
}
export default StoriesComponent;