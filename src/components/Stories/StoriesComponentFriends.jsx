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

function StoriesComponentFriends({ story, setRefresh }) {
  let history = useHistory();
  const { user } = useContext(UserContext);
  const [index, setIndex] = useState(0);
  const [storiesForUserFriends, setStoriesForUserFriends] = useState([]);
  const [FriendsStories, setFriendsStories] = useState([]);

  const [stories, setStories] = useState([]);
  const [userR, setUserR] = useState([]);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const getStoriesForFriendsUser = async () => {
    await StoriesService.getStoriesForUserFriendsNew(user?.id).then((res) => {
      setStoriesForUserFriends(res.data);
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
}
function getFileExtension(filename){
  // const extension = filename.split('.').pop();
  // return extension;
}

  useEffect(() => {
    getUser();
    getStoriesForFriendsUser();
    testScript();
  }, [FriendsStories]);


  return (
    <div className="strysggstion-card">
      <div className="strysggstion-Profimg" style={{borderColor:'yellowgreen'}}>
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
        <span>{storiesForUserFriends.length}</span>
      </div>
      <a href="#">
        <div className="strysggstion-imgStry" id="stry-number-hover">
        <a href="#!">
            {story.storyType === "image" ? (
              <img
                src={fileStorage.baseUrl + story.storiesMediaPath}
                alt=""
                className="zoom-story-img"
              />
            ) : (
              <video
                preload="none"
                loop
                controls={false}
                autoPlay
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "fill",
                }}
                src={`${fileStorage.baseUrl}${story.storiesMediaPath}`}
                type="video/mp4"
                alt={`${fileStorage.baseUrl}${story.storiesMediaPath}`}
              />
            )}
          </a>
          <div className="strysggstion-imgStry-overlay">

          </div>
          <div className="strysggstion-imgStry-number d-flex align-items-end" onClick={checkPop}>
            <span className='text-light p-2' style={{fontSize:'0.8rem'}}>{story.user.firstName} {story.user.lastName}</span>
          </div>
        </div>
      </a>
    </div>
  );
}
export default StoriesComponentFriends;