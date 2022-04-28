import React, { useState, useEffect, useContext, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import AuthService from "../../services/auth.services";
import { testScript } from "../../js/script";
import StoriesService from "../../services/StoriesService";
import ShareupInsideHeaderComponent from "../dashboard/ShareupInsideHeaderComponent";
import settings from "../../services/Settings";
import fileStorage from "../../config/fileStorage";
// import './button.css';
// import '../../css/SliderJava';

function DisplayFriendsStoryComponent({ story, setRefresh }) {
  let history = useHistory();

  const { user } = useContext(UserContext);

  // const []

  // const inputRef = createRef();

  const [storiesForUser, setStoriesForUser] = useState([]);
  const [storiesForUserFriends, setStoriesForUserFriends] = useState([]);
  const [stories, setStories] = useState([]);
  const [FriendsStories, setFriendsStories] = useState([]);

  const [storiesS, setStoriesS] = useState([]);
  const [userR, setUserR] = useState([]);

  const delay = 5000;

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  console.log("ashiya beti", delay * index);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };




  const getStoriesForFriendsUser = async () => {
    await StoriesService.getStoriesForUserFriendsNew(user?.id).then((res) => {
      // const sorting = res.data.sort(function (a, b) {
      //   let dateA = new Date(a.date),
      //     dateB = new Date(b.date);
      //   return dateB - dateA;
      // });
      // const uniqueStories = Array.from(new Set(sorting.map((a) => a.id))).map((id) => {
      //   return res.data.find((a) => a.id === id);
      // });
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
  useEffect(() => {
    testScript();
  }, []);


  useEffect(() => {
    getUser();
    getStoriesForFriendsUser();
    testScript();
  }, [FriendsStories]);


  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === storiesForUserFriends.length - 1
            ? setTimeout(
                () =>
                  (document.querySelector(".popup-overlay").style.display =
                    "none"),
                200
              )
            : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);



  return (
    <>
      <div className="stryDsply">
        <div className="container">
          <div className="strydivcontnr">
            <div className="strydiv">
              <div className="slideshow">
                <div
                  className="slideshowSlider"
                  style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}  
                 >
                  {story.map((background, index) => {
                  
                    return(
                      <>
                      {background.image ? (
                        <div className="slide" key={index} id={index}>
                          <div className="strydisplay-Profimg">
                            <img
                              src={
                                fileStorage.baseUrl +
                                background.user.profilePicturePath
                              }
                              alt=""
                            />
                            <span>{background.user.firstName}</span>
                            <div   style={{marginTop: "500px"}}>
                          <span
                              >{background.caption}</span>
                          </div>
                          </div>
                          <img
                          onClick={() => window.clearTimeout(timeoutRef.current)}
                            className="stryDsplyImg"
                            src={
                              fileStorage.baseUrl + background.storiesImagePath
                            }
                          />
                        </div>
                      ) : null}
                  
                    </>
                  )})}
                </div>

                <div className="slideshowDots">
                  {story.map((_, idx) => (
                    <div
                      key={idx}
                      className={`slideshowDot${
                        index === idx ? " active" : ""
                      }`}
                      onClick={() => {
                        setIndex(idx);
                      }}
                    >
                      <span className="risewidth"></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="slide-buttons">
              {index + 1 < story.length ? (
                <span
                  id="getnext"
                  onClick={() => {
                    setIndex(index + 1);
                    console.log("looking for -1", index);
                  }}
                >
                  <i className="fas fa-arrow-right"></i>
                </span>
              ) : (
                ""
              )}

              {index > 0 ? (
                <span
                  id="getprev"
                  onClick={() => {
                    setIndex(index - 1);
                  }}
                >
                  <i className="fas fa-arrow-left"></i>
                </span>
              ) : null}
            </div>
          </div> 
        </div>
      </div>
    </>
  );
}

export default DisplayFriendsStoryComponent;
