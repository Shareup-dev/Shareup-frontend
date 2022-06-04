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
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReelCommentComponent from "./ReelCommentComponent";

function DisplayFriendsReelsComponent(props ) {
  let history = useHistory();

  const { user } = useContext(UserContext);
  const [reelsForUserFriends, setReelsForUserFriends] = useState([]);
  const [FriendsReels, setFriendsStories] = useState([]);
  const [userR, setUserR] = useState([]);
  const [index, setIndex] = useState(props.index);
  const timeoutRef = useRef(null);
  const [reel,setReel] = useState(props.reel)
  const [commentsShowFlag,setCommentsShowFlag] = useState(false)

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
  const handleDeleteReel = (post) => {
    // ReelsServices.deleteReel(post.id).then((res) => {
    //   props.setRefresh(res.data);
    // });
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
  const likeReel = async(reelId) => {
    props.likeReel(reelId)
  }
  const checkIfLiked = (reel) => {
    if (reel.reactions) {
      const result = reel.reactions.filter(
        (reaction) => reaction.user.id == user.id
      );
      if (result.length > 0) {
        // setLikedReelId(reel.id)
        return true;
      }
      return false;
    }
  }
  const commentCliked = () => {
    setCommentsShowFlag(!commentsShowFlag)
  }
  
  return (
    <>
      <div className="container reel-container">
        <div className="strydivcontnr">
          <div className="strydiv" style={commentsShowFlag?{width:'100%'}:{}}>
            <div className="slideshow" style={commentsShowFlag?{maxWidth:'70%'}:{width: '100%'}}>
              <div
                className="slideshowSlider"
                // style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
              >
                <>
                  {reel.video_name ? (
                    <div className="slide"  id={index}>
                      <div className="slide-reel-cont" style={commentsShowFlag?{width:'50%'}:{}}>

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
                            <div
                              className="dropdown"
                              style={{

                                zIndex: "100",
                              }}
                            >
                              <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-controls={open ? "long-menu" : undefined}
                                aria-expanded={open ? "true" : undefined}
                                aria-haspopup="true"
                                onClick={handleClick}
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                id="long-menu"
                                className="btn dropdown-toggle"
                                MenuListProps={{
                                  "aria-labelledby": "long-button",
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                  style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: "20ch",
                                  },
                                }}
                              >
                                <div>
                                  <MenuItem onClick={() => console.log('hi')}>
                                    <i className="lar la-bookmark"></i>
                                    <span>Save Reel</span>
                                  </MenuItem>
                                  {reel.userdata.id === user.id ? (
                                    <MenuItem onClick={handleDeleteReel(reel.id)}>
                                      <i className="las la-trash"></i>
                                      <span>Delete Reel</span>
                                    </MenuItem>
                                  ) : (
                                    <></>
                                  )}
                                  <MenuItem>
                                    <i className="las la-link"></i>
                                    <span>Copy Link</span>
                                  </MenuItem>
                                </div>
                              </Menu>
                            </div>
                          </div>

                        </div>
                        <>
                          <video
                            preload="none"

                            loop
                            autoPlay
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "fill",
                            }}
                            src={`${fileStorage.baseUrl}${reel.video_url}`}
                            type="video/mp4"
                            alt={`${fileStorage.baseUrl}${reel.video_url}`}
                          />
                        </>
                        <div className="reel-popup-caption">
                          <p>{reel.content}</p>
                        </div>
                        
                      </div>
                      <div className="reel-popup-action-btns">
                        <button onClick={()=>likeReel(reel.id)} >
                          {checkIfLiked(reel)?<i class="fas fa-star" style={{color: 'red'}}></i>:
                          <i class="far fa-star" ></i>
                          }
                          {reel.numberOfReaction>0?reel.numberOfReaction:null}
                        </button>
                        <button onClick={commentCliked}>
                          <i class="far fa-comment"></i>
                          {reel.numberOfComments>0?reel.numberOfComments:null}
                        </button>
                        <button><i class="fas fa-share"></i></button>

                      </div>
                      {commentsShowFlag?<div style={commentsShowFlag?{width:'50%'}:{}}
                        className="reel-comment-section">
                        <ReelCommentComponent reel={reel}/>
                      </div>:null}
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
