import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import AuthService from "../../services/auth.services";
import Layout from "../LayoutComponent";
import { testScript } from "../../js/script";
import FriendsService from "../../services/FriendService";
import ShareupInsideHeaderComponent from "../dashboard/ShareupInsideHeaderComponent";
import PostComponent from "../post/PostComponent";
import PostService from "../../services/PostService";
import PostProfileComponent from "../Profile/PostProfileComponent";
import FriendProfileComponent from "../Profile/FriendProfileComponent";
import settings from "../../services/Settings";
import fileStorage from "../../config/fileStorage";
import NewsfeedComponent from "./NewsfeedComponent";
import StoriesComponent from "../Stories/StoriesComponent";
import DisplayComponent from "../Stories/DisplayComponent";
import StoriesComponentFriends from "../Stories/StoriesComponentFriends";
import DisplayFriendsStoryComponent from "../Stories/DisplayFriendsStoryComponent";
import Popup from "reactjs-popup";
import Form from "react-bootstrap/Form";
import StoriesService from "../../services/StoriesService";
import ReelsServices from "../../services/ReelsServices";
import ReelsComponentFriends from "../Reels/ReelsComponentFriends";
import DisplayFriendsReelsComponent from "../Reels/DisplayFriendsReelsComponent";
import DisplayMediaComponent from "../Profile/DisplayMediaComponent";
import MediaComponent from "../Profile/MediaComponent";
import Nav from "react-bootstrap/Nav";
import { textAlign } from "@mui/system";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext } from "@mui/lab";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import FriendRequestProfileComponent from "../Profile/FriendRequestProfileComponent";
import FriendFollowProfileComponent from "../Profile/FriendFollowProfileComponent";
function OtherProfileComponent() {
  const { email: user_email } = useParams();

  let history = useHistory();

  const { user } = useContext(UserContext);

  const [temp, setTemp] = useState("");
  const [profilePicturePath, setprofilePicturePath] = useState(null);
  const [profileRender, setProfileRender] = useState(null);
  const [showprofilePicturePath, setShowprofilePicturePath] = useState(false);
  const [showstoriesImage, setShowstoriesImage] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [aboutme, setAboutme] = useState("");
  const [job, setJob] = useState("");
  const [homeTown, setHomeTown] = useState("");
  const [friendStatus, setFriendStatus] = useState("");
  const [ProfileCount, setProfileCount] = useState();
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [interests, setInterests] = useState("");
  const [storiesForUser, setStoriesForUser] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [uploadErrorStory, setUploadErrorStory] = useState("");
  const [stories, setStories] = useState([]);
  const [userPost, setUserPost] = useState([]);
  const [refresh, setRefresh] = useState(null);
  const [show, setShow] = useState("timeline");
  const [value, setValue] = React.useState("1");

  const [showStoryButton, setShowStoryButton] = useState(true);
  const [showStoryButtonVdo, setShowStoryButtonVdo] = useState(false);
  const [storyType, setStoryType] = useState("image");
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [myPost, setMyPost] = useState([]);
  const [profileMedia, setProfileMedia] = useState([]);

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastName = (event) => {
    setLastName(event.target.value);
  };
  const handleAboutme = (event) => {
    setAboutme(event.target.value);
  };
  const handleJob = (event) => {
    setJob(event.target.value);
  };
  const handleHomeTown = (event) => {
    setHomeTown(event.target.value);
  };
  const handleRelationshipStatus = (event) => {
    setRelationshipStatus(event.target.value);
  };
  const handleInterests = (event) => {
    setInterests(event.target.value);
  };

  const [userProfile, setUserProfile] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);
  const [friendRequestRecieved, setFriendRequestRecieved] = useState([]);
  const [friendRequestSent, setFriendRequestSent] = useState([]);
  const [allUser, setAllUser] = useState([]);

  const getStoriesForUser = async () => {
    await StoriesService.getStoriesForUser(user_email).then((res) => {
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

  const [storiesImage, setStoriesImage] = useState([]);
  const [filesStry, setFilesStry] = useState({});
  const [storyContent, setStoryContent] = useState("");
  const handleStoryContent = (event) => {
    setStoryContent(event.target.value);
  };
  const handleFileStry = (event) => {
    setFilesStry(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setStoriesImage(reader.result);
      }
    };
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0]);
    // }
    setShowstoriesImage(true);
  };
  const handleRemoveImageStry = () => {
    setFilesStry({});
    setShowstoriesImage(false);
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
    formData.append("story_type",storyType);
    formData.append(`stryfiles`, filesStry);
    StoriesService.createStories(user.id, formData).then((res) => {
      handleRemoveImageStry();
      setStories(res.data);
      setRefresh(res.data);
    });
  };

  const currentUserGet = async () => {
    await UserService.getUserByEmail(user_email).then((res) => {
      setUserProfile(res.data);
      console.log(userProfile)
      setFirstName(res.data.firstName);
      setLastName(res.data.lastName);
      setEmail(res.data.email);
      setId(res.data.id);
      setRole(res.data.role);
      setAboutme(res.data.aboutme);
      setJob(res.data.job);
      setHomeTown(res.data.hometown);
      setRelationshipStatus(res.data.relationshipstatus);
      setInterests(res.data.interests);
    });
  };

  const getPostForUser = async () => {
    await PostService.getPostForUserById(userProfile.id).then((res) => {
      setMyPost(res.data);
    });
  };

  const getMediaForProfile = async () => {
    await PostService.getMediaForProfile(userProfile.id).then((res) => {
      setProfileMedia(res.data);
    });
  };

  const handleProfileImage = (event) => {
    let validated = false;
    setprofilePicturePath(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileRender(reader.result);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
    setShowprofilePicturePath(true);
  };

  const uploadprofilePicturePath = async () => {
    if (profilePicturePath === "") {
      return;
    }
    const formData = new FormData();
    formData.append("profilePicture", profilePicturePath);
    await UserService.uploadProfilePicture(user_email, formData).then((res) => {
      window.location.reload();
    });
  };

  const acceptFriendRequest = (uid, fid) => {
    FriendsService.acceptRequest(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };

  const getFriendStatus = () => {
    FriendsService.getFriendStatus(user.id, userProfile.id).then((res) => {
      setFriendStatus(res.data);
    });
  };

  const getFriendCount = () => {
    FriendsService.getFriendCount(userProfile.id).then((res) => {
      setProfileCount(res.data);
    });
  };

  const declineFriendRequest = (uid, fid) => {
    FriendsService.declineRequest(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };

  const unsendFriendRequest = (uid, fid) => {
    FriendsService.unsendRequest(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };

  const sendFriendRequest = (uid, fid) => {
    FriendsService.sendRequest(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };
  const removeFriend = (uid, fid) => {
    FriendsService.removeFriends(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };
  const handleFollow = (uid) => {
    UserService.follow(user.id, uid).then((res) => {
      setRefresh(res.data);
    });
  };

  const handleUnfollow = (uid) => {
    UserService.unfollow(user.id, uid).then((res) => {
      setRefresh(res.data);
    });
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

  const getAllFollowing = async () => {
    await UserService.getFollowing(AuthService.getCurrentUser().username).then(
      (res) => {
        setFollowing(res.data);
      }
    );
  };

  const getAllFollowers = async () => {
    await UserService.getFollowers(AuthService.getCurrentUser().username).then(
      (res) => {
        setFollowers(res.data);
      }
    );
  };

  const getAllFriendRequestSent = async () => {
    await UserService.getFriendRequestSent(
      AuthService.getCurrentUser().username
    ).then((res) => {
      setFriendRequestSent(res.data);
    });
  };

  const getAllFriendRequestRecieved = async () => {
    await UserService.getFriendRequestRecieved(
      AuthService.getCurrentUser().username
    ).then((res) => {
      setFriendRequestRecieved(res.data);
    });
  };
  const [searchedReelforUser, setSearchedReelforUser] = useState([]);
  const [tagsMedia, setTagsMedia] = useState([]);

  const getReelsForUser = async () => {
    await ReelsServices.getReelForUser(userProfile.id).then((res) => {
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
      setSearchedReelforUser(uniquePost);
    });
  };

  const getTagMediaForUser = async () => {
    await ReelsServices.getReelForUser(userProfile.id).then((res) => {
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
      setSearchedReelforUser(uniquePost);
    });
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
    }
  };
  useEffect(() => {
    // window.scrollTo(0, 0);
    console.log(user)
    if(user&&user.id){
      currentUserGet();
      getFriendStatus();
      getFriendCount();
      getAllUser();
      getFriendsList();
      getAllFollowing();
      getReelsForUser();
      getAllFollowers();
      getMediaForProfile();
      getAllFriendRequestSent();
      getAllFriendRequestRecieved();
      getPostForUser();
      getStoriesForUser();
    }
  }, [show, friendStatus, refresh]);

  useEffect(() => {
    // window.scrollTo(0, 0);
    if(user&&user.id){
      getFriendStatus();
      getFriendCount();
      getPostForUser();
    }
  }, [userProfile, friendStatus, refresh]);

  const handleShow = () => {
    if (show === "timeline") {
      return <PostProfileComponent posts={myPost} setRefresh={setRefresh} showPostInput={user&&user.id === userProfile?.id ?true:false}/>;
    }
    if (show === "photos") {
      return (
        <div className="pb-5">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    style={{ textTransform: "capitalize" }}
                    label="Photos"
                    value="1"
                  />
                  <Tab
                    style={{ textTransform: "capitalize" }}
                    label="Reels"
                    value="2"
                  />

                  <Tab
                    style={{ textTransform: "capitalize" }}
                    label="Tags"
                    value="3"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">{MyPhotosComponentFunction()}</TabPanel>
              <TabPanel value="2">{MyReelsComponentFunction()}</TabPanel>
              <TabPanel value="3">{MyTagsComponentFunction()}</TabPanel>
            </TabContext>
          </Box>
        </div>
      );
    }

    if (show === "friends") {
      return (
        <div className="pb-5">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    style={{ textTransform: "capitalize" }}
                    label="Friends"
                    value="1"
                  />
                  {user.id === userProfile?.id ? (
                    <Tab
                      style={{ textTransform: "capitalize" }}
                      label="Friend Requests"
                      value="2"
                    />
                  ) : (
                    <></>
                  )}
                  <Tab
                    style={{ textTransform: "capitalize" }}
                    label="Follow"
                    value="3"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">
                <FriendProfileComponent
                  email={user_email}
                  id={userProfile?.id}
                />
              </TabPanel>
              <TabPanel value="2">
                <FriendRequestProfileComponent
                  email={user_email}
                  id={userProfile?.id}
                />
              </TabPanel>

              <TabPanel value="3">
                <FriendFollowProfileComponent
                  email={user_email}
                  id={userProfile?.id}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      );
    }
  };

  function SwitchCase(props) {
    switch (props.value) {
      case "Friend":
        return (
          <div>
            <a
              onClick={() => removeFriend(user?.id, userProfile?.id)}
              style={{
                color: "#000000",
                fontWeight: "bold",
                background: "#D6D6D6",
                marginTop: "15px",
              }}
              className="button common-trans-btn1"
            >
              Unfriend
            </a>
          </div>
        );
      case "Unfriend":
        return (
          <div>
            <a
              onClick={() => sendFriendRequest(user?.id, userProfile?.id)}
              style={{
                color: "#000000",
                fontWeight: "bold",
                background: "#D6D6D6",
                marginTop: "15px",
              }}
              className="button common-theme-btn1"
            >
              Add Friend
            </a>
          </div>
        );
      case "FriendRequested":
        return (
          <div>
            <a
              onClick={() => unsendFriendRequest(user?.id, userProfile?.id)}
              style={{
                color: "#000000",
                fontWeight: "bold",
                background: "#D6D6D6",
                marginTop: "15px",
              }}
              className="button common-trans-btn1"
            >
              Cancel Request
            </a>
          </div>
        );
      case "FriendResponse":
        return (
          <div>
            <a
              onClick={() => acceptFriendRequest(user?.id, userProfile?.id)}
              style={{
                color: "#000000",
                fontWeight: "bold",
                background: "#D6D6D6",
                marginTop: "15px",
              }}
              className="button common-theme-btn1"
            >
              Accept
            </a>
            <a
              onClick={() => declineFriendRequest(user?.id, userProfile?.id)}
              style={{
                color: "#000000",
                fontWeight: "bold",
                background: "#D6D6D6",
              }}
              className="button common-trans-btn1"
            >
              Reject
            </a>
          </div>
        );
    }
  }
  const updateProfile = async () => {
    let updateduser = {
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      aboutme: aboutme,
      job: job,
      hometown: homeTown,
      relationshipstatus: relationshipStatus,
      interests: interests,
    };
    UserService.editProfile(user.email, updateduser).then((res) => {
      setUserProfile(res.data);
    });
  };
  const likeReel = async (reelId) => {
    let params = {}
    await ReelsServices.likeReel(user.id, reelId, params).then((res) => {
      getReelsForUser()

    })
  }
  const MyPhotosComponentFunction = () => {
    return (
      <>
        <div className="loadMore" style={{ textAlign: "center" }}>
          {profileMedia && profileMedia.length > 0 ? (
            <ul class="profilemedia">
              {profileMedia.map((post, index) => (
                <Popup
                  style={{ padding: "0px" }}
                  trigger={
                    <li className="slideprofmedia" key={post.id} id={index}>
                      <MediaComponent post={post} setRefresh={setRefresh} />
                    </li>
                  }
                  modal
                >
                  {(close) => (
                    <Form>
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
                      <DisplayMediaComponent
                        key={post.id}
                        id={index}
                        post={post}
                        setRefresh={setRefresh}
                        index={index}
                      />
                    </Form>
                  )}
                </Popup>
              ))}
            </ul>
          ) : (
            <div class="center" style={{ padding: "20px" }}>
              No Post to show
            </div>
          )}
        </div>
      </>
    );
  };
  const MyReelsComponentFunction = () => {
    return (
      <div className="loadMore">
        {searchedReelforUser && searchedReelforUser.length > 0 ? (
          <ul class="slidesreel">
            {searchedReelforUser.map((reel, index) => (
              <Popup
                style={{ padding: "0px" }}
                trigger={
                  <li className="slideitemreelcom" key={reel.id} id={index}>
                    <ReelsComponentFriends
                      reel={reel}
                      setRefresh={setRefresh}
                    />
                  </li>
                }
                modal
              >
                {(close) => (
                  <Form>
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
                    <DisplayFriendsReelsComponent
                      key={reel.id}
                      id={index}
                      reel={reel}
                      likeReel={likeReel}
                      setRefresh={setRefresh}
                      index={index}
                    />
                  </Form>
                )}
              </Popup>
            ))}
          </ul>
        ) : (
          <div class="center" style={{ padding: "20px" }}>
            No Reels to show
          </div>
        )}
      </div>
    );
  };
  const MyTagsComponentFunction = () => {
    return (
      <>
        <div className="loadMore" style={{ textAlign: "center" }}>
          {/* {profileMedia && profileMedia.length > 0
          ? (
            <ul class="profilemedia" >
                          {profileMedia.map((post, index) => (
                            <Popup
                              style={{ padding: "0px" }}
                              trigger={
                                <li
                                  className="slideprofmedia"
                                  key={post.id}
                                  id={index}
                                >
                                  <MediaComponent
                                    post={post}
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
                                <DisplayMediaComponent key={post.id} id={index} 
                                  post={ post}
                                  setRefresh={setRefresh}
                                  index={index}
                                />
                              </Form> 
                              )}
                            </Popup>

                        
                             )
                          
                          )
                          
                          
                          }
                        </ul>

          )
          : */}
          <div class="center" style={{ padding: "20px" }}>
            No Tags Photo
          </div>
          {/* } */}
        </div>
      </>
    );
  };

  return (
    <>
      <div>
        <ShareupInsideHeaderComponent />

        <div className="row merged">
          <section>
            <div className="feature-photo">
              <div className="container edit-profile-cont">
                <div className="row" style={{padding:'25px 35px'}}>
                  <div className="col-lg-3">
                    <div className="right-edit-profile-image-a">
                      {user?.id === userProfile?.id ? (
                        <label className="fileContainer ">
                          <div className="add-prof mrgnFileCntnrVwProf">+</div>
                          <input
                            id="file-input"
                            type="file"
                            name="profile_image"
                            accept="image/*"
                            onChange={handleProfileImage}
                          ></input>
                        </label>
                      ) : null}

                      {showprofilePicturePath ? (
                        <>
                          <img id="preview profprvw" src={profileRender} />
                          <div>
                            <button
                              className="button"
                              id="submit"
                              name="submit"
                              onClick={uploadprofilePicturePath}
                            >
                              Upload
                            </button>
                          </div>{" "}
                        </>
                      ) : (
                        <>
                          {" "}
                          <img
                            src={
                              userProfile.profilePicturePath
                                ? fileStorage.baseUrl +
                                userProfile.profilePicturePath
                                : "	http://192.168.100.2:3000/data/user/default/profile_picture/default.png"
                            }
                          ></img>{" "}
                        </>
                      )}
                    </div>
                    
                  </div>
                  <div className="col-lg-9" style={{display:'flex',flexDirection:'column'}}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <h5>{`${userProfile ? userProfile.firstName : '0'} ${userProfile ? userProfile.lastName : '0'}`}</h5>
                       
                      </div>
                      <div className="d-flex">
                        {userProfile?.id === user?.id ? (
                          <a
                            href="/editprofile"
                          
                            className="button common-theme-btn1"
                          >
                            Edit Profile
                          </a>
                        ) : user.id !== userProfile?.id ? (
                          !friendsList.some((el) => el.id === userProfile?.id) ? (
                            friendRequestRecieved.some(
                              (el) => el.id === userProfile?.id
                            ) ? (
                              <>
                                <button
                                  title=""
                                  className="button"
                                  style={{
                                    width: "15%",
                                    margin: "10px",
                                    padding: "0px 5px",
                                  }}
                                  onClick={() =>
                                    acceptFriendRequest(user.id, userProfile?.id)
                                  }
                                >
                                  Accept
                                </button>
                                <button
                                  title=""
                                  className="button"
                                  style={{
                                    width: "15%",
                                    margin: "10px",
                                    padding: "0px 5px",
                                  }}
                                  onClick={() =>
                                    declineFriendRequest(user.id, userProfile?.id)
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            ) : friendRequestSent.some(
                              (el) => el.id === userProfile?.id
                            ) ? (
                              <button
                                title=""
                                className="button"
                                style={{
                                  width: "25%",
                                  margin: "10px",
                                  padding: "0 5px",
                                }}
                                onClick={() =>
                                  unsendFriendRequest(user.id, userProfile?.id)
                                }
                              >
                                Cancel Request
                              </button>
                            ) : (
                              <button
                                title=""
                                className="button"
                                style={{
                                  width: "25%",
                                  margin: "10px",
                                  padding: "0 5px",
                                }}
                                onClick={() =>
                                  sendFriendRequest(user.id, userProfile?.id)
                                }
                              >
                                Add Friend
                              </button>
                            )
                          ) : (
                            <>
                              <button
                                title=""
                                className="button common-theme-btn1"
                                
                                onClick={() =>
                                  removeFriend(user.id, userProfile?.id)
                                }
                              >
                                Unfriend
                              </button>
                            </>
                          )
                        ) : (
                          <></>
                        )}
                        {user?.id !== userProfile?.id ? (
                        !following.some((el) => el.id === userProfile?.id) ? (
                          <button title="" className="button common-theme-btn1" 
                            onClick={() => handleFollow(userProfile?.id)}
                          >
                            Follow
                          </button>
                        ) : (
                          <button title="" className="button common-trans-btn1" 
                            onClick={() => handleUnfollow(userProfile?.id)}
                          >
                            Unfollow
                          </button>
                        )
                      ) : null}
                      </div>
                    </div>
                    <div className="profsts">
                      <ul>
                        <li>
                          <span
                            style={{ textAlign: "center" }}
                          >{`${ProfileCount ? ProfileCount.posts_count : '0'}`}</span>
                          <span>Posts</span>
                        </li>
                        <li>
                          <span
                            style={{ textAlign: "center" }}
                          >{`${ProfileCount ? ProfileCount.followers_count : '0'}`}</span>
                          <span>Followers</span>
                        </li>
                        <li>
                          <span
                            style={{ textAlign: "center" }}
                          >{`${ProfileCount ? ProfileCount.followings_count : '0'}`}</span>
                          <span>Following</span>
                        </li>
                      </ul>
                     
                    </div>
                    {userProfile?.aboutme !== undefined ? (
                        <div style={{paddingTop:'30px'}}>{`${userProfile?.aboutme}`}</div>
                      ) : ""
                      }
                  </div>
                  
                  
                  {/*                      
                        <div className="add-btn">
                          <span>1205 followers</span>
                          <a href="#" title="" data-ripple="">Add Friend</a>
                        </div>
                        <form className="edit-phto">
                          <i className="fa fa-camera-retro"></i>
                          <label className="fileContainer">
                            Edit Cover Photo
                            <input type="file" />
                          </label>
                        </form> */}
                </div>
                {/* <div className="user-avatar">
                      
                          {
                            showprofilePicturePath ?
                              <img id="preview" src={profileRender} /> :
                              userProfile.profilePicturePath ? <img src={userProfile.profilePicturePath}></img> : <p>	Edit Display Photo</p>
                          }
                          <form className="edit-phto">
                            <i className="fa fa-camera-retro"></i>
                            <label className="fileContainer">
                              <input id="file-input" type="file" name="profile_image" accept="image/*" onChange={handleProfileImage}></input>
                            </label>
                          </form>
                        
                        <button type="button" id="submit" name="submit" className="btn btn-primary" onClick={uploadprofilePicturePath}>Upload</button>
                      </div> */}
                <div>
                  {
                    storiesForUser.length > 0?
                    <div className="slide-wrapperstry">
                    <ul className="slidestry">
                      {userProfile?.id === user?.id ? (
                        <li className="slideitemstry">
                        <div className="strysggstion-card">
                          <div className="strysggstion-img">
                            <div style={{background:'#f1f1f1',height:'100%'}}></div>
                          </div>
                          <Popup
                            trigger={<div className="add-stry"> +</div>}
                            modal
                            className="addStory-popup"
                          >
                            {(close) => (
                              <Form className="popwidth">
                                <div className="headpop">
                                  <span>
                                    <a href="#!" onClick={close}>
                                      <i className="las la-times"></i>
                                    </a>
                                  </span>
                                  <span className="poptitle">Lets Add Stories</span>
        
                                  {/* { checkIfUserAlreadyPostStory(storyauth.user) ?  */}
                                  <span style={{ float: "right" }}>
                                    {" "}
                                    <>
                                      {showStoryButtonVdo ? (
                                        <div style={{ textAlign: "center" }}>
                                          <button
                                            style={{
                                              float: "right",
                                              borderRadius: "20px",
                                              padding: "5px 20px",
                                            }}
                                            onClick={() => {
                                              setStoryType("image");
                                              setShowStoryButtonVdo(false);
                                              setShowStoryButton(true);
                                            }}
                                          >
                                            Add Image
                                          </button>
                                        </div>
                                      ) : null}
                                      {showStoryButton ? (
                                        <div style={{ textAlign: "center" }}>
                                          <button
                                            style={{
                                              float: "right",
                                              borderRadius: "20px",
                                              padding: "5px 20px",
                                            }}
                                            onClick={() => {
                                              setStoryType("video");
                                              setShowStoryButtonVdo(true);
                                              setShowStoryButton(false);
                                            }}
                                          >
                                            Add Video
                                          </button>
                                        </div>
                                      ) : null}
                                    </>
                                  </span>
                                </div>
        
                                <div>
                                  <span className="textPop">
                                    {showstoriesImage ? (
                                      <>
                                        { showStoryButton ? (
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
                                          <i className="las la-times"></i>
                                        </button>
                                          </>
                                        ):(
                                          <>
        
                                          <video
                                               id="video"
                                                width="100%"
                                                src={storiesImage}
                                                height={"350px"}
                                                controls="controls"
                                           >
                                          </video>
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
                                          <i className="las la-times"></i>
                                        </button>
                                        </>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        {showStoryButtonVdo ? (
                                          <div style={{ textAlign: "center" }}>
                                            <label className="fileContainer">
                                              <div className="reelvideo" type="submit">
                                                <input
                                                  type="file"
                                                  name="reel_video"
                                                  accept="video/*"
                                                  onChange={handleFileStry}
                                                ></input>
                                                Add Video Story
                                              </div>
                                            </label>
                                          </div>
                                        ) : null}
                                        {showStoryButton ? (
                                          <div style={{ textAlign: "center" }}>
                                            <label className="fileContainer">
                                              <div className="storypic" type="submit">
                                                <input
                                                  type="file"
                                                  name="swap_image"
                                                  accept="image/*"
                                                  onChange={handleFileStry}
                                                ></input>
                                                Add Image Story
                                              </div>
                                            </label>
                                          </div>
                                        ) : null}
                                      </>
                                    )}
                                    <textarea
                                      className="textpopup"
                                      rows={2}
                                      style={{ marginTop: "10px" }}
                                      placeholder={"Add text to your Story"}
                                      name="story_content"
                                      value={storyContent}
                                      onChange={handleStoryContent}
                                    />
                                  </span>
        
                                  {uploadErrorStory ? (
                                    <div className="storyErr">{uploadErrorStory}</div>
                                  ) : null}
        
                                  <button
                                    class="popsbmt-btn"
                                    type="submit"
                                    onClick={uploadStories}
                                  >
                                    SHARE STORY
                                  </button>
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
                      ) : (
                        <></>
                      )}
                      {storiesForUser?storiesForUser.map((story, index) => (
                        <>
                          <Popup
                            style={{ padding: "0px" }}
                            className="story-popup"
                            trigger={
                              <li className="slideitemstry" key={story.id}>
                                
                                <StoriesComponent
                                  story={story}
                                  hideText={true}
                                  
                                />
                              </li>
                            }
                            modal
                          >
                            {(close) => (
                              <Form
                                className="stryp"

                              >
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
                                          className="las la-times"
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
                      )):null}
                    </ul>
                  </div>
                  :null
                  }
                  
                </div>
                <div className="timeline-info">
                  <div className="row">
                    <div className="col">
                      <a
                        className={show === "timeline" ? "active " : ""}
                        style={{}}
                        title=""
                        data-ripple=""
                        onClick={() => setShow("timeline")}
                      >
                        <i className="las la-rss"></i>
                      </a>
                    </div>
                    <div className="col brdrmid">
                      <a
                        className={show === "photos" ? "active " : ""}
                        title=""
                        data-ripple=""
                        onClick={() => setShow("photos")}
                      >
                        <i className="las la-icons"></i>
                      </a>
                    </div>
                    <div className="col">
                      <a
                        className={show === "friends" ? "active " : ""}
                        title=""
                        data-ripple=""
                        onClick={() => setShow("friends")}
                      >
                        <i className="las la-user-tag"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container ">
              {/*  */}
              <div className="col-lg-3"></div>
              <div className="col-lg-6">
                <div className="changethis" style={{ overflow: "auto" }}>
                  {handleShow()}
                </div>

              </div>
              <div className="col-lg-3"></div>
            </div>
          </section>
        </div>
      </div>

      {/* <div>
          <ShareupInsideHeaderComponent />
          <div className="container">
            <div style={{ marginLeft: '5%', marginRight: '5%' }}>

              <div className="container-fluid eighty">
                <div className="row merged">
                  
                  <div>
                    <div className="feature-photo">
                      <figure><img className='coverImg borderR' src="../assets/images/reg.jpg" alt="" />
                      <div className="add-btn">
                        <span>1205 followers</span>
                        <a href="#" title="" data-ripple="">Add Friend</a>
                      </div>
                      <form className="edit-phto">
                        <i className="fa fa-camera-retro"></i>
                        <label className="fileContainer">
                          Edit Cover Photo
            <input type="file" />
                        </label>
                      </form>
                      <div className="align-avatar">
                <div className="user-avatar">{
                            showprofilePicturePath ?
                              <img  id="preview" src={profileRender} /> :
                              userProfile.profilePicturePath ? <img className="border-gradient" src={userProfile.profilePicturePath}></img> : <p>	Edit Display Photo</p>
                          }
                          
                          
                          </div></div> 
                          <div className="admin-name">
                        <h5>{`${userProfile.firstName} ${userProfile.lastName}`}</h5>
                        <span>{`${userProfile.email}`}</span>
                      </div>
                          
                      </figure>
                      {/* <div className="user-avatar">
                      
                          {
                            showprofilePicturePath ?
                              <img id="preview" src={profileRender} /> :
                              userProfile.profilePicturePath ? <img src={userProfile.profilePicturePath}></img> : <p>	Edit Display Photo</p>
                          }
                          <form className="edit-phto">
                            <i className="fa fa-camera-retro"></i>
                            <label className="fileContainer">
                              <input id="file-input" type="file" name="profile_image" accept="image/*" onChange={handleProfileImage}></input>
                            </label>
                          </form>
                        
                        <button type="button" id="submit" name="submit" className="btn btn-primary" onClick={uploadprofilePicturePath}>Upload</button>
                      </div> *
                      
                      </div>
                    <div className="timeline-info">
                      <ul>

                        <li>
                          <a className={(show === "timeline" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("timeline")}>time line</a>
                          <a className={(show === "photos" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("photos")}>Photos</a>
                          <a className={(show === "videos" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("videos")}>Videos</a>
                          <a className={(show === "friends" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("friends")}>Friends</a>
                          <a className={(show === "groups" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("groups")}>Groups</a>
                          <a className={(show === "about" ? "active" : "")}  title="" data-ripple="" onClick={() => setShow("about")}>about</a>
                          <a className={(show === "more" ? "active" : "")}  data-ripple="" onClick={() => setShow("more")}>more</a>
                        </li>
                      </ul>
                    </div>

                    {/*  *
                  <div className="changethis" style={{boxShadow: '0 1px 3px rgb(0 0 0 / 20%)', padding:'40px 0px'}}>
                    
                      
                      {
                        
                      handleShow()
                    }
                    
                    
                    
            

            
            
            </div>
            
                    

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div> */}
    </>
  );
}
export default OtherProfileComponent;
