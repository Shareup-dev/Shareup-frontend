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
import moment from 'moment';

// import './button.css';
// import '../../css/SliderJava';

function DisplayFriendsStoryComponent({ story, setRefresh }) {
  let history = useHistory();

  const { user } = useContext(UserContext);

  // const []

  // const inputRef = createRef();

  const [storiesForUserFriends, setStoriesForUserFriends] = useState([]);
  const [stories, setStories] = useState([]);
  const [FriendsStories, setFriendsStories] = useState([]);

  const [userR, setUserR] = useState([]);

  const delay = 5000;

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const addViewrsToStories = async (sid) => {
    await StoriesService.addViewrsToStories(sid, user?.id).then((res) => {
      console.log("viewing story working");
    });
  };
  function getFileExtension(filename){
    const extension = filename.split('.').pop();
    return extension;
}
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
                    return (
                      <>
                        {background.image ? (
                          <div className="slide" key={index} id={index}>
                            <div className="strydisplay-Profimg">
                              <div>
                                <img
                                  src={
                                    fileStorage.baseUrl +
                                    background.user.profilePicturePath
                                  }
                                  alt=""
                                />
                                <span>{background.user.firstName}</span>
                                <span style={{ fontWeight: '500', fontSize: '14px' }}>{moment(background.date, "DD MMMM YYYY hh:mm:ss").fromNow(true)}</span>
                              </div>

                            </div>
                            <div className="story-caption-cont">
                              <span style={{ padding: '10px', color: 'white' }}>
                                {background.caption}{" "}
                              </span>
                            </div>
                            {getFileExtension(background.image) !== "mp4" ? (
                              <img
                                onClick={() =>
                                  window.clearTimeout(timeoutRef.current)
                                }
                                className="stryDsplyImg"
                                src={
                                  fileStorage.baseUrl +
                                  background.storiesImagePath
                                }
                              />
                            ) : (
                              <>
                                <video
                                  preload="none"
                                  controls
                                  loop
                                  autoPlay
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "fill",
                                  }}
                                  src={`${fileStorage.baseUrl}${background.storiesImagePath}`}
                                  type="video/mp4"
                                  alt={`${fileStorage.baseUrl}${background.storiesImagePath}`}
                                />
                              </>
                            )}
                          </div>
                        ) : null}
                      </>
                    );
                  })}
                </div>

                <div className="slideshowDots">
                  {story.map((_, idx) => (
                    <div
                      key={idx}
                      className={`slideshowDot${index === idx ? " active" : ""
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
