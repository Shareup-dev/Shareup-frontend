import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../contexts/UserContext";
import UserService from "../../services/UserService";
import PostService from "../../services/PostService";
import SwapService from "../../services/SwapService";
import EditPostComponent from "./EditPostComponent";
import CommentPostComponent from "./CommentPostComponent";
import PostComponentBoxComponent from "./PostCommentBoxComponent";
import Popup from "reactjs-popup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ImageGallery from "react-image-gallery";
import storage from "../../config/fileStorage";
import Carousel from "react-bootstrap/Carousel";
import fileStorage from "../../config/fileStorage";
import ShareService from "../../services/ShareService";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "react-image-lightbox/style.css";
import Form from "react-bootstrap/Form";
import moment from "moment";
import NewsfeedComponent from "../user/NewsfeedComponent";
import Card from "react-bootstrap/Card";
import HangShareService from "../../services/HangShareService";
import { settings } from "nprogress";
import Settings from "../../services/Settings";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { setRef } from "@mui/material";
import ReactionsListComponent from "./ReactionsListComponent";
import  { handleSendNotification } from "../dashboard/ShareupInsideHeaderComponent";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import Lightbox from "react-awesome-lightbox";
// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";
const my_url = `${storage.baseUrl}`;

export default function PostComponent({ post, setRefresh , commentChangedFunction}) {
  const { user } = useContext(UserContext);
  let psotid = post?.id;
  const [editPostId, setEditPostId] = useState(null);
  const [userR, setUserR] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState();
  // const [postID, setPostID] = useState(post.id);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showUserReactions, setShowUserReactions] = useState(false);
  const [showSwapImage, setShowSwapImage] = useState(false);
  const [swapImage, setSwapImage] = useState({});
  const [swapfiles, setSwapfiles] = useState([]);
  const [photoIndex, setPhotoindex] = useState(0);
  const [isOpen, setIsopen] = useState(false);
  const [likeReaction, setLikeReaction] = useState(null);
  const [imgString, setimgString] = useState("");
  const images = [
    {
      original: `/user-post/${post.id}/${imgString[0]}`,
      thumbnail: `/user-post/${post.id}/${imgString[0]}`,
    },
  ];

  const handleRemoveImageSwap = () => {
    // setSwapfiles({});
    setShowSwapImage(false);
  };

  const something = (event) => {
    if (event.key === "Enter") {
    }
  };
  const handleEditPost = (id) => {
    setEditPostId(id);
    setRefresh(id);
  };

  // const getCommentCounter = (comments) => {
  //   let counter = 0;
  //   comments.map((comment) => {
  //     counter += comment.replies.length + 1;
  //   });
  //   if (counter > 0) return counter + " Comments";
  //   else return "";
  // };
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  const getShareCounter = (shares) => {
    let counter = 0;
    shares.map((share) => {
      counter += share.replies.length + 1;
    });
    if (counter > 0) return counter + " shares";
    else return "";
  };

  const handleSwapContent = (event) => {
    setShareContent(event.target.value);
  };

  const handleUserPhone = (event) => {
    setUserPhone(event.target.value);
  };
  const checkIfLiked = (post) => {
    if (post?.likedType !== "false") {
      return true;
    }
    return false;
  };

  const handleFileSwap = (event) => {
    setSwapfiles(event.target.files);
    let filesAmount = event.target.files.length;
    if (filesAmount < 6) {
      let tempImage = [];
      for (let i = 0; i < filesAmount; i++) {
        //tempImage=[...tempImage,URL.createObjectURL(event.target.files[i])]
        tempImage.push(URL.createObjectURL(event.target.files[i]));
      }

      setSwapImage(tempImage);

      setShowSwapImage(true);
    } else {
      alert("5 files are allowed");
      event.preventDefault();
    }
  };
  const checkIfSaved = (post) => {
    if (post.savedByUsers) {
      const result = post.savedByUsers.filter((userz) => userz.id == user.id);
      if (result.length > 0) {
        return true;
      }
      return false;
    }
  };

  const handleLikePost = async (post, reaction) => {
    UserService.likeAllPost(user?.id, post.id, reaction).then((res) => {
     if(res.status ===201){
      
      switch (res.data.allPostsType){
        case 'hangShare':
          handleSendNotification(res.data.userdata.id,'Liked your hangShare',user.firstName,user.lastName,user.email,"hangShare",post.id)        
          break;
        case 'post':
          handleSendNotification(res.data.userdata.id,'Liked your post',user.firstName,user.lastName,user.email,"post",post.id)        
        break;
        case 'share':
          handleSendNotification(res.data.userdata.id,'Liked your shared post',user.firstName,user.lastName,user.email,"share",post.id)        
        break;
        case 'swap':
          handleSendNotification(res.data.userdata.id,'Liked your swap',user.firstName,user.lastName,user.email,"swap",post.id)        
        break;
        case 'reel':
          handleSendNotification(res.data.userdata.id,'Liked your reel',user.firstName,user.lastName,user.email,"reel",post.id)        
        break;
      }
    }
    setRefresh(res.data);
  });
  };

  const handleSwapPost = async (post_id) => {
    await UserService.likeSwap(user.id, post_id).then((res) => {
      setRefresh(res.data);
    });
  };

  const handleSavePost = async (post_id) => {
    UserService.savePost(user.id, post_id).then((res) => {
      setRefresh(res.data);
    });
    setShowMoreOptions(false);
  };

  const handleDeletePost = (post) => {
    PostService.deleteAllPost(post.id).then((res) => {
      setRefresh(res.data);
    });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
  };
  const handleEditingSave = (value) => {
    setEditPostId(value);
    setRefresh(value);
    setShowMoreOptions(false);
  };

  const handleShowuserReaction = () => {
    setTimeout(function () {
      setShowUserReactions(true);
    }, 200);
  };

  const handleUnshowuserReaction = () => {
    setTimeout(function () {
      setShowUserReactions(false);
    }, 200);
  };
  const [AllReactionList, setAllReactionList] = useState([]);
  const [AllReactionListShare, setAllReactionListShare] = useState([]);

  const getAllReactionList = () => {
    
    if (post.allPostsType !== "share"){
    PostService.getAllReactionList(post?.id).then((res) => {
      setAllReactionList(res.data);
    })
  }else {
    PostService.getAllReactionList(post?.id).then((res) => {
      setAllReactionList(res.data);
    })
    PostService.getAllReactionList(post.post?.id).then((res) => {
      setAllReactionListShare(res.data);
    })
  }
  };
  useEffect(() => {
    getAllReactionList();
  }, []);
  useEffect(() => {
    getAllReactionList();
  }, [setRefresh]);
  
  const handleShowingReaction = () => {
    setTimeout(function () {
      setShowReactions(true);
    }, 200);
  };

  const handleUnshowingReaction = () => {
    setTimeout(function () {
      setShowReactions(false);
    }, 200);
  };

  const acceptHangShare = (hsid, uid) => {
    if (UserPhone === "") {
      setStatus("Please Insert Your Phone number");
      return;
    } else {
      const formData = new FormData();
      formData.append("latitude", lat);
      formData.append(`phone_number`, UserPhone);
      formData.append(`longitude`, lng);

      HangShareService.acceptHangShare(hsid, uid, formData).then((res) => {
        setRefresh(res.data);
      });
    }
  };
  const [emoji, setEmoji] = useState();
  //  setEmoji(post?.likedType)

  const handleReaction = () => {
    return (
      <>
        {(() => {
          switch (post?.likedType) {
            case "star":
              return (
                <div className="emoji-reaction">
                  <i
                    className="fas fa-star"
                    style={{
                      fontSize: "20px",
                      color: "#d83535",
                      paddingRight: "5px",
                    }}
                  ></i>
                </div>
              );
            case "smiley":
              return (
                <div>
                  <i
                    className="emoji-reaction"
                    style={{
                      fontSize: "20px",
                      paddingRight: "5px",
                    }}
                  >
                    😊
                  </i>
                </div>
              );
            case "wow":
              return (
                <div>
                  <i
                    className="emoji-reaction"
                    style={{
                      fontSize: "20px",
                      paddingRight: "5px",
                    }}
                  >
                    😮
                  </i>
                </div>
              );
            case "laugh":
              return (
                <div>
                  <i
                    className="emoji-reaction"
                    style={{
                      fontSize: "20px",
                      paddingRight: "5px",
                    }}
                  >
                    😂
                  </i>
                </div>
              );
            case "cry":
              return (
                <div>
                  <i
                    className="emoji-reaction"
                    style={{
                      fontSize: "20px",
                      paddingRight: "5px",
                    }}
                  >
                    😭
                  </i>
                </div>
              );
            case "love":
              return (
                <div>
                  <i
                    className="emoji-reaction"
                    style={{
                      fontSize: "20px",
                      paddingRight: "5px",
                    }}
                  >
                    😍
                  </i>
                </div>
              );
            case "celebrate":
              return (
                <div>
                  <i
                    className="emoji-reaction"
                    style={{
                      fontSize: "20px",
                      paddingRight: "5px",
                    }}
                  >
                    🥳
                  </i>
                </div>
              );
            case "angry":
              return (
                <div>
                  <i
                    className="emoji-reaction"
                    style={{
                      fontSize: "20px",
                      paddingRight: "5px",
                    }}
                  >
                    😡
                  </i>
                </div>
              );
            default:
              return (
                <div>
                  <i
                    className="fas fa-star"
                    style={{
                      fontSize: "20px",
                      color: "#d83535",
                      paddingRight: "5px",
                    }}
                  ></i>
                </div>
              );
          }
        })()}
      </>
    );
  };

  const handlePostReactions = () => {
    return (
      <>
        {post.countOfEachReaction.star > 0 ? (
          <i
            className="fas fa-star"
            style={{ fontSize: "15px", color: "#d83535" }}
          ></i>
        ) : (
          <></>
        )}
        {post.countOfEachReaction.smiley > 0 ? (
          <i
            style={{
              fontSize: "15px",
              paddingRight: "1px",
            }}
          >
            😊
          </i>
        ) : (
          <></>
        )}
        {post.countOfEachReaction.wow > 0 ? (
          <i
            style={{
              fontSize: "15px",
              paddingRight: "1px",
            }}
          >
            😮
          </i>
        ) : (
          <></>
        )}
        {post.countOfEachReaction.laugh > 0 ? (
          <i
            style={{
              fontSize: "15px",
              paddingRight: "1px",
            }}
          >
            😂
          </i>
        ) : (
          <></>
        )}

        {post.countOfEachReaction.cry > 0 ? (
          <i
            style={{
              fontSize: "15px",
              paddingRight: "1px",
            }}
          >
            😭
          </i>
        ) : (
          <></>
        )}
        {post.countOfEachReaction.love > 0 ? (
          <i
            style={{
              fontSize: "15px",
              paddingRight: "1px",
            }}
          >
            😍
          </i>
        ) : (
          <></>
        )}
        {post.countOfEachReaction.celebrate > 0 ? (
          <i
            style={{
              fontSize: "15px",
              paddingRight: "1px",
            }}
          >
            🥳
          </i>
        ) : (
          <></>
        )}
        {post.countOfEachReaction.angry > 0 ? (
          <i
            style={{
              fontSize: "15px",
              paddingRight: "1px",
            }}
          >
            😡
          </i>
        ) : (
          <></>
        )}
      </>
    );
  };

  const handleSharedPostReactions = () => {
    return (
      <>
        {post.post.countOfEachReaction.star > 0 ? (
          <i
            className="fas fa-star"
            style={{ fontSize: "14px", color: "#d83535" }}
          ></i>
        ) : (
          <></>
        )}
        {post.post.countOfEachReaction.smiley > 0 ? (
          <i
            style={{
              fontSize: "14px",
              paddingRight: "0px",
            }}
          >
            😊
          </i>
        ) : (
          <></>
        )}
        {post.post.countOfEachReaction.wow > 0 ? (
          <i
            style={{
              fontSize: "14px",
              paddingRight: "0px",
            }}
          >
            😮
          </i>
        ) : (
          <></>
        )}
        {post.post.countOfEachReaction.laugh > 0 ? (
          <i
            style={{
              fontSize: "14px",
              paddingRight: "0px",
            }}
          >
            😂
          </i>
        ) : (
          <></>
        )}

        {post.post.countOfEachReaction.cry > 0 ? (
          <i
            style={{
              fontSize: "14px",
              paddingRight: "0px",
            }}
          >
            😭
          </i>
        ) : (
          <></>
        )}
        {post.post.countOfEachReaction.love > 0 ? (
          <i
            style={{
              fontSize: "14px",
              paddingRight: "0px",
            }}
          >
            😍
          </i>
        ) : (
          <></>
        )}
        {post.post.countOfEachReaction.celebrate > 0 ? (
          <i
            style={{
              fontSize: "14px",
              paddingRight: "0px",
            }}
          >
            🥳
          </i>
        ) : (
          <></>
        )}
        {post.post.countOfEachReaction.angry > 0 ? (
          <i
            style={{
              fontSize: "14px",
              paddingRight: "0px",
            }}
          >
            😡
          </i>
        ) : (
          <></>
        )}
      </>
    );
  };

  const handleSettingReactions = (reaction) => {
    setLikeReaction(reaction);
    if (!checkIfLiked(post)) {
      handleLikePost(post, reaction);
    }
  };

  const handleCounterReaction = () => {
    if (likeReaction) {
      return (
        <img
          width={20}
          style={{ marginTop: "-5px" }}
          src={`../assets/images/gif/${likeReaction}.gif`}
        />
      );
    }
    return (
      <img
        src="/assets/images/Starwhite.svg"
        alt=""
        style={{
          left: "16px",
          height: "15px",
          position: "absolute",
          bottom: "16px",
          background: "darksalmon",
        }}
      />
    );
  };
  //array fetch
  const postImg = (str) => {
    if (str != null) {
      let temps = [];
      for (let i = 0; i < str.length; i++)
        temps = [...temps, `/user-post/${post.id}/${str[i]}`];
    }
  };
  const toggleShowMoreOptions = (e) => {
    e.preventDefault();
    setShowMoreOptions(!showMoreOptions);
  };

  const imageshowSwap = () => {
    return (
      <div className="swap-rqst">
        <div className="" style={{ width: "100%" }}>
          <label
            className="fileContainer"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <input
              type="file"
              name="swap_image"
              accept="image/*"
              onChange={handleFileSwap}
            ></input>
            Upload swap images<i className="lar la-file-image"></i>
          </label>
        </div>
      </div>
    );
  };
  const openLightbox = (index) => {
    setIsopen(true);
    setPhotoindex(index);
  };

  const [userF, setUserF] = useState(null);
  const [shareContent, setShareContent] = useState("");
  const [UserPhone, setUserPhone] = useState("");
  const uploadShare = async (event) => {
    await event.preventDefault();

    const formData = new FormData();
    formData.append("content", shareContent);

    if (post.allPostsType === "share") {
      if (userF === null) {
        await ShareService.createShare(
          user.id,
          post.post.id,
          formData,
          null
        ).then((res) => {
          setShareContent("");
          setRefresh(res.data);
        });
      } else
        await ShareService.createShare(user.id, post.post.id).then((res) => {
          setShareContent("");
          setRefresh(res.data);
        });
    } else {
      if (userF === null) {
        await ShareService.createShare(user.id, post.id, formData, null).then(
          (res) => {
            setShareContent("");
            setRefresh(res.data);
          }
        );
      } else
        await ShareService.createShare(user.id, post.id).then((res) => {
          setShareContent("");
          setRefresh(res.data);
        });
    }
  };

  const updateSharedPost = async (event) => {
    await event.preventDefault();

    const formData = new FormData();
    formData.append("content", shareContent);

    await ShareService.updateSharedPost(post.id, formData).then((res) => {
      setShareContent("");
      setRefresh(res.data);
    });
  };

  const commentChanged = async (prop) => {
    await setComments(prop);
  };
  const sharepopup = () => {
    return (
      <Popup
        trigger={<span style={{ cursor: "pointer" }}>Share</span>}
        modal
        nested
        closeOnDocumentClick
      >
        {(close) => (
          <Form
            className="popwidth"
            onSubmit={(e) => {
              uploadShare(e);
              close();
            }}
          >
            <div className="headpop">
              <div className="row">
                <div style={{ width: "20%" }}>
                  <a
                    href="#!"
                    style={{ padding: "10px 80px 10px 0" }}
                    onClick={close}
                  >
                    <i className="las la-times"></i>
                  </a>
                </div>
                <div
                  style={{
                    color: "#000000",
                    fontSize: "18px",
                    fontWeight: "bold",
                    width: "60%",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  <span>Share This Post</span>
                </div>
                <div style={{ width: "20%", textAlign: "right" }}></div>
              </div>
            </div>
            <div style={{ padding: "0 11px 11px 11px" }}>
              <div className="popupimg">
                <img
                  src={
                    user
                      ? fileStorage.baseUrl + user.profilePicturePath
                      : fileStorage.baseUrl + user.profilePicturePath
                  }
                  alt=""
                />
              </div>
              <div className="popupuser-name">
                <div style={{ display: "inline" }}>
                  <span>
                    {`${user.firstName} ${user.lastName}`}
                    {userF ? (
                      <>
                        <span style={{ fontWeight: "100", fontSize: "14px" }}>
                          {" "}
                          with{" "}
                        </span>
                        {`${userF.firstName} ${userF.lastName}`}
                      </>
                    ) : null}
                  </span>
                  <span
                    style={{
                      marginTop: "4px ",
                      display: "block",
                      fontSize: "10px",
                    }}
                  ></span>
                </div>{" "}
              </div>{" "}
            </div>
            <div style={{ minHeight: "150px" }}>
              <span className="textPop">
                <textarea
                  className="textpopup"
                  rows={2}
                  placeholder="Sharing is Caring"
                  name="swap_content"
                  value={shareContent}
                  onChange={handleSwapContent}
                />
                {post.allPostsType === "share" ? (
                  <>
                    <div className="postShared">
                      <div style={{ padding: "0 11px 11px 11px" }}>
                        {post.post.media && post.post.media.length == 1 ? (
                          <>
                            <img
                              style={{ width: "100%", objectFit: "cover" }}
                              src={`${fileStorage.baseUrl}${post.post.media[0].mediaPath}`}
                              alt={`${fileStorage.baseUrl}${post.post.media[0].mediaPath}`}
                              className="lightbox-popup"
                            />
                          </>
                        ) : null}
                        <div className="p-1 popupuser-name">
                          <div style={{ display: "inline" }}>
                            <span>
                              {`${post.post.userdata.firstName} ${post.post.userdata.lastName}`}
                              {userF ? (
                                <>
                                  {" "}
                                  with {`${userF.firstName} ${userF.lastName}`}
                                </>
                              ) : null}
                            </span>
                            <span
                              className="text-muted"
                              style={{
                                display: "block",
                                fontSize: "9px",
                                paddingTop: "0px",
                              }}
                            >
                              {moment(
                                post.published,
                                "DD MMMM YYYY hh:mm:ss"
                              ).fromNow()}
                            </span>
                          </div>
                        </div>
                        {post.post.content && (
                          <p
                            id={`post-content-${post.post.id}`}
                            style={{
                              marginLeft: "4px",
                              fontSize: "14px",
                              color: "black",
                            }}
                          >
                            {`${post.post.content}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="postShared">
                    <div style={{ padding: "0 11px 11px 11px" }}>
                      {post.media && post.media.length == 1 ? (
                        <>
                          <img
                            style={{ width: "100%", objectFit: "cover" }}
                            src={`${fileStorage.baseUrl}${post.media[0].mediaPath}`}
                            alt={`${fileStorage.baseUrl}${post.media[0].mediaPath}`}
                            className="lightbox-popup"
                          />
                        </>
                      ) : null}
                      <div className="p-1 popupuser-name">
                        <div style={{ display: "inline" }}>
                          <span>
                            {`${post.userdata.firstName} ${post.userdata.lastName}`}
                            {userF ? (
                              <>
                                {" "}
                                with {`${userF.firstName} ${userF.lastName}`}
                              </>
                            ) : null}
                          </span>
                          <span
                            className="text-muted"
                            style={{
                              display: "block",
                              fontSize: "9px",
                              paddingTop: "0px",
                            }}
                          >
                            {moment(
                              post.published,
                              "DD MMMM YYYY hh:mm:ss"
                            ).fromNow()}
                          </span>
                        </div>
                      </div>
                      {post.content && (
                        <p
                          id={`post-content-${post.id}`}
                          style={{
                            marginLeft: "4px",
                            fontSize: "14px",
                            color: "black",
                          }}
                        >
                          {`${post.content}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </span>
            </div>

            <button type="submit" value="Submit" className="popsbmt-btn">
              Share
            </button>
          </Form>
        )}
      </Popup>
    );
  };

  return (
    <div
      className="central-meta item"
      style={{ paddingBottom: "0px" }}
      key={post.id}
      onClick={(e) => {
        if (showMoreOptions) toggleShowMoreOptions(e);
      }}
    >
      <div
        className="container_drop-options__transparent"
        hidden={!showMoreOptions}
        onClick={toggleShowMoreOptions}
      ></div>
      <div className="user-post">
        {editPostId !== post.id ? (
          <div className="friend-info">
            <div className="post-meta">
              {post.mediaPath ? (
                <>
                  <div className="grid-container1">
                    <div className="itemS1">
                      {post.media.length > 0 ? (
                        <div className="postImage">
                          {post.media.map((postImage) => (
                            <React.Fragment>
                              <a
                                href={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                                data-lightbox={`image-user-${post.userdata.id}`}
                              >
                                <img
                                  style={{
                                    width: "100%",
                                    maxHeight: "550px",
                                    objectFit: "unset",
                                  }}
                                  src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                                  alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                                />
                              </a>
                            </React.Fragment>
                          ))}
                        </div>
                      ) : post.media.length > 0 ? (
                        <div className="postImage swap-image">
                          {post.media.map((postImage) => {
                            return (
                              <React.Fragment>
                                {/* <a
                                href={`${fileStorage.baseUrl}${postImage.imagePath}`}
                                data-lightbox={`image-user-${post.userdata.id}`}
                              >
                                <img
                                  style={{ width: '100%', objectFit: 'cover' }}
                                  src={`${fileStorage.baseUrl}${postImage.imagePath}`}
                                  alt={`${fileStorage.baseUrl}${postImage.imagePath}`}
                                />
                              </a> */}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                    <div className="itemS2">
                      <div className="swapbtnfeed">
                        <i className="las la-sync"></i>
                      </div>
                    </div>
                    <div className="itemS3">
                      <>
                        <div className="swapImage">
                          <a
                            href={post.mediaPath}
                            data-lightbox={`image-user-${post.userdata.id}`}
                          >
                            <img
                              style={{ width: "100%", objectFit: "cover" }}
                              src={post.mediaPath}
                            />{" "}
                          </a>
                        </div>{" "}
                      </>
                    </div>
                  </div>

                  <div className="buttonS">
                    <a
                      href="/shipping"
                      className="buttonshare"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Accept
                    </a>
                  </div>
                </>
              ) : (
                //single

                <>
                  {post.swapImagePath &&
                  post.swapImagePath.split(",").length > 1 ? (
                    <div>
                      <Carousel
                        height="200px"
                        thumbnails={true}
                        thumbnailWidth="100px"
                        style={{
                          textAlign: "center",
                          maxWidth: "850px",
                          maxHeight: "500px",
                          margin: "40px auto",
                        }}
                      >
                        {post.postImagePath.split(",").map((item, key) => (
                          <Carousel.Item>
                            <a
                              href={`${fileStorage.baseUrl}/user-post/${post.id}/${item}`}
                              data-lightbox={`image-user-${post.userdata.id}`}
                            >
                              {" "}
                              <img
                                className="d-block w-100"
                                src={`${fileStorage.baseUrl}/user-post/${post.id}/${item}`}
                                key={key}
                              />
                            </a>
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    </div>
                  ) : (
                    // <div className="postImage">
                    //     <div className="row">

                    //    {
                    //       // setimgString(post.postImagePath.split(','))
                    //      // <ImageGallery items={images}/>

                    //     (post.postImagePath.split(',')).map((item,key)=>(<div className="column">
                    //         <a href={`${storage.baseUrl}/user-post/${post.id}/${item}`}
                    //     data-lightbox={`image-user-${post.userdata.id}`}>
                    //        <img src={`${storage.baseUrl}/user-post/${post.id}/${item}`} key={key}
                    //        style={{ width: '300px', height: '250px',padding:'2px', display:''}}/></a></div>))

                    //    }
                    //     </div>

                    //    </div>

                    <></>
                  )}
                </>
              )}
              <div
                className="friend-name"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "8px",
                  paddingLeft: "0px",
                }}
              >
                <div style={{ display: "flex" }}>
                  <figure>
                    <img
                      src={
                        fileStorage.baseUrl + post.userdata.profilePicturePath
                      }
                      alt=""
                      className="post-user-img"
                    />
                  </figure>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      paddingLeft: "10px",
                    }}
                  >
                    <a
                      href={`/profile/${post.userdata.email}`}
                      title="#"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                    >
                      {`${post.userdata.firstName} ${post.userdata.lastName}`}

                      {post.allPostsType === "share" ? (
                        <span
                          style={{
                            paddingLeft: "10px",
                            textTransform: "lowercase",
                            fontWeight: "100",
                            fontSize: "14px",
                          }}
                        >
                          shared post{" "}
                        </span>
                      ) : null}
                      {post.userTag ? (
                        <>
                          <span style={{ padding: "0 5px" }}>with</span>{" "}
                          <span className="tagPost">
                            {post.userTag.firstName}
                          </span>
                          <span className="tagPost">
                            {post.userTag.lastName}
                          </span>
                        </>
                      ) : null}
                    </a>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        paddingTop: "5px",
                      }}
                    >
                      {/* on{" "} */}
                      {moment(
                        post.published,
                        "DD MMMM YYYY hh:mm:ss"
                      ).fromNow()}

                      {/* {checkIfSaved(post) && <i className='las la-bookmark szbkmrk'></i>} */}
                    </span>
                  </div>

                  {/* {post.group ? <span className="groupName">Group: {`${post.group.name}`}</span> : null} */}
                </div>
                {/* <div
                  style={{ float: 'right', display: 'inline', fontSize: '28px', fontWeight: '900', cursor: 'pointer' }}
                ></div> */}
                {/* <div className='add-dropdown' onClick={toggleShowMoreOptions}>
                      <span title='add icon'>
                        <i className='las la-ellipsis-h' style={{  fontSize: '30px' }}></i>
                      </span>
                    </div> */}
                <div className="dropdown add-dropdown">
                  <button
                    className="btn dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i
                      className="fas fa-ellipsis-h"
                      style={{ fontSize: "20px" }}
                    ></i>
                  </button>
                  <div
                    className="dropdown-menu drop-options"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <ul>
                      {post.userdata.id === user.id ? (
                        <>
                          {post.allPostsType !== "share" ? (
                            <li onClick={() => handleEditPost(post.id)}>
                              <i className="las la-pencil-alt"></i>
                              <span>Edit Post</span>
                            </li>
                          ) : (
                            <>
                              <Popup
                                trigger={
                                  <li onClick={() => handleEditPost(post.id)}>
                                    <i className="las la-pencil-alt"></i>
                                    <span>Edit share</span>
                                  </li>
                                }
                                modal
                                nested
                                closeOnDocumentClick
                              >
                                {(close) => (
                                  <Form
                                    className="popwidth"
                                    onSubmit={(e) => {
                                      updateSharedPost(e);
                                      close();
                                    }}
                                  >
                                    <div className="headpop">
                                      <div className="row">
                                        <div style={{ width: "20%" }}>
                                          <a
                                            href="#!"
                                            style={{
                                              padding: "10px 80px 10px 0",
                                            }}
                                            onClick={close}
                                          >
                                            <i className="las la-times"></i>
                                          </a>
                                        </div>
                                        <div
                                          style={{
                                            color: "#000000",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                            width: "60%",
                                            textAlign: "center",
                                          }}
                                        >
                                          {" "}
                                          <span>Edit Share</span>
                                        </div>
                                        <div
                                          style={{
                                            width: "20%",
                                            textAlign: "right",
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                    <div
                                      style={{ padding: "0 11px 11px 11px" }}
                                    >
                                      <div className="popupimg">
                                        <img
                                          src={
                                            user
                                              ? fileStorage.baseUrl +
                                                user.profilePicturePath
                                              : fileStorage.baseUrl +
                                                user.profilePicturePath
                                          }
                                          alt=""
                                        />
                                      </div>
                                      <div className="popupuser-name">
                                        <div style={{ display: "inline" }}>
                                          <span>
                                            {`${user.firstName} ${user.lastName}`}
                                            {userF ? (
                                              <>
                                                <span
                                                  style={{
                                                    fontWeight: "100",
                                                    fontSize: "14px",
                                                  }}
                                                >
                                                  {" "}
                                                  with{" "}
                                                </span>
                                                {`${userF.firstName} ${userF.lastName}`}
                                              </>
                                            ) : null}
                                          </span>
                                          <span
                                            style={{
                                              marginTop: "4px ",
                                              display: "block",
                                              fontSize: "10px",
                                            }}
                                          ></span>
                                        </div>{" "}
                                      </div>{" "}
                                    </div>
                                    <div style={{ minHeight: "150px" }}>
                                      <span className="textPop">
                                        <textarea
                                          className="textpopup"
                                          rows={2}
                                          placeholder="Sharing is Caring"
                                          name="swap_content"
                                          value={shareContent}
                                          onChange={handleSwapContent}
                                        />
                                        {post.allPostsType === "share" ? (
                                          <>
                                            <div className="postShared">
                                              <div
                                                style={{
                                                  padding: "0 11px 11px 11px",
                                                }}
                                              >
                                                {post.post.media &&
                                                post.post.media.length == 1 ? (
                                                  <>
                                                    <img
                                                      style={{
                                                        width: "100%",
                                                        objectFit: "cover",
                                                      }}
                                                      src={`${fileStorage.baseUrl}${post.post.media[0].mediaPath}`}
                                                      alt={`${fileStorage.baseUrl}${post.post.media[0].mediaPath}`}
                                                      className="lightbox-popup"
                                                    />
                                                  </>
                                                ) : null}
                                                <div className="p-1 popupuser-name">
                                                  <div
                                                    style={{
                                                      display: "inline",
                                                    }}
                                                  >
                                                    <span>
                                                      {`${post.post.userdata.firstName} ${post.post.userdata.lastName}`}
                                                      {userF ? (
                                                        <>
                                                          {" "}
                                                          with{" "}
                                                          {`${userF.firstName} ${userF.lastName}`}
                                                        </>
                                                      ) : null}
                                                    </span>
                                                    <span
                                                      className="text-muted"
                                                      style={{
                                                        display: "block",
                                                        fontSize: "9px",
                                                        paddingTop: "0px",
                                                      }}
                                                    >
                                                      {moment(
                                                        post.published,
                                                        "DD MMMM YYYY hh:mm:ss"
                                                      ).fromNow()}
                                                    </span>
                                                  </div>
                                                </div>
                                                {post.post.content && (
                                                  <p
                                                    id={`post-content-${post.post.id}`}
                                                    style={{
                                                      marginLeft: "4px",
                                                      fontSize: "14px",
                                                      color: "black",
                                                    }}
                                                  >
                                                    {`${post.post.content}`}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="postShared">
                                            <div
                                              style={{
                                                padding: "0 11px 11px 11px",
                                              }}
                                            >
                                              {post.media &&
                                              post.media.length == 1 ? (
                                                <>
                                                  <img
                                                    style={{
                                                      width: "100%",
                                                      objectFit: "cover",
                                                    }}
                                                    src={`${fileStorage.baseUrl}${post.media[0].mediaPath}`}
                                                    alt={`${fileStorage.baseUrl}${post.media[0].mediaPath}`}
                                                    className="lightbox-popup"
                                                  />
                                                </>
                                              ) : null}
                                              <div className="p-1 popupuser-name">
                                                <div
                                                  style={{ display: "inline" }}
                                                >
                                                  <span>
                                                    {`${post.userdata.firstName} ${post.userdata.lastName}`}
                                                    {userF ? (
                                                      <>
                                                        {" "}
                                                        with{" "}
                                                        {`${userF.firstName} ${userF.lastName}`}
                                                      </>
                                                    ) : null}
                                                  </span>
                                                  <span
                                                    className="text-muted"
                                                    style={{
                                                      display: "block",
                                                      fontSize: "9px",
                                                      paddingTop: "0px",
                                                    }}
                                                  >
                                                    {moment(
                                                      post.published,
                                                      "DD MMMM YYYY hh:mm:ss"
                                                    ).fromNow()}
                                                  </span>
                                                </div>
                                              </div>
                                              {post.content && (
                                                <p
                                                  id={`post-content-${post.id}`}
                                                  style={{
                                                    marginLeft: "4px",
                                                    fontSize: "14px",
                                                    color: "black",
                                                  }}
                                                >
                                                  {`${post.content}`}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </span>
                                    </div>

                                    <button
                                      type="submit"
                                      value="Submit"
                                      className="popsbmt-btn"
                                    >
                                      Save
                                    </button>
                                  </Form>
                                )}
                              </Popup>
                            </>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                      <li onClick={() => handleSavePost(post.id)}>
                        <i className="lar la-bookmark"></i>
                        <span>Save Post</span>
                      </li>
                      {post.userdata.id === user.id ? (
                        <li onClick={() => handleDeletePost(post)}>
                          <i className="las la-trash"></i>
                          <span>Delete</span>
                        </li>
                      ) : (
                        <></>
                      )}
                      <li>
                        <i className="las la-link"></i>
                        <CopyToClipboard
                          text={`192.168.100.88:3000/post/${post?.id}`}
                        >
                          <span>Copy Link</span>
                        </CopyToClipboard>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {post.content && (
                <p
                  id={`post-content-${post.id}`}
                  style={{
                    margin: "1%",
                    fontSize: "14px",
                    color: "black",
                  }}
                >
                  {`${post.content}`}
                </p>
              )}

              <div className="postImage">
                {post.allPostsType === "post" &&
                post.media &&
                post.media.length > 1 ? (
                  <>
                    <OwlCarousel
                      items={1}
                      className="owl-theme grp-carousel post-carousel"
                      dots
                      nav
                      navText={
                        ("<i className='fa fa-chevron-left'></i>",
                        "<i className='fa fa-chevron-right'></i>")
                      }
                      margin={10}
                    >
                      {post.media.map((postImage, index) => (
                        <React.Fragment>
                          <img
                            style={{
                              height: "420px",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                            alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                            className="lightbox-popup"
                            onClick={() => openLightbox(index)}
                          />
                        </React.Fragment>
                      ))}
                    </OwlCarousel>
                    {isOpen && (
                      <Lightbox
                        mainSrc={
                          fileStorage.baseUrl + post.media[photoIndex].mediaPath
                        }
                        nextSrc={
                          post.media[(photoIndex + 1) % post.media.length]
                        }
                        prevSrc={
                          post.media[
                            (photoIndex + post.media.length - 1) %
                              post.media.length
                          ]
                        }
                        onCloseRequest={() => setIsopen(false)}
                        onMovePrevRequest={() =>
                          setPhotoindex(
                            (photoIndex + post.media.length - 1) %
                              post.media.length
                          )
                        }
                        onMoveNextRequest={() =>
                          setPhotoindex((photoIndex + 1) % post.media.length)
                        }
                      />
                    )}
                  </>
                ) : post.allPostsType === "post" &&
                  post.media &&
                  post.media.length == 1 ? (
                  post.media.map((postImage) => (
                    <React.Fragment>
                      <img
                        src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                        alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                        className="lightbox-popup post-display-img"
                        onClick={() => setIsopen(true)}
                      />
                      {isOpen && (
                        <Lightbox
                          image={fileStorage.baseUrl + postImage.mediaPath}
                          buttonAlign="center"
                          onClose={() => setIsopen(false)}
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : post.allPostsType === "swap" && post.media ? (
                  post.media.map((postImage) => (
                    <div >
                      <img
                        style={
                          post.userdata.id == user.id
                            ? { width: "100%", objectFit: "cover" }
                            : { borderRadius: "10px 10px 0 0" }
                        }
                        src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                        alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                        className="lightbox-popup Lightbox-display-img"
                        onClick={() => setIsopen(true)}
                      />
                      {isOpen && (
                        <Lightbox
                           image={fileStorage.baseUrl + postImage.mediaPath}
                          buttonAlign="center"
                          onClose={() => setIsopen(false)}
                        />
                      )}
                      {/* {post.userdata.id !== user.id && (
                        <div className="swappost-cont">
                          <div className="">
                            <div
                              className="bold "
                              style={{
                                marginBottom: "5px",
                                marginTop: "10px",
                                color: "#050505",
                              }}
                            >
                              {post.category ? post.category : "Category"}
                            </div>
                            <div style={{ fontSize: "14px" }}>
                              {post.content
                                ? post.content
                                : "Get swapped with your favourite things"}
                            </div>
                          </div>
                          <Popup
                            trigger={<button className="button">SWAP</button>}
                            modal
                            nested
                          >
                            {(close) => (
                              <Form
                                style={{ margin: "5px" }}
                                className="popwidth rqst-swap-form"
                                onSubmit={close}
                              >
                                <div className="headpop">
                                  <div className="row">
                                    <div style={{ width: "20%" }}>
                                      <a
                                        href="#!"
                                        style={{ padding: "10px 80px 10px 0" }}
                                        onClick={close}
                                      >
                                        <i className="las la-times"></i>
                                      </a>
                                    </div>
                                    <div
                                      style={{
                                        color: "#000000",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        width: "60%",
                                        textAlign: "center",
                                      }}
                                    >
                                      {" "}
                                      <span>Request for Swap</span>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ padding: "0 11px 11px 11px" }}>
                                  <div className="popupimg">
                                    <img
                                      src={
                                        user
                                          ? fileStorage.baseUrl +
                                            user.profilePicturePath
                                          : fileStorage.baseUrl +
                                            userR.profilePicturePath
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <div className="popupuser-name">
                                    <div style={{ display: "inline" }}>
                                      <span>
                                        {`${user.firstName} ${user.lastName}`}
                                        {post.userdata ? (
                                          <>
                                            {" "}
                                            <span
                                              style={{
                                                color: "rgb(100 166 194)",
                                                fontWeight: "500",
                                              }}
                                            >
                                              swap with
                                            </span>{" "}
                                            {`${post.userdata.firstName} ${post.userdata.lastName}`}
                                          </>
                                        ) : null}
                                      </span>
                                      <span
                                        style={{
                                          marginTop: "4px ",
                                          display: "block",
                                          fontSize: "10px",
                                        }}
                                      >
                                        <li
                                          style={{
                                            paddingLeft: "0%",
                                            paddingTop: "1%",
                                            listStyleType: "none",
                                          }}
                                        >
                                        </li>

                                      </span>
                                    </div>{" "}
                                  </div>{" "}
                                </div>
                                <div style={{ minHeight: "150px" }}>
                                  <span className="textPop">
                                    <textarea
                                      className="textpopup"
                                      rows={2}
                                      placeholder={
                                        "Share about swap with " +
                                        post.userdata.firstName +
                                        "?"
                                      }
                                      name="swap_content"
                                      value={shareContent}
                                      onChange={handleSwapContent}
                                    />

                                    {showSwapImage ? (
                                      <>
                                        <div style={{ position: "relative" }}>
                                          {swapImage.map((item, key) => (
                                            <img
                                              src={item}
                                              key={key}
                                              style={{
                                                padding: "10px",
                                                display: "inline-block",
                                                verticalAlign: "middle",
                                              }}
                                            />
                                          ))}

                                          <button
                                            onClick={handleRemoveImageSwap}
                                            style={{
                                              right: "10px",
                                              top: "10px",
                                              position: "absolute",
                                              borderRadius: "100%",
                                              background: "#b7b7b738",
                                              padding: "10px 10px",
                                            }}
                                          >
                                            <i className="las la-times"></i>
                                          </button>
                                        </div>
                                      </>
                                    ) : null}
                                  </span>
                                </div>

                                {imageshowSwap()}
                                <div
                                  type="submit"
                                  value="Submit"
                                  style={{
                                    textAlign: "center",
                                    background: "#033347",
                                    fontWeight: "bold",
                                    color: "white",
                                    margin: "11px 11px",
                                    padding: "15px",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                  }}
                                  onClick={close}
                                >
                                  Request for Swap
                                </div>
                              </Form>
                            )}
                          </Popup>


                        </div>
                      )} */}
                    </div>
                  ))
                ) : post.allPostsType === "hangShare" && post.media ? (
                  post.media.map((postImage) => (
                    <div >
                      <img
                        style={
                          post.userdata.id == user.id
                            ? { width: "100%", objectFit: "cover" }
                            : { borderRadius: "10px 10px 10px 10px" }
                        }
                        src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                        alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                        className="lightbox-popup Lightbox-display-img"

                        onClick={() => setIsopen(true)}
                      />
                      {isOpen && (
                        <Lightbox
                          image={fileStorage.baseUrl + postImage.mediaPath}
                          buttonAlign="center"
                          onClose={() => setIsopen(false)}
                        />
                      )}
                      <div className="swappost-cont">
                        <div className="">
                          <div
                            className="bold "
                            style={{
                              marginBottom: "5px",
                              marginTop: "10px",
                              color: "#050505",
                            }}
                          >
                            {post.hangsharetype ? post.hangsharetype : "Other"}
                          </div>
                          <div style={{ fontSize: "14px" }}>
                            {post.content ? post.content : ""}
                          </div>
                        </div>
                        {post.userdata.id === user.id ? (
                          <button className="button">Close</button>
                        ) : (
                          <Popup
                            trigger={<button className="button">Accept</button>}
                            modal
                            nested
                          >
                            {(close) => (
                              <Form
                                style={{ margin: "5px" }}
                                className="popwidth rqst-swap-form"
                                onSubmit={close}
                              >
                                <div className="headpop">
                                  <div className="row">
                                    <div style={{ width: "20%" }}>
                                      <a
                                        href="#!"
                                        style={{ padding: "10px 80px 10px 0" }}
                                        onClick={close}
                                      >
                                        <i className="las la-times"></i>
                                      </a>
                                    </div>
                                    <div
                                      style={{
                                        color: "#000000",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        width: "60%",
                                        textAlign: "center",
                                      }}
                                    >
                                      {" "}
                                      <span>Accepting Hang Share</span>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ padding: "0 11px 11px 11px" }}>
                                  <div className="popupimg">
                                    <img
                                      src={
                                        user
                                          ? fileStorage.baseUrl +
                                            user.profilePicturePath
                                          : fileStorage.baseUrl +
                                            userR.profilePicturePath
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <div className="popupuser-name">
                                    <div style={{ display: "inline" }}>
                                      <span>
                                        {`${user.firstName} ${user.lastName}`}
                                        {post.userdata ? (
                                          <>
                                            {" "}
                                            <span
                                              style={{
                                                color: "rgb(100 166 194)",
                                                fontWeight: "500",
                                              }}
                                            >
                                              Accept this Hang Share From
                                            </span>{" "}
                                            {`${post.userdata.firstName} ${post.userdata.lastName}`}
                                          </>
                                        ) : null}
                                      </span>
                                      <span
                                        style={{
                                          marginTop: "4px ",
                                          display: "block",
                                          fontSize: "10px",
                                        }}
                                      >
                                        <li
                                          style={{
                                            paddingLeft: "0%",
                                            paddingTop: "1%",
                                            listStyleType: "none",
                                          }}
                                        ></li>
                                      </span>
                                    </div>{" "}
                                  </div>{" "}
                                </div>
                                <div style={{ minHeight: "150px" }}>
                                  <span className="textPop">
                                    <div
                                      className="input-group mb-3"
                                      style={{
                                        margin: "11px 0px 11px",
                                      }}
                                    >
                                      <div className="input-group-prepend">
                                        <span
                                          className="input-group-text"
                                          id="basic-addon1"
                                        >
                                          Phone Number
                                        </span>
                                      </div>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your Phone"
                                        value={UserPhone}
                                        onChange={handleUserPhone}
                                        style={{margin:0}}

                                      />
                                    </div>
                                    <div>
                                      <div
                                        onClick={getLocation}
                                        style={{
                                          textAlign: "center",
                                          background: "#033347",
                                          fontWeight: "bold",
                                          color: "white",
                                          margin: "11px 0px 11px",
                                          padding: "15px",
                                          borderRadius: "5px",
                                          fontSize: "14px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {"Get Location"}
                                      </div>
                                      <p
                                        style={{
                                          margin: "11px 0px 11px",
                                        }}
                                      >
                                        Coordinates
                                      </p>
                                      <p>{status}</p>
                                      {lat && <p>Latitude: {lat}</p>}
                                      {lng && <p>Longitude: {lng}</p>}
                                    </div>
                                  </span>
                                </div>

                                <div
                                  type="submit"
                                  value="Submit"
                                  style={{
                                    textAlign: "center",
                                    background: "#033347",
                                    fontWeight: "bold",
                                    color: "white",
                                    margin: "11px 0px 11px",
                                    padding: "15px",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    acceptHangShare(post.id, user.id);
                                    close();
                                  }}
                                >
                                  Accept this Hang Share
                                </div>
                              </Form>
                            )}
                          </Popup>
                        )}
                      </div>
                    </div>
                  ))
                ) : null}
              </div>

              {post.allPostsType === "share" ? (
                post.post.id !== null ? (
                  <div className="postSharedCopm">
                    <div
                      className="friend-name"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <figure>
                          <img
                            src={
                              fileStorage.baseUrl +
                              post.post.userdata.profilePicturePath
                            }
                            alt=""
                            className="post-user-img"
                            style={{ borderRadius: "100%" }}
                          />
                        </figure>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            paddingLeft: "10px",
                          }}
                        >
                          <a
                            href={`/profile/${post.post.userdata.email}`}
                            title="#"
                            style={{
                              textTransform: "capitalize",
                              fontWeight: "bold",
                            }}
                          >
                            {`${post.post.userdata.firstName} ${post.post.userdata.lastName}`}
                            {post.post.userTag ? (
                              <>
                                <span style={{ padding: "0 5px" }}>with</span>{" "}
                                <span className="tagPost">
                                  {post.post.userTag.firstName}
                                </span>
                                <span className="tagPost">
                                  {post.post.userTag.lastName}
                                </span>
                              </>
                            ) : null}
                          </a>
                          <span
                            style={{
                              display: "block",
                              fontSize: "12px",
                              paddingTop: "5px",
                            }}
                          >
                            on{" "}
                            {moment(
                              post.post.published,
                              "DD MMMM YYYY hh:mm:ss"
                            ).fromNow()}
                            {/* {checkIfSaved(post) && <i className='las la-bookmark szbkmrk'></i>} */}
                          </span>
                        </div>

                        {/* {post.group ? <span className="groupName">Group: {`${post.group.name}`}</span> : null} */}
                      </div>
                      {/* <div
                  style={{ float: 'right', display: 'inline', fontSize: '28px', fontWeight: '900', cursor: 'pointer' }}
                ></div> */}
                      {/* <div className='add-dropdown' onClick={toggleShowMoreOptions}>
                      <span title='add icon'>
                        <i className='las la-ellipsis-h' style={{  fontSize: '30px' }}></i>
                      </span>
                    </div> */}
                      <div className="dropdown add-dropdown">
                        <button
                          className="btn dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i
                            className="fas fa-ellipsis-h"
                            style={{ fontSize: "20px" }}
                          ></i>
                        </button>
                        <div
                          className="dropdown-menu drop-options"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <ul>
                            {post.post.userdata.id === user.id ? (
                              <li onClick={() => handleEditPost(post.id)}>
                                <i className="las la-pencil-alt"></i>
                                <span>Edit Post</span>
                              </li>
                            ) : (
                              <></>
                            )}
                            <li onClick={() => handleSavePost(post.id)}>
                              <i className="lar la-bookmark"></i>
                              <span>Save Post</span>
                            </li>
                            {post.post.userdata.id === user.id ? (
                              <li onClick={() => handleDeletePost(post.post)}>
                                <i className="las la-trash"></i>
                                <span>Delete</span>
                              </li>
                            ) : (
                              <></>
                            )}
                            <li>
                              <i className="las la-link"></i>
                              <span>Copy Link</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {post.post.content && (
                      <p
                        id={`post-content-${post.id}`}
                        style={{
                          margin: "1%",
                          marginBottom: "5px",
                          fontSize: "14px",
                          color: "black",
                        }}
                      >
                        {`${post.post.content}`}
                        <br></br>
                      </p>
                    )}

                    {post.allPostsType === "share" &&
                    post.post.allPostsType === "post" &&
                    post.post.media.length > 1 ? (
                      <>
                        <OwlCarousel
                          items={1}
                          className="owl-theme grp-carousel post-carousel"
                          dots
                          nav
                          navText={
                            ("<i className='fa fa-chevron-left'></i>",
                            "<i className='fa fa-chevron-right'></i>")
                          }
                          margin={10}
                        >
                          {post.post.media.map((postImage, index) => (
                            <React.Fragment>
                              <img
                                style={{
                                  height: "420px",
                                  width: "100%",
                                  objectFit: "cover",
                                }}
                                src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                                alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                                className="lightbox-popup Lightbox-display-img"
                                onClick={() => openLightbox(index)}
                              />
                            </React.Fragment>
                          ))}
                        </OwlCarousel>
                        {isOpen && (
                          <Lightbox
                            mainSrc={
                              fileStorage.baseUrl +
                              post.post.media[photoIndex].mediaPath
                            }
                            nextSrc={
                              post.post.media[
                                (photoIndex + 1) % post.post.media.length
                              ]
                            }
                            prevSrc={
                              post.post.media[
                                (photoIndex + post.post.media.length - 1) %
                                  post.post.media.length
                              ]
                            }
                            onCloseRequest={() => setIsopen(false)}
                            onMovePrevRequest={() =>
                              setPhotoindex(
                                (photoIndex + post.post.media.length - 1) %
                                  post.post.media.length
                              )
                            }
                            onMoveNextRequest={() =>
                              setPhotoindex(
                                (photoIndex + 1) % post.post.media.length
                              )
                            }
                          />
                        )}
                      </>
                    ) : post.post.allPostsType === "post" &&
                      post.post.media &&
                      post.post.media.length == 1 ? (
                      post.post.media.map((postImage) => (
                        <React.Fragment>
                          <img
                            src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                            alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                            className="lightbox-popup post-display-img"
                            onClick={() => setIsopen(true)}
                          />
                          {isOpen && (
                            <Lightbox
                          image={fileStorage.baseUrl + postImage.mediaPath}
                          buttonAlign="center"
                          onClose={() => setIsopen(false)}
                            />
                          )}
                        </React.Fragment>
                      ))
                    ) : post.post.allPostsType === "swap" && post.post.media ? (
                      post.post.media.map((postImage) => (
                        <div >
                          <img
                            style={
                              post.userdata.id == user.id
                                ? { width: "100%", objectFit: "cover" }
                                : { borderRadius: "10px 10px 0 0" }
                            }
                            src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                            alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                            className="lightbox-popup Lightbox-display-img"
                            onClick={() => setIsopen(true)}
                          />
                          {isOpen && (
                            <Lightbox
                              image={fileStorage.baseUrl + postImage.mediaPath}
                          buttonAlign="center"
                          onClose={() => setIsopen(false)}
                            />
                          )}
                          {post.post.userdata.id !== user.id && (
                            <div className="swappost-cont">
                              <div className="">
                                <div
                                  className="bold "
                                  style={{
                                    marginBottom: "5px",
                                    marginTop: "10px",
                                    color: "#050505",
                                  }}
                                >
                                  {post.category ? post.category : "Category"}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {post.content
                                    ? post.content
                                    : "Get swapped with your favourite things"}
                                </div>
                                {/* <div style={{marginBottom:'2px', fontSize:'13px'}}>Get swapped with your favourite things</div> */}
                              </div>
                              <Popup
                                trigger={
                                  <button className="button">SWAP</button>
                                }
                                modal
                                nested
                              >
                                {(close) => (
                                  <Form
                                    style={{ margin: "5px" }}
                                    className="popwidth rqst-swap-form"
                                    onSubmit={close}
                                  >
                                    <div className="headpop">
                                      <div className="row">
                                        <div style={{ width: "20%" }}>
                                          <a
                                            href="#!"
                                            style={{
                                              padding: "10px 80px 10px 0",
                                            }}
                                            onClick={close}
                                          >
                                            <i className="las la-times"></i>
                                          </a>
                                        </div>
                                        <div
                                          style={{
                                            color: "#000000",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                            width: "60%",
                                            textAlign: "center",
                                          }}
                                        >
                                          {" "}
                                          <span>Request for Swap</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      style={{ padding: "0 11px 11px 11px" }}
                                    >
                                      <div className="popupimg">
                                        <img
                                          src={
                                            user
                                              ? fileStorage.baseUrl +
                                                user.profilePicturePath
                                              : fileStorage.baseUrl +
                                                userR.profilePicturePath
                                          }
                                          alt=""
                                        />
                                      </div>
                                      <div className="popupuser-name">
                                        <div style={{ display: "inline" }}>
                                          <span>
                                            {`${user.firstName} ${user.lastName}`}
                                            {post.userdata ? (
                                              <>
                                                {" "}
                                                <span
                                                  style={{
                                                    color: "rgb(100 166 194)",
                                                    fontWeight: "500",
                                                  }}
                                                >
                                                  swap with
                                                </span>{" "}
                                                {`${post.userdata.firstName} ${post.userdata.lastName}`}
                                              </>
                                            ) : null}
                                          </span>
                                          <span
                                            style={{
                                              marginTop: "4px ",
                                              display: "block",
                                              fontSize: "10px",
                                            }}
                                          >
                                            <li
                                              style={{
                                                paddingLeft: "0%",
                                                paddingTop: "1%",
                                                listStyleType: "none",
                                              }}
                                            >
                                              {/* {popAudience()} */}
                                            </li>

                                            {/* <div className='dropdownnewsfeed'>
                                        <select name='privacy' id='privacy' value={Privacy} onChange={handlePrivacy}>
                                          <option value='Friends'>Friends</option>
                                          <option value='Public'>Public</option>
                                          <option value='Only Me'>Only Me</option>
                                        </select>
                                      </div>{' '} */}
                                          </span>
                                        </div>{" "}
                                      </div>{" "}
                                    </div>
                                    <div style={{ minHeight: "150px" }}>
                                      <span className="textPop">
                                        <textarea
                                          className="textpopup"
                                          rows={2}
                                          // style={{fontSize:'14px'}}
                                          placeholder={
                                            "Share about swap with " +
                                            post.userdata.firstName +
                                            "?"
                                          }
                                          name="swap_content"
                                          value={shareContent}
                                          onChange={handleSwapContent}
                                        />

                                        {showSwapImage ? (
                                          <>
                                            <div
                                              style={{ position: "relative" }}
                                            >
                                              {swapImage.map((item, key) => (
                                                <img
                                                  src={item}
                                                  key={key}
                                                  style={{
                                                    padding: "10px",
                                                    display: "inline-block",
                                                    verticalAlign: "middle",
                                                  }}
                                                />
                                              ))}

                                              {/* <img id="preview" src={postImage} style={{ width: "100%",objectFit:'cover' }} /> */}
                                              <button
                                                onClick={handleRemoveImageSwap}
                                                style={{
                                                  right: "10px",
                                                  top: "10px",
                                                  position: "absolute",
                                                  borderRadius: "100%",
                                                  background: "#b7b7b738",
                                                  padding: "10px 10px",
                                                }}
                                              >
                                                <i className="las la-times"></i>
                                              </button>
                                            </div>
                                          </>
                                        ) : null}
                                      </span>
                                      {/* <a href="#!" onClick={() => setShowCompont("image")}><span style={{float:'right',padding:'5px',margin:'5px',background:'#033347',padding: '2px 5px',color:'#fff',borderRadius:'5px'}}>+</span></a>*/}
                                    </div>

                                    {imageshowSwap()}
                                    <div
                                      type="submit"
                                      value="Submit"
                                      style={{
                                        textAlign: "center",
                                        background: "#033347",
                                        fontWeight: "bold",
                                        color: "white",
                                        margin: "11px 11px",
                                        padding: "15px",
                                        borderRadius: "5px",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                      }}
                                      onClick={close}
                                    >
                                      Request for Swap
                                    </div>
                                  </Form>
                                )}
                              </Popup>

                              {/* <div className='itemS3'> */}
                              {/* <>
                          <div className='swapImage'>
                            <a href={post.swapImagePath} data-lightbox={`image-user-${post.userdata.id}`}>
                              <img
                                style={{ width: '100%', objectFit: 'cover' }}
                                src={post.swapImagePath}
                              />{' '}
                            </a>
                          </div>{' '}
                        </> */}
                              {/* </div> */}
                            </div>
                          )}
                        </div>
                      ))
                    ) : post.post.allPostsType === "hangShare" &&
                      post.post.media ? (
                      post.post.media.map((postImage) => (
                        <div>
                          {/* <Popup */}
                          {/* trigger={ */}
                          <img
                            style={
                              post.userdata.id == user.id
                                ? { width: "100%", objectFit: "cover" }
                                : { borderRadius: "10px 10px 0 0" }
                            }
                            src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                            alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                            className="lightbox-popup Lightbox-display-img"
                            onClick={() => setIsopen(true)}
                          />
                          {isOpen && (
                            <Lightbox
                              image={fileStorage.baseUrl + postImage.mediaPath}
                          buttonAlign="center"
                          onClose={() => setIsopen(false)}
                            />
                          )}
                          <div className="swappost-cont">
                            <div className="">
                              <div
                                className="bold "
                                style={{
                                  marginBottom: "5px",
                                  marginTop: "10px",
                                  color: "#050505",
                                }}
                              >
                                {post.post.hangsharetype
                                  ? post.post.hangsharetype
                                  : "Other"}
                              </div>
                              <div style={{ fontSize: "14px" }}>
                                {post.post.content ? post.post.content : ""}
                              </div>
                            </div>
                            {post.post.userdata?.id === user.id ? (
                              <button className="button">Close</button>
                            ) : (
                              <Popup
                                trigger={
                                  <button className="button">Accept</button>
                                }
                                modal
                                nested
                              >
                                {(close) => (
                                  <Form
                                    style={{ margin: "5px" }}
                                    className="popwidth rqst-swap-form"
                                    onSubmit={close}
                                  >
                                    <div className="headpop">
                                      <div className="row">
                                        <div style={{ width: "20%" }}>
                                          <a
                                            href="#!"
                                            style={{
                                              padding: "10px 80px 10px 0",
                                            }}
                                            onClick={close}
                                          >
                                            <i className="las la-times"></i>
                                          </a>
                                        </div>
                                        <div
                                          style={{
                                            color: "#000000",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                            width: "60%",
                                            textAlign: "center",
                                          }}
                                        >
                                          {" "}
                                          <span>Accepting Hang Share</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      style={{ padding: "0 11px 11px 11px" }}
                                    >
                                      <div className="popupimg">
                                        <img
                                          src={
                                            user
                                              ? fileStorage.baseUrl +
                                                user.profilePicturePath
                                              : fileStorage.baseUrl +
                                                userR.profilePicturePath
                                          }
                                          alt=""
                                        />
                                      </div>
                                      <div className="popupuser-name">
                                        <div style={{ display: "inline" }}>
                                          <span>
                                            {`${user.firstName} ${user.lastName}`}
                                            {post.post.userdata ? (
                                              <>
                                                {" "}
                                                <span
                                                  style={{
                                                    color: "rgb(100 166 194)",
                                                    fontWeight: "500",
                                                  }}
                                                >
                                                  Accept this Hang Share From
                                                </span>{" "}
                                                {`${post.post.userdata.firstName} ${post.post.userdata.lastName}`}
                                              </>
                                            ) : null}
                                          </span>
                                          <span
                                            style={{
                                              marginTop: "4px ",
                                              display: "block",
                                              fontSize: "10px",
                                            }}
                                          >
                                            <li
                                              style={{
                                                paddingLeft: "0%",
                                                paddingTop: "1%",
                                                listStyleType: "none",
                                              }}
                                            ></li>
                                          </span>
                                        </div>{" "}
                                      </div>{" "}
                                    </div>
                                    <div style={{ minHeight: "150px" }}>
                                      <span className="textPop">
                                        <div
                                          className="input-group mb-3"
                                          style={{
                                            margin: "11px 0px 11px",
                                          }}
                                        >
                                          <div className="input-group-prepend">
                                            <span
                                              className="input-group-text"
                                              id="basic-addon1"
                                            >
                                              Phone Number
                                            </span>
                                          </div>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your Phone"
                                            value={UserPhone}
                                            onChange={handleUserPhone}
                                            style={{margin:0}}
                                          />
                                        </div>
                                        <div>
                                          <div
                                            onClick={getLocation}
                                            style={{
                                              textAlign: "center",
                                              background: "#033347",
                                              fontWeight: "bold",
                                              color: "white",
                                              margin: "11px 0px 11px",
                                              padding: "15px",
                                              borderRadius: "5px",
                                              fontSize: "14px",
                                              cursor: "pointer",
                                            }}
                                          >
                                            {"Get Location"}
                                          </div>
                                          <p
                                            style={{
                                              margin: "11px 0px 11px",
                                            }}
                                          >
                                            Coordinates
                                          </p>
                                          <p>{status}</p>
                                          {lat && <p>Latitude: {lat}</p>}
                                          {lng && <p>Longitude: {lng}</p>}
                                        </div>
                                      </span>
                                    </div>

                                    <div
                                      style={{
                                        textAlign: "center",
                                        background: "#033347",
                                        fontWeight: "bold",
                                        color: "white",
                                        margin: "11px 0px 11px",
                                        padding: "15px",
                                        borderRadius: "5px",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        acceptHangShare(post.post.id, user.id);
                                        // close();
                                      }}
                                    >
                                      Accept this Hang Share
                                    </div>
                                  </Form>
                                )}
                              </Popup>
                            )}
                          </div>
                        </div>
                      ))
                    ) : null}

                    <div className="counter" style={{ fontSize: "12px" }}>
                      <ul>
                        <li style={{ float: "left", color: "black" }}>
                          {post.post.numberOfReaction > 0 ? (
                            <div className="userreaction">
                            <OverlayTrigger
                            key={post.id}
                            placement="bottom"
                            overlay={
                              <Tooltip id={`tooltip-${post.id}`}>
                              {Array.isArray(AllReactionListShare.all) && AllReactionListShare.all.length > 0 ? (
                                <>
                                {AllReactionListShare.all.slice(0, 10).map((post) => (
                                  <strong style={{  display: "block"}}>
                                    {" "}
                                    {post.firstName + " " + post.lastName}
                                  </strong>
                                ))}</> 
                               ):null}
                              </Tooltip>
                           }
                          >
                              <span
                                className="isreaction"
                                data-toggle="tooltip"
                                title=""
                              >
                                {handleSharedPostReactions()}
                                <span> {post.post.numberOfReaction}</span>
                              </span>
                              </OverlayTrigger>
                            </div>
                          ) : (
                            <>
                              <div
                                className="userreaction"
                                onClick={() =>
                                  handleLikePost(post.post, "star")
                                }
                              >
                                <span
                                  className="noreaction"
                                  data-toggle="tooltip"
                                  title=""
                                  onMouseEnter={handleShowuserReaction}
                                  onMouseLeave={handleUnshowuserReaction}
                                >
                                  <i className="far fa-star"></i>
                                </span>
                              </div>
                            </>
                          )}
                        </li>

                        <li
                          style={{
                            float: "right",
                            color: "black",
                            paddingLeft: "0px",
                          }}
                        >
                          <span>
                            {`${post.post.numberOfshares}` + " "}

                            {sharepopup()}
                          </span>
                        </li>

                        <li
                          style={{
                            cursor: "pointer",
                            float: "right",
                            color: "black",
                          }}
                        >
                          <span
                            className="commentCounter"
                            style={{ marginRight: "5px" }}
                            onClick={() => setShowComment(!showComment)}
                          >
                            <img src="/assets/images/commentwhite.svg" alt="" />
                          </span>{" "}
                          <span>
                            {" "}
                            {/* {`${getCommentCounter(post.post.comments)}` + " "} */}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="postShared">Unavailable Post</div>
                )
              ) : null}

              <div className="counter">
                <ul>
                  <li style={{ float: "left", color: "black" }}>
                    {post.numberOfReaction > 0 ? (
                      <>
                        <div className="userreaction">
                          {" "}
                          <OverlayTrigger
                            key={post.id}
                            placement="bottom"
                            overlay={
                              <Tooltip id={`tooltip-${post.id}`}>
                              {Array.isArray(AllReactionList.all) && AllReactionList.all.length > 0 ? (
                                <>
                                {AllReactionList.all.slice(0, 10).map((post) => (
                                  <strong style={{  display: "block"}}>
                                    {" "}
                                    {post.firstName + " " + post.lastName}
                                  </strong>
                                ))}</> 
                               ):null}
                              </Tooltip>
                           }
                          >
                            <span
                              className="isreaction"
                              data-toggle="tooltip"
                              title=""
                            >
                              <Popup
                                style={{ padding: "0px" }}
                                trigger={
                                  <span>
                                    {handlePostReactions()}{" "}
                                    {post.numberOfReaction}
                                  </span>
                                }
                                modal
                              >
                                {(close) => (
                                  <Form
                                    onSubmit={() => {
                                      close();
                                    }}
                                  >
                                    <div>
                                      <div className="row">
                                        <div style={{ width: "5%" }}>
                                          <a href="#!" onClick={close}>
                                            <i
                                              style={{
                                                color: "#000",
                                                padding: "0px",
                                                fontSize: "15px",
                                              }}
                                              className="las la-times"
                                            ></i>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                    <ReactionsListComponent postID={post?.id} />
                                  </Form>
                                )}
                              </Popup>
                            </span>
                          </OverlayTrigger>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="userreaction">
                          <span
                            className="noreaction"
                            data-toggle="tooltip"
                            title=""
                            onMouseEnter={handleShowuserReaction}
                            onMouseLeave={handleUnshowuserReaction}
                          >
                            <i className="far fa-star"></i>
                          </span>
                        </div>
                      </>
                    )}
                  </li>

                  <li
                    style={{
                      float: "right",
                      color: "black",
                      paddingLeft: "0px",
                    }}
                  >
                    <span>
                      {" "}
                      {`${post.numberOfshares}` + " "}
                      {sharepopup()}
                    </span>
                  </li>

                  <li
                    style={{
                      cursor: "pointer",
                      float: "right",
                      color: "black",
                    }}
                  >
                    <span
                      className="commentCounter"
                      style={{ marginRight: "5px" }}
                      onClick={() => setShowComment(!showComment)}
                    >
                      {post.numberOfComments} Comments
                    </span>{" "}
                  </li>
                </ul>
              </div>

              {showReactions && (
                <div
                  onMouseEnter={handleShowingReaction}
                  onMouseLeave={handleUnshowingReaction}
                  className="reaction-bunch active"
                >
                  <img
                    src={"../assets/images/gif/smiley.gif"}
                    onClick={() => handleSettingReactions("smiley")}
                  />
                  <img
                    src={"../assets/images/gif/wow.gif"}
                    onClick={() => handleSettingReactions("wow")}
                  />
                  <img
                    src={"../assets/images/gif/laughing.gif"}
                    onClick={() => handleSettingReactions("laugh")}
                  />
                  <img
                    src={"../assets/images/gif/crying.gif"}
                    onClick={() => handleSettingReactions("cry")}
                  />
                  <img
                    src={"../assets/images/gif/love.gif"}
                    onClick={() => handleSettingReactions("love")}
                  />
                  <img
                    src={"../assets/images/gif/angry.gif"}
                    onClick={() => handleSettingReactions("angry")}
                  />
                  <img
                    src={"../assets/images/gif/celebrate.gif"}
                    onClick={() => handleSettingReactions("celebrate")}
                  />
                </div>
              )}

              <div
                className="we-video-info post-action"
                style={{ marginLeft: "10px" }}
              >
                <div className="click">
                  <div className="commShare">
                    {checkIfLiked(post) ? (
                      <div
                        className="btncmn"
                        onClick={() => handleLikePost(post, "star")}
                      >
                        <span className="like " data-toggle="tooltip" title="">
                          <div className="emoji-reaction">
                            {handleReaction()}
                          </div>
                          <div
                            style={{
                              display: "inline-block",
                              textTransform: "capitalize",
                            }}
                          >
                            {post.likedType}
                          </div>
                        </span>
                      </div>
                    ) : (
                      <>
                        <div
                          className="btncmn"
                          onClick={() => handleLikePost(post, "star")}
                        >
                          <span
                            className="dislike"
                            data-toggle="tooltip"
                            title=""
                            onMouseEnter={handleShowingReaction}
                            onMouseLeave={handleUnshowingReaction}
                          >
                            <i
                              className="far fa-star"
                              style={{ fontSize: "15px", paddingRight: "5px" }}
                            ></i>
                            Star
                          </span>
                        </div>
                      </>
                    )}

                    <div
                      className="btncmn"
                      style={{ padding: "0px" }}
                      onClick={() => setShowComment(!showComment)}
                    >
                      <span
                        className="comment"
                        data-toggle="tooltip"
                        title="Comments"
                      >
                        <i className="far fa-comment"></i>
                        <span style={{ paddingLeft: "5px" }}>Comments</span>
                      </span>
                    </div>

                    <div className="btncmn">
                      <span
                        className="views"
                        data-toggle="tooltip"
                        title="Share"
                      >
                        <i
                          className="fas fa-share"
                          style={{ paddingRight: "5px" }}
                        ></i>
                        {sharepopup()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EditPostComponent post={post} set={handleEditingSave} />
        )}

        <PostComponentBoxComponent
          post={post}
          setRefresh={setRefresh}
          showComment={showComment}
          commentChangedFunction={commentChangedFunction}

        />
      </div>
    </div>
  );
}
