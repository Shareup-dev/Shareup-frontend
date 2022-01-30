import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import PostService from "../../services/PostService";
import SwapService from "../../services/SwapService";
import AuthService from "../../services/auth.services";
import SimpleReactLightbox from "simple-react-lightbox";
import { testScript } from "../../js/script";
import FriendsService from "../../services/FriendService";

import EditPostComponent from "./EditPostComponent";

import Layout from "../LayoutComponent";

import PostComponent from "../post/PostComponent";
import Popup from "reactjs-popup";
import settings from "../../services/Settings";
import fileStorage from "../../config/fileStorage";
import LocSearchComponent from '../AccountSettings/LocSearchComponent';


function PostTextBoxComponent() {
  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  const { user } = useContext(UserContext);

  // const []

  // const inputRef = createRef();

  const [refresh, setRefresh] = useState(null);

  const [showComp, setShowComp] = useState("newsfeed");

  const [posts, setPosts] = useState([]);
  const [postsForUser, setPostsForUser] = useState([]);
  const [savedPost, setSavedPost] = useState([]);
  const [userR, setUserR] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [files, setFiles] = useState({});
  const [postImage, setPostImage] = useState({});
  const [showPostImage, setShowPostImage] = useState(false);
  const [swapContent, setSwapContent] = useState("");
  const [swapImage, setSwapImage] = useState({});
  const [showSwapImage, setShowSwapImage] = useState(false);

  const [uploadError, setUploadError] = useState("");
  const [swapfiles, setSwapfiles] = useState([]);

  const [editPostId, setEditPostId] = useState(null);

  const [img, setImage] = useState("");
  const [Privacy, setPrivacy] = useState("");
  const [privacy, setprivacy] = useState('privacy');

  const [friendsList, setFriendsList] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [userF, setUserF] = useState(null);
  const [searchedUser, setSearchedUser] = useState([]);

  // const [cursorPosition, setCursorPosition] = useState();
  // const pickEmoji = (e, {emoji}) => {
  //   const ref = inputRef.current;
  //   ref.focus();
  //   const start = commentContent.substring(0, ref.seletionStart);
  //   const end = commentContent.substring(ref.selectionStart);
  //   const text = start + emoji + end;
  //   setCommentContent(text)
  //   setCursorPosition(start.length+emoji.length)
  // }

  // useEffect(() => {
  //   inputRef.current.selectionEnd = cursorPosition;
  // },[cursorPosition])

  const getPost = async () => {
    await PostService.getPost().then((res) => {
      setPosts(res.data);
    });
  };
  const handleChange = e => {
    const target = e.target;
    if (target.checked) {
      setprivacy(target.value);
    }
 };
  const getPostForUser = async () => {
    await PostService.getPostForUser(
      AuthService.getCurrentUser().username
    ).then((res) => {
      const uniquePost = Array.from(new Set(res.data.map((a) => a.id))).map(
        (id) => {
          return res.data.find((a) => a.id === id);
        }
      );
      setPostsForUser(uniquePost);
    });
  };

  const getSavedPost = async () => {
    await PostService.getSavedPostForUser(
      AuthService.getCurrentUser().username
    ).then((res) => {
      setSavedPost(res.data);
    });
  };

  const handlePostContent = (event) => {
    console.log(event.target.value);
    setPostContent(event.target.value);
  };

  const handleDeletePost = (postid) => {
    PostService.deletePost(postid).then((res) => {
      console.log(res.status);
      setRefresh(res.data);
      // window.location.reload();
    });
  };

  const handleCommentContent = (event) => {
    console.log(event.target.value);
    setCommentContent(event.target.value);
  };

  const handlePostingComment = (postid) => {
    if (commentContent === "") {
      return null;
    }
    const comment = { content: commentContent };
    PostService.addComment(user.id, postid, comment).then((res) => {
      console.log(res.status);
      setRefresh(res.data);
      setCommentContent("");
    });
  };

  const handleEditPost = (id) => {
    setEditPostId(id);
  };

  const handleFile = (event) => {
    console.log(event.target.files[0]);
    setFiles(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPostImage(reader.result);
      }
    };
    console.log(event.target.files[0]);
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0]);
    // }
    setShowPostImage(true);
  };

  const handleRemoveImage = () => {
    setFiles({});
    setShowPostImage(false);
  };

  const handleEditingSave = (value) => {
    setEditPostId(value);
    // console.log(res.status)
    // window.location.reload();
  };

  const checkIfLiked = (post) => {
    // maybe this is more effecient
    // post.reactions.map(r => {
    //   console.log(JSON.stringify(r.user))
    //   if(r.user.id === user.id){
    //     return true
    //   }else{
    //     return false
    //   }
    // })
    const result = post.reactions.filter(
      (reaction) => reaction.user.id == userR.id
    );
    if (result.length > 0) {
      return true;
    }
    return false;
  };

  const checkIfSaved = (post) => {
    console.log(post.savedByUsers);
    // maybe this is more effecient
    // post.savedByUsers.map(r => {
    //   console.log("runninggg")
    //   console.log(JSON.stringify(r.user) + " i p pp p p")
    // if(r.user.id === user.id){
    //   return true
    // }else{
    //   return false
    // }
    // })
    console.log(post.savedByUsers.length + " yaa");
    const result = post.savedByUsers.filter((userz) => userz.id == user.id);
    if (result.length > 0) {
      console.log(" FOUND");
      return true;
    }
    console.log(" Not found");
    return false;
  };

  const handleDeleteComment = (commentid) => {
    PostService.deleteComment(commentid).then((res) => {
      console.log(res.status);
      setRefresh(res.data);
    });
  };

  const getCommentCounter = (comments) => {
    let counter = 0;
    comments.map((comment) => {
      counter += comment.replies.length + 1;
    });
    return counter;
  };

  const uploadPost = (event) => {
    event.preventDefault();
    setUploadError("");
    console.log("uploading post working");
    if (
      postContent === "" &&
      Object.keys(files).length === 0 &&
      files.constructor === Object
    ) {
      console.log("cant be null");
      setUploadError("Please Insert A Text or an Image");
      return;
    }

    const formData = new FormData();
    formData.append("content", postContent);
    console.log(" this is the files" + files);
    formData.append(`files`, files);
    if (userF === null) {
      PostService.createPost(user.id, formData, null).then((res) => {
        console.log(JSON.stringify(res));
        setPostContent("");
        handleRemoveImage();
        setRefresh(res.data);
      });
    } else
      PostService.createPost(user.id, formData, userF.id).then((res) => {
        console.log(JSON.stringify(res));
        setPostContent("");
        handleRemoveImage();
        setRefresh(res.data);
      });
  };

  const handleLikePost = async (post_id) => {
    UserService.likePost(user.id, post_id).then((res) => {
      setRefresh(res.data);
    });
  };

  const handleSavePost = async (post_id) => {
    UserService.savePost(user.id, post_id).then((res) => {
      setRefresh(res.data);
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
  const handlePrivacy = (event) => {
    console.log(event.target.value);
    setPrivacy(event.target.value);
  };
  //Swap functions

  const handleSwapContent = (event) => {
    console.log(event.target.value);
    setSwapContent(event.target.value);
  };
  const handleFileSwap = (event) => {
    console.log(event.target.files[0]);
    setFiles(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setSwapImage(reader.result);
      }
    };
    console.log(event.target.files[0]);
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0]);
    // }
    setShowSwapImage(true);
  };
  const handleRemoveImageSwap = () => {
    setFiles({});
    setShowSwapImage(false);
  };
  // const uploadSwap = (event) => {
  //   event.preventDefault();
  //   setUploadError("")
  //   console.log("uploading post working")
  //   if (swapContent === "" && (Object.keys(files).length === 0 && files.constructor === Object)) {
  //     console.log("cant be null")
  //     setUploadError("Please Insert A Text or an Image")
  //     return
  //   }

  //   const formData = new FormData();
  //   formData.append('content', swapContent)
  //   console.log(" this is the files" + files)
  //   formData.append(`files`, files)
  //   SwapService.createSwap(user.id, formData).then(res => {
  //     console.log(JSON.stringify(res))
  //     setSwapContent("")
  //     handleRemoveImage()
  //     setRefresh(res.data)
  //   })
  // }
  const testFanc = (post) => {
    return <PostComponent post={post} setRefresh={setRefresh} />;
  };

  const show = () => {
    if (showComp === "newsfeed") {
      return (
        <div className="loadMore">
          {postsForUser.map((post) => (
            <div key={post.id}>
              {post.group
                ? post.group.members.some(
                    (member) =>
                      member.email === AuthService.getCurrentUser().username
                  )
                  ? testFanc(post)
                  : null
                : testFanc(post)}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="loadMore">
          {savedPost.map((post) => (
            <div key={post.id}>
              {post.group
                ? post.group.members.some(
                    (member) =>
                      member.email === AuthService.getCurrentUser().username
                  )
                  ? testFanc(post)
                  : null
                : testFanc(post)}
            </div>
          ))}
        </div>
      );
    }
  };
  const handleTag = (userM) => {
    setUserF(userM);
    console.log(userM);
  };
  const handleSearchedUser = (event) => {
    if (event.target.value === "") {
      setSearchedUser(allUser);
    } else {
      let temp = [];
      allUser.map((u) => {
        const email = u.email.toLowerCase();
        const firstname = u.firstName.toLowerCase();
        const lastname = u.lastName.toLowerCase();
        const searchedvalue = event.target.value.toLowerCase();
        if (
          email.includes(searchedvalue) ||
          firstname.includes(searchedvalue) ||
          lastname.includes(searchedvalue)
        ) {
          temp.push(u);
        }
      });
      setSearchedUser(temp);
      console.log(temp);
    }
  };
  const getAllUser = async () => {
    await UserService.getUsers().then((res) => {
      setAllUser(res.data);
      setSearchedUser(res.data);
    });
    console.log(user.email + " This is the users");
  };
  const getFriendsList = async () => {
    await FriendsService.getFriends(AuthService.getCurrentUser().username).then(
      (res) => {
        setFriendsList(res.data);
      }
    );
  };

  useEffect(() => {
    getAllUser();
    getFriendsList();
    testScript();
  }, []);

  useEffect(() => {
    getUser();
    getPost().then(() => {
      setIsLoading(false);
    });
    getPostForUser();
    getSavedPost();
    testScript();
  }, [editPostId, refresh]);

  useEffect(() => {
    getPostForUser();
    getSavedPost();
    testScript();
  }, [user]);

  if (isLoading) {
    return <div>Loading... Please Wait</div>;
  }

  const imageshow = () => {
    return (
      <div
        style={{
          margin: "0 11px",
          padding: "15px",
          boxShadow: "0 0 3px rgb(0 0 0 / 16%)",
          borderRadius: "5px",
        }}
      >
        <div style={{ display: "inline" }}>What's in hang?</div>

        <div className="add-smilespopup">
          <label className="fileContainer">
            <i class="lar la-file-image"></i>{" "}
            <input
              type="file"
              name="post_image"
              accept="image/*"
              onChange={handleFile}
            ></input>
          </label>
        </div>
        <div className="gifpopup">
          <Popup
            trigger={
              <a href="#!">
                <i class="las la-user-tag"></i>
              </a>
            }
            modal
            nested
          >
            {(close) => (
              <Form style={{ margin: "5px" }} className="popwidth">
                <div class="search-container">
                  <i class="las la-search"></i>
                  <input
                    className="friend-search"
                    type="text"
                    id="header-search"
                    placeholder="Search Friends"
                    name="s"
                    onChange={handleSearchedUser}
                  />
                  <span onClick={close}>Done</span>
                </div>
                {userF ? (
                  <>
                    <div className="Tag">
                      Tagged:{`${userF.firstName} ${userF.lastName}`}
                    </div>
                  </>
                ) : null}
                <div>
                  <ul>
                    {friendsList.length > 0 ? (
                      <>
                        {friendsList.map((userM) =>
                          user.id !== userM.id ? (
                            <li key={userM.id} className="friends-card">
                              <a href="#!" onClick={() => handleTag(userM)}>
                                {" "}
                                <div className="grid-container">
                                  {/* <figure> */}
                                  <div class="item1">
                                    <a
                                      href={`/profile/${userM.email}`}
                                      title={`${userM.email}`}
                                    >
                                      <img
                                        style={{ objectFit: "cover" }}
                                        src={
                                          fileStorage.baseUrl +
                                          userM.profilePicturePath
                                        }
                                        alt=""
                                      />
                                    </a>
                                    {/* </figure> */}
                                  </div>
                                  <div class="item2">
                                    <p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                                  </div>
                                  {/* <div className="  "> */}
                                </div>
                              </a>
                            </li>
                          ) : null
                        )}
                      </>
                    ) : (
                      <div style={{ padding: "10% 0", textAlign: "center" }}>
                        You have no friends to tag
                      </div>
                    )}
                  </ul>
                </div>
              </Form>
            )}
          </Popup>
        </div>
        <div className="campopup">
          <label className="fileContainer">
            <i class="las la-map-marker-alt"></i>
            <input
              type="file"
              name="post_image"
              accept="image/*"
              onChange={handleFile}
            ></input>
          </label>
        </div>

        {/* <ul style={{marginLeft:'10px'}}>
        <li style={{fontSize:'12px'}}>What's in hang?</li>
        <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
      </label></li></ul>*/}
      </div>
    );
  };
  const imageshowPost = () => {
    return (
      <div
        style={{
          margin: "0 11px",
          padding: "15px",
          boxShadow: "0 0 3px rgb(0 0 0 / 16%)",
          borderRadius: "5px",
        }}
      >
        <div style={{ display: "inline" }}>Add More</div>

        <div className="add-smilespopup">
          <label className="fileContainer">
            <input
              type="file"
              name="post_image"
              accept="image/*"
              onChange={handleFile}
            ></input>
            <i class="lar la-file-image"></i>
          </label>
        </div>
        <div className="gifpopup">
          <Popup
            trigger={
              <a href="#!">
                <i class="las la-user-tag"></i>
              </a>
            }
            nested
            modal
          >
            {(close) => (
              <Form style={{ margin: "5px" }} className="popwidth">
                <div class="search-container">
                  <i class="las la-search"></i>
                  <input
                    className="friend-search"
                    type="text"
                    id="header-search"
                    placeholder="Search Friends"
                    name="s"
                    onChange={handleSearchedUser}
                  />
                  <span onClick={close}>Done</span>
                </div>
                {userF ? (
                  <>
                    <div className="Tag">
                      Tagged:{`${userF.firstName} ${userF.lastName}`}
                    </div>
                  </>
                ) : null}
                <div>
                  <ul>
                    {friendsList.length > 0 ? (
                      <>
                        {friendsList.map((userM) =>
                          user.id !== userM.id ? (
                            <li key={userM.id} className="friends-card">
                              <a href="#!" onClick={() => handleTag(userM)}>
                                {" "}
                                <div className="grid-container">
                                  {/* <figure> */}
                                  <div class="item1">
                                    <a
                                      href={`/profile/${userM.email}`}
                                      title={`${userM.email}`}
                                    >
                                      <img
                                        style={{ objectFit: "cover" }}
                                        src={
                                          fileStorage.baseUrl +
                                          userM.profilePicturePath
                                        }
                                        alt=""
                                      />
                                    </a>
                                    {/* </figure> */}
                                  </div>
                                  <div class="item2">
                                    <p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                                  </div>
                                  {/* <div className="  "> */}
                                </div>
                              </a>
                            </li>
                          ) : null
                        )}
                      </>
                    ) : (
                      <div style={{ padding: "10% 0", textAlign: "center" }}>
                        You have no friends to tag
                      </div>
                    )}
                  </ul>
                </div>
              </Form>
            )}
          </Popup>
        </div>
        <div className="campopup">
          <label className="fileContainer">
            <input
              type="file"
              name="post_image"
              accept="image/*"
              onChange={handleFile}
            ></input>
            <i class="las la-map-marker-alt"></i>
          </label>
        </div>

        {/* <ul style={{marginLeft:'10px'}}>
          <li style={{fontSize:'12px'}}>What's in hang?</li>
          <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
        </label></li></ul>*/}
      </div>
    );
  };

  const popUp = () => {
    return (
      <Popup
        trigger={
          <span style={{ cursor: "pointer" }}>
            <span style={{ marginRight: "5px", padding: "5px" }}>
              <img
                style={{ verticalAlign: "middle", width: "15px" }}
                src="/assets/images/hangshare.svg"
                alt="img"
              />
            </span>
            Hang Share
          </span>
        }
        modal
        nested
      >
        {(close) => (
          <Form style={{ margin: "5px" }} className="popwidth">
            <div className="headpop">
              <div className="row">
                <div style={{ width: "5%" }}>
                  <a
                    href="#!"
                    style={{ padding: "10px 80px 10px 0" }}
                    onClick={close}
                  >
                    <i class="las la-times"></i>
                  </a>
                </div>
                <div
                  style={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: "bold",
                    width: "70%",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  <span>Today to me, Tomorrow to you</span>
                </div>
                <div style={{ width: "25%", textAlign: "right" }}>
                  <a className="popup-btn" href="/HangGift">
                    Keep Hang
                  </a>
                </div>
              </div>
            </div>

            <div style={{ padding: "0 11px 11px 11px" }}>
              <div className="popupimg">
                <img
                  src={
                    user
                      ? fileStorage.baseUrl + user.profilePicturePath
                      : fileStorage.baseUrl + userR.profilePicturePath
                  }
                  alt=""
                />
              </div>
              <div class="popupuser-name">
                <div style={{ float: "left", display: "inline" }}>
                  <span>
                    {`${user.firstName} ${user.lastName}`}
                    {userF ? (
                      <> with {`${userF.firstName} ${userF.lastName}`}</>
                    ) : null}
                  </span>
                  <span style={{ display: "block", fontSize: "12px" }}>
                    <div className="dropdownnewsfeed">
                      <select
                        name="privacy"
                        id="privacy"
                        value={Privacy}
                        onChange={handlePrivacy}
                      >
                        <option value="Friends">Friends</option>
                        <option value="Public">Public</option>
                        <option value="Only Me">Only Me</option>
                      </select>
                    </div>{" "}
                  </span>
                </div>{" "}
              </div>{" "}
            </div>
            <div style={{ margin: "0 0 100px 11px" }}>
              <span className="textPop">
                <textarea
                  className="textpopup"
                  rows={2}
                  placeholder={
                    uploadError ? `${uploadError}` : "We share,do you?"
                  }
                  name="post_content"
                  value={postContent}
                  onChange={handlePostContent}
                />
                {showPostImage ? (
                  <>
                    <img
                      id="preview"
                      src={postImage}
                      style={{ width: "100%", objectFit: "cover" }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      style={{
                        right: "25px",
                        position: "absolute",
                        borderRadius: "100%",
                        background: "#b7b7b738",
                        padding: "10px 10px",
                      }}
                    >
                      <i class="las la-times"></i>
                    </button>
                  </>
                ) : null}
              </span>
              {/* <a href="#!" onClick={() => setShowCompont("image")}><span style={{float:'right',padding:'5px',margin:'5px',background:'#033347',padding: '2px 5px',color:'#fff',borderRadius:'5px'}}>+</span></a>*/}
            </div>

            {imageshow()}
            <div
              style={{
                textAlign: "center",
                background: "#C4C4C4",
                fontWeight: "bold",
                color: "rgb(68 68 68)",
                margin: "11px 11px",
                padding: "15px",
                borderRadius: "5px",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={uploadPost}
            >
              Post
            </div>
          </Form>
        )}
      </Popup>
    );
  };

  const postUp = () => {
    return (
      <Popup
        trigger={
          <div className="textbox">
            <span style={{ cursor: "pointer", padding: "5px" }}>
              We share,do you?
            </span>
          </div>
        }
        modal
        nested
      >
        {(close) => (
          <Form className="popform popwidth">
            <div className="headpop">
              <div className="row">
                <div style={{ width: "5%" }}>
                  <a href="#!" onClick={close}>
                    <i class="las la-times"></i>
                  </a>
                </div>
                <div
                  style={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: "bold",
                    width: "85%",
                    textAlign: "center",
                  }}
                >
                  <span>We share, do you?</span>
                </div>
                <div style={{ width: "10%", textAlign: "center" }}>
                  <span style={{ float: "right" }}>
                    {" "}
                    <button
                      style={{ float: "right", borderRadius: "20px" }}
                      type="submit"
                      onClick={uploadPost}
                    >
                      Post
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: "0 11px 11px 11px" }}>
              <div className="popupimg">
                <img
                  src={
                    user
                      ? fileStorage.baseUrl + user.profilePicturePath
                      : fileStorage.baseUrl + userR.profilePicturePath
                  }
                  alt=""
                />
              </div>
              <div class="popupuser-name">
                <div style={{ float: "left", display: "inline" }}>
                  <span
                    style={{ textTransform: "capitalize", fontWeight: "bold" }}
                  >
                    {`${user.firstName} ${user.lastName}`}
                    {userF ? (
                      <> with {`${userF.firstName} ${userF.lastName}`}</>
                    ) : null}
                  </span>
                  <span style={{ display: "block", fontSize: "12px" }}>
                    <div className="dropdownnewsfeed">
                      <select
                        name="privacy"
                        id="privacy"
                        value={Privacy}
                        onChange={handlePrivacy}
                      >
                        <option value="Friends">Friends</option>
                        <option value="Public">Public</option>
                        <option value="Only Me">Only Me</option>
                      </select>
                    </div>{" "}
                  </span>
                </div>{" "}
              </div>{" "}
            </div>
            <div style={{ margin: "0 11px 100px 11px" }}>
              <span className="textPop">
                <textarea
                  className="textpopup"
                  rows={2}
                  placeholder={
                    uploadError ? `${uploadError}` : "We share,do you?"
                  }
                  name="post_content"
                  value={postContent}
                  onChange={handlePostContent}
                />
                {showPostImage ? (
                  <>
                    <img
                      id="preview"
                      src={postImage}
                      style={{ width: "100%" }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      style={{
                        right: "20px",
                        position: "absolute",
                        borderRadius: "100%",
                        background: "#b7b7b738",
                        padding: "10px 10px",
                      }}
                    >
                      <i class="las la-times"></i>
                    </button>
                  </>
                ) : null}
              </span>
            </div>

            {imageshowPost()}
          </Form>
        )}
      </Popup>
    );
  };

  const shareUp = () => {
    return (
      <Popup
        trigger={
          <span style={{ cursor: "pointer" }}>
            <img
              style={{ verticalAlign: "middle", padding: "5px" }}
              src="/assets/images/share-2.svg"
              alt="img"
            />
            Share Up
          </span>
        }
        modal
        nested
      >
        {(close) => (
          <Form className="popform popwidth">
            <div className="headpop">
              <div className="row">
                <div style={{ width: "5%" }}>
                  <a
                    href="#!"
                    style={{ padding: "10px 150px 10px 0" }}
                    onClick={close}
                  >
                    <i class="las la-times"></i>
                  </a>
                </div>
                <div
                  style={{
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: "bold",
                    width: "85%",
                    textAlign: "center",
                  }}
                >
                  Share up
                </div>
                <div style={{ width: "10%", textAlign: "center" }}>
                  <span style={{ float: "right" }}>
                    {" "}
                    <button
                      style={{ float: "right", borderRadius: "20px" }}
                      type="submit"
                      onClick={uploadPost}
                    >
                      Post
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: "0 11px 11px 11px" }}>
              {" "}
              <div className="popupimg">
                <img
                  src={
                    user
                      ? fileStorage.baseUrl + user.profilePicturePath
                      : fileStorage.baseUrl + userR.profilePicturePath
                  }
                  alt=""
                />
              </div>
              <div class="popupuser-name">
                <div style={{ float: "left", display: "inline" }}>
                  <span
                    style={{ textTransform: "capitalize", fontWeight: "bold" }}
                  >
                    {`${user.firstName} ${user.lastName}`}
                    {userF ? (
                      <> with {`${userF.firstName} ${userF.lastName}`}</>
                    ) : null}
                  </span>
                  <span style={{ display: "block", fontSize: "12px" }}>
                    <div className="dropdownnewsfeed">
                      <select
                        name="privacy"
                        id="privacy"
                        value={Privacy}
                        onChange={handlePrivacy}
                      >
                        <option value="Friends">Friends</option>
                        <option value="Public">Public</option>
                        <option value="Only Me">Only Me</option>
                      </select>
                    </div>{" "}
                  </span>
                </div>{" "}
              </div>{" "}
            </div>
            <div style={{ margin: "0 11px 100px 11px" }}>
              <span className="textPop">
                <textarea
                  className="textpopup"
                  rows={2}
                  placeholder={
                    uploadError ? `${uploadError}` : "We share,do you?"
                  }
                  name="post_content"
                  value={postContent}
                  onChange={handlePostContent}
                />
                {showPostImage ? (
                  <>
                    <img
                      id="preview"
                      src={postImage}
                      style={{ width: "100%" }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      style={{
                        right: "20px",
                        position: "absolute",
                        borderRadius: "100%",
                        background: "#b7b7b738",
                        padding: "10px 10px",
                      }}
                    >
                      <i class="las la-times"></i>
                    </button>
                  </>
                ) : null}
              </span>
            </div>

            {imageshowPost()}
          </Form>
        )}
      </Popup>
    );
  };
  const photos = () => {
    return (
      <>
        <Popup
          trigger={
            <span style={{ cursor: "pointer" }}>
              <img
                style={{ verticalAlign: "middle", padding: "5px" }}
                src="assets/images/images.svg"
              />
              <span>Photos</span>
            </span>
          }
          modal
          nested
        >
          {(close) => (
            <Form className="popform popwidth">
              <div className="headpop">
                <div className="row">
                  <div style={{ width: "5%" }}>
                    <a href="#!" onClick={close}>
                      <i class="las la-times"></i>
                    </a>
                  </div>
                  <div
                    style={{
                      color: "#000000",
                      fontSize: "14px",
                      fontWeight: "bold",
                      width: "85%",
                      textAlign: "center",
                    }}
                  >
                    <span>We share, do you?</span>
                  </div>
                  <div style={{ width: "10%", textAlign: "center" }}>
                    <span style={{ float: "right" }}>
                      {" "}
                      <button
                        style={{ float: "right", borderRadius: "20px" }}
                        type="submit"
                        onClick={uploadPost}
                      >
                        Post
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ padding: "0 11px 11px 11px" }}>
                <div className="popupimg">
                  <img
                    src={
                      user
                        ? fileStorage.baseUrl + user.profilePicturePath
                        : fileStorage.baseUrl + userR.profilePicturePath
                    }
                    alt=""
                  />
                </div>
                <div class="popupuser-name">
                  <div style={{ float: "left", display: "inline" }}>
                    <span
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                    >
                      {`${user.firstName} ${user.lastName}`}
                      {userF ? (
                        <> with {`${userF.firstName} ${userF.lastName}`}</>
                      ) : null}
                    </span>
                    <span style={{ display: "block", fontSize: "12px" }}>
                      <div className="dropdownnewsfeed">
                        <select
                          name="privacy"
                          id="privacy"
                          value={Privacy}
                          onChange={handlePrivacy}
                        >
                          <option value="Friends">Friends</option>
                          <option value="Public">Public</option>
                          <option value="Only Me">Only Me</option>
                        </select>
                      </div>{" "}
                    </span>
                  </div>{" "}
                </div>{" "}
              </div>
              <div style={{ margin: "0 11px 100px 11px" }}>
                <span className="textPop">
                  <textarea
                    className="textpopup"
                    rows={2}
                    placeholder={
                      uploadError ? `${uploadError}` : "We share,do you?"
                    }
                    name="post_content"
                    value={postContent}
                    onChange={handlePostContent}
                  />
                  {showPostImage ? (
                    <>
                      <img
                        id="preview"
                        src={postImage}
                        style={{ width: "100%" }}
                      />
                      <button
                        onClick={handleRemoveImage}
                        style={{
                          right: "20px",
                          position: "absolute",
                          borderRadius: "100%",
                          background: "#b7b7b738",
                          padding: "10px 10px",
                        }}
                      >
                        <i class="las la-times"></i>
                      </button>
                    </>
                  ) : null}
                </span>
              </div>

              {imageshowPost()}
            </Form>
          )}
        </Popup>
      </>
    );
  };
  const popAudience = () => {
    return (
      <Popup
        trigger={
          <span
            style={{
              fontSize: "11px",
              padding: "4px",
              cursor: "pointer",
              backgroundColor: "#0333471a",
              borderRadius: "5px",
            }}
          >
            {privacy}

            <img
              src="assets/images/Vector.svg"
              style={{ paddingLeft: "4px", verticalAlign: "middle" }}
            />
          </span>
        }
        modal
        nested
      >
        {(close) => (
          <Form
            style={{
              paddingRight: "11px",
              paddinLeft: "11px",
              paddingBottom: "0px",
            }}
            className="popwidth"
            onSubmit={close}
          >
            <div className="headpop" style={{ padding: "0px" }}>
              <div
                className="row"
                style={{ paddingBottom: "10px", paddingtop: "10px" }}
              >
                <div style={{ width: "5%", paddingBottom: "10px" }}>
                  <a
                    href="#!"
                    style={{ padding: "10px 80px 10px 0" }}
                    onClick={close}
                  >
                    <i
                      class="las la-times"
                      style={{
                        fontSize: "20px",
                        background: "#C4C4C4",
                        borderRadius: "50%",
                      }}
                    ></i>
                  </a>
                </div>

                <div
                  style={{
                    color: "#000000",
                    fontSize: "21px",
                    fontWeight: "bold",
                    width: "95%",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  <span>Select Audience</span>
                </div>
              </div>

              <div className="headaudience">
                {" "}
                <span style={{ fontWeight: "bold" }}>
                  Who can see your post?
                </span>
                <p style={{ fontSize: "13px", paddingTop: "2px" }}>
                  <p style={{ color: "#525050", fontweight: "400 !important" }}>
                    your post will apear in newsfeed, on your profile and search
                    results
                  </p>
                </p>
              </div>
              <div>
                <fieldset>
                  <div className="form-card">
                    <ul className="nearby-contct">
                      <yi>
                        <div className="grid-containeraudience">
                          <div class="item11">
                            <img
                              src="assets/images/publicicon.svg"
                              style={{ width: "49%" }}
                            />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div class="item22">
                            <p
                              style={{
                                fontSize: "17px",
                                fontWeight: "bold",
                                color: "black",
                              }}
                            >
                              Public
                            </p>
                            <p style={{ fontSize: "11px", paddingTop: "1px" }}>
                              <p style={{ color: "#525050" }}>
                                anyone on or off facebook
                              </p>
                            </p>
                          </div>

                          <input
                            type="radio"
                            Value="Public"
                            name="privacy"
                            onChange={handleChange}
                            style={{ height: "60%", width: "100%" }}
                          />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}
                        </div>
                      </yi>

                      <yi>
                        <div className="grid-containeraudience">
                          <div class="item11">
                            <img
                              src="assets/images/friendsicon.svg"
                              style={{ width: "46%" }}
                            />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div class="item22">
                            <p
                              style={{
                                fontSize: "17px",
                                fontWeight: "bold",
                                color: "black",
                              }}
                            >
                              Friends
                            </p>

                            <p
                              style={{
                                fontSize: "11px",
                                fontweight: "300",
                                paddingTop: "1px",
                                color: "#525050",
                              }}
                            >
                              your shareup friends
                            </p>
                          </div>

                          <input
                            type="radio"
                            Value="Friends"
                            name="privacy"
                            onChange={handleChange}
                            style={{ height: "60%", width: "100%" }}
                          />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}
                        </div>
                      </yi>

                      <yi>
                        <div className="grid-containeraudience">
                          <div class="item11">
                            <img
                              src="assets/images/friendexcepticon.svg"
                              style={{ width: "46%" }}
                            />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div class="item22">
                            <p
                              style={{
                                fontSize: "17px",
                                fontWeight: "bold",
                                color: "black",
                              }}
                            >
                              Friends except
                            </p>
                            <p
                              style={{
                                fontSize: "11px",
                                fontweight: "300",
                                paddingTop: "1px",
                                color: "#525050",
                              }}
                            >
                              don't show some friends
                            </p>
                          </div>

                          <input
                            type="radio"
                            Value="Friends except"
                            name="privacy"
                            onChange={handleChange}
                            style={{ height: "60%", width: "100%" }}
                          />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}
                        </div>
                      </yi>

                      <yi>
                        <div className="grid-containeraudience">
                          <div class="item11">
                            <img
                              src="assets/images/groupicon.svg"
                              style={{ width: "46%" }}
                            />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div class="item22">
                            <p
                              style={{
                                fontSize: "17px",
                                fontWeight: "bold",
                                color: "black",
                              }}
                            >
                              Group
                            </p>
                            <p
                              style={{
                                fontSize: "11px",
                                fontweight: "300",
                                paddingTop: "1px",
                                color: "#525050",
                              }}
                            >
                              select to show for group
                            </p>
                          </div>

                          <input
                            type="radio"
                            Value="Group"
                            name="privacy"
                            onChange={handleChange}
                            style={{ height: "60%", width: "100%" }}
                          />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}
                        </div>
                      </yi>

                      <yi>
                        <div className="grid-containeraudience">
                          <div class="item11">
                            <img
                              src="assets/images/onlymeicon.svg"
                              style={{ width: "39%" }}
                            />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div class="item22">
                            <p
                              style={{
                                fontSize: "17px",
                                fontWeight: "bold",
                                color: "black",
                              }}
                            >
                              Only Me
                            </p>
                            <p
                              style={{
                                fontSize: "11px",
                                fontweight: "300",
                                paddingTop: "1px",
                                color: "#525050",
                              }}
                            >
                              private to all shareup users
                            </p>
                          </div>

                          <input
                            type="radio"
                            Value="Only Me"
                            name="privacy"
                            style={{ height: "60%", width: "100%" }}
                          />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}
                        </div>
                      </yi>
                    </ul>
                  </div>
                </fieldset>
              </div>
            </div>
          </Form>
        )}
      </Popup>
    );
  };
  const imageshowSwap = () => {
    return (
      <div
        style={{
          margin: "0 11px",
          padding: "15px",
          boxShadow: "0 0 3px rgb(0 0 0 / 16%)",
          borderRadius: "5px",
        }}
      >
        <div style={{ display: "inline" }}>What has to be swapped?</div>

        <div className="add-smilespopup">
          <label className="fileContainer">
            <input
              type="file"
              name="swap_image"
              accept="image/*"
              onChange={handleFileSwap}
            ></input>
            <i class="lar la-file-image"></i>
          </label>
        </div>
        <div
          className="gifpopup"
          style={{ fontSize: "28px", paddingBottom: "14px" }}
        >
          <Popup
            trigger={
              <a href="#!">
                <i class="las la-user-tag"></i>
              </a>
            }
            modal
            nested
          >
            {(close) => (
              <Form style={{ margin: "5px" }} className="popwidth">
                <div class="search-container">
                  <i class="las la-search"></i>
                  <input
                    className="friend-search"
                    type="text"
                    id="header-search"
                    placeholder="Search Friends"
                    name="s"
                    onChange={handleSearchedUser}
                  />
                  <span onClick={close}>Done</span>
                </div>
                {userF ? (
                  <>
                    <div className="Tag">
                      Tagged:{`${userF.firstName} ${userF.lastName}`}
                    </div>
                  </>
                ) : null}
                <div>
                  <ul>
                    {friendsList.length > 0 ? (
                      <>
                        {friendsList.map((userM) =>
                          user.id !== userM.id ? (
                            <li key={userM.id} className="friends-card">
                              <a href="#!" onClick={() => handleTag(userM)}>
                                {" "}
                                <div className="grid-container">
                                  {/* <figure> */}
                                  <div class="item1">
                                    <a
                                      href={`/profile/${userM.email}`}
                                      title={`${userM.email}`}
                                    >
                                      <img
                                        style={{ objectFit: "cover" }}
                                        src={userM.profilePicturePath}
                                        alt=""
                                      />
                                    </a>
                                    {/* </figure> */}
                                  </div>
                                  <div class="item2">
                                    <p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                                  </div>
                                  {/* <div className="  "> */}
                                </div>
                              </a>
                            </li>
                          ) : null
                        )}
                      </>
                    ) : (
                      <div style={{ padding: "10% 0", textAlign: "center" }}>
                        You have no friends to tag
                      </div>
                    )}
                  </ul>
                </div>
              </Form>
            )}
          </Popup>
        </div>
        <div className="campopup">
          <Popup
            trigger={
              <a href="#!">
                <i class="las la-map-marker-alt"></i>
              </a>
            }
            nested
            modal
          >
            {(close) => (
              <Form style={{ margin: "5px" }} className="popwidth">
                <LocSearchComponent />
              </Form>
            )}
          </Popup>{" "}
        </div>

        {/* <ul style={{marginLeft:'10px'}}>
                                                          <li style={{fontSize:'12px'}}>What's in hang?</li>
                                                          <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                                                        </label></li></ul>*/}
      </div>
    );
  };

  const popSwap = () => {
    return (
      <Popup
        trigger={
          <span style={{ cursor: "pointer" }}>
            <span style={{ marginRight: "5px", padding: "5px" }}>
              <img
                style={{ verticalAlign: "middle", width: "30px" }}
                src="/assets/images/swap-icon3.png"
                alt="img"
              />
            </span>
            Swap
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
              uploadSwap(e);
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
                    <i class="las la-times"></i>
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
                  <span>Create Swap</span>
                </div>
                <div style={{ width: "20%", textAlign: "right", padding: "0" }}>
                  <a
                    className="popup-btn"
                    href="/HangGift"
                    style={{ padding: "4px" }}
                  >
                    Keep Swap
                  </a>
                </div>
              </div>
            </div>
            <div style={{ padding: "0 11px 11px 11px" }}>
              <div className="popupimg">
                <img
                  src={
                    user
                      ? fileStorage.baseUrl + user.profilePicturePath
                      : fileStorage.baseUrl + userR.profilePicturePath
                  }
                  alt=""
                />
              </div>
              <div class="popupuser-name">
                <div style={{ display: "inline" }}>
                  <span>
                    {`${user.firstName} ${user.lastName}`}
                    {userF ? (
                      <> with {`${userF.firstName} ${userF.lastName}`}</>
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
                      {popAudience()}
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
                  placeholder={
                    uploadError ? `${uploadError}` : "We share,do you?"
                  }
                  name="swap_content"
                  value={swapContent}
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
                        <i class="las la-times"></i>
                      </button>
                    </div>
                  </>
                ) : null}
              </span>
              {/* <a href="#!" onClick={() => setShowCompont("image")}><span style={{float:'right',padding:'5px',margin:'5px',background:'#033347',padding: '2px 5px',color:'#fff',borderRadius:'5px'}}>+</span></a>*/}
            </div>

            {imageshowSwap()}
            <button
              type="submit"
              value="Submit"
              className="popsbmt-btn"
              // onClick={}
            >
              SWAP
            </button>
          </Form>
        )}
      </Popup>
    );
  };
  
  const uploadSwap = async (event) => {
    await event.preventDefault();
    await setUploadError("");
    console.log("uploading swap working");
    if (
      swapContent === "" &&
      Object.keys(swapfiles).length === 0 &&
      swapfiles.constructor === Object
    ) {
      console.log("cant be null");
      await setUploadError("Please Insert A Text or an Image");
      return;
    }

    const formData = new FormData();

    await formData.append("content", swapContent);
    for (let i = 0; i < swapfiles.length; i++) {
      await formData.append(`files`, swapfiles[i]);
    }
    console.log(formData.getAll(`files`));
    console.log(" this is the files" + files[0]);
    console.log(" this is the swapfiles" + swapfiles);
    for (let i = 0; i < `swapfiles`.length; i++) {
      console.log(swapfiles);
    }
    await formData.append(`swapfiles`, swapfiles);
    await formData.append(`privacy`, Privacy);
    if (userF === null) {
      await SwapService.createSwap(user.id, formData, null).then((res) => {
        console.log(JSON.stringify(res));
        console.log(res.data);
        console.log(user.id);
        // setCloseModal(false)
        // window.location.reload();

        setSwapContent("");
        handleRemoveImageSwap();
        setRefresh(res.data);
        // window.location.reload();
        console.log("ssssssssssrefersh", refresh);
      });
    } else
      await SwapService.createSwap(user.id, formData, userF.id).then((res) => {
        console.log(JSON.stringify(res));
        setSwapContent("");
        handleRemoveImageSwap();
        setRefresh(res.data);
      });
  };
  
  return (
    <div className="central-meta newsfeed">
      {/* <div className="new-postbox">
                <figure>
                  <img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" />
                </figure>
                <div className="newpst-input">
                  <Form>
                    <textarea rows={2} placeholder={uploadError ? `${uploadError}` : "write something"} name="post_content" value={postContent} onChange={handlePostContent} />
                    {showPostImage ?
                      <>
                        <img id="preview" src={postImage} style={{ width: "20rem", height: "20rem", border: "3px solid" }} />
                        <button onClick={handleRemoveImage}>x</button>
                      </>
                      :
                      null
                    }

                    <div className="attachments">
                      <ul>
                        <li><i class="las la-music"></i> <label className="fileContainer"> <input type="file" name="post_music" />
                        </label></li>

                        <li><i class="lar la-image"></i><label className="fileContainer"> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                        </label></li>
                        <li><i class="las la-video"></i> <label className="fileContainer"> <input type="file" name="post_video" />
                        </label></li>
                        <li><i class="las la-camera"></i> <label className="fileContainer"> <input type="file" />
                        </label></li>
                        <li>
                          <button type="submit" onClick={uploadPost}>Post</button>
                        </li>
                      </ul>
                    </div>
                  </Form>
                </div>
              </div> */}
      <div className="new-postbox">
        <figure>
          <img
            src={
              user
                ? fileStorage.baseUrl + user.profilePicturePath
                : fileStorage.baseUrl + userR.profilePicturePath
            }
            alt=""
          />
        </figure>
        <div className="newpst-input">
          <Form>
            {postUp()}
            {/* <textarea rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
                    {showPostImage ?
                      <>
                        <img id="preview" src={postImage} style={{ width: "80%", border: "3px solid" }} />
                        <button onClick={handleRemoveImage}>x</button>
                      </>
                      :
                      null
                    } */}

            <div className="attachments">
              <ul>
                <li>{popUp()}</li>
                {/* <label className="fileContainer"><img src="/assets/images/share-2.png" alt="img" /><span>Share Up</span> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                        </label> */}
                <li>{shareUp()}</li>
                <li>{photos()}</li>
                <li>{popSwap()}</li>
                {/* <li><i class="las la-camera"></i> <label className="fileContainer"> <input type="file" />
                        </label></li> */}
              </ul>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default PostTextBoxComponent;