import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import AuthService from "../../services/auth.services";
import Layout from "../LayoutComponent";
import PostService from "../../services/PostService";
import ShareupInsideHeaderComponent from "../dashboard/ShareupInsideHeaderComponent";
import PostComponent from "../post/PostComponent";
import FriendsComponent from "../user/FriendsComponent";
import FriendsService from "../../services/FriendService";
import PostProfileComponent from "../Profile/PostProfileComponent";
import FriendProfileComponent from "../Profile/FriendProfileComponent";
import settings from "../../services/Settings";
import fileStorage from "../../config/fileStorage";
import  { handleSendNotification } from "../dashboard/ShareupInsideHeaderComponent";
function ProfileComponent() {
  let history = useHistory();

  const { user } = useContext(UserContext);

  const [temp, setTemp] = useState("");
  const [profilePicturePath, setprofilePicturePath] = useState(null);
  const [profileRender, setProfileRender] = useState(null);
  const [showprofilePicturePath, setShowprofilePicturePath] = useState(false);

  const [coverPicture, setCoverPicture] = useState(null);
  // const [coverRender, setCoverRender] = useState(null)
  // const [showCoverPicture, setShowCoverPicture] = useState(false)

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [aboutme, setAboutme] = useState("");
  const [job, setJob] = useState("");
  const [homeTown, setHomeTown] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [interests, setInterests] = useState("");
  const [gender, setGender] = useState("");
  const [currentTown, setCurrentTown] = useState("");

  const [userPost, setUserPost] = useState([]);
  const [refresh, setRefresh] = useState(null);
  const [show, setShow] = useState("timeline");
  const [myPost, setMyPost] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);
  const [friendRequestRecieved, setFriendRequestRecieved] = useState([]);
  const [following, setFollowing] = useState([]);

  const [friendRequestSent, setFriendRequestSent] = useState([]);
  const [searchedFriendRequestSent, setSearchedFriendRequestSent] = useState(
    []
  );
  const [allUser, setAllUser] = useState([]);
  const [followers, setFollowers] = useState([]);

  const acceptFriendRequest = (uid, fid) => {
    FriendsService.acceptRequest(uid, fid).then((res) => {
      setRefresh(res.data);
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
    UserService.follow(user.id, uid).then((res) => {
      setRefresh(res.data);
    });
  };

  const handleUnfollow = (uid) => {
    UserService.unfollow(user.id, uid).then((res) => {
      setRefresh(res.data);
    });
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
      let mypost = [];
      uniquePost.map((post) => {
        if (post.userdata.email === AuthService.getCurrentUser().username) {
          mypost.push(post);
        }
      });
      setMyPost(mypost);
    });
  };

  const checkIfLiked = (post) => {
    const result = post.reactions.filter(
      (reaction) => reaction.user.id == user.id
    );
    if (result.length > 0) {
      return true;
    }
    return false;
  };

  const handleLikePost = async (post_id) => {
    await UserService.likePost(user.id, post_id).then((res) => {
      handleSendNotification(res.data.userdata.id,'Liked your post',user.firstName,user.lastName,user.email,"post",post_id)

      setRefresh(res.data);
    });
  };

  const handleDeletePost = (postid) => {
    PostService.deletePost(postid).then((res) => {
      console.log(res.status);
      setRefresh(res.data);
    });
  };

  const checkIfSaved = (post) => {
    const result = post.savedByUsers.filter((userz) => userz.id == user.id);
    if (result.length > 0) {
      console.log(" FOUND");
      return true;
    }
    console.log(" Not found");
    return false;
  };

  const [userProfile, setUserProfile] = useState([]);

  const currentUserGet = async () => {
    await UserService.getUserByEmail(
      AuthService.getCurrentUser().username
    ).then((res) => {
      console.log(JSON.stringify(res.data));
      setUserProfile(res.data);
      //
      setFirstName(res.data.firstName);
      setLastName(res.data.lastName);
      setEmail(res.data.email);
      setRole(res.data.role);
      setAboutme(res.data.aboutme);
      setJob(res.data.job);
      setHomeTown(res.data.hometown);
      setGender(res.data.gender);
      setCurrentTown(res.data.currenttown);
      setRelationshipStatus(res.data.relationshipstatus);
      setInterests(res.data.interests);
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
      console.log("cant be null");
      return;
    }
    const formData = new FormData();
    formData.append("profilePicturePath", profilePicturePath);
    await UserService.uploadprofilePicturePath(user.email, formData).then((res) => {
      window.location.reload();
    });
  };

  const updateCoverPicture = async (event) => {
    setCoverPicture(null);
    setCoverPicture(event.target.files[0]);
    setTimeout(async () => {
      const formData = new FormData();
      formData.append("coverPicture", coverPicture);
      await UserService.uploadCoverPicture(user.email, formData).then((res) => {
        window.location.reload();
      });
    }, 1000);
  };

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
  const handleCurrentTown = (event) => {
    setCurrentTown(event.target.value);
  };
  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const updateProfile = async () => {
    let updateduser = {
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      aboutme: aboutme,
      job: job,
      hometown: homeTown,
      gender: gender,
      currenttown: currentTown,
      relationshipstatus: relationshipStatus,
      interests: interests,
    };
    UserService.editProfile(user.email, updateduser).then((res) => {
      setUserProfile(res.data);
    });
  };

  const handleOnChange = async () => {
    console.log("ha");
  };

  const handleShow = () => {
    if (show === "timeline") {
      return <PostProfileComponent posts={myPost} setRefresh={setRefresh} />;
    }
    if (show === "about") {
      return profileAboutComponent();
    }

    if (show === "friends") {
      return <FriendProfileComponent
      email={AuthService.getCurrentUser().username} />;
    } else {
      return null;
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
    getAllUser();
    getPostForUser();
    getFriendsList();
    getAllFollowing();
    getAllFollowers();
    getAllFriendRequestSent();
    getAllFriendRequestRecieved();
  }, [refresh, show]);

  const profileAboutComponent = () => {
    return (
      <div className="right-edit-profile bck">
        <div className="right-edit-profile-content">
          <div className="right-edit-profile-image">
            {/* <form className="edit-phto"> */}

            {/* <i className="fa fa-camera-retro"></i> */}

            {/* </form> */}
          </div>
          <div className=".right-edit-profile-bio1">
            <div className="right-edit-profile-bio-top">
              <p>Bio</p>
            </div>
            <div className="right-edit-profile-bio-after1">{aboutme}</div>
          </div>
          <div className="right-edit-profile-bio">
            <div className="right-edit-profile-bio-top">
              <p>Details</p>
            </div>
            <div className="right-edit-profile-details">
              <ul>
                {/* <span className="text-color-2">Current town / city</span> */}
                <li>
                  <p>
                    <i className="las la-home" aria-hidden="true" />{" "}
                    <span className="bio">{currentTown}</span>
                  </p>
                </li>
                {/* <input type="text" className="inpt" id="Current town/city" placeholder="Current town/city" */}
                {/* <span className="text-color-2">Home town</span> */}
                <li>
                  <p>
                    <i className="las la-map-marker"></i>
                    <span className="bio">{homeTown}</span>
                  </p>
                </li>
                {/* <span className="text-color-2">Relationship status</span> */}
                <li>
                  <p>
                    <i className="lab la-gratipay"></i>{" "}
                    <span className="bio">{relationshipStatus}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="right-edit-profile-bio">
            <div className="right-edit-profile-bio-top">
              <p>Hobbies</p>
            </div>
            <div className="right-edit-profile-details">
              <div className="right-edit-profile-bio-after1">
                <span className="bio">{interests}</span>
                {/* <p><span className="text-color-2">Add your hobbies...</span></p> */}
              </div>
            </div>
          </div>
          <div className="right-edit-more-details">
            <p>
              <span className="text-color">Switch to Professional account</span>
            </p>
          </div>
          <div className="right-edit-more-details">
            <p>
              <span className="text-color">
                Professional information settings
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <ShareupInsideHeaderComponent />

      <div className="row merged">
        <section>
          <div className="feature-photo">
            <div className="cover-photo pdng1">
              <div className="col-lg-6">
                {showprofilePicturePath ? (
                  <img id="preview" src={profileRender} />
                ) : userProfile.profilePicturePath ? (
                  <img
                    className="border-gradient1"
                    src={fileStorage.baseUrl + userProfile.profilePicturePath}
                  ></img>
                ) : (
                  <p> Edit Display Photo</p>
                )}

                <form className="edit-phto">
                  <label className="fileContainer">
                    <div className="add-profile mrgnFileCntnrVwProf">+</div>
                    <input
                      id="file-input"
                      type="file"
                      name="profile_image"
                      accept="image/*"
                      onChange={handleProfileImage}
                    ></input>
                  </label>
                  <a
                    href="#!"
                    id="submit"
                    name="submit"
                    onClick={uploadprofilePicturePath}
                  ></a>
                </form>
              </div>
              <div className="col-lg-6">
                <a
                  href="/editprofile"
                  style={{
                    color: "#000000",
                    fontWeight: "bold",
                    background: "#ffffff",
                    float: "right",
                    marginTop: "80%",
                    marginRight: "-97%",
                  }}
                  className="button"
                >
                  Change Cover
                </a>
              </div>
              <div
                style={{
                  float: "right",
                  marginTop: "0%",
                  marginRight: "32px",
                }}
              ></div>
            </div>
            <div className="row profile-name">
              <p>{`${userProfile.firstName} ${userProfile.lastName}`}</p>
              {/* <a href="/editprofile" title="Update you details">Add Bio</a> */}
            </div>
            <hr className="new1"></hr>
            <div
              className="row pdng1 person-details"
              style={{
                height: "22px",
              }}
            >
              <div className="col-lg-1"></div>
              <div className="col-lg-6">
                <div className="profsts">
                  <ul>
                    <li>
                      <span>Timeline</span>
                    </li>
                    <li>
                      <span>About</span>
                    </li>

                    <li>
                      <span>Friends</span>
                    </li>
                    <li>
                      <span>Groups</span>
                    </li>
                    <li>
                      <span>More</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div
                  style={{
                    float: "left",
                    marginTop: "-4%",
                    marginLeft: "25%",
                  }}
                >
                  <a
                    href="/editprofile"
                    style={{
                      color: "#000000",
                      fontWeight: "bold",
                      background: "#D6D6D6",
                    }}
                    className="button"
                  >
                    Edit Profile
                  </a>
                </div>
                <div
                  style={{
                    float: "right",
                    marginTop: "-4%",
                    marginRight: "-2%",
                  }}
                >
                  <a
                    href="#"
                    style={{
                      color: "#000000",
                      fontWeight: "bold",
                      background: "#D6D6D6",
                      color: "#ffffff",
                      fontWeight: "bold",
                      background: "#044f66",
                    }}
                    className="button"
                  >
                    Add Story
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-2"></div>
            <div className="container pdng1">
              <div className="row">
                {/* <div className="col-lg-3">
                  {showprofilePicturePath ? (
                    <img id="preview" src={profileRender} />
                  ) : userProfile.profilePicturePath ? (
                    <img
                      className="border-gradient"
                      src={fileStorage.baseUrl + userProfile.profilePicturePath}
                    ></img>
                  ) : (
                    <p> Edit Display Photo</p>
                  )}

                  <form className="edit-phto">
                    <label className="fileContainer">
                      <div className="add-profile mrgnFileCntnrVwProf">+</div>
                      <input
                        id="file-input"
                        type="file"
                        name="profile_image"
                        accept="image/*"
                        onChange={handleProfileImage}
                      ></input>
                    </label>
                    <a
                      href="#!"
                      id="submit"
                      name="submit"
                      onClick={uploadprofilePicturePath}
                    >
                      Upload
                    </a>
                  </form>
                </div> */}
                {/* <div className="col-lg-6">
                  <h5>{`${userProfile.firstName} ${userProfile.lastName}`}</h5>
                  <div className="profsts">
                    <ul>
                      <li>
                        <span style={{ textAlign: "center" }}>0</span>
                        <span>Posts</span>
                      </li>
                      <li>
                        <span style={{ textAlign: "center" }}>0</span>
                        <span>Folowers</span>
                      </li>
                      <li>
                        <span style={{ textAlign: "center" }}>0</span>
                        <span>Following</span>
                      </li>
                    </ul>
                    <span>Feeling happy to share and find my soul</span>
                  </div>
                </div> */}
                {/* <div className="col-lg-3">
                  <div
                    style={{
                      float: "right",
                      marginTop: "10%",
                      marginRight: "10px",
                    }}
                  >
                    <a
                      href="/editprofile"
                      style={{
                        color: "#000000",
                        fontWeight: "bold",
                        background: "#D6D6D6",
                      }}
                      className="button"
                    >
                      Edit Profile
                    </a>
                  </div>
                </div> */}
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
              {/* <div>
                <div className="stories">
                  <ul>
                    <li>
                      <a href="#">
                        <div className="stories-card">
                          <div className="stories-img">
                            <img
                              src="/assets/images/vector-34@2x.png"
                              alt="img"
                            />
                          </div>
                          <div className="add-storie">+</div>
                          <div className="stories-by">
                            <h5>Create Story</h5>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div> */}

              {/* <div className="timeline-info">
                <div className="row">
                  <div className="col">
                    <a
                      className={
                        show === "timeline" ? "active button" : "button"
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
                      className={show === "about" ? "active button" : "button"}
                      title=""
                      data-ripple=""
                      onClick={() => setShow("about")}
                    >
                      <i className="las la-icons"></i>
                    </a>
                  </div>
                  <div className="col">
                    <a
                      className={
                        show === "friends" ? "active button" : "button"
                      }
                      title=""
                      data-ripple=""
                      onClick={() => setShow("friends")}
                    >
                      <i className="las la-user-friends"></i>
                    </a>
                  </div>
                
                </div>
              </div> */}
            </div>
          </div>

          <div className="container pdng2">
            {/*  */}
            <div className="col-lg-4">
            <div className="central-meta item intro-section">
            <h2 style={{ color: "#000000", fontWeight: "600" }}>Intro</h2>
            <a
                  href="/editprofile"
                 
                  className="button info-btn-style"
                >
                  Edit Details
                </a>
                <a
                  href="/editprofile"
                 
                  className="button info-btn-style"
                >
                  Add Hobbies
                </a>
                <a
                  href="/editprofile"
                 
                  className="button info-btn-style"
                >
                  Add Address
                </a>
              </div>
              <div className="central-meta item photo-section">
                <h2 style={{ color: "#000000", fontWeight: "600" }}>Photos</h2>
                <div className="attachments">
                  <ul>
                    <li>
                      <img src="assets/images/photoicon.png" />
                    </li>

                    <li>
                      <img src="assets/images/photoicon.png" />
                    </li>
                    <li>
                      <img src="assets/images/photoicon.png" />
                    </li>
                  
                  </ul>
                  <ul>
                    <li>
                      <img src="assets/images/photoicon.png" />
                    </li>
                    <li>
                      <img src="assets/images/photoicon.png" />
                    </li>

                    <li>
                      <img src="assets/images/photoicon.png" />
                    </li>
                   
                  </ul>
                  <ul>
                    <li>
                      <img src="assets/images/photoicon.png" />
                    </li>
                    <li>
                      <img src="assets/images/photoicon.png" />
                    </li>
                    <li>
                      <img src="assets/images/photoicon.png" />
                    </li>
                    
                  </ul>
                </div>
              </div>
              <div className="central-meta item friend-section">
                <h2 style={{ color: "#000000", fontWeight: "600" }}>Friends</h2>
                <div className="attachments">
                  <ul>
                    <li>
                      <img src="assets/images/propic1.jpg" />
                    </li>

                    <li>
                      <img src="assets/images/propic1.jpg" />
                    </li>
                  
                    <li>
                      <img src="assets/images/propic1.jpg" />
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <img src="assets/images/propic1.jpg" />
                    </li>
                    <li>
                      <img src="assets/images/propic1.jpg" />
                    </li>

                    <li>
                      <img src="assets/images/propic1.jpg" />
                    </li>
                  
                  </ul>
                  <ul>
                    <li>
                      <img src="assets/images/propic1.jpg" />
                    </li>
                    <li>
                      <img src="assets/images/propic1.jpg" />
                    </li>
                    <li>
                      <img src="assets/images/propic1.jpg" />
                    </li>
                   
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-7 changethis ur-profile" style={{ overflow: "auto",padding:"0px" }}>
              {handleShow()}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfileComponent;