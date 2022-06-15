import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import PostService from '../../services/PostService';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import Nav from "react-bootstrap/Nav";
import { textAlign } from "@mui/system";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext } from "@mui/lab";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { handleSendNotification } from "../dashboard/ShareupInsideHeaderComponent";
function FriendFollowProfileComponent({email,id}) {
    let history = useHistory();

    const { user } = useContext(UserContext)
	const [refresh, setRefresh] = useState([]);

    const [FollowingList, setFollowingList] = useState([])
    const [following, setFollowingUser] = useState([])
    const [followersList, setFollowersList] = useState([])
    const [followStatus, setFollowStatus] = useState(null)
    const [followStatus2, setFollowStatus2] = useState([])


    const getAllFollowers = async () => {
        await UserService.getFollowers(email).then(res => {
          setFollowersList(res.data)
        })
    }

    const getAllFollowing = async () => {
      await UserService.getFollowing(email).then(res => {
        setFollowingList(res.data)
      })
  }
  const getAllFollowingUser = async () => {
    await UserService.getFollowing(user?.email).then(
      (res) => {
        setFollowingUser(res.data);
      }
    );
  };




  const getFollowStatus = (fid) => {
    UserService.getFollowStatus(user?.id,fid).then((res) => {
      setFollowStatus(res.data)
    })
  }
  const getFollowStatus2 = (fid) => {
    UserService.getFollowStatus(user?.id, fid).then((res) => {
      setFollowStatus2(res.data)
    })
  }
	const handleFollow = (fid) => {
		UserService.follow(user?.id, fid).then(res => {
			setRefresh(res.data)
      console.log("follows you from friend follow profile component"+user?.firstName+user?.lastName+user?.email);
      handleSendNotification(fid,'follows you',user?.firstName,user?.lastName,user?.email,"follow",res.data.id);

		})
	}
	const handleUnfollow = (fid) => {
		UserService.unfollow(user?.id, fid).then(res => {
			setRefresh(res.data)
		})
	}





    useEffect(() => {
        const abortCtrl = new AbortController();
        const opts = {signal: abortCtrl.signal };
        getAllFollowing();
        getAllFollowingUser();
        getAllFollowers();
        return () => abortCtrl.abort()
    }, [refresh])

    const [value, setValue] = React.useState("1");

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const FollowingFriends = () => {
        return (
          <>
            <div className="loadMore" style={{ textAlign: "center" }}>
              {FollowingList && FollowingList.length > 0 ? (
                <ul className="nearby-contct">
                      {FollowingList.map(friend =>
                      <li key={friend.id} className="friends-card bckclr grp">
                                              <div className="grid-container">
                                                  <div className="item1">
                                                      <a href={`/profile/${friend.email}`} title={`${friend.email}`}><img src={fileStorage.baseUrl+friend.profilePicturePath} alt="" /></a>
                                                  </div>
                                                  <div className="item2">
                                                      <p className="nameTag"><a href={`/profile/${friend.email}`} title={`${friend.email}`}>{`${friend.firstName} ${friend.lastName}`}</a></p>
                                  
                                                  </div>
                                                  {user.id !== friend.id ? (
                                      !following.some((el) => el.id === friend.id) ? (
                                        <button title="" className="button common-theme-btn1" style={{width:'25%',margin:'10px',padding:'0 5px'}}
                                          onClick={() => handleFollow(friend.id)}
                                        >
                                          Follow
                                        </button>
                                      ) : (
                                        <button title="" className="button common-trans-btn1" style={{width:'25%',margin:'10px',padding:'0 5px'}}
                                          onClick={() => handleUnfollow(friend.id)}
                                        >
                                          Unfollow
                                        </button>
                                      )
                                    ) : null}

                                              
                                              </div>
                                          </li>)}</ul>
                            ) : (
                              <div className="center" style={{ padding: "20px" }}>
                              No Following Friends
                              </div>
                            )}
                          </div>
                        </>
                      );
                    };
                    const FollowersFriends = () => {
                      return (
                        <>
                          <div className="loadMore" style={{ textAlign: "center" }}>
                            {followersList && followersList.length > 0 ? (
                              <ul className="nearby-contct">
                      {followersList.map(friend =>
                      <li key={friend.id} className="friends-card bckclr grp">
                                <div className="grid-container">
                                    <div className="item1">
                                        <a href={`/profile/${friend.email}`} title={`${friend.email}`}><img src={fileStorage.baseUrl+friend.profilePicturePath} alt="" /></a>
                                    </div>
                                    <div className="item2">
                                        <p className="nameTag"><a href={`/profile/${friend.email}`} title={`${friend.email}`}>{`${friend.firstName} ${friend.lastName}`}</a></p>
										
                                    </div>
                                    {user.id !== friend.id ? (
                        !following.some((el) => el.id === friend.id) ? (
                          <button title="" className="button common-theme-btn1" style={{width:'25%',margin:'10px',padding:'0 5px'}}
                            onClick={() => handleFollow(friend.id)}
                          >
                            Follow
                          </button>
                        ) : (
                          <button title="" className="button common-trans-btn1" style={{width:'25%',margin:'10px',padding:'0 5px'}}
                            onClick={() => handleUnfollow(friend.id)}
                          >
                            Unfollow
                          </button>
                        )
                      ) : null}

                                
                                </div>
                            </li>)}</ul>
              ) : (
                <div className="center" style={{ padding: "20px" }}>
                No Followers Friends
                </div>
              )}
            </div>
          </>
        );
      };


    return (
        <>
        <div className="viewContnr">
        <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    style={{ textTransform: "capitalize" }}
                    label="Followers"
                    value="1"
                  />
                  <Tab
                    style={{ textTransform: "capitalize" }}
                    label="Following"
                    value="2"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">{FollowersFriends()}</TabPanel>
              <TabPanel value="2">{FollowingFriends()}</TabPanel>
            </TabContext>
          </Box>


            </div>
        </>
    );
}
export default FriendFollowProfileComponent;