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
import fileStorage from '../../config/fileStorage';
import Frndimg from '../../images/frndimg.png'


function FriendsWidgetComponent() {
    let history = useHistory();

    const { user } = useContext(UserContext)

    const [friendsList, setFriendsList] = useState([])

    const getFriendsList = async () => {
        await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
            console.log(res.data)
            setFriendsList(res.data)
        })
    }

    useEffect(() => {
        const abortCtrl = new AbortController();
        const opts = {signal: abortCtrl.signal };
        getFriendsList()
        return () => abortCtrl.abort()
    }, [])


    return (
        friendsList.length>0?
            <div className="widget friend-widget stick-widget">
                <div className="row"><img src="../assets/images/Graphicloads-Colorful-Long-Shadow-User-group.ico"/><p className="widget-title">Friends</p></div>
                {/* <div id="searchDir" /> */}
                <ul id="people-list" className="nearby-contct" style={{marginTop:'0'}}>
                    {friendsList.slice(0, 4).map(friend =>
                        <li key={friend.id}  >
                            <div className="nearly-pepls" style={{display:'flex', width:'100%' ,padding:'10px',alignItems:'center'}}>
                            <figure style={{width:'20%'}}>
                                <img className="imgFrnd" src={fileStorage.baseUrl+friend.profilePicturePath} alt="" />
                                <span className="status f-online" />
                            </figure>
                            <div className="" style={{width:'55%',textAlign: 'left' ,paddingLeft:'10px',display:'flex',flexDirection:'column'}}>
                                <a href={`/profile/${friend.email}`}>{`${friend.firstName} ${friend.lastName}`}</a>
                                <p style={{fontSize:'12px',paddingTop:'5px'}}>{friend.numberOfFriends} Friends</p>
                            </div>
                            <button title="" className="button" style={{width:'25%',margin:'10px',padding:'0 5px'}}>Unfriend</button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        :<></>
    );
}
export default FriendsWidgetComponent;