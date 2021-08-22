import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import GroupService from '../../services/GroupService';

function GroupsWidgetComponent() {
    let history = useHistory();

    const { user } = useContext(UserContext)

    const [friendsList, setFriendsList] = useState([])

    const getFriendsList = async () => {
        await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
            setFriendsList(res.data)
        })
    }

    const [allGroups, setAllGroups] = useState([]);
    const [searchedGroups, setSearchedGroups] = useState([]);

    const getAllGroups = async () => {
        await GroupService.getAllGroups().then(res => {
            setAllGroups(res.data)
            setSearchedGroups(res.data)
        })
    }

    const handleSearchGroup = () => {
        console.log("Waaa")
    }

    useEffect(() => {
        const abortCtrl = new AbortController();
        const opts = {signal: abortCtrl.signal };
        getAllGroups()
        return () => abortCtrl.abort()
    }, [])


    return (

        <div className="widget friend-list stick-widget">
            <div className="row"><img src="../assets/images/b76706b9814f347e841ff15b89a5d170-instagram-discover-people-icon-by-vexels.png"/><p className="widget-title">Groups</p></div>
            {/* <div id="searchDir" /> */}
            <ul className="nearby-contct">
                {searchedGroups.map(
                    group =>
                    <li key={group.id}>
                    <div className="nearly-pepls">
                        <figure>
                            {console.log(group.groupImagePath)}
                            <a href={`/groups/${group.id}`} title="#"> <img src={group.groupImagePath ? group.groupImagePath : "https://freeiconshop.com/wp-content/uploads/edd/many-people-outline.png"} alt="" /></a>
                        </figure>
                        <div className="pepl-info">
                            <h4><a href={`/groups/${group.id}`} title="#">{`${group.name}`}</a></h4>
                            <span>{`${group.description}`}</span>

                        </div>
                    </div>
                </li>
                )}
            </ul>
        </div>
    );
}
export default GroupsWidgetComponent;