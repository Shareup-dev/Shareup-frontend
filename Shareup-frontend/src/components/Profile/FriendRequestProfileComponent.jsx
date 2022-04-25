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
function FriendRequestProfileComponent({email,id}) {
    let history = useHistory();

    const { user } = useContext(UserContext)
	const [refresh, setRefresh] = useState([]);

    const [friendsList, setFriendsList] = useState([])
    const [RecievedfriendsList, setRecievedFriendsList] = useState([])

    const getAllFriendRequestSent = async () => {
        await UserService.getFriendRequestSent(email).then(res => {
            setFriendsList(res.data)
        })
    }
    
    const getFriendRequestRecieved = async () => {
        await UserService.getFriendRequestRecieved(email).then(res => {
            setRecievedFriendsList(res.data)
        })
    }
	const acceptFriendRequest = (uid, fid) => {
		FriendsService.acceptRequest(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}

    const unsendFriendRequest = (uid, fid) => {
		FriendsService.unsendRequest(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}
    const declineFriendRequest = (uid, fid) => {
		FriendsService.declineRequest(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}
    useEffect(() => {
        const abortCtrl = new AbortController();
        const opts = {signal: abortCtrl.signal };
        getAllFriendRequestSent()
        getFriendRequestRecieved()
        return () => abortCtrl.abort()
    }, [refresh])

    const [value, setValue] = React.useState("1");

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const SentFriendRequest = () => {
        return (
          <>
            <div className="loadMore" style={{ textAlign: "center" }}>
              {friendsList && friendsList.length > 0 ? (
                <ul className="nearby-contct">
         {friendsList.map(friend =>
        <li key={friend.id} className="friends-card bckclr grp">
                                <div className="grid-container">
                                    <div class="item1">
                                        <a href={`/profile/${friend.email}`} title={`${friend.email}`}><img src={fileStorage.baseUrl+friend.profilePicture} alt="" /></a>
                                    </div>
                                    <div class="item2">
                                        <p className="nameTag"><a href={`/profile/${friend.email}`} title={`${friend.email}`}>{`${friend.firstName} ${friend.lastName}`}</a></p>
										
                                    </div>
                                    {user.id === id ?(
                                        <button title="" className="button" style={{width:'25%',margin:'10px',padding:'0 5px'}}onClick={() => unsendFriendRequest(user.id, friend.id)}>Unsend</button>
                                    ):(<>

                                    </>)}

                                
                                </div>
                            </li>)}</ul>
              ) : (
                <div class="center" style={{ padding: "20px" }}>
                No Friend Requests Sent
                </div>
              )}
            </div>
          </>
        );
      };




      const ReceivedFriendRequest = () => {
        return (
          <>
            <div className="loadMore" style={{ textAlign: "center" }}>
              {RecievedfriendsList && RecievedfriendsList.length > 0 ? (
                <ul className="nearby-contct">
         {RecievedfriendsList.map(friend =>
        <li key={friend.id} className="friends-card bckclr grp">
                                <div className="grid-container">
                                    <div class="item1">
                                        <a href={`/profile/${friend.email}`} title={`${friend.email}`}><img src={fileStorage.baseUrl+friend.profilePicture} alt="" /></a>
                                    </div>
                                    <div class="item2">
                                        <p className="nameTag"><a href={`/profile/${friend.email}`} title={`${friend.email}`}>{`${friend.firstName} ${friend.lastName}`}</a></p>
										
                                    </div>
                                    {user.id === id ?(
                                        <>
                                        <button title="" className="button" style={{width:'25%',margin:'10px',padding:'0 5px'}}onClick={() => acceptFriendRequest(user.id, friend.id)}>Accept</button>
                                        <button title="" className="button" style={{width:'25%',margin:'10px',padding:'0 5px'}}onClick={() => declineFriendRequest(user.id, friend.id)}>Reject</button>
                                         </>
                                    ):(<>

                                    </>)}

                                
                                </div>
                            </li>)}</ul>
              ) : (
                <div class="center" style={{ padding: "20px" }}>
                No Friend Requests Received
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
                    label="Resieved"
                    value="1"
                  />
                  <Tab
                    style={{ textTransform: "capitalize" }}
                    label="Sent"
                    value="2"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">{ReceivedFriendRequest()}</TabPanel>
              <TabPanel value="2">{SentFriendRequest()}</TabPanel>
            </TabContext>
          </Box>


            </div>
        </>
    );
}
export default FriendRequestProfileComponent;