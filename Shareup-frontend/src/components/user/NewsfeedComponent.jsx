import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import PostService from "../../services/PostService";
import NewsFeedService from "../../services/NewsfeedService";
import SwapService from "../../services/SwapService";
import AuthService from "../../services/auth.services";
import SimpleReactLightbox from "simple-react-lightbox";
import { testScript } from "../../js/script";
import GroupService from "../../services/GroupService";
import StoriesService from "../../services/StoriesService";
import EditPostComponent from "./EditPostComponent";
import Modal from "react-modal";
import Layout from "../LayoutComponent";
import ReelVideo from "../LayoutComponent";
import ShowReelVideo from "../LayoutComponent";
import handleFileReel from "../LayoutComponent";
import handleRemoveReelVideo from "../LayoutComponent";
import uploadReels from "../LayoutComponent";
import GuideComponent from "./GuideComponent";
import PostComponent from "../post/PostComponent";

import DisplayComponent from "../Stories/DisplayComponent";
import DisplayFriendsStoryComponent from "../Stories/DisplayFriendsStoryComponent";
import StoriesComponent from "../Stories/StoriesComponent";
import StoriesComponentFriends from "../Stories/StoriesComponentFriends";
import ReelsComponentFriends from "../Reels/ReelsComponentFriends";

import Popup from "reactjs-popup";
import Carousel from "react-bootstrap/Carousel";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import LocationComponent from "../AccountSettings/LocationComponent";
import LocSearchComponent from "../AccountSettings/LocSearchComponent";
import FriendSearchComponent from "./FriendSearchComponent";
import FriendsService from "../../services/FriendService";
import fileStorage from "../../config/fileStorage";
import SwapComponents from "../SwapPoint/SwapComponents";
import Grpicon from "../../images/grpicon.png";
import ReelsServices from "../../services/ReelsServices";
import DisplayFriendsReelsComponent from "../Reels/DisplayFriendsReelsComponent";

