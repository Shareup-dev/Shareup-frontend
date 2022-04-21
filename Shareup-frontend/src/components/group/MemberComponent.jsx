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

function MembersComponent(props) {
    let history = useHistory();

	const { user } = useContext(UserContext)

	const [refresh, setRefresh] = useState([]);

	const [group, setGroup] = useState(props);
	const [member, setMember] = useState(props);


	// const []

	const [allUser, setAllUser] = useState([]);
	const [friendsList, setFriendsList] = useState([]);
	const [friendsCount, setFriendsCount] = useState();
	const [moreFlag, setMoreFlag] = useState(false);

    
	const [searchedUser, setSearchedUser] = useState([]);

	const [showComp, setShowComp] = useState("members");

	const [following, setFollowing] = useState([]);
	const [followingCount, setFollowingCount] = useState([]);
	const [searchedFollowing, setSearchedFollowing] = useState([]);

	const [followers, setFollowers] = useState([]);
	const [followersCount, setFollowersCount] = useState([]);
	const [searchedFollowers, setSearchedFollowers] = useState([]);

	const [friendRequestSent, setFriendRequestSent] = useState([]);
	const [searchedFriendRequestSent, setSearchedFriendRequestSent] = useState([]);

	const [friendRequestRecieved, setFriendRequestRecieved] = useState([]);
	const [searchedFriendRequestRecieved, setSearchedFriendRequestRecieved] = useState([]);


    
    useEffect(() => {
        setMember(props.member)
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
        console.log(moreFlag)
    }
    }); 
    const getFriendsList = async () => {
        await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
            setFriendsList(res.data)
            setSearchedUser	(res.data)
        })
    }

    
	const addFriendsId = ( fid) => {
		console.log("uid: " + user.id + " fid: " + fid)
		FriendsService.addFriends(user.id, fid).then(res => {
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
    const removeMember = (aid,gid,memberId) =>{
        GroupService.removeMember(aid,gid,memberId).then(res => {
			setRefresh(res.data);
		})
    }
    return(
        member&& group&&
            <li key={member.id} className="friends-card grp">
            <div className="grid-container">
                {/* <div className="nearly-pepls"> */}
                {/* <figure> */}
                <div class="item1">
                    <a href={`/profile/${member.email}`} title={`${member.email}`}><img src={fileStorage.baseUrl+member.profilePicturePath} alt="" /></a>
                    {/* </figure> */}
                </div>
                {/* <div className="  "> */}
                <div class="item2">
                    <p className="nameTag"><a href={`/profile/${member.email}`} title={`${member.email}`}>{`${member.firstName} ${member.lastName}`}</a></p>
                    {group&&group.owner&&member.id === group.owner.id 
                    ?<div  style={{fontSize:'12px',paddingTop:'5px',color:'rgb(3, 51, 71)',display:'inline-block',background:'#f0f0f0'}}>Admin</div>
                    : group.admins&&group.admins.length&&group.admins.some(admin=>admin.id==member.id)
                        ?<div  style={{fontSize:'12px',paddingTop:'5px',color:'rgb(3, 51, 71)',display:'inline-block',background:'#f0f0f0'}}>Admin</div>
                        :null
                        
                    }
                    <div  style={{fontSize:'12px',paddingTop:'5px'}}>10 Mutual friends</div>
                </div>
                <div className="item4">
                    {
                        (group&&group.owner&&group.owner.id!==user.id)
                        ?friendsList.some(friend=>member.id!==friend.id)?
                            <a href="#"  className="add-butn more-action" data-ripple onClick={() => addFriendsId(member.id)}>Add Friend </a>
                            : member.id!==user.id&&<a href="#"  className="add-butn more-action" data-ripple >Message </a>
                        :null    }
                    {/* <div>  <i style={{ float: "right", fontSize: 35 }} class="las la-ellipsis-v"></i></div> */}
                </div>
                <div class="item5">
                            
                    { group.owner&&member.id!== group.owner.id || group.admins&&group.admins.length>0&&group.admins.some(admin=>member.id !== admin.id)?
                        <div className="pos-rel">
                        <i style={{ float: "right", fontSize: 25 }} class="las la-ellipsis-v" onClick={()=>setMoreFlag(!moreFlag)}></i>
                        {moreFlag
                        ?   <ul className="moredrpdwn">
                                {member.id===user.id?<li onClick={() => leaveGroup(member.id)}>Leave group</li>:null}
                                {/* {(group.owner.id===user.id)?<li onClick={() => removeMember(group.owner.id,member.id)}>Remove from group</li>:null} */}
                                {group.owner.id===user.id
                                ?<li onClick={() => removeMember(group.owner.id,group.id,member.id)}>Remove from group</li>
                                
                                :
                                    group.admins&&group.admins.length>0
                                    ?group.admins.some(admin=>
                                    (admin.id !== member.id && admin.id!==group.owner.id)
                                    ?null
                                    :(admin.id === user.id && admin.id===group.owner.id)
                                        ? (member.id!==group.owner.id)
                                            ?<li onClick={() => removeMember(admin.id,group.id,member.id)}>Remove from group</li>
                                            :null
                                        :''):
                                    null
                                }
                                {(group.owner.id===user.id)
                                ?group.admins&&group.admins.length>0
                                    ?
                                        group.admins.some(admin=>(admin.id!==member.id)
                                        ?<li onClick={() => addAdmin(member.id)}>Add as admin</li>
                                        :null
                                        )
                                    :<li onClick={() => addAdmin(member.id)}>Add as admin</li>

                                :group.admins&&group.admins.length>0
                                    ?group.admins.some(admin=>(admin.id!==member.id)
                                        ?<li onClick={() => addAdmin(member.id)}>Add as admin</li>
                                        :null)
                                    :null
                                }

                            </ul>
                        :   null}
                    </div>
                    :null}  
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
    )
}
export default MembersComponent;