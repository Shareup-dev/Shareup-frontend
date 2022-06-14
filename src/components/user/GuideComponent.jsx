import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import GroupService from "../../services/GroupService";
import Layout from "../LayoutComponent";
import AuthService from "../../services/auth.services";
import UserService from "../../services/UserService";
import FriendsService from "../../services/FriendService";
import settings from "../../services/Settings";
import fileStorage from "../../config/fileStorage";
import { handleSendNotification } from "../dashboard/ShareupInsideHeaderComponent";
function GuideComponent() {
  let history = useHistory();

  const { user } = useContext(UserContext);

  const [refresh, setRefresh] = useState([]);

  const [allUser, setAllUser] = useState([]);
  const getAllUser = async () => {
    await UserService.getUsers().then((res) => {
      setAllUser(res.data);
      // setSearchedUser(res.data)
    });
  };

  const [friendsList, setFriendsList] = useState([]);
  const getFriendsList = async () => {
    await FriendsService.getFriends(AuthService.getCurrentUser().username).then(
      (res) => {
        setFriendsList(res.data);
      }
    );
  };

  const [friendRequestSent, setFriendRequestSent] = useState([]);
  const [friendRequestRecieved, setFriendRequestRecieved] = useState([]);
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

  const sendFriendRequest = (uid, fid,email) => {
    FriendsService.sendRequest(uid, fid).then((res) => {
      setRefresh(res.data);
      console.log("sent friend request to you guide component"+user?.firstName+user?.lastName+user?.email);

      handleSendNotification(email,'sent friend request to you',user?.firstName,user?.lastName,user?.email,"friendRequest",res.data.user.id);

    });
  };

  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
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
  const handleFollow = (uid,email) => {
    UserService.follow(user.id, uid).then((res) => {
      setRefresh(res.data);
      console.log("follow you guide component"+user?.firstName+user?.lastName+user?.email);

      handleSendNotification(email,'follows you',user?.firstName,user?.lastName,user?.email,"follow",res.data.user.id);

    });
  };

  const handleUnfollow = (uid) => {
    UserService.unfollow(user.id, uid).then((res) => {
      setRefresh(res.data);
    });
  };

  const removeFriend = (uid, fid) => {
    FriendsService.removeFriends(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };

  const [allGroups, setAllGroups] = useState([]);
  const getAllGroups = async () => {
    await GroupService.getAllGroups().then((res) => {
      setAllGroups(res.data);
      // setSearchedGroups(res.data)
    });
  };

  const [myGroups, setMyGroups] = useState([]);
  const getMyGroups = async () => {
    await GroupService.getGroupByCurrentUser(user.email).then((res) => {
      setMyGroups(res.data);
      // setSearchedMyGroups(res.data)
    });
  };

  const handleLeaveGroup = (group_id) => {
    GroupService.leaveGroup(user.id, group_id).then((res) => {
      setRefresh(res.data);
    });
  };

  const handleJoinGroup = (group_id) => {
    GroupService.joinGroup(user.id, group_id).then((res) => {
      setRefresh(res.data);
    });
  };

  const handleRedirect = () => {
    // let user = {};
    // user.newUser = false
    // UserService.editProfile(user.email,user).then((res)=>{

      setTimeout(() => window.location.reload(), 2000);
    // })
    //setTimeout(() => history.push('/newsfeed'), 2000)
  };

  const [step, setStep] = useState(0);

  const activeOrNot = (num) => {
    return num <= step ? "active" : "";
  };

  const validateStep = (num) => {
    let validated = true;
    // if (!groupName) {
    //     setGroupNameError("Please Ensure You Write The Group Name")
    //     validated = false
    // }
    // if (!groupDesc) {
    //     setGroupDescError("Please Ensure You Write The Group Description")
    //     validated = false
    // }
    // // if()
    // if (validated) {
    //     setStep(num)
    // }

    setStep(num);
  };
  const removeFriendFromList = async (friend) =>{
    const filt = await allUser.filter((frnd) => frnd.id !== friend)
    await setAllUser(filt);
    // await console.log(allUser,friend)
  }
  const removeFromGroup = async (group) => {
    const filt = await allGroups.filter((grp) => grp.id !== group)
    await setAllGroups(filt);
    // await console.log(allUser,friend)
  }
  const show = () => {
    if (step === 0) {
      return (
        <fieldset>
          <div className="form-card">
            <ul className="nearby-contct">
              {allUser.slice(0, 8).map((userF) => (
                user.id !== userF.id ? 
                  <li className="sendrqstli" key={userF.id}>
                    <div className="grid-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <div className="item1" style={{ width: '20%' }}>
                        <img
                          src={fileStorage.baseUrl + userF.profilePicturePath}
                          alt=""
                        />
                        {/* <span className="status f-online" /> */}
                      </div>
                      <div
                        className="item2"
                        style={{ paddingTop: "15px", paddingLeft: "0px", width: '35%' }}
                      >
                        <p className="nameTag">
                          <a
                            href={`/profile/${userF.email}`}
                          >{`${userF.firstName} ${userF.lastName}`}</a>
                        </p>
                        <p2>
                          <p>Recommended</p>
                        </p2>
                      </div>
                      <div
                        style={{
                          display: "inline-flex",
                          paddingTop: "25px",
                          width: '35%',
                          justifyContent:'right'
                        }}
                      >
                        {user.id !== userF.id ? (
                          !friendsList.some((el) => el.id === userF.id) ? (
                            friendRequestRecieved.some(
                              (el) => el.id === userF.id
                            ) ? (
                              <>
                                <a
                                  href="#"
                                  className="button common-theme-btn1"

                                  onClick={() =>
                                    acceptFriendRequest(user.id, userF.id)
                                  }
                                >
                                  Accept
                                </a>
                                <a
                                  href="#"
                                  className="button common-trans-btn1"
                                  style={{
                                    color: "#000000",
                                    background: "#EAEAEA",
                                    fontSize: "12px",
                                  }}
                                  onClick={() =>
                                    declineFriendRequest(user.id, userF.id)
                                  }
                                >
                                  Decline
                                </a>
                                {/* <br></br>
                                                          <br></br> */}
                              </>
                            ) : friendRequestSent.some(
                              (el) => el.id === userF.id
                            ) ? (
                              <a
                                href="#"
                                className="button common-trans-btn1"
                                onClick={() =>
                                  unsendFriendRequest(user.id, userF.id)
                                }
                              >
                                Unsend Request
                              </a>
                            ) : (
                              <a
                                href="#"
                                className="button common-theme-btn1"
                               
                                onClick={() =>
                                  sendFriendRequest(user.id, userF.id,userF.email)
                                }
                              >
                                Send Request
                              </a>
                            )
                          ) : (
                            <>
                              <a
                                href="#"
                                className="button common-trans-btn1"
                                onClick={() => removeFriend(user.id, userF.id)}
                              >
                                Unfriend
                              </a>

                              <p style={{ fontSize: '15px' }}>Already a friend</p>
                            </>
                          )
                        ) : null}

                        
                      </div>
                      <div
                        style={{width:'10%',display:'flex',alignItems:'center'}}
                          onClick={()=>removeFriendFromList(userF.id)}
                          >
                        <i
                          className="las la-times"
                          style={{
                            fontSize: "13px",
                            padding: "6px",
                            color: "black",
                          }}
                        ></i>
                      </div>

                      {/* <button onClick={() => sendFriendRequest(userF.id)}>Hi</button> */}
                    </div>
                  </li>
                  :null
              ))}
            </ul>
          </div>
          <input
            type="button"
            name=""
            className="action-button"
            defaultValue="Next Step"
            onClick={() => validateStep(1)}
          />
        </fieldset>
      );
    }

    if (step === 1) {
      return (
        <fieldset>
          <div className="form-card">
            <ul className="nearby-contct">
              {allUser.slice(0, 8).map((userF) => (
                user.id !== userF.id ?
                <li className="sendrqstli" key={userF.id}>
                  <div className="grid-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <div className="item1" style={{ width: '20%' }}>
                      <img
                        src={fileStorage.baseUrl + userF.profilePicturePath}
                        alt=""
                      />
                      {/* <span className="status f-online" /> */}
                    </div>
                    <div
                      className="item2"
                      style={{ paddingTop: "15px", paddingLeft: "0px", width: '35%' }}
                    >
                      <p className="nameTag">
                        <a href={`/profile/${userF.email}`}>
                          {`${userF.firstName} ${userF.lastName}`}
                        </a>
                      </p>
                      <p2>
                        <p>3 mutual</p>
                      </p2>
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        paddingTop: "25px",
                        width: '35%',
                        justifyContent:'right'
                      }}
                    >
                      {user.id !== userF.id ? (
                        !following.some((el) => el.id === userF.id) ? (
                          <a
                            href="#!"
                            className="button common-theme-btn1"

                            onClick={() => handleFollow(userF.id,userF.email)}
                          >
                            Follow
                          </a>
                        ) : (
                          <a
                            href="#!"
                            className="button common-trans-btn1"
                            
                            onClick={() => handleUnfollow(userF.id)}
                          >
                            Unfollow
                          </a>
                        )
                      ) : null}
                    </div>
                    <div
                        style={{width:'10%',display:'flex',alignItems:'center'}}
                          onClick={()=>removeFriendFromList(userF.id)}
                          >
                        <i
                          className="las la-times"
                          style={{
                            fontSize: "13px",
                            padding: "6px",
                            color: "black",
                          }}
                        ></i>
                      </div>
                  </div>
                </li>
                :null
              ))}
            </ul>
          </div>
          <input
            type="button"
            name="previous"
            className="previous action-button-previous"
            defaultValue="Previous"
            onClick={() => setStep(0)}
          />
          <input
            type="button"
            name=""
            className="action-button"
            defaultValue="Next Step"
            onClick={() => setStep(2)}
          />
        </fieldset>
      );
    }
    if (step === 2) {
      return (
        <fieldset>
          <div className="form-card">
            <ul className="nearby-contct">
              {allGroups.slice(0, 8).map((group) => (
                <li key={group.id} className="sendrqstli">
                  <div className="grid-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <div className="item1" style={{ width: '20%' }}>
                      <img
                        src={
                          group.groupImagePath
                            ? fileStorage.baseUrl + group.groupImagePath
                            : "https://freeiconshop.com/wp-content/uploads/edd/many-people-outline.png"
                        }
                        alt=""
                        width="56px"
                      />
                    </div>

                    <div
                      className="item2"
                      style={{ paddingTop: "15px", paddingLeft: "0px",width:'35%' }}
                    >
                      <p className="nameTag">
                        <a href={`/groups/${group.id}`}>{`${group.name}`}</a>
                      </p>
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        paddingTop: "25px",
                        paddingRight: "10px",
                        width: '35%'
                      }}
                    >
                      {group.members.some((el) => el.id === user.id) ? (
                        <a
                          href="#!"
                          className="button common-trans-btn1"
                          onClick={() => handleLeaveGroup(group.id)}
                        >
                          Leave Group
                        </a>
                      ) : (
                        <a
                          href="#!"
                          className="button common-theme-btn1"
                          
                          onClick={() => handleJoinGroup(group.id)}
                        >
                          Join Group
                        </a>
                      )}

                      
                    </div>
                    <div
                        style={{width:'10%',display:'flex',alignItems:'center'}}
                          onClick={()=>removeFromGroup(group.id)}
                          >
                        <i
                          className="las la-times"
                          style={{
                            fontSize: "13px",
                            padding: "6px",
                            color: "black",
                          }}
                        ></i>
                      </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <input
            type="button"
            name="previous"
            className="previous action-button-previous"
            defaultValue="Previous"
            onClick={() => setStep(1)}
          />
          <input
            type="button"
            name=""
            className="action-button"
            defaultValue="Next Step"
            onClick={() => {
              setStep(3);
              // handleCreateGroup()
            }}
          />
        </fieldset>
      );
    }
    if (step === 3) {
      return (
        <fieldset>
          <div className="form-card">
            <h2 className="fs-title text-center">You Are Setup !</h2> <br />
            <br />
            <div className="row justify-content-center">
              <div className="col-3">
                {" "}
                <img
                  src="https://img.icons8.com/color/96/000000/ok--v2.png"
                  className="fit-image"
                />{" "}
              </div>
            </div>{" "}
            <br />
            <br />
            <div className="row justify-content-center">
              <div className="col-7 text-center">
                {/* <h5>You Are Set</h5> */}
                <p style={{ color: "blue" }}>
                  You will be redirected shortly...
                </p>
                {handleRedirect()}
              </div>
            </div>
          </div>
        </fieldset>
      );
    }
  };

  useEffect(() => {
    getAllUser();
    getAllGroups();
    getFriendsList();
    getAllFriendRequestSent();
    getAllFriendRequestRecieved();
    getAllFollowing();
    getAllFollowers();
  }, [refresh]);

  return (
    <Layout user={user}>
      <div className="col-lg-6">
        <div className="central-meta create-group">
          <div className="card px-0 pt-4 pb-0 mt-3 mb-3">
            <div
              className="grid-container"
              style={{
                gridTemplateColumns: "max-content",
                textAlign: "left",
                fontWeight: "bold",
                paddingLeft: "13%",
                paddingRight: "13%",
                fontColor: "#000000",
              }}
            >
              <div className="item1">
                <img src={fileStorage.baseUrl + user.profilePicturePath} alt="" />
                {/* <span className="status f-online" /> */}
              </div>
              <div
                className="item2"
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "black",
                  paddingTop: "22px",
                }}
              >
                <h4>
                  {" "}
                  <strong>Are you new?</strong>
                </h4>

                <h4>Here are some suggestions</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mx-0">
                <div style={{ paddingLeft: "12%", paddingRight: "12%" }}>
                  <form id="msform">
                    {/* progressbar */}
                    <ul id="progressbar">
                      <li id="account" className={activeOrNot(0)}>
                        <strong>{`Friends`}</strong>
                      </li>
                      <li id="personal" className={activeOrNot(1)}>
                        <strong>Follower</strong>
                      </li>
                      <li id="payment" className={activeOrNot(2)}>
                        <strong>Groups</strong>
                      </li>
                      <li id="confirm" className={activeOrNot(3)}>
                        <strong>Success</strong>
                      </li>
                    </ul>{" "}
                    {/* fieldsets */}
                    {show()}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default GuideComponent;
