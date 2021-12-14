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
import styled from "styled-components";
// import './button.css';
// import '../../css/SliderJava';

function DisplayComponent() {
  let history = useHistory();

  const { user } = useContext(UserContext);

  // const []

  // const inputRef = createRef();

  const [storiesForUser, setStoriesForUser] = useState([]);
  const [stories, setStories] = useState([]);
  const [storiesS, setStoriesS] = useState([]);
  const [userR, setUserR] = useState([]);

  const [mycolor, setMycolor] = useState([]);

  const delay = 5000;

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  console.log("ashiya beti", delay * index);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
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
      console.log("RUNNING");
      await UserService.getUserByEmail(
        AuthService.getCurrentUser().username
      ).then((res) => {
        setUserR(res.data);
      });
    } else {
      console.log("WALKING" + JSON.stringify(user));
      setUserR(user);
    }
  };
  useEffect(() => {
    testScript();
  }, []);
  useEffect(() => {
    getUser();
    getStoriesForUser();
    testScript();
  }, [stories]);
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setIndex((prevIndex) => (prevIndex === 5 ? 0 : prevIndex + 1)),
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
                  {storiesForUser.map((background, index) => (
                    <>
                      {background.storiesImagePath ? (
                        <div className="slide" key={index} id={index}>
                          <div className="strydisplay-Profimg">
                            <img
                              src={
                                fileStorage.baseUrl +
                                background.user.profilePicturePath
                              }
                              alt=""
                            />
                                  <span >{background.user.firstName} </span>
                                <span style={{marginLeft:'17rem'}}>{index+1}/{storiesForUser.length}</span>

                                  
                          </div>
                          <img
                            className="stryDsplyImg"
                            src={
                              fileStorage.baseUrl + background.storiesImagePath
                            }
                          />
                        </div>
                      ) : null}
                    </>
                  ))}

                </div>

                <div className="slideshowDots">
                  {storiesForUser.map((_, idx) => (
                    <div
                      key={idx} id={idx}
                      className={`slideshowDot${
                        index === idx ? " active" : ""
                      } slider-indicator${idx}`} 
                      onClick={() => {
                        setIndex(idx);
                      }}
                    >
                      <span className="risewidth"></span>
                      <div className="d-inline-block risewidth2"></div>

                    </div>
                  ))}
                </div>

              </div>
            </div>
            <div class="slide-buttons">
            <span
                    id="getnext"
                    onClick={() => {
                      setIndex(index + 1);
                      setMycolor(index);
                      console.log('check set color', mycolor)
                      console.log("looking for -1", index);
                    }}
                  >
                    <i class="fas fa-arrow-right"></i>
                  </span>

              {index > 0 ? (
                <span
                  id="getprev"
                  onClick={() => {
                    setIndex(index - 1);
                  }}
                >
                  <i class="fas fa-arrow-left"></i>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DisplayComponent;
