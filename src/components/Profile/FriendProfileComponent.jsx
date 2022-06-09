import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import AuthService from "../../services/auth.services";
import FriendsService from "../../services/FriendService";

import ShareupInsideHeaderComponent, { handleSendNotification } from "../dashboard/ShareupInsideHeaderComponent";
import PostService from "../../services/PostService";
import settings from "../../services/Settings";
import fileStorage from "../../config/fileStorage";

function FriendProfileComponent({ email, id }) {
  let history = useHistory();

  const { user } = useContext(UserContext);
  const [refresh, setRefresh] = useState([]);

  const [friendsList, setFriendsList] = useState([]);
  const [friendsListForUser, setFriendsListForUser] = useState([]);

  const getFriendsList = async () => {
    await FriendsService.getFriends(email).then((res) => {
      setFriendsList(res.data);
    });
  };
  const getFriendsListForUser = async () => {
    await FriendsService.getFriends(user?.email).then((res) => {
      setFriendsListForUser(res.data);
    });
  };
  const removeFriend = (uid, fid) => {
    FriendsService.removeFriends(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };

  const sendFriendRequest = (uid, fid,email) => {
    FriendsService.sendRequest(uid, fid).then((res) => {
      setRefresh(res.data);
      console.log("send notification to "+email);
      console.log("sent friend request to you "+user?.firstName+user?.lastName+user?.email);
      handleSendNotification(email,'sent friend request to you',user?.firstName,user?.lastName,user?.email,"friendRequest",res.data.user.id);

       });
    
  };
  const unsendFriendRequest = (uid, fid) => {
    FriendsService.unsendRequest(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };
  const declineFriendRequest = (uid, fid) => {
    FriendsService.declineRequest(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };
  const acceptFriendRequest = (uid, fid) => {
    FriendsService.acceptRequest(uid, fid).then((res) => {
      setRefresh(res.data);
    });
  };

  const [friendRequestSent, setFriendRequestSent] = useState([]);
  const [friendRequestRecieved, setFriendRequestRecieved] = useState([]);
  const getAllFriendRequestSent = async () => {
    await UserService.getFriendRequestSent(
        user?.email
    ).then((res) => {
      setFriendRequestSent(res.data);
    });
  };

  const getAllFriendRequestRecieved = async () => {
    await UserService.getFriendRequestRecieved(
        user?.email
    ).then((res) => {
      setFriendRequestRecieved(res.data);
    });
  };
  useEffect(() => {
    const abortCtrl = new AbortController();
    const opts = { signal: abortCtrl.signal };
    getAllFriendRequestSent();
    getAllFriendRequestRecieved();
    getFriendsList();
    getFriendsListForUser();
    return () => abortCtrl.abort();
  }, [refresh]);

  return (
    <>
      <div className="viewContnr">
        <ul className="nearby-contct">
          {friendsList.map((friend) => (
            <li key={friend.id} className="friends-card bckclr grp">
              <div className="grid-container">
                <div className="item1">
                  <a
                    href={`/profile/${friend.email}`}
                    title={`${friend.email}`}
                  >
                    <img
                      src={fileStorage.baseUrl + friend.profilePicturePath}
                      alt=""
                    />
                  </a>
                </div>
                <div className="item2">
                  <p className="nameTag">
                    <a
                      href={`/profile/${friend.email}`}
                      title={`${friend.email}`}
                    >{`${friend.firstName} ${friend.lastName}`}</a>
                  </p>
                </div>
                {user.id === id ? (
                  <button
                    title=""
                    className="button common-trans-btn1"
                    style={{ width: "25%", margin: "10px", padding: "0 5px" }}
                    onClick={() => removeFriend(user.id, friend.id)}
                  >
                    Unfriend
                  </button>
                ) : user.id !== friend.id ? (
                  !friendsListForUser.some((el) => el.id === friend.id) ? (
                    friendRequestRecieved.some((el) => el.id === friend.id) ? (
                      <>
                        <button
                          title=""
                          className="button common-theme-btn1"
                          style={{
                            width: "25%",
                            margin: "10px",
                            padding: "0 5px",
                          }}
                          onClick={() =>
                            acceptFriendRequest(user.id, friend.id)
                          }
                        >
                          Accept
                        </button>
                        <button
                          title=""
                          className="button common-trans-btn1"
                          style={{
                            width: "25%",
                            margin: "10px",
                            padding: "0 5px",
                          }}
                          onClick={() =>
                            declineFriendRequest(user.id, friend.id)
                          }
                        >
                          Reject
                        </button>
                      </>
                    ) : friendRequestSent.some((el) => el.id === friend.id) ? (
                      <button
                        title=""
                        className="button common-trans-btn1"
                        style={{
                          width: "25%",
                          margin: "10px",
                          padding: "0 5px",
                        }}
                        onClick={() => unsendFriendRequest(user.id, friend.id)}
                      >
                        Cancel Request
                      </button>
                    ) : (
                      <button
                        title=""
                        className="button common-theme-btn1"
                        style={{
                          width: "25%",
                          margin: "10px",
                          padding: "0 5px",
                        }}
                        onClick={() => sendFriendRequest(user.id, friend.id,friend.email)}
                      >
                        Add Friend
                      </button>
                    )
                  ) : (
                    <>
                      <button
                        title=""
                        className="button common-trans-btn1"
                        style={{
                          width: "25%",
                          margin: "10px",
                          padding: "0 5px",
                        }}
                        onClick={() => removeFriend(user.id, friend.id)}
                      >
                        Unfriend
                      </button>
                    </>
                  )
                ) : (
                  <></>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
export default FriendProfileComponent;
