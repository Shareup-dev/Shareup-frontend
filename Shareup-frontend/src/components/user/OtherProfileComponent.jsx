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
import Nav from 'react-bootstrap/Nav'
import { textAlign } from "@mui/system";
function OtherProfileComponent() {
  const { email: user_email } = useParams();
  
  let history = useHistory();

  const { user } = useContext(UserContext);

  const [temp, setTemp] = useState("");
  const [profilePicture, setprofilePicturePath] = useState(null);
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
  const [ProfileCount, setProfileCount] = useState("");
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

  const [myPost, setMyPost] = useState([]);

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

  const currentUserGet = async () => {
    await UserService.getUserByEmail(user_email).then((res) => {
      setUserProfile(res.data);
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
    await PostService.getPostForUserById(userProfile?.id).then((res) => {
      setMyPost(res.data);
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
    if (profilePicture === "") {
      console.log("cant be null");
      return;
    }
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    await UserService.uploadProfilePicture(user_email, formData).then((res) => {
      window.location.reload();
    });
  };

  const handleOnChange = () => {
    console.log("HEHE");
  };

  const acceptFriendRequest = (uid, fid) => {
    FriendsService.acceptRequest(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };

  const getFriendStatus = () => {
    FriendsService.getFriendStatus(user?.id,userProfile?.id).then((res) => {
      setFriendStatus(res.data);
    });
  };

  const getFriendCount = () => {
    FriendsService.getFriendCount(userProfile?.id).then((res) => {
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
    console.log("uid: " + uid + " fid: " + fid);
    FriendsService.removeFriends(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };
  const handleFollow = (uid) => {
    UserService.follow(user.email, uid).then((res) => {
      setRefresh(res.data);
    });
  };

  const handleUnfollow = (uid) => {
    UserService.unfollow(user.email, uid).then((res) => {
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

  const getReelsForUser = async () => {

    await ReelsServices.getReelForUser(userProfile?.id).then(res => {
      const sorting = res.data.sort(function (a, b) {
        let dateA = new Date(a.published), dateB = new Date(b.published);
        return dateB - dateA;
      });
      
      const uniquePost = Array.from(new Set(sorting.map(a => a.id)))
        .map(id => {
          return res.data.find(a => a.id === id)
        })
      setSearchedReelforUser(uniquePost)
    })
  }
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
  useEffect(() => {
    currentUserGet();
    getFriendStatus();
    getFriendCount();
    getAllUser();
    getFriendsList();
    getAllFollowing();
    getReelsForUser();
    getAllFollowers();
    getAllFriendRequestSent();
    getAllFriendRequestRecieved();
    getPostForUser();
    getStoriesForUser();
  }, [show,userProfile]);


  const handleShow = () => {
    if (show === "timeline") {
      return <PostProfileComponent posts={myPost} setRefresh={setRefresh} />;
    }
    if (show === "photos") {
      return MyPhotosComponentFunction();
    }

    if (show === "friends") {
      return <FriendProfileComponent />;
    } else {
      return null;
    }
  };

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
const MyPhotosComponentFunction = () => {
    return (
      <>
      <div className="pb-5">
      <Nav fill variant="tabs" defaultActiveKey="#">
      <Nav.Item>
        <Nav.Link href="#">Photos</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="#">Reels</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="#">Tags</Nav.Link>
      </Nav.Item>
    </Nav>
    </div>
      <div className="loadMore" style={{textAlign:"center"}}>
        {myPost && myPost.length > 0
          ? (
            <ul class="profilemedia" >
                          {myPost.map((post, index) => (
                            myPost.media !== [] ? (
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

                            ) : (
                        <></>
                      )
                             )
                          
                          )
                          
                          
                          }
                        </ul>

          )
          : <div class="center" style={{padding: "20px"}}>No Reels to show</div>
        }

      </div>
      </>
    )
  }
  const profileAboutComponent = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div
              style={{
                background: "white",
                border: "1px solid #ececec",
                borderRadius: "10px",
                boxShadow: "0 1px 3px rgb(0 0 0 / 20%)",
                margin: "0 20px 20px 0",
              }}

            >
              <div>
                <span style={{ float: "right" }}>
                  <i className="las la-ellipsis-v"></i>
                </span>
              </div>

              <div className="admin-name">
                <h5>{`${userProfile.firstName} ${userProfile.lastName}`}</h5>
                <span>{`${userProfile.email}`}</span>
              </div>

              <div className="edit-area">
                <div className="form-group2">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    className="form-inpt"
                    id="fullName"
                    placeholder="Click to add"
                    value={firstName}
                    onChange={handleFirstName}
                  />
                </div>

                <div className="form-group2">
                  <label htmlFor="firstName">Last Name</label>
                  <input
                    type="text"
                    className="form-inpt"
                    id="lastName"
                    placeholder="Click to add"
                    value={lastName}
                    onChange={handleLastName}
                  />
                </div>

                <div className="form-group2">
                  <label htmlFor="firstName">About Me</label>
                  <input
                    type="text"
                    className="form-inpt"
                    id="About"
                    placeholder="Click to add"
                    value={aboutme}
                    onChange={handleAboutme}
                  />
                </div>

                <div className="form-group2">
                  <label htmlFor="firstName">Job</label>
                  <input
                    type="text"
                    className="form-inpt"
                    id="About"
                    placeholder="Click to add"
                    value={job}
                    onChange={handleJob}
                  />
                </div>

                <div className="form-group2">
                  <label htmlFor="firstName">Email</label>
                  <p>{userProfile.email} </p>
                </div>

                <div className="form-group2">
                  <label htmlFor="firstName">Role</label>
                  <input
                    disabled={true}
                    className="form-inpt"
                    type="url"
                    id="interests"
                    placeholder="No Role"
                    style={{ color: "red" }}
                    value={userProfile.role}
                    onChange={handleOnChange}
                  />
                </div>

                <div className="form-group2">
                  <label htmlFor="firstName">Home Town</label>
                  <input
                    type="text"
                    className="form-inpt"
                    id="About"
                    placeholder="Click to add"
                    value={homeTown}
                    onChange={handleHomeTown}
                  />
                </div>

                <div className="form-group2">
                  <label htmlFor="firstName">Relationship Status</label>
                  <input
                    type="text"
                    className="form-inpt"
                    id="Relationship Status"
                    placeholder="Click to add"
                    value={relationshipStatus}
                    onChange={handleRelationshipStatus}
                  />
                </div>

                <div className="form-group2">
                  <label htmlFor="firstName">Interests</label>
                  <input
                    type="text"
                    className="form-inpt"
                    id="Interests"
                    placeholder="Click to add"
                    value={interests}
                    onChange={handleInterests}
                  />
                </div>

                <br></br>

                <div style={{ display: "inline", margin: "10px 0" }}>
                  <button
                    id="submit"
                    name="submit"
                    className="shareIn-btn2"
                    type="button"
                    onClick={temp}
                  >
                    <span>Cancel</span>
                  </button>
                  {/* <button type="button" id="submit" name="submit" className="btn btn-secondary" onClick={temp} >Cancel</button> */}
                  <button
                    id="submit"
                    name="submit"
                    className="shareIn-btn2"
                    type="button"
                    onClick={updateProfile}
                  >
                    <span>Save</span>
                  </button>
                  {/* <button type="button" id="submit" name="submit" className="btn btn-primary" onClick={updateProfile}>Save</button> */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4"></div>
          <div className="col-lg-4">
            <div className="widget-prof">
              <ul>
                <li className="head-widgt">Privacy</li>
                <li>
                  <div className="row">
                    <input type="checkbox" />
                    <p>Include my profile in ShareUp search</p>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <input type="checkbox" />
                    <p>Allow my contacts to see my contacts</p>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <input type="checkbox" />
                    <p>
                      Allow my contacts to download photos I share to my
                      ShareTime
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const profileFriendComponent = () => {
    return (
      <div className="container">
        <div className="tab-pane active fade show " id="frends">
          <ul className="nearby-contct">
            {searchedUser.map((userM) => (
              <li key={userM.id}>
                <div className="nearly-pepls">
                  <figure>
                    <a
                      href={`/profile/${userM.email}`}
                      title={`${userM.email}`}
                    >
                      <img
                        src={fileStorage.baseUrl + userM.profilePicture}
                        alt=""
                      />
                    </a>
                  </figure>
                  <div className="pepl-info">
                    <h4>
                      <a
                        href={`/profile/${userM.email}`}
                        title={`${userM.email}`}
                      >{`${userM.firstName} ${userM.lastName}`}</a>
                    </h4>
                    <p>
                      <a
                        href={`/profile/${userM.email}`}
                        title={`${userM.email}`}
                      >{`${userM.email}`}</a>
                    </p>
                    <span>Engr</span>
                    {user.id !== userM.id ? (
                      !friendsList.some((el) => el.id === userM.id) ? (
                        friendRequestRecieved.some(
                          (el) => el.id === userM.id
                        ) ? (
                          <>
                            <a
                              href="#!"
                              title="#"
                              className="add-butn"
                              style={{ color: "#fff" }}
                              data-ripple
                              onClick={() =>
                                acceptFriendRequest(user.id, userM.id)
                              }
                            >
                              Accept Friend Request
                            </a>
                            <p>
                              <a
                                style={{
                                  display: "block",
                                  float: "right",
                                  color: "gray",
                                }}
                                href="#"
                                onClick={() =>
                                  declineFriendRequest(user.id, userM.id)
                                }
                              >
                                Decline Friend Request
                              </a>
                            </p>
                            <br></br>
                            <br></br>
                          </>
                        ) : friendRequestSent.some(
                            (el) => el.id === userM.id
                          ) ? (
                          <p>
                            <a
                              href="#!"
                              title="#"
                              className="add-butn"
                              style={{ color: "#fff" }}
                              data-ripple
                              onClick={() =>
                                unsendFriendRequest(user.id, userM.id)
                              }
                            >
                              Unsend Friend Request
                            </a>
                          </p>
                        ) : (
                          <p>
                            <a
                              href="#!"
                              title="#"
                              className="add-butn"
                              style={{ color: "#fff" }}
                              data-ripple
                              onClick={() =>
                                sendFriendRequest(user.id, userM.id)
                              }
                            >
                              Send Friend Request
                            </a>
                          </p>
                        )
                      ) : (
                        <>
                          <a
                            href="#"
                            title="#!"
                            className="add-butn more-action"
                            data-ripple
                            onClick={() => removeFriend(user.id, userM.id)}
                          >
                            unfriend
                          </a>
                          <p>Already a friend</p>
                        </>
                      )
                    ) : (
                      <p style={{ float: "right" }}>Your own profile</p>
                    )}
                    {user.id !== userM.id ? (
                      !following.some((el) => el.id === userM.id) ? (
                        <p>
                          <a
                            style={{ display: "block", float: "right" }}
                            href="#!"
                            onClick={() => handleFollow(userM.id)}
                          >
                            Follow
                          </a>
                        </p>
                      ) : (
                        <p>
                          <a
                            style={{
                              display: "block",
                              float: "right",
                              color: "red",
                            }}
                            href="#!"
                            onClick={() => handleUnfollow(userM.id)}
                          >
                            Unfollow
                          </a>
                        </p>
                      )
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="lodmore">
            <button className="btn-view btn-load-more" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div>
        <ShareupInsideHeaderComponent />

        <div className="row merged">
          <section>
            <div className="feature-photo">
              <div className="container pdng1">
                <div className="row">
                  <div className="col-lg-3">
                    {showprofilePicturePath ? (
                      <img id="preview" src={profileRender} />
                    ) : userProfile.profilePicture ? (
                      <img
                        className="border-gradient"
                        src={fileStorage.baseUrl + userProfile.profilePicture}
                      ></img>
                    ) : (
                      <p> Edit Display Photo</p>
                    )}
                    {userProfile?.id === user?.id ? (
                      <form className="edit-phto">
                        <label className="fileContainer">
                          <div className="add-profile mrgnFileCntnrVwProf">
                            +
                          </div>
                          <input
                            id="file-input"
                            type="file"
                            name="profile_image"
                            accept="image/*"
                            onChange={handleProfileImage}
                          ></input>
                        </label>
                        <button
                          href="#!"
                          id="submit"
                          name="submit"
                          onClick={uploadprofilePicturePath}
                        ></button>
                      </form>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="col-lg-9">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <h5>{`${userProfile?.firstName} ${userProfile?.lastName}`}</h5>
                      </div>
                      {userProfile?.id === user?.id ? (
                        <div>
                          <a
                            href="/editprofile"
                            style={{
                              color: "#000000",
                              fontWeight: "bold",
                              background: "#D6D6D6",
                              marginTop: "15px",
                            }}
                            className="button rounded-pill"
                          >
                            Edit Profile
                          </a>
                        </div>
                      ) : friendStatus === "Friend" ? (
                        <div>
                          <a
                            onClick={() =>
                              removeFriend(user?.id, userProfile?.id)
                            }
                            style={{
                              color: "#000000",
                              fontWeight: "bold",
                              background: "#D6D6D6",
                              marginTop: "15px",
                            }}
                            className="button rounded-pill"
                          >
                            Unfriend
                          </a>
                        </div>
                      ) : friendStatus === "Unfriend" ? (
                        <div>
                          <a
                            onClick={() =>
                              sendFriendRequest(user?.id, userProfile?.id)
                            }
                            style={{
                              color: "#000000",
                              fontWeight: "bold",
                              background: "#D6D6D6",
                              marginTop: "15px",
                            }}
                            className="button rounded-pill"
                          >
                            Add Friend
                          </a>
                        </div>
                      ) : friendStatus === "FriendRequested" ? (
                        <div>
                          <a
                            onClick={() =>
                              unsendFriendRequest(user?.id, userProfile?.id)
                            }
                            style={{
                              color: "#000000",
                              fontWeight: "bold",
                              background: "#D6D6D6",
                              marginTop: "15px",
                            }}
                            className="button rounded-pill"
                          >
                            Cancel Request
                          </a>
                        </div>
                      ) : friendStatus === "FriendResponse" ? (
                        <div>
                          <a
                            onClick={() =>
                              acceptFriendRequest(user?.id, userProfile?.id)
                            }
                            style={{
                              color: "#000000",
                              fontWeight: "bold",
                              background: "#D6D6D6",
                              marginTop: "15px",
                            }}
                            className="button rounded-pill"
                          >
                            Accept
                          </a>
                          <a
                            onClick={() =>
                              declineFriendRequest(user?.id, userProfile?.id)
                            }
                            style={{
                              color: "#000000",
                              fontWeight: "bold",
                              background: "#D6D6D6",
                            }}
                            className="button rounded-pill"
                          >
                            Reject
                          </a>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    {/* <span>{`${userProfile.email}`}</span> */}
                    <div className="profsts">
                      <ul>
                        <li>
                          <span
                            style={{ textAlign: "center" }}
                          >{`${ProfileCount?.posts_count}`}</span>
                          <span>Posts</span>
                        </li>
                        <li>
                          <span
                            style={{ textAlign: "center" }}
                          >{`${ProfileCount?.followers_count}`}</span>
                          <span>Followers</span>
                        </li>
                        <li>
                          <span
                            style={{ textAlign: "center" }}
                          >{`${ProfileCount?.followings_count}`}</span>
                          <span>Following</span>
                        </li>
                      </ul>
                      {userProfile.aboutme !== null ? (
                        <span>{`${userProfile.aboutme}`}</span>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3"></div>
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
                              userProfile.profilePicture ? <img src={userProfile.profilePicture}></img> : <p>	Edit Display Photo</p>
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
                  <div className="slide-wrapperstry">
                    <ul className="slidestry">
                      {userProfile?.id === user?.id ? (
                        <li className="slideitemstry">
                          <div className="strysggstion-card">
                            <div className="strysggstion-img">
                              <img
                                src="/assets/images/vector-34@2x.png"
                                alt="img"
                              />
                            </div>
                            <Popup
                              trigger={<div className="add-stry"> +</div>}
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
                                          <i className="las la-times"></i>
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
                                            <i className="las la-times"></i>
                                          </button>
                                        </>
                                      ) : (
                                        <div style={{ textAlign: "center" }}>
                                          <label className="fileContainer">
                                            <div
                                              className="storypic"
                                              type="submit"
                                            >
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
                                      {uploadErrorStory
                                        ? `${uploadErrorStory}`
                                        : null}
                                    </div>
                                  </div>
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
                          </div>
                        </li>
                      ) : (
                        <></>
                      )}
                      {storiesForUser?.map((story, index) => (
                        <>
                          <Popup
                            style={{ padding: "0px" }}
                            trigger={
                              <li className="slideitemstry" key={story.id}>
                                <StoriesComponent
                                  story={story}
                                  setRefresh={setRefresh}
                                />
                              </li>
                            }
                            modal
                          >
                            {(close) => (
                              <Form
                                className="stryp"
                                style={{ marginRight: "100px" }}
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
                      ))}
                    </ul>
                    
                  </div>
                </div>
                <div className="timeline-info">
                  <div className="row">
                    <div className="col">
                      <a
                        className={
                          show === "timeline" ? "active " : ""
                        }
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
                        className={
                          show === "photos" ? "active " : ""
                        }
                        title=""
                        data-ripple=""
                        onClick={() => setShow("photos")}
                      >
                        <i className="las la-icons"></i>
                      </a>
                    </div>  
                    <div className="col">
                      <a
                        className={
                          show === "friends" ? "active " : ""
                        }
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

            <div className="container pdng1">
              {/*  */}
              <div className="changethis" style={{ overflow: "auto" }}>
                {handleShow()}
              </div>
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
                              userProfile.profilePicture ? <img className="border-gradient" src={userProfile.profilePicture}></img> : <p>	Edit Display Photo</p>
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
                              userProfile.profilePicture ? <img src={userProfile.profilePicture}></img> : <p>	Edit Display Photo</p>
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
