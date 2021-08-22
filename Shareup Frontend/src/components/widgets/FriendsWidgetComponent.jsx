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

function FriendsWidgetComponent() {
    let history = useHistory();

    const { user } = useContext(UserContext)

    const [friendsList, setFriendsList] = useState([])

    const getFriendsList = async () => {
        await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
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
        <div className="widget friend-list stick-widget">
            <div className="row"><img src="../assets/images/Graphicloads-Colorful-Long-Shadow-User-group.ico"/><p className="widget-title">Friends</p></div>
            {/* <div id="searchDir" /> */}
            <ul id="people-list" className="nearby-contct">
                {friendsList.slice(0, 8).map(friend =>
                    <li key={friend.id}  >
                        <div className="nearly-pepls">
                        <figure>
                            <img className="imgFrnd" src={friend.profilePicturePath} alt="" />
                            <span className="status f-online" />
                        </figure>
                        <div className="friendz-meta">
                            <a href={`/profile/${friend.email}`}>{`${friend.firstName} ${friend.lastName}`}</a>
                            
                        </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}
export default FriendsWidgetComponent;