function NewsfeedComponent() {
  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  const { user } = useContext(UserContext);

  // const []

  // const inputRef = createRef();

  const [refresh, setRefresh] = useState(null);
  const [stories, setStories] = useState([]);
  const [storiesImage, setStoriesImage] = useState([]);
  const [filesStry, setFilesStry] = useState({});
  const [showstoriesImage, setShowstoriesImage] = useState(false);
  const [showComp, setShowComp] = useState("newsfeed");
  const [showCompont, setShowCompont] = useState();
  const [posts, setPosts] = useState([]);
  const [postsForUser, setPostsForUser] = useState([]);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const [storiesForUserFriends, setStoriesForUserFriends] = useState([]);
  const [FriendsStories, setFriendsStories] = useState([]);
  const [FriendsReels, setFriendsReels] = useState([]);

  const [storyContent, setStoryContent] = useState("");

  const [rellsForUserFriends, setReelsForUserFriends] = useState([]);

  const [storiesForUser, setStoriesForUser] = useState([]);
  const [savedPost, setSavedPost] = useState([]);
  const [userR, setUserR] = useState([]);
  const [group, setGroup] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [searchedGroups, setSearchedGroups] = useState([]);

  const [count, setCount] = useState(1);

  const [swapContent, setSwapContent] = useState("");
  const [swapImage, setSwapImage] = useState({});
  const [showSwapImage, setShowSwapImage] = useState(false);

  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [files, setFiles] = useState([]);
  const [swapfiles, setSwapfiles] = useState([]);
  const [postImage, setPostImage] = useState([]);

  const [showPostImage, setShowPostImage] = useState(false);

  const [uploadError, setUploadError] = useState("");
  const [uploadErrorStory, setUploadErrorStory] = useState("");

  const [editPostId, setEditPostId] = useState(null);

  const [img, setImage] = useState("");
  const [Privacy, setPrivacy] = useState("");
  const [index, setIndex] = useState(0);
  const [friendsList, setFriendsList] = useState([]);
  const [allUser, setAllUser] = useState([]);

  const [userF, setUserF] = useState(null);
  const [searchedUser, setSearchedUser] = useState([]);

  const [photosContent, setPhotosContent] = useState("");

  const [shareupContent, setShareupContent] = useState("");

  const [hangshareContent, setHangshareContent] = useState("");

  const [privacy, setprivacy] = useState("privacy");

  const [closeModal, setCloseModal] = useState(false);

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
  // const getStories = async () => {
  //   await StoriesService.getStories().then(res => {
  //     setStories(res.data)
  //   })
  // }

  const handleChange = (e) => {
    const target = e.target;
    if (target.checked) {
      setprivacy(target.value);
    }
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const uploadStories = (event) => {
    event.preventDefault();
    setUploadErrorStory("");
    if (
      storyContent === "" &&
      Object.keys(filesStry).length === 0 &&
      filesStry.constructor === Object
    ) {
      setUploadErrorStory("Please Add Image for Stories");
      return;
    }

    const formData = new FormData();
    formData.append("caption", storyContent);
    formData.append(`stryfiles`, filesStry);
    StoriesService.createStories(user.id, formData).then((res) => {
      handleRemoveImageStry();
      setStories(res.data);
      setRefresh(res.data);
    });
  };

  // const checkIfUserAlreadyPostStory = (story) => {
  //   const found = story.some(el => el.id === user.id);
  //   return found
  // }

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

  const getStoriesForFriendsUser = () => {
    StoriesService.getStoriesForUserFriendsNew(user?.id).then((res) => {
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
      setStoriesForUserFriends(uniqueStories);
    });
  };

  const getReelForUserFriends = () => {
    ReelsServices.getReelForUserFriends(user?.id).then((res) => {
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
      setReelsForUserFriends(uniqueStories);
    });
  };

  const getPostForUser = async () => {
    await NewsFeedService.getFeed(AuthService.getCurrentUser().username).then(
      (res) => {
        const sorting = res.data.sort(function (a, b) {
          let dateA = new Date(a.published),
            dateB = new Date(b.published);
          return dateB - dateA;
        });
        const uniquePost = Array.from(new Set(sorting.map((a) => a.id))).map(
          (id) => {
            return res.data.find((a) => a.id === id);
          }
        );
        setPostsForUser(uniquePost);
      }
    );
  };

  const handleFileStry = (event) => {
    console.log(event.target.files[0]);
    setFilesStry(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setStoriesImage(reader.result);
      }
    };
    console.log(event.target.files[0]);
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0]);
    // }
    setShowstoriesImage(true);
  };
  const handleRemoveImageStry = () => {
    setFilesStry({});
    setShowstoriesImage(false);
  };
  const handleLeaveGroup = (e, group_id) => {
    e.preventDefault();
    console.log(group_id);
    GroupService.leaveGroup(user.id, group_id).then((res) => {
      setRefresh(res.data);
      setGroup(res.data);
    });
  };
  const handleJoinGroup = (e, group_id) => {
    e.preventDefault();
    console.log(group_id);
    GroupService.joinGroup(user.id, group_id).then((res) => {
      setRefresh(res.data);
      setGroup(res.data);
    });
  };

  const checkIfInGroup = (members) => {
    const found = members.some((el) => el.id === user.id);
    return found;
  };
  const getAllGroups = async () => {
    await GroupService.getAllGroups().then((res) => {
      setAllGroups(res.data);
      setSearchedGroups(res.data);
    });
  };

  const getPost = async () => {
    await PostService.getPost().then((res) => {
      setPosts(res.data);
    });

    await SwapService.getSwap().then((res) => {
      setPosts((val) => [...val, ...res.data]);
    });
  };

  useEffect(() => {
    console.log("@GET ALL POSTS UPDATE", posts);
  }, [posts]);

  const getSavedPost = async () => {
    await PostService.getSavedPostForUser(
      AuthService.getCurrentUser().username
    ).then((res) => {
      console.log("get saved post" + res.data);
      setSavedPost(res.data);
    });
  };

  const handlePostContent = (event) => {
    console.log("handlepostcontent" + event.target.value);
    setPostContent(event.target.value);
  };
  const handleHangshareContent = (event) => {
    // console.log('handlepostcontent' + event.target.value);
    setHangshareContent(event.target.value);
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
  const handleCount = (opertator) => {
    if (opertator === "+") {
      let counting = count + 1;
      console.log(counting + "hi count");
      setCount(counting);
    }
  };
  const handleEditPost = (id) => {
    setEditPostId(id);
  };

  //single image
  const handleFile = (event) => {
    setFiles(event.target.files);
    console.log(files);
    let filesAmount = event.target.files.length;
    if (filesAmount < 6) {
      let tempImage = [];
      for (let i = 0; i < filesAmount; i++) {
        //tempImage=[...tempImage,URL.createObjectURL(event.target.files[i])]
        tempImage.push(URL.createObjectURL(event.target.files[i]));
      }

      setPostImage(tempImage);
      console.log("url " + postImage[1]);

      setShowPostImage(true);
    } else {
      alert("5 files are allowed");
      event.preventDefault();
    }
  };

  const handleLoc = (event) => {
    //create file array
    //const handleFile = (event) => {
    let tempImage = [];
    console.log(event.target.files);
    if (event.target.files) {
      let filesAmount = event.target.files.length;
      let i;
      for (i = 0; i < filesAmount; i++) {
        let reader = new FileReader();
        reader.onload = () => {
          setPostImage(reader.result);
          tempImage = [...tempImage, reader.result];
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
    console.log(tempImage);
    setPostImage(tempImage);
    setShowPostImage(true);
  };

  const handleRemoveImage = () => {
    setFiles([]);
    setShowPostImage(false);
  };

  const renderphoto = (imgarray) => {
    //alert('imge');
    return Object.entries(imgarray).map((currentobject) => (
      <>
        <img
          src={currentobject}
          style={{ maxWidth: "150px", maxHeight: "150px" }}
          className="img img-responsive"
          key={currentobject}
        />
        <button
          onClick={() => {
            handleRemoveImage(index);
          }}
        >
          delete
        </button>
      </>
    ));
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
  const handleStoryContent = (event) => {
    setStoryContent(event.target.value);
  };
  const getCommentCounter = (comments) => {
    let counter = 0;
    comments.map((comment) => {
      counter += comment.replies.length + 1;
    });
    return counter;
  };
  const handlePrivacy = (event) => {
    console.log(event.target.value);
    setPrivacy(event.target.value);
  };
  const uploadPost = (event) => {
    event.preventDefault();
    setUploadError("");
    console.log(postContent, Object.keys(files).length, files.constructor);
    if (
      postContent === "" &&
      Object.keys(files).length === 0 &&
      files.constructor === Object
    ) {
      console.log("cant be null");
      setUploadError("Please Insert A Text or an Image");
      return;
    } else {
      const formData = new FormData();

      formData.append("content", postContent);
      for (let i = 0; i < files.length; i++) {
        formData.append(`files`, files[i]);
      }
      console.log(formData.getAll(`files`));
      console.log(" this is the files" + files[0]);
      console.log(" this is the swapfiles" + swapfiles);
      for (let i = 0; i < `files`.length; i++) {
        console.log(files);
      }
      formData.append(`swapfiles`, swapfiles);
      formData.append(`privacy`, Privacy);
      if (userF === null) {
        PostService.createPost(user.id, formData, null).then((res) => {
          console.log(JSON.stringify(res));
          console.log(res.data);
          console.log(user.id);
          setPostContent("");
          handleRemoveImage();
          setRefresh(res.data);
          console.log("ssssssssssrefersh", refresh);
        });
      } else
        PostService.createPost(user.id, formData, userF.id).then((res) => {
          console.log(JSON.stringify(res));
          setPostContent("");
          handleRemoveImage();
          setRefresh(res.data);
        });
    }
  };

  useEffect(() => {}, []);

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
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  //handle photos content function
  const handlePhotosContent = (event) => {
    console.log("handlephotoscontent" + event.target.value);
    setPhotosContent(event.target.value);
  };
  // show images in photos popup
  const imageshowPhotos = () => {
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
              name="photos_image"
              accept="image/*"
              multiple
            ></input>
            <i class="lar la-file-image"></i>
          </label>
        </div>
        <div className="gifpopup">
          <Popup
            trigger={
              <a href="#!">
                <i
                  class="las la-user-tag"
                  style={{ fontSize: "28px", paddingBottom: "14px" }}
                ></i>
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
                                        src={userM.profilePicture}
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
          {" "}
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
              <Form
                style={{ margin: "5px", width: "500px", minHeight: "500px" }}
                className="popwidth"
              >
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
  //swap content function
  const handleSwapContent = (event) => {
    console.log(event.target.value);
    setSwapContent(event.target.value);
  };
  // swap files function
  const handleFileSwap = (event) => {
    setSwapfiles(event.target.files);
    console.log(swapfiles);
    let filesAmount = event.target.files.length;
    if (filesAmount < 6) {
      let tempImage = [];
      for (let i = 0; i < filesAmount; i++) {
        //tempImage=[...tempImage,URL.createObjectURL(event.target.files[i])]
        tempImage.push(URL.createObjectURL(event.target.files[i]));
      }

      setSwapImage(tempImage);
      console.log("url " + swapImage[1]);

      setShowSwapImage(true);
    } else {
      alert("5 files are allowed");
      event.preventDefault();
    }
  };

  //swap popup image view remove function
  const handleRemoveImageSwap = () => {
    setSwapfiles({});
    setShowSwapImage(false);
  };

  //swap upload function
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

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  // function closeModal() {
  //   setIsOpen(false);
  // }
  const getUser = async () => {
    if (user === null) {
      console.log("RUNNING");
      await UserService.getUserByEmail(
        AuthService.getCurrentUser().username
      ).then((res) => {
        setUserR(res.data);
      });
    } else {
      console.log("User Info : ========." + JSON.stringify(user));
      setUserR(user);
    }
  };

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
            <input type="file" name="swap_image" accept="image/*"></input>
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
                                        src={userM.profilePicture}
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
                                        src={userM.profilePicture}
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
              multiple
              onChange={handleFile}
            ></input>
            <i class="lar la-file-image"></i>
          </label>
        </div>
        <div className="gifpopup">
          <Popup
            style={{ height: "100px" }}
            trigger={
              <a href="#!">
                <i
                  class="las la-user-tag"
                  style={{ fontSize: "28px", paddingBottom: "14px" }}
                ></i>
              </a>
            }
            modal
            nested
          >
            {(close) => (
              <Form className="popwidth poptag">
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
                  <ul className="nearby-contct">
                    {friendsList.length > 0 ? (
                      <>
                        {friendsList.map((userM) =>
                          user.id !== userM.id ? (
                            <li key={userM.id} className="friends-card grp">
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
                                          userM.profilePicture
                                        }
                                        alt=""
                                      />
                                    </a>
                                    {/* </figure> */}
                                  </div>
                                  <div class="item2">
                                    <p className="nameTag">
                                      <a
                                        href={`/profile/${userM.email}`}
                                        title={`${userM.email}`}
                                      >{`${userM.firstName} ${userM.lastName}`}</a>
                                    </p>
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        paddingTop: "5px",
                                      }}
                                    >
                                      10 Mutual friends
                                    </div>
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
          {" "}
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
              <Form
                style={{ margin: "5px", width: "500px", minHeight: "500px" }}
                className="popwidth"
              >
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

  const Loc = () => {
    return (
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
          <Form
            style={{ margin: "5px", width: "500px", height: "500px" }}
            className="popwidth"
          >
            <LocSearchComponent />
          </Form>
        )}
      </Popup>
    );
  };
  //handle shareup content function
  const handleShareupContent = (event) => {
    setShareupContent(event.target.value);
  };

  // shareup popup file input button
  const imageshowShareup = () => {
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
              multiple
            ></input>
            <i class="lar la-file-image"></i>
          </label>
        </div>
        <div className="gifpopup">
          <Popup
            trigger={
              <a href="#!">
                <i
                  class="las la-user-tag"
                  style={{ fontSize: "28px", paddingBottom: "14px" }}
                ></i>
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
                                        src={userM.profilePicture}
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
          {" "}
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
              <Form
                style={{ margin: "5px", width: "500px", minHeight: "500px" }}
                className="popwidth"
              >
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
                      ? fileStorage.baseUrl + user.profilePicture
                      : fileStorage.baseUrl + userR.profilePicture
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

  const hangsharePopUp = () => {
    return (
      <Popup
        trigger={
          <span style={{ cursor: "pointer" }}>
            <span style={{ marginRight: "5px", padding: "5px" }}>
              <img
                style={{ verticalAlign: "middle", width: "20 px" }}
                src="/assets/images/hangshare3.png"
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
          <Form className="popwidth" onSubmit={close}>
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
                  <span>Today to me, Tomorrow to you</span>
                </div>
                <div style={{ width: "20%", textAlign: "right" }}>
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
                      ? fileStorage.baseUrl + user.profilePicture
                      : fileStorage.baseUrl + userR.profilePicture
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
                  name="post_content"
                  value={hangshareContent}
                  onChange={handleHangshareContent}
                />

                {/*showPostImage ? (
                  <>
                    <div>
                      {postImage.map((item, key) => (
                        <img
                          src={item}
                          key={key}
                          style={{
                            maxWidth: '150px',
                            maxHeight: '150px',
                            padding: '10px',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleRemoveImage}
                      style={{
                        right: '25px',
                        position: 'absolute',
                        borderRadius: '100%',
                        background: '#b7b7b738',
                        padding: '10px 10px',
                      }}
                    >
                      <i class='las la-times'></i>
                    </button>
                  </>
                    ) : null*/}
              </span>
              {/* <a href="#!" onClick={() => setShowCompont("image")}><span style={{float:'right',padding:'5px',margin:'5px',background:'#033347',padding: '2px 5px',color:'#fff',borderRadius:'5px'}}>+</span></a>*/}
            </div>

            {imageshow()}
            <div type="submit" value="Submit" className="popsbmt-btn">
              POST
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
          <Form
            className="popform popwidth"
            onSubmit={(e) => {
              uploadPost(e);
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
                  <span>We share, do you</span>
                </div>
                <div style={{ width: "20%", textAlign: "right" }}>
                  <a className="popup-btn">Keep Post</a>
                </div>
              </div>
            </div>

            <div style={{ padding: "0 11px 11px 11px" }}>
              <div className="popupimg">
                <img
                  src={
                    user
                      ? fileStorage.baseUrl + user.profilePicture
                      : fileStorage.baseUrl + userR.profilePicture
                  }
                  alt=""
                />
              </div>
              <div class="popupuser-name">
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
                  style={{ borderRadius: "0" }}
                  placeholder={
                    uploadError ? `${uploadError}` : "We share,do you?"
                  }
                  name="post_content"
                  value={postContent}
                  onChange={handlePostContent}
                />
                <div>
                  {showPostImage ? (
                    <>
                      <div style={{ position: "relative", padding: "5px" }}>
                        {postImage.length > 1 ? (
                          <OwlCarousel
                            items={1}
                            className="owl-theme grp-carousel post-carousel"
                            nav
                            center={true}
                            dots={false}
                            margin={10}
                          >
                            {postImage.map((item, key) => (
                              <img
                                src={item}
                                key={key}
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "middle",
                                  borderRadius: "10px",
                                  paddingBottom: "10px !important",
                                }}
                              />
                            ))}
                          </OwlCarousel>
                        ) : (
                          postImage.length == 1 && (
                            <img
                              src={postImage[0]}
                              style={{
                                display: "inline-block",
                                verticalAlign: "middle",
                                borderRadius: "10px",
                                width: "fit-content",
                                maxHeight: "450px",
                                marginBottom: "10px!important",
                              }}
                            />
                          )
                        )}
                        <button
                          onClick={handleRemoveImage}
                          style={{
                            right: "20px",
                            top: "10px",
                            position: "absolute",
                            borderRadius: "100%",
                            background: "rgb(183 183 183 / 82%)",
                            padding: "10px 10px",
                            zIndex: "99",
                          }}
                        >
                          <i class="las la-times"></i>
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </span>
            </div>

            {imageshowPost()}
            <button
              type="submit"
              value="Submit"
              className="popsbmt-btn"
              // onClick={uploadPost}
            >
              POST
            </button>
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
            <span style={{ marginRight: "5px", padding: "5px" }}>
              <img
                style={{ verticalAlign: "middle", width: "30px" }}
                src="/assets/images/shareicon.svg"
                alt="img"
              />
            </span>
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
                  <span>What's on your mind</span>
                </div>
                <div style={{ width: "20%", textAlign: "right" }}>
                  <a className="popup-btn" href="">
                    Keep share
                  </a>
                </div>
              </div>
            </div>

            <div style={{ padding: "0 11px 11px 11px" }}>
              <div className="popupimg">
                <img
                  src={
                    user
                      ? fileStorage.baseUrl + user.profilePicture
                      : fileStorage.baseUrl + userR.profilePicture
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
                  name="post_content"
                  value={shareupContent}
                  onChange={handleShareupContent}
                />
              </span>
            </div>

            {imageshowShareup()}
            <button type="submit" value="Submit" className="popsbmt-btn">
              POST
            </button>
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
              <span style={{ marginRight: "5px", padding: "5px" }}>
                <img
                  style={{ verticalAlign: "middle", width: "30px" }}
                  src="assets/images/photo-icon3.png"
                />
              </span>
              <span>Photos</span>
            </span>
          }
          modal
          nested
        >
          {(close) => (
            <Form
              className="popform popwidth"
              onSubmit={(e) => {
                uploadPost(e);
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
                    <span>We share, do you</span>
                  </div>
                  <div style={{ width: "20%", textAlign: "right" }}>
                    <a className="popup-btn">Keep Post</a>
                  </div>
                </div>
              </div>

              <div style={{ padding: "0 11px 11px 11px" }}>
                <div className="popupimg">
                  <img
                    src={
                      user
                        ? fileStorage.baseUrl + user.profilePicture
                        : fileStorage.baseUrl + userR.profilePicture
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
                    style={{ borderRadius: "0" }}
                    placeholder={
                      uploadError ? `${uploadError}` : "We share,do you?"
                    }
                    name="post_content"
                    value={postContent}
                    onChange={handlePostContent}
                  />
                  <div>
                    {showPostImage ? (
                      <>
                        <div style={{ position: "relative", padding: "5px" }}>
                          {postImage.length > 1 ? (
                            <OwlCarousel
                              items={1}
                              className="owl-theme grp-carousel post-carousel"
                              nav
                              center={true}
                              dots={false}
                              margin={10}
                            >
                              {postImage.map((item, key) => (
                                <img
                                  src={item}
                                  key={key}
                                  style={{
                                    display: "inline-block",
                                    verticalAlign: "middle",
                                    borderRadius: "10px",
                                    paddingBottom: "10px !important",
                                  }}
                                />
                              ))}
                            </OwlCarousel>
                          ) : (
                            postImage.length == 1 && (
                              <img
                                src={postImage[0]}
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "middle",
                                  borderRadius: "10px",
                                  marginBottom: "10px!important",
                                }}
                              />
                            )
                          )}
                          <button
                            onClick={handleRemoveImage}
                            style={{
                              right: "20px",
                              top: "10px",
                              position: "absolute",
                              borderRadius: "100%",
                              background: "rgb(183 183 183 / 82%)",
                              padding: "10px 10px",
                              zIndex: "99",
                            }}
                          >
                            <i class="las la-times"></i>
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </span>
              </div>

              {imageshowPost()}
              <button
                type="submit"
                value="Submit"
                className="popsbmt-btn"
                // onClick={uploadPost}
              >
                POST
              </button>
            </Form>
          )}
        </Popup>
      </>
    );
  };
  const testFanc = (post) => {
    return <PostComponent post={post} setRefresh={setRefresh} />;
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
                            {/* <img src={fileStorage.baseUrl +profilePicture} alt="" /> */}
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
                            {/* <img src={fileStorage.baseUrl +profilePicture} alt="" /> */}
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
                            {/* <img src={fileStorage.baseUrl +profilePicture} alt="" /> */}
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
                            {/* <img src={fileStorage.baseUrl +profilePicture} alt="" /> */}
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
                            {/* <img src={fileStorage.baseUrl +profilePicture} alt="" /> */}
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

  useEffect(() => {}, [postsForUser]);

  const show = () => {
    return (
      <div className="loadMore">
        {postsForUser.map((post, index) => (
          <div key={post.id}>
            {post.group ? (
              post.group.members.some(
                (member) =>
                  member.email === AuthService.getCurrentUser().username
              ) ? (
                <>
                  <PostComponent
                    post={post}
                    setRefresh={setRefresh}
                    user={user}
                    userF={userF}
                  />
                  {index == 4 ? (
                    <div className="central-meta newsfeed">
                      <div class="fw-bold">REELS</div>
                      <div className="new-postbox">
                        <div class="slide-wrapperstry">
                          <ul class="slidestry">
                            {rellsForUserFriends
                              .slice(-5)
                              .map((reel, index) => (
                                <Popup
                                  style={{ padding: "0px" }}
                                  trigger={
                                    <li
                                      className="slideitemstry"
                                      key={reel.id}
                                      id={index}
                                    >
                                      <ReelsComponentFriends
                                        reel={reel}
                                        setRefresh={setRefresh}
                                      />
                                    </li>
                                  }
                                  modal
                                >
                                  {(close) => (
                                    <Form className="stryp" >
                                <div>
                                  <div className="row">
                                    <div style={{ width: "5%" }}>
                                      <a href="#!" onClick={close}>
                                        <i
                                          style={{
                                            color: "#fff",
                                            padding: "10px",
                                            fontSize: "30px",
                                          }}
                                          class="las la-times"
                                        ></i>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <DisplayFriendsReelsComponent key={reel.id} id={index} 
                                  reel={ reel}
                                  setRefresh={setRefresh}
                                  index={index}
                                />
                              </Form> 
                                  )}
                                </Popup>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null
            ) : (
              <>
                <PostComponent post={post} setRefresh={setRefresh} />
                {index == 4 ? (
                  <div className="central-meta newsfeed">
                    <div class="fw-bold">REELS</div>
                    <div className="new-postbox">
                      <div class="slide-wrapperstry">
                        <ul class="slidestry">
                          {rellsForUserFriends.slice(0, 5).map((reel, index) => (
                            <Popup
                              style={{ padding: "0px" }}
                              trigger={
                                <li
                                  className="slideitemreel"
                                  key={reel.id}
                                  id={index}
                                >
                                  <ReelsComponentFriends
                                    reel={reel}
                                    setRefresh={setRefresh}
                                  />
                                </li>
                              }
                              modal
                             >
                              {(close) => ( 
                                <Form  >
                                    <div style={{ width: "5%" }}>
                                      <a href="#!" onClick={close}>
                                        <i
                                          style={{
                                            color: "#fff",
                                            padding: "10px",
                                            fontSize: "30px",
                                          }}
                                          class="las la-times"
                                        ></i>
                                      </a>
                                  </div>
                                <DisplayFriendsReelsComponent key={reel.id} id={index} 
                                  reel={ reel}
                                  setRefresh={setRefresh}
                                  index={index}
                                />
                              </Form> 
                              )}
                            </Popup>
                          ))}
                        </ul>
                      </div>
                      <Popup
                                  trigger={
                                    <div className="add-reel"> Add Reel</div>
                                  }
                                  modal
                                >
                                  {(close) => (
                                    <Form className="popwidth">
                                      <div className="headpop">
                                        <div style={{ padding: "10px" }}>
                                          <span>
                                            <a
                                              href="#!"
                                              style={{
                                                padding: "10px 150px 10px 0",
                                              }}
                                              onClick={close}
                                            >
                                              <i class="las la-times"></i>
                                            </a>
                                          </span>
                                          <span
                                            style={{
                                              color: "#000000",
                                              fontSize: "14px",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Lets Add Reel Video
                                          </span>

                                          {/* { checkIfUserAlreadyPostStory(storyauth.user) ?  */}
                                          <span style={{ float: "right" }}>
                                            {" "}
                                            <button
                                              style={{
                                                float: "right",
                                                borderRadius: "20px",
                                                padding: "5px 20px",
                                              }}
                                              type="submit"
                                              onClick={uploadReels}
                                            >
                                              Upload
                                            </button>
                                          </span>
                                          {/* :null}  */}
                                        </div>
                                      </div>

                                      <div
                                        style={{ margin: "0 11px 10px 11px" }}
                                      >
                                        <span className="textPop">
                                          {ShowReelVideo ? (
                                            <>
                                              <video
                                                id="video"
                                                width="100%"
                                                height={"350px"}
                                                controls="controls"
                                              >
                                                <source src={ReelVideo} />
                                              </video>

                                              <button
                                                onClick={handleRemoveReelVideo}
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
                                          ) : (
                                            <div
                                              style={{ textAlign: "center" }}
                                            >
                                              <label className="fileContainer">
                                                <div
                                                  className="reelvideo"
                                                  type="submit"
                                                >
                                                  <input
                                                    type="file"
                                                    name="reel_video"
                                                    accept="video/*"
                                                    onChange={handleFileReel}
                                                  ></input>
                                                  Add Reel Video
                                                </div>
                                              </label>
                                            </div>
                                          )}
                                        </span>
                                        {/* <div className='storyErr'>{uploadErrorStory ? `${uploadErrorStory}` : null}</div> */}
                                      </div>
                                      {/* </> 
                                                   
                                 )}  */}
                                    </Form>
                                  )}
                                </Popup>

                                <div className="add-reel">
                                  <a
                                    href="/reelFeed"
                                    style={{ color: "white" }}
                                  >
                                    {" "}
                                    Explore Reels{" "}
                                  </a>
                                </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };
  //   if (showComp === "newsfeed") {
  //   else {
  //     return (
  //       <div className="loadMore">
  //         {
  //           savedPost.map(
  //             post =>
  //               <div key={post.id}>
  //                 {
  //                   post.group ?
  //                     post.group.members.some(member => member.email === AuthService.getCurrentUser().username) ?
  //                       testFanc(post) : null
  //                     :
  //                     testFanc(post)
  //                 }
  //               </div>
  //           )
  //         }

  //       </div>
  //     )
  //   }
  // }

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
    getAllGroups();
  }, [showComp, group]);

  useEffect(() => {
    testScript();
  }, []);

  useEffect(() => {
    getUser();
    getPost().then(() => {
      setIsLoading(false);
    });
    getPostForUser();
    getReelForUserFriends();
    getSavedPost();
    testScript();
  }, [editPostId, refresh]);

  useEffect(() => {
    getPostForUser();
    getReelForUserFriends();
    getSavedPost();
    testScript();
  }, [user]);

  useEffect(async () => {
    await getStoriesForFriendsUser();
  }, [FriendsStories]);
  useEffect(async () => {
     getReelForUserFriends();
  }, [FriendsReels]);

  useEffect(() => {
    getStoriesForUser();
    getReelForUserFriends();
    testScript();
  }, [stories]);
  if (isLoading) {
    return <div>Loading... Please Wait</div>;
  }

  if (user.newUser) {
    return <GuideComponent />;
  }

  return (
    <Layout user={user ? user : userR}>
      {user.newUser ? (
        <GuideComponent />
      ) : (
        <div className="col-lg-6">
          <div class="slide-wrapperstry">
            <ul class="slidestry">
              <li class="slideitemstry">
                <div className="strysggstion-card">
                  <div className="strysggstion-img">
                    <img src="/assets/images/vector-34@2x.png" alt="img" />
                  </div>
                  <Popup trigger={<div className="add-stry"> +</div>} modal>
                    {(close) => (
                      <Form className="popwidth">
                        <div className="headpop">
                          <div style={{ padding: "10px" }}>
                            <span>
                              <a
                                href="#!"
                                style={{ padding: "10px 150px 10px 0" }}
                                onClick={close}
                              >
                                <i class="las la-times"></i>
                              </a>
                            </span>
                            <span
                              style={{
                                color: "#000000",
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              Lets Add Stories
                            </span>

                            {/* { checkIfUserAlreadyPostStory(storyauth.user) ?  */}
                            <span style={{ float: "right" }}>
                              {" "}
                              <button
                                style={{
                                  float: "right",
                                  borderRadius: "20px",
                                  padding: "5px 20px",
                                }}
                                type="submit"
                                onClick={uploadStories}
                              >
                                Upload
                              </button>
                            </span>
                            {/* :null}  */}
                          </div>
                        </div>

                        <div style={{ margin: "0 11px 10px 11px" }}>
                          <span className="textPop">
                            {showstoriesImage ? (
                              <>
                                <img
                                  id="preview"
                                  src={storiesImage}
                                  style={{ width: "100%" }}
                                />
                                <button
                                  onClick={handleRemoveImageStry}
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
                            ) : (
                              <div style={{ textAlign: "center" }}>
                                <label className="fileContainer">
                                  <div className="storypic" type="submit">
                                    <input
                                      type="file"
                                      name="swap_image"
                                      accept="image/*"
                                      onChange={handleFileStry}
                                    ></input>
                                    Add Story
                                  </div>
                                </label>
                              </div>
                            )}
                            <textarea
                              className="textpopup"
                              rows={2}
                              placeholder={"Add text to your Story"}
                              name="story_content"
                              value={storyContent}
                              onChange={handleStoryContent}
                            />
                          </span>
                          <div className="storyErr">
                            {uploadErrorStory ? `${uploadErrorStory}` : null}
                          </div>
                        </div>
                        {/* </> 
                                                   
                                 )}  */}
                      </Form>
                    )}
                  </Popup>

                  <label className="fileContainer">
                    <input
                      id="file-input"
                      type="file"
                      name="stories_image"
                      accept="image/*"
                      onChange={handleFileStry}
                    ></input>
                  </label>
                  <div className="strysggstion-by">
                    <h5>Create Story</h5>
                  </div>
                  {/* <button  onClick={uploadStories}>Post</button> */}
                </div>
              </li>

              {storiesForUser.map((story, index) => (
                <>
                  {story.storiesImagePath && index === 0 ? (
                    <>
                      <Popup
                        style={{ padding: "0px" }}
                        trigger={
                          <li class="slideitemstry" key={story.id}>
                            <StoriesComponent
                              story={story}
                              setRefresh={setRefresh}
                            />
                          </li>
                        }
                        modal
                      >
                        {(close) => (
                          <Form className="stryp" style={{marginRight: "100px"}}>
                            <div>
                              <div className="row">
                                <div style={{ width: "5%" }}>
                                  <a href="#!" onClick={close}>
                                    <i
                                      style={{
                                        color: "#fff",
                                        padding: "10px",
                                        fontSize: "30px",
                                      }}
                                      class="las la-times"
                                    ></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <DisplayComponent />
                          </Form>
                        )}
                      </Popup>
                    </>
                  ) : null}
                </>
              ))}

              {storiesForUserFriends.map((story, index) => (
                <Popup
                  style={{ padding: "0px" }}
                  trigger={
                    <li className="slideitemstry" key={story.id} id={index}>
                      <StoriesComponentFriends
                        story={
                          storiesForUserFriends[index].stories_List[
                            storiesForUserFriends[index].stories_List.length - 1
                          ]
                        }
                        setRefresh={setRefresh}
                      />
                    </li>
                  }
                  modal
                >
                  {(close) => (
                    <Form className="stryp" style={{marginRight: "100px"}}>
                      <div>
                        <div className="row">
                          <div style={{ width: "5%" }}>
                            <a href="#!" onClick={close}>
                              <i
                                style={{
                                  color: "#fff",
                                  padding: "10px",
                                  fontSize: "30px",
                                }}
                                class="las la-times"
                              ></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <DisplayFriendsStoryComponent
                        key={story.id}
                        id={index}
                        story={storiesForUserFriends[index].stories_List}
                        setRefresh={setRefresh}
                      />
                    </Form>
                  )}
                </Popup>
              ))}
            </ul>
            {/* <div class="paddles">
              <button class="left-paddlestry paddle">
                <i class="las la-chevron-circle-left"></i>
              </button>
              <button class="right-paddlestry paddle">
                <i class="las la-chevron-circle-right"></i>
              </button>
            </div> */}
          </div>

          <div className="central-meta newsfeed">
            <div className="new-postbox">
              <figure>
                <img
                  src={
                    user
                      ? fileStorage.baseUrl + user.profilePicture
                      : fileStorage.baseUrl + userR.profilePicture
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
                </Form>
              </div>
              <div className="attachments">
                <ul>
                  <li>{hangsharePopUp()}</li>

                  {/* <label className="fileContainer"><img src="/assets/images/share-2.png" alt="img" /><span>Share Up</span> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                        </label> */}
                  <li>{shareUp()}</li>
                  <li>{photos()}</li>
                  <li>{popSwap()}</li>
                  {/* <li><i class="las la-camera"></i> <label className="fileContainer"> <input type="file" />
                        </label></li> */}
                </ul>
              </div>
            </div>
          </div>

          {/* <div>
                     {
                    postImage.map((item,key)=>(<img src={item} key={key} style={{maxWidth:'150px',maxHeight:'150px'}}/>))
                     }
                     </div> */}
          {/* <div className='central-meta newsfeed grp-sugg-cont'>
            <div style={{ fontSize: '18px', padding:'1rem 20px' , fontWeight: 'bold', marginTop: '10px' }}>Groups Suggestions</div>
              <div class='slide-wrapper' style={{margin:'0'}}>            
                <ul class='slide container-fluid'>
                  <OwlCarousel items={3}  
                    className="owl-theme grp-carousel"  
                    nav  
                    margin ={0}
                    dots = {false}
                    >  
                      <li class='slideitem' style={{margin: 0}}>
                        <a href='#'>
                          <div className='groupsggstion-card'>
                            <div className='groupsggstion-img'>
                              <a href=''>
                                <div>
                                  {' '}
                                  <img src={Grpicon} className="no-img"/>
                                </div>
                              </a>
                            </div>

                            <div className='groupsggstion-by'>
                              <a href='/group/create'>
                                <div class='add-group' aria-describedby='popup-2'>
                                  {' '}

                                </div>
                              </a>

                              <a href='/group/create'>
                                <h5 style={{ fontWeight: 'bold', fontSize: '13px', backgroundColor: 'rgb(3 51 71)', color: '#ffff', borderRadius: '5px' ,lineHeight:'35px' ,fontWeight: '600' }}><i class="fas fa-plus"></i> &nbsp;Create Group</h5>
                              </a>
                            </div>
                          </div>
                        </a>
                      </li>
                      {searchedGroups.map((group) => (
                        <li class='slideitem'>
                          <a href={`/groups/${group.id}`} title={group.name}>
                            <div className='groupsggstion-card'>
                              <div className='groupsggstion-img'>
                                <a href={`/groups/${group.id}`} title={group.name}>
                                  {' '}
                                  <img
                                    src={
                                      group.groupImagePath
                                        ? fileStorage.baseUrl+group.groupImagePath
                                        : Grpicon
                                    }
                                    className={group.groupImagePath
                                      ? "img"
                                      : "no-img"}
                                    alt=''
                                  />
                                </a>
                              </div>

                              <div className='groupsggstion-by'>
                                <div style={{ paddingLeft: '10px' , height:'20px' }}>

                                    <span className='groupname'>

                                      <a href={`/groups/${group.id}`} title='#'>{`${group.name}`}

                                      </a>
                                    </span>
                                  </div>
                                  <div style={{ textAlign: 'right', paddingRight: '20px', fontSize: '13px' }}>
                                    {group.members.length > 1 ? (

                                      <p className="grp-mem-text"> {group.members.length} Members</p>
                                    ) : (
                                      <p className="grp-mem-text">{group.members.length} Member</p>
                                    )}
                                  </div>
                                  {checkIfInGroup(group.members) ? (
                                    <a

                                      href
                                      class='buttonGrpFd mrgngrp mt-0'  
                                      style={{ color: '#fff', background: '#033347', fontSize: '12px' ,lineHeight: '35px' , fontWeight: '600'}}
                                      onClick={(e) => handleLeaveGroup(e,group.id)}
                                    >
                                      Leave Group
                                    </a>
                                  ) : (
                                    <a
                                      href
                                      class='buttonGrpFd mrgngrp mt-0'
                                      style={{ color: '#000000', background: '#EAEAEA', fontSize: '12px' ,lineHeight: '35px' , fontWeight: '600' }}
                                      onClick={(e) => handleJoinGroup(e,group.id)}
                                    >
                                      Join Group
                                    </a>

                                  )}
                              </div>
                            </div>
                          </a>
                        </li>
                      ))}
                  </OwlCarousel>
                </ul>
            </div>
          </div> */}
          {/* add post new box */}
          {/* <p className="showCompNewsfeed" style={{ fontWeight: 'bold', color: 'rgb(207, 144, 7)', textAlign: 'center' }}><span onClick={() => setShowComp("newsfeed")}>Newsfeed</span> | <span onClick={() => setShowComp("saved")}>Saved Posts</span>|<span onClick={() => setShowComp("saved")}>SharePosts</span>|<span onClick={() => setShowComp("saved")}>Swap Posts</span></p> */}
          {show()}
        </div>
      )}
    </Layout>
  );
}
export default NewsfeedComponent;
