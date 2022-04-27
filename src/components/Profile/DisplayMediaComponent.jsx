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
import PostService from "../../services/PostService";

function DisplayMediaComponent({ post,email,setRefresh, indexs }) {
  let history = useHistory();

  const { user } = useContext(UserContext);
  const options = ["Save Reel", "Delete Reel", "Copy Link"];
  const [reelsForUserFriends, setReelsForUserFriends] = useState([]);
  const [FriendsReels, setFriendsStories] = useState([]);
  const [userR, setUserR] = useState([]);
  const [index, setIndex] = useState(indexs);
  const timeoutRef = useRef(null);
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
      await UserService.getUserByEmail(email
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
    PostService.deletePost(post.id).then((res) => {
      setRefresh(res.data);
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
    getReelsForFriendsUser();
    testScript();
  }, [FriendsReels]);

  return (
    <>
      <div className="container">
        <div className="strydivcontnr">
          <div className="strydiv">
            <div className="slideshow">
              <div
                className="slideshowSlider"
                style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
              >
                <>
                    <div className="slide" key={index} id={index}>
                      <div
                        style={{ marginTop: "65px" }}
                        className="reeldisplay-Profimg"
                       >
                        <img
                          src={
                            fileStorage.baseUrl +
                            userR.profilePicturePath
                          }
                          alt=""
                        />
                        <span style={{ color: "black" }}>
                          {userR.firstName}
                        </span>
                        <div
                          className="dropdown"
                          style={{
                            marginLeft: "410px",
                            marginTop: "-55px",
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
                              <MenuItem>
                                <i className="lar la-bookmark"></i>
                                <span>Save Post</span>
                              </MenuItem>
                              {/* {post.userdata.id === userR.id ? ( */}
                                <MenuItem onClick={handleDeleteReel(post.id)}>
                                  <i className="las la-trash"></i>
                                  <span>Delete Post</span>
                                </MenuItem>
                              {/* ) : (
                                <></>
                              )} */}
                              <MenuItem>
                                <i className="las la-link"></i>
                                <span>Copy Link</span>
                              </MenuItem>
                            </div>
                          </Menu>
                        </div>
                      </div>
                      <>
                      <img
                            className="postDsplyImg"
                            src={
                              fileStorage.baseUrl + post.mediaPath
                            }
                          />
                      </>
                    </div>
                </>
              </div>
            </div>
          </div>
          {/* <div className="slide-buttons">
                <span
                  id="getnext"
                  onClick={() => {
                    setIndex(index + 1);
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

export default DisplayMediaComponent;
