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
import ReelsServices from "../../services/ReelsServices";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReelCommentComponent from "./ReelCommentComponent";
import $ from 'jquery'
import SavedService from "../../services/SavedService";


function DisplayFriendsReelsComponent(props) {
  
  let history = useHistory();

  const { user } = useContext(UserContext);
  const [reelsForUserFriends, setReelsForUserFriends] = useState([]);
  const [FriendsReels, setFriendsStories] = useState([]);
  const [userR, setUserR] = useState([]);
  const [index, setIndex] = useState(props.index);
  const timeoutRef = useRef(null);
  const [reel, setReel] = useState(props.reel);
  const [commentsShowFlag, setCommentsShowFlag] = useState(false);
  const [showDropdn, setShowDropdn] = useState(false);
  const [videoPause, setVideoPause] = useState(false);
  const [muteVideo, setMuteVideo] = useState(false);




  const getReelsForFriendsUser = async () => {
    await ReelsServices.getReelForUserFriends(user?.id).then((res) => {
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
      setReelsForUserFriends(res.data);
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
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDeleteReel = (reelId) => {
    ReelsServices.deleteReel(reelId).then((res) => {
      props.setRefresh(res.data);
    });
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    testScript();
  }, []);

  useEffect(() => {
    getUser();
    setReel(props.reel)
    // getReelsForFriendsUser();
    testScript();
  }, [props.reel]);
  const likeReel = async (reelId, reaction) => {
    props.likeReel(reelId, reaction)
  }
  const checkIfLiked = (reel) => {
    if (reel.likedType === 'star') {
      return true;
    }
    return false;

  }
  const commentCliked = () => {
    setCommentsShowFlag(!commentsShowFlag)
  }
  const pauseVideo = () => {
    $('video').trigger('pause');
    setVideoPause(true)
  }
  const playVideo = () => {
    $('video').trigger('play');
    setVideoPause(false)
  }
  const muteVideoClick = () => {
    setMuteVideo(!muteVideo)
    if (!muteVideo) {

      $('video').prop('muted', true);
    } else {
      $('video').prop('muted', false);

    }
  }
  const saveReel = (reelId) =>{
    SavedService.saveAllPosts(user.id,reelId).then((res)=>{
      console.log(res.data)
    })
  }
  return (
    <>
      <div className="container reel-container">
        <div className="strydivcontnr">
          <div className="strydiv" style={commentsShowFlag ? { width: '100%' } : {}}>
            <div className="slideshow" style={commentsShowFlag ? { maxWidth: '65%' } : { width: '100%' }}>
              <div
                className="slideshowSlider"
              // style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
              >
                <>
                  {reel.video_name ? (
                    <div className="slide" id={index}>
                      <div className="slide-reel-cont" style={commentsShowFlag ? { width: '51%', position: 'relative' } : {}} >

                        <div
                          className="reeldisplay-Profimg"
                        >
                          <div className="d-flex justify-content-between">
                            <div>
                              <img
                                src={
                                  fileStorage.baseUrl +
                                  reel.userdata.profilePicturePath
                                }
                                alt=""
                              />
                              <span >
                                {reel.userdata.firstName}  {"" + reel.userdata.lastName}
                              </span>
                            </div>
                            <div style={{ zIndex: "100", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              {muteVideo
                                ? <div onClick={muteVideoClick} style={{ marginRight: '15px', color: 'white' }}>
                                  <i className="fas fa-volume-up"></i>

                                </div>
                                : <div onClick={muteVideoClick} style={{ marginRight: '15px', color: 'white' }}>
                                  <i className="fas fa-volume-mute"></i>

                                </div>
                              }
                              {videoPause
                                ? <div onClick={playVideo}>
                                  <i className="fa fa-play" style={{ color: 'white' }}></i>

                                </div>
                                : <div onClick={pauseVideo}>
                                  <i className="fa fa-pause" style={{ color: 'white' }}></i>

                                </div>
                              }
                              <DropdownButton
                                // style={{marginLeft: "400px" }}
                                className={`bi bi-three-dots-vertical`}
                                title={<i className="las la-ellipsis-v" style={{ fontSize: '20px' }}></i>}
                                onClick={() =>
                                  window.clearTimeout(timeoutRef.current)
                                }
                              >
                                <Dropdown.Item
                                  type="button"
                                  onClick={() =>
                                   saveReel(reel.id)
                                  }
                                >
                                  <i className="lar la-bookmark" ></i>
                                  <span>Save Reel</span>
                                </Dropdown.Item>
                                {
                                  reel.userdata && user.id === reel.userdata.id ?
                                    <Dropdown.Item
                                      type="button"
                                      onClick={() => {
                                        handleDeleteReel(reel.id)
                                      }}
                                    >
                                      <i className="las la-trash"></i>
                                      <span>Delete</span>
                                    </Dropdown.Item>
                                    : null
                                }

                                <Dropdown.Item
                                  type="button"

                                >
                                  <i className="las la-link"></i>
                                  <span>Copy Link</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  type="button"

                                >
                                  <i className="fas fa-share"></i>
                                  <span>Share to</span>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  type="button"

                                >
                                  <i className="fas fa-flag"></i>
                                  <span>Report</span>
                                </Dropdown.Item>
                              </DropdownButton>
                            </div>
                          </div>

                        </div>
                        <>
                          <video
                            preload="none"

                            loop
                            autoPlay
                            style={commentsShowFlag ?
                              {
                                width: "100%",
                                height: "100%",
                                objectFit: "fill",
                                borderBottomRightRadius: 0, borderTopRightRadius: 0
                              } : {
                                width: "100%",
                                height: "100%",
                                objectFit: "fill",
                              }}
                            src={`${fileStorage.baseUrl}${reel.video_url}`}
                            type="video/mp4"
                            alt={`${fileStorage.baseUrl}${reel.video_url}`}
                          // style={commentsShowFlag?{ borderBottomRightRadius: 0 , borderTopRightRadius: 0}:{}}
                          />
                        </>
                        <div className="reel-popup-caption">
                          <p>{reel.content}</p>
                        </div>
                        <div className="reel-popup-action-btns">
                          <button onClick={() => likeReel(reel.id, 'star')} >
                            {checkIfLiked(reel) ? <i className="fas fa-star" style={{ color: 'red' }}></i> :
                              <i className="far fa-star" ></i>
                            }
                            {reel.numberOfReaction > 0 ? reel.numberOfReaction : null}
                          </button>
                          <button onClick={commentCliked}>
                            <i className="far fa-comment"></i>
                            {reel.numberOfComments > 0 ? reel.numberOfComments : null}
                          </button>
                          <button><i className="fas fa-share"></i></button>

                        </div>
                      </div>

                      {commentsShowFlag
                        ? <div style={commentsShowFlag ? { width: '50%', borderBottomLeftRadius: 0, borderTopLeftRadius: 0 } : {}}
                          className="reel-comment-section">
                          <div className="d-flex" style={{ paddingBottom: '10px' }}>
                            <img
                              src={
                                fileStorage.baseUrl +
                                reel.userdata.profilePicturePath
                              }
                              alt=""
                              width="50px"
                              height="50px"
                            />
                            <span style={{ paddingLeft: '10px', paddingTop: '10px', fontWeight: 'bold' }}>
                              {reel.userdata.firstName}  {"" + reel.userdata.lastName}
                            </span>
                          </div>
                          {reel.content ? <div style={{ paddingBottom: '1rem ' }}>{reel.content}</div> : null}
                          <ReelCommentComponent reel={reel} />
                        </div>
                        : null}
                    </div>
                  ) : null}
                </>
              </div>
            </div>
          </div>
          {/* <div className="slide-buttons">
                <span
                  id="getnext"
                  onClick={() => {
                    setIndex(index + 1);
                    console.log("looking for -1", index);
                  }}
                >
                  <i className="fas fa-arrow-right"></i>
                </span>
           

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
            </div> */}
        </div>
      </div>
    </>
  );
}

export default DisplayFriendsReelsComponent;
