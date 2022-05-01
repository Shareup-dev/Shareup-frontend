import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import GroupService from '../../services/GroupService';
import Layout from '../LayoutComponent';
import { testScript } from '../../js/script';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import { ownerDocument } from '@mui/material';
import $ from 'jquery'
import MemberComponent from './MemberComponent'

function InviteMembersComponent(props) {
    let history = useHistory();

	const { user } = useContext(UserContext)

	const [refresh, setRefresh] = useState([]);

	const [group, setGroup] = useState(props);
	const [members, setMembers] = useState(props);


	// const []

	const [allUser, setAllUser] = useState([]);
	const [friendsList, setFriendsList] = useState([]);
	const [friendsCount, setFriendsCount] = useState();
	const [moreFlag, setMoreFlag] = useState(false);
	const [invite, setInvite] = useState();

    
	const [searchedUser, setSearchedUser] = useState([]);

	const [showComp, setShowComp] = useState("members");

	const [following, setFollowing] = useState([]);
	const [followingCount, setFollowingCount] = useState([]);
	const [searchedFollowing, setSearchedFollowing] = useState([]);

	const [followers, setFollowers] = useState([]);
	const [followersCount, setFollowersCount] = useState([]);
	const [searchedFriends, setSearchedFriends] = useState([]);

	const [friendRequestSent, setFriendRequestSent] = useState([]);
	const [searchedFriendRequestSent, setSearchedFriendRequestSent] = useState([]);

	const [friendRequestRecieved, setFriendRequestRecieved] = useState([]);
	const [searchedFriendRequestRecieved, setSearchedFriendRequestRecieved] = useState([]);


    
    useEffect(() => {
        setMembers(props.members)
        setGroup(props.group)
        getFriendsList()
    }, [props])
    $(document).mouseup(function(e) 
{
    var container = $(".moredrpdwn");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        setMoreFlag(false)
        // console.log(moreFlag)
    }
    }); 
    const getFriendsList = async () => {
        await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
            setFriendsList(res.data)
            setSearchedUser	(res.data)
        })
    }

    
	const addFriendsId = (uid, fid) => {
		console.log("uid: " + uid + " fid: " + fid)
		FriendsService.addFriends(uid, fid).then(res => {
			window.location.reload();
		})
	}
    const addAdmin = (memberId) =>{
        GroupService.addAdmin( memberId ,group.id ).then(res => {
			setRefresh(res.data)
		})
    }
    const leaveGroup = () =>{
        GroupService.leaveGroup(user.id, group.id).then(res => {
			setTimeout(function () { history.push(`/groups`) }, 2000);
		})
    }
    const removeMember = (memberId) =>{
        GroupService.removeMember(memberId).then(res => {
			setRefresh(res.data);
		})
    }
    const inviteMember = (fId) =>{
        GroupService.inviteMember(group.id,user.id,fId).then(res => {
			setInvite(res.data.requestStatus)
            setRefresh(res.data);
            
		})
    }
    const handleSearchedFriends = (event) => {
		if (event.target.value === "") {
			setFriendsList(friendsList)
		} else {
			let temp = []
			friendsList.map(u => {
				const email = u.email.toLowerCase()
				const firstname = u.firstName.toLowerCase()
				const lastname = u.lastName.toLowerCase()
				const searchedvalue = event.target.value.toLowerCase()
				
				if (email.includes(searchedvalue) || firstname.includes(searchedvalue) || lastname.includes(searchedvalue)) {
					temp.push(u)
				}
			})
			setFriendsList(temp)
			console.log(temp)
		}
	}
    // console.log(friendsList)
    return(
        <div className="">
            <div className="">
			    <div className="central-meta swap-pg-cont grp-pg-invite-cont">
				    <div className="frnds">
                        <div className='fw-6  abt-title no-brdr-btm  clr-blk'>Invite people</div>
                        <div class="friends-search-container grp-search">
                            {/* <i class="las la-search"></i> */}
                            <input className="friend-search" type="text" id="header-search" placeholder="Search Friends" name="s" onChange={handleSearchedFriends} />
                        </div>
                        <div className="tab-pane active fade show " id="following">
                            <ul className="nearby-contct" style={{marginTop:'15px'}}>
                            {
                                friendsList&&friendsList.length>0?
                                // friendsList.map((friend)=>{
                                    friendsList.map(friend=> 
                                        members.map(member=> 
                                           friend.id !== member.id?
                                                <li key={friend.id} className="friends-card grp">
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
                                                            <div  style={{fontSize:'12px',paddingTop:'5px'}}>10 Mutual friends</div>
                                                        </div>
                                                        <div className="item4">
                                                            {
                                                                friendsList.some(friend=>user.id!==friend.id)
                                                                ?<a href="#"  className="add-butn more-action" data-ripple onClick={() => inviteMember(friend.id)}>Invite </a>
                                                                : user.id!==user.id&&<a href="#"  className="add-butn more-action" data-ripple >Invited </a>
                                                                    }
                                                            {/* <div>  <i style={{ float: "right", fontSize: 35 }} class="las la-ellipsis-v"></i></div> */}
                                                        </div>
                                                        {/* <div className="pepl-info">
                                                                <h4><a href={`/profile/${member.email}`} title={`${userM.email}`}>{`${userM.firstName} ${userM.lastName}`}</a></h4>
                                                                <p><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.email}`}</a></p>
                                                                <span>Engr</span>
                                                                <a href="#" title="#" className="add-butn more-action" data-ripple onClick={() => handleUnfollow(userM.id)}>unfollow</a>
                                                            </div> */}
                                                        {/* </div> */}
                                                    </div>
                                                </li>
                                                :null
                                            )
                                        )
                                
                            : <div>No user found</div>
                            }
                            </ul>
                        </div>
                    
                    </div>
                </div>
            </div>
            
        </div>
        
    )
}
export default InviteMembersComponent;