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

function FriendProfileComponent() {
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
        <div className="viewContnr">
        <h2 style={{fontSize:'18px',fontWeight:'bold',lineHeight:'2'}}>Friends</h2>
         <ul className="nearby-contct">
             
         {friendsList.slice(0, 8).map(friend =>
        <li key={friend.id} className="friends-card bckclr grp">
                                <div className="grid-container">
                                    {/* <div className="nearly-pepls"> */}
                                    {/* <figure> */}
                                    <div class="item1">
                                        <a href={`/profile/${friend.email}`} title={`${friend.email}`}><img src={friend.profilePicturePath} alt="" /></a>
                                        {/* </figure> */}
                                    </div>
                                    {/* <div className="  "> */}
                                    <div class="item2">
                                        <p className="nameTag"><a href={`/profile/${friend.email}`} title={`${friend.email}`}>{`${friend.firstName} ${friend.lastName}`}</a></p>
										
                                    </div>
                                    
                                    {/* <div class="item6">
                                        {/* <span>Engr</span> 
                                        <i style={{ float: "right", fontSize: 35 }} class="las la-ellipsis-v"></i>
                                    </div> */}
                                    {/* <div className="pepl-info">
                                            <h4><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.firstName} ${userM.lastName}`}</a></h4>
                                            <p><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.email}`}</a></p>
                                            <span>Engr</span>
                                            <a href="#" title="#" className="add-butn more-action" data-ripple onClick={() => handleUnfollow(userM.id)}>unfollow</a>
                                        </div> */}
                                    {/* </div> */}
                                </div>
                            </li>)}</ul>
            {/* <div id="searchDir" /> */}
              {/* <div className="row" id="people-list" style={{listStyleType:'none'}}>
                {friendsList.slice(0, 8).map(friend =>
                    <div className="col-lg-6" key={friend.id}>
					<div className="bor">
                        <figure>
                            <img className="imgFrnd1" src={friend.profilePicturePath} alt="" />
                            
                        </figure>
                        <div className="friendz-meta">
                            <a href={`/profile/${friend.email}`}>{`${friend.firstName} ${friend.lastName}`}</a>
                            
                        </div>
                    </div></div>
                )}
            </div> */}
            </div>
        </>
    );
}
export default FriendProfileComponent;