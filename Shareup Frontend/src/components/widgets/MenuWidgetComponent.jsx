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

function MenuWidgetComponent() {
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
        <div className="widget navmenu">
        <div className="row"><img src="../assets/images/menu-1899421-1606840.png" /><p className="widget-title">Menu</p></div>
        <div><ul className="naves">
            <li>
                <div style={{ marginRight: "10px", display: "inline" }}><i className="ti-clipboard" /></div>
                <a href="/newsfeed" title="#">ShareFeed</a>
            </li>
            <li>
                <div style={{ marginRight: "10px", display: "inline" }}><i className="ti-write" /></div>
                <a href="#" title="#">ShareTime</a>
            </li>
            <li>
                <div style={{ marginRight: "10px", display: "inline" }}><i className="ti-comments" /></div>
                <a href="#" title="#">Messages</a>
            </li>
            <li>
                <div style={{ marginRight: "10px", display: "inline" }}><i className="ti-user" /></div>
                <a href="/friends" title="#">ShareFriends</a>
            </li>
            <li>
                <div style={{ marginRight: "10px", display: "inline" }}><i className="ti-user" /><p style={{ fontSize: "18px", color: "blue", marginLeft: "-8px", display: "inline" }}>+</p></div>

                <a href="/friends" title="#">Add Friends</a>
            </li>
            <li>
                <div style={{ marginRight: "2px", display: "inline" }}><i className="ti-user" /><i className="ti-user" style={{ marginLeft: "-10px" }} /></div>
                <a href="/groups" title="#">ShareGroups</a>
            </li>
        </ul></div>
    </div>
    );
}
export default MenuWidgetComponent;