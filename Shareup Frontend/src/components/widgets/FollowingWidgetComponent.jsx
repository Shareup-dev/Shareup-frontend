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

function FollowingWidgetComponent() {
    let history = useHistory();

    const { user } = useContext(UserContext)

    const [followers, setFollowers] = useState([]);
	const [searchedFollowers, setSearchedFollowers] = useState([]);

    const getAllFollowers = async () => {
		await UserService.getFollowers(AuthService.getCurrentUser().username).then(res => {
			setFollowers(res.data)
		})
	}

    useEffect(() => {
        getAllFollowers()
    }, [])


    return (
        <div className="widget">
            <div className="row"><img src="../assets/images/Public-Account-300x300.png"/><p className="widget-title">Who's following</p></div>
            <ul className="followers">
                {
                    followers.slice(0, 5).map((follower_user) =>
                        <li key={follower_user.id}>
                            <figure>
                                <img src={follower_user.profilePicturePath} alt="" />
                            </figure>
                            <div className="friend-meta">
                                <h4>
                                    <a href={`/profile/${follower_user.email}`} title="">{`${follower_user.firstName} ${follower_user.lastName}`}</a>
                                </h4>
                                <a href="#" title="" className="underline">Add Friend</a>
                            </div>
                        </li>
                    )
                }
            </ul>
        </div>
    );
}
export default FollowingWidgetComponent;