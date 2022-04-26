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
import ReelsServices from "../../services/ReelsServices";
import PostService from "../../services/PostService";

function MediaComponent({ post, setRefresh }) {
  let history = useHistory();
  const { user } = useContext(UserContext);
  const [index, setIndex] = useState(0);
  const [postsForUserFriends, setPostsForUserFriends] = useState([]);
  const [FriendsStories, setFriendsStories] = useState([]);

  const [stories, setStories] = useState([]);
  const [userR, setUserR] = useState([]);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const getPostsForFriendsUser = async () => {
    await PostService.getPostForUserById(user?.id).then((res) => {
      setPostsForUserFriends(res.data);
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

  useEffect(() => {
    getUser();
    getPostsForFriendsUser();
    testScript();
  }, []);


  return (
    <div className="strysggstion-card">
      <div className="strysggstion-Profimg" style={{borderColor:'transparent'}}>
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
        <span>{postsForUserFriends.length}</span>
      </div>
      <a href="#">
        <div className="strysggstion-imgStry" id="stry-number-hover">
          <a >
            <img src={fileStorage.baseUrl + post.media} alt="" className='zoom-post-img'/>
          </a>
          <div className="strysggstion-imgStry-overlay">

          </div>
          <div className="strysggstion-imgStry-number d-flex align-items-end" onClick={checkPop}>
          </div>
        </div>
      </a>
    </div>
  );
}
export default MediaComponent;