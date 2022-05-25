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

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import Form from "react-bootstrap/Form";
import moment from "moment";
import NewsfeedComponent from "../user/NewsfeedComponent";
import Card from "react-bootstrap/Card";
import HangShareService from "../../services/HangShareService";

const my_url = `${storage.baseUrl}`;

export default function PostComponent({ post, setRefresh }) {
  const { user } = useContext(UserContext);

  const [editPostId, setEditPostId] = useState(null);
  const [userR, setUserR] = useState([]);
  const [showComment, setShowComment] = useState(false);
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
    if (post.reactions) {
      const result = post.reactions.filter(
        (reaction) => reaction.user.id == user.id
      );
      if (result.length > 0) {
        return true;
      }
      return false;
    }
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

  const handleLikePost = async (post_id) => {
    UserService.likeSwap(user.id, post_id)
      .then((res) => {
        setRefresh(res.data);
      })
      .catch((e) => {
        UserService.likePost(user.id, post_id).then((res) => {
          setRefresh(res.data);
        });
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
    PostService.deletePost(post.id).then((res) => {
      setRefresh(res.data);
    });
  };

  const handleDeleteSwap = (post) => {
    SwapService.deleteSwap(post.id).then((res) => {
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

      HangShareService.acceptHangShare(hsid, uid, formData).then(
        (res) => {
          setRefresh(res.data);
        }
      );
    }
  };

  const handleReaction = () => {
    if (likeReaction) {
      return <i className="fas fa-star" style={{ fontSize: "12px" }}></i>;
      // return (<img width={30} style={{marginTop:'-5px'}} src={`../assets/images/gif/${likeReaction}.gif`}/>)
    }
    return (
      <i
        className="fas fa-star"
        style={{ fontSize: "12px", color: "#d83535" }}
      ></i>
    );
  };

  const handleSettingReactions = (reaction) => {
    setLikeReaction(reaction);
    if (!checkIfLiked(post)) {
      handleLikePost(post.id);
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

  const sharepopup = () => {
    return (
      <Popup
        trigger={
          <span style={{ cursor: "pointer" }}>
            Share
          </span>
        }
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

  useEffect(() => { }, []);

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
                  paddingLeft: '0px'
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
                        <span>Copy Link</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {post.content && (
                <p
                  id={`post-content-${post.id}`}
                  style={{
                    marginBottom: "5px",
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
                        style={{ width: "100%", objectFit: "cover" }}
                        src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                        alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                        className="lightbox-popup"
                        onClick={() => setIsopen(true)}
                      />
                      {isOpen && (
                        <Lightbox
                          mainSrc={fileStorage.baseUrl + postImage.mediaPath}
                          onCloseRequest={() => setIsopen(false)}
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : post.allPostsType === "swap" && post.media ? (
                  post.media.map((postImage) => (
                    <div className="swappost-main-div">
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
                        onClick={() => setIsopen(true)}
                      />
                      {isOpen && (
                        <Lightbox
                          mainSrc={fileStorage.baseUrl + postImage.mediaPath}
                          onCloseRequest={() => setIsopen(false)}
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
                    <div className="swappost-main-div">
                      <img
                        style={
                          post.userdata.id == user.id
                            ? { width: "100%", objectFit: "cover" }
                            : { borderRadius: "10px 10px 10px 10px" }
                        }
                        src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                        alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                        onClick={() => setIsopen(true)}
                      />
                      {isOpen && (
                        <Lightbox
                          mainSrc={fileStorage.baseUrl + postImage.mediaPath}
                          onCloseRequest={() => setIsopen(false)}
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
                            {post.hangsharetype
                              ? post.hangsharetype
                              : "Other"}
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
                                    <div class="input-group mb-3">
                                      <div class="input-group-prepend">
                                        <span
                                          class="input-group-text"
                                          id="basic-addon1"
                                        >
                                          Phone Number
                                        </span>
                                      </div>
                                      <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Enter you Phone"
                                        value={UserPhone}
                                        onChange={handleUserPhone}
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
                                          padding: "15px",
                                          borderRadius: "5px",
                                          fontSize: "14px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        {"Get Location"}
                                      </div>
                                      <h1>Coordinates</h1>
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
                                    margin: "11px 11px",
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
                  <div className="postShared">
                    <div
                      className="friend-name"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
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
                                className="lightbox-popup"
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
                            style={{ width: "100%", objectFit: "cover" }}
                            src={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                            alt={`${fileStorage.baseUrl}${postImage.mediaPath}`}
                            className="lightbox-popup"
                            onClick={() => setIsopen(true)}
                          />
                          {isOpen && (
                            <Lightbox
                              mainSrc={
                                fileStorage.baseUrl + postImage.mediaPath
                              }
                              onCloseRequest={() => setIsopen(false)}
                            />
                          )}
                        </React.Fragment>
                      ))
                    ) : post.post.allPostsType === "swap" && post.post.media ? (
                      post.post.media.map((postImage) => (
                        <div className="swappost-main-div">
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
                            onClick={() => setIsopen(true)}
                          />
                          {isOpen && (
                            <Lightbox
                              mainSrc={
                                fileStorage.baseUrl + postImage.mediaPath
                              }
                              onCloseRequest={() => setIsopen(false)}
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
                        <div className="swappost-main-div">
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
                            onClick={() => setIsopen(true)}
                          />
                          {isOpen && (
                            <Lightbox
                              mainSrc={
                                fileStorage.baseUrl + postImage.mediaPath
                              }
                              onCloseRequest={() => setIsopen(false)}
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
                                  {post.post.hangsharetype
                                    ? post.post.hangsharetype
                                    : "Other"}
                                </div>
                                <div style={{ fontSize: "14px" }}>
                                  {post.post.content ? post.post.content : ""}
                                </div>
                              </div>
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
                                        <div class="input-group mb-3">
                                          <div class="input-group-prepend">
                                            <span
                                              class="input-group-text"
                                              id="basic-addon1"
                                            >
                                              Phone Number
                                            </span>
                                          </div>
                                          <input
                                            type="text"
                                            class="form-control"
                                            placeholder="Enter you Phone"
                                            value={UserPhone}
                                            onChange={handleUserPhone}
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
                                              padding: "15px",
                                              borderRadius: "5px",
                                              fontSize: "14px",
                                              cursor: "pointer",
                                            }}
                                          >
                                            {"Get Location"}
                                          </div>
                                          <h1>Coordinates</h1>
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
                                        margin: "11px 11px",
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
                              </Popup>                            </div>
                          )}
                        </div>
                      ))
                    ) : null}

                    <div className="counter" style={{ fontSize: "12px" }}>
                      <ul>
                        <li style={{ float: "left", color: "black" }}>
                          {checkIfLiked(post.post) ? (
                            <div className="userreaction">
                              <span
                                className="isreaction"
                                data-toggle="tooltip"
                                title=""
                              >
                                {handleReaction()}

                                {/* <span style={{ paddingLeft: '5px' }}>{post.reactions&&post.reactions.length>0?post.reactions.length:''}</span> */}
                              </span>
                            </div>
                          ) : (
                            <>
                              <div
                                className="userreaction"
                                onClick={() => handleLikePost(post.post.id)}
                              >
                                <span
                                  className="noreaction"
                                  data-toggle="tooltip"
                                  title=""
                                  onMouseEnter={handleShowuserReaction}
                                  onMouseLeave={handleUnshowuserReaction}
                                >
                                  {/* <img src='/assets/images/Star.svg' alt='' /> */}
                                  {/* <span style={{ paddingLeft: '10px' }}>Star</span> */}
                                  <i className="far fa-star"></i>

                                  {/* <span style={{paddingLeft:'5px'}}>{post.reactions&&post.reactions.length>0?post.reactions.length:''}</span> */}
                                </span>
                              </div>
                            </>
                          )}
                          <span style={{ paddingLeft: "5px" }}>
                            {post.post.reactions &&
                              post.post.reactions.length + " "}
                          </span>
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
                            {/* <img src='/assets/images/shareicnwhite.svg' alt='' /> */}
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
                    {checkIfLiked(post) ? (
                      <div className="userreaction">
                        <span
                          className="isreaction"
                          data-toggle="tooltip"
                          title=""
                        >
                          {handleReaction()}

                          {/* <span style={{ paddingLeft: '5px' }}>{post.reactions&&post.reactions.length>0?post.reactions.length:''}</span> */}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div
                          className="userreaction"
                          onClick={() => handleLikePost(post.id)}
                        >
                          <span
                            className="noreaction"
                            data-toggle="tooltip"
                            title=""
                            onMouseEnter={handleShowuserReaction}
                            onMouseLeave={handleUnshowuserReaction}
                          >
                            {/* <img src='/assets/images/Star.svg' alt='' /> */}
                            {/* <span style={{ paddingLeft: '10px' }}>Star</span> */}
                            <i className="far fa-star"></i>

                            {/* <span style={{paddingLeft:'5px'}}>{post.reactions&&post.reactions.length>0?post.reactions.length:''}</span> */}
                          </span>
                        </div>
                      </>
                    )}
                    <span style={{ paddingLeft: "5px" }}>
                      {post.reactions && post.reactions.length + " "}
                    </span>
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
                      {/* <img src='/assets/images/shareicnwhite.svg' alt='' /> */}
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
                    src={"../assets/images/gif/cool.gif"}
                    onClick={() => handleSettingReactions("cool")}
                  />
                  <img
                    src={"../assets/images/gif/laughing.gif"}
                    onClick={() => handleSettingReactions("laughing")}
                  />
                  <img
                    src={"../assets/images/gif/tongue.gif"}
                    onClick={() => handleSettingReactions("tongue")}
                  />
                  <img
                    src={"../assets/images/gif/angel.gif"}
                    onClick={() => handleSettingReactions("angel")}
                  />
                  <img
                    src={"../assets/images/gif/devil.gif"}
                    onClick={() => handleSettingReactions("devil")}
                  />
                  <img
                    src={"../assets/images/gif/angry.gif"}
                    onClick={() => handleSettingReactions("angry")}
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
                        onClick={() => handleLikePost(post.id)}
                      >
                        <span className="like" data-toggle="tooltip" title="">
                          {handleReaction()}
                          Star
                          {/* <span style={{ paddingLeft: '5px' }}>{post.reactions&&post.reactions.length>0?post.reactions.length:''}</span> */}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div
                          className="btncmn"
                          onClick={() => handleLikePost(post.id)}
                        >
                          <span
                            className="dislike"
                            data-toggle="tooltip"
                            title=""
                            onMouseEnter={handleShowingReaction}
                            onMouseLeave={handleUnshowingReaction}
                          >
                            {/* <img src='/assets/images/Star.svg' alt='' /> */}
                            {/* <span style={{ paddingLeft: '10px' }}>Star</span> */}
                            <i
                              className="far fa-star"
                              style={{ paddingRight: "5px" }}
                            ></i>
                            Star
                            {/* <span style={{paddingLeft:'5px'}}>{post.reactions&&post.reactions.length>0?post.reactions.length:''}</span> */}
                          </span>
                          {/* <div className='smiliehint'>
                        {(
                          <div
                           
                            className='reaction-bunch active'
                          >
                            <img src={'../assets/images/gif/smiley.gif'} onClick={() => handleSettingReactions('smiley')} />
                            <img src={'../assets/images/gif/cool.gif'} onClick={() => handleSettingReactions('cool')} />
                            <img src={'../assets/images/gif/laughing.gif'} onClick={() => handleSettingReactions('laughing')} />
                            <img src={'../assets/images/gif/tongue.gif'} onClick={() => handleSettingReactions('tongue')} />
                            <img src={'../assets/images/gif/angel.gif'} onClick={() => handleSettingReactions('angel')} />
                            <img src={'../assets/images/gif/devil.gif'} onClick={() => handleSettingReactions('devil')} />
                            <img src={'../assets/images/gif/angry.gif'} onClick={() => handleSettingReactions('angry')} />
                          </div>
                        )} 
                        </div> */}
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
                        {/* <img src='/assets/images/comment.svg' /> */}
                        {/* <span style={{ paddingLeft: '2px' }}>Comment</span> */}
                        <i className="far fa-comment"></i>
                        <span style={{ paddingLeft: "5px" }}>
                          Comments
                          {/* {getCommentCounter(post.comments)} */}
                        </span>
                      </span>
                    </div>

                    <div className="btncmn">
                      <span
                        className="views"
                        data-toggle="tooltip"
                        title="Share"
                      >
                        {/* <img src='/assets/images/shareicn.svg' /> */}
                        <i
                          className="fas fa-share"
                          style={{ paddingRight: "5px" }}
                        ></i>
                        {sharepopup()}
                      </span>
                    </div>
                    {/* <div className='btncmn'>
                      <span className='views' data-toggle='tooltip'>
                        
                        {checkIfSaved(post)==true?<i className="fas fa-bookmark" style={{color:'#044f66'}} onClick={()=>handleSavePost(post.id)} title='Save post' ></i>:<i className="far fa-bookmark" onClick={()=>handleSavePost(post.id)}  title='Save post'></i>}
                        {/* <span style={{ paddingLeft: '12px' }}>Share</span> */}
                    {/* </span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EditPostComponent post={post} set={handleEditingSave} />
        )}
        {/* 
        {showMoreOptions && (
          <div className='drop-options active' onClick={toggleShowMoreOptions}>
            <ul>
              <li className='head-drop'>
                <h6>Post Options</h6>
              </li>
              {post.userdata.id === user.id ? (
                <li onClick={() => handleEditPost(post.id)}>
                  <i className='las la-pencil-alt'></i>
                  <span>Edit Post</span>
                </li>
              ) : (
                <></>
              )}
              <li onClick={() => handleSavePost(post.id)}>
                <i className='lar la-bookmark'></i>
                <span>Save Post</span>
              </li>
              {post.userdata.id === user.id ? (
                <li onClick={() => handleDeletePost(post.id)}>
                  <i className='las la-trash'></i>
                  <span>Delete</span>
                </li>
              ) : (
                <></>
              )}
              <li>
                <i className='las la-link'></i>
                <span>Copy Link</span>
              </li>
            </ul>
          </div>
        )} */}
        {/* Till here */}
        <div className="coment-area">
          <ul className="we-comet">
            <PostComponentBoxComponent post={post} setRefresh={setRefresh} />
            {/* {showComment && <PostComponentBoxComponent post={post} setRefresh={setRefresh} />} */}
            {showComment && (
              <CommentPostComponent post={post} setRefresh={setRefresh} />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
