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
        followers.length>0?
            <div className="widget sidebar-flwrs">
                <div className="row">
                <p className="widget-title" >Who's following</p></div>
                <ul className="followers">
                    {
                        followers.slice(0, 4).map((follower_user) =>
                            <li key={follower_user.id} style={{display:'flex', width:'100%' ,padding:'10px',alignItems:'center'}}>
                                <figure style={{width:'20%'}}>
                                    <img src={ fileStorage.baseUrl+follower_user.profilePicturePath} alt="" />
                                </figure>
                                <div className="" style={{width:'55%',textAlign: 'left' ,paddingLeft:'10px',display:'flex',flexDirection:'column'}}>
                                    <h4>
                                        <a href={`/profile/${follower_user.email}`} title="">{`${follower_user.firstName} ${follower_user.lastName}`}</a>
                                    </h4>
                                    <p style={{fontSize:'12px',paddingTop:'5px'}}>{follower_user.numberOfFollowers} Followers</p>
                                </div>
                                <button title="" className="button common-theme-btn1" style={{width:'25%',margin:'10px',padding:'0 5px'}}>Unfollow</button>

                            </li>
                        )
                    }
                </ul>
            </div>
            :<></>
    );
}
export default FollowingWidgetComponent;