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
import { nodeName } from 'jquery';

function FriendProfWidgtComponent() {
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
        <>
            {/* <div id="searchDir" /> */}
            <ul id="people-list" style={{listStyleType:'none',overflow:'auto'}}>
                {friendsList.slice(0, 8).map(friend =>
                    <li key={friend.id}>
                        <figure>
                            <img className="imgFrnd" src={friend.profilePicturePath} alt="" />
                            
                        </figure>
                        <div className="friendz-meta">
                            <a href={`/profile/${friend.email}`}>{`${friend.firstName} ${friend.lastName}`}</a>
                            
                        </div>
                    </li>
                )}
            </ul>
                
           
            
        </>
    );
}
export default FriendProfWidgtComponent;