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
	const [members, setMembers] = useState(props);


	// const []

	const [allUser, setAllUser] = useState([]);
	const [friendsList, setFriendsList] = useState([]);
	const [friendsCount, setFriendsCount] = useState();
	const [moreFlag, setMoreFlag] = useState(false);

	const [searchedMember, setSearchedMember] = useState([]);
    
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


	const addFriendsId = (uid, fid) => {
		console.log("uid: " + uid + " fid: " + fid)
		FriendsService.addFriends(uid, fid).then(res => {
			window.location.reload();
		})
	}

	const removeFriend = (uid, fid) => {
		console.log("uid: " + uid + " fid: " + fid)
		FriendsService.removeFriends(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}

	const handleSearchedMembers = (event) => {
		if (event.target.value === "") {
			setMembers(members)
		} else {
			let temp = []
			group.members.map(u => {
				const email = u.email.toLowerCase()
				const firstname = u.firstName.toLowerCase()
				const lastname = u.lastName.toLowerCase()
				const searchedvalue = event.target.value.toLowerCase()
				
				if (email.includes(searchedvalue) || firstname.includes(searchedvalue) || lastname.includes(searchedvalue)) {
					temp.push(u)
				}
			})
			setMembers(temp)
			console.log(temp)
		}

	}


	const handleSearchedFollowers = (event) => {
		if (event.target.value === "") {
			// setMembers(followers)
		} else {
			let temp = []
			followers.map(u => {
				const email = u.email.toLowerCase()
				const firstname = u.firstName.toLowerCase()
				const lastname = u.lastName.toLowerCase()
				const searchedvalue = event.target.value.toLowerCase()
				
				if (email.includes(searchedvalue) || firstname.includes(searchedvalue) || lastname.includes(searchedvalue)) {
					temp.push(u)
				}
			})
			setMembers(temp)
			console.log(temp)
		}
	}

	const acceptFriendRequest = (uid, fid) => {
		FriendsService.acceptRequest(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}

	const declineFriendRequest = (uid, fid) => {
		FriendsService.declineRequest(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}

	const unsendFriendRequest = (uid, fid) => {
		FriendsService.unsendRequest(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}

	const sendFriendRequest = (uid, fid) => {
		FriendsService.sendRequest(uid, fid).then(res => {
			setRefresh(res.data)
		})
	}



	const handleFollow = (uid) => {
		UserService.follow(user.email, uid).then(res => {
			setRefresh(res.data)
		})
	}

	const handleUnfollow = (uid) => {
		UserService.unfollow(user.email, uid).then(res => {
			setRefresh(res.data)
		})
	}

	const handleShowComp = () => {
		return MembersComponentFunction()
	}

	
    const addAdmin = (memberId) =>{
        GroupService.addAdmin(group.id,memberId).then(res => {
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
    
    const MembersComponentFunction = () => {
        return (
            <div className="">
                {/* <div className='fw-6  abt-title no-brdr-btm  clr-blk'>Members<span>{group.members&&group.members.length?' '+ group.members.length:''}</span></div> */}
                <div class="friends-search-container grp-search">
                    {/* <i class="las la-search"></i> */}
                    <input className="friend-search" type="text" id="header-search" placeholder="Search Members" name="s" onChange={handleSearchedMembers} />
                </div>
                <div className="tab-pane active fade show " id="following">
                    <ul className="nearby-contct" style={{marginTop:'15px'}}>
                        {members&&members.length>0&&
                        members.map(
                            member =>
                                <MemberComponent member={member} group={group}/>
                        )}
                    </ul>
                    <div className="lodmore"><button className="btn-view btn-load-more" /></div>
                </div>
            </div >
        );
    }

    const FollowersComponentFunction = () => {
        return (
            <div className="tab-content">
                <div class="friends-search-container grp-search">
                    {/* <i class="las la-search"></i> */}
                    <input className="friend-search" type="text" id="header-search" placeholder="Search Followers" name="s" onChange={handleSearchedFollowers} />
                </div>
                {/* <input type="text" id="header-search" placeholder="Search Followers" name="s" onChange={handleSearchedFollowers} /> */}
                <div className="tab-pane active fade show " id="following">
                    <ul className="nearby-contct" style={{marginTop:'15px'}}>
                        {searchedFollowers.map(
                            userM =>
                                <li key={userM.id} className="friends-card grp">
                                    <div className="grid-container">
                                        {/* <div className="nearly-pepls"> */}
                                        {/* <figure> */}
                                        <div class="item1">
                                            <a href={`/profile/${userM.email}`} title="#"><img src={userM.profilePicturePath} alt="" /></a>
                                            {/* </figure> */}
                                        </div>
                                        {/* <div className="  "> */}
                                        <div class="item2">
                                            <p className="nameTag"><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.firstName} ${userM.lastName}`}</a></p>
                                            {/* <button className="friends-button">Request Sent</button> */}
                                            <div style={{fontSize:'12px',paddingTop:'5px'}}>10 Mutual friends</div>
                                            
                                            
                                        </div>
                                        <div className="item4">
                                            <a href="#"  className="add-butn more-action" data-ripple onClick={() => handleUnfollow(userM.id)}>unfollow</a>
                                        </div>
                                        {/* <div className="pepl-info">
                                                <h4><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.firstName} ${userM.lastName}`}</a></h4>
                                                <p><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.email}`}</a></p>
                                                <span>Engr</span>
                                            
                                            </div>  */}
                                        {/* </div> */}
                                    </div>
                                </li>


                            // <li key={userM.id} className="friends-card">
                            // 	<div className="grid-container">
                            // 		<div className="nearly-pepls">
                            // 			<figure>
                            // 				<a href={`/profile/${userM.email}`} title="#"><img src="https://wallpaperaccess.com/full/2213424.jpg" alt="" /></a>
                            // 			</figure>
                            // 			<div className="pepl-info">
                            // 				<h4><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.firstName} ${userM.lastName}`}</a></h4>
                            // 				<p><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.email}`}</a></p>
                            // 				{/* <span>Engr</span> */}
                            // 				{/* <a href="#" title="#" className="add-butn more-action" data-ripple onClick={() => console.log("temp")}>unfriend</a> */}

                            // 			</div>
                            // 		</div>
                            // 	</div>
                            // </li>
                        )}
                    </ul>
                    <div className="lodmore"><button className="btn-view btn-load-more" /></div>
                </div>
            </div>
        );
    }



    const FriendRequestSentComponentFunction = () => {
        return (
            <div className="tab-content">
                <input type="text" id="header-search" placeholder="Search Followers" name="s" onChange={handleSearchedFollowers} />
                <div className="tab-pane active fade show " id="following">
                    <ul className="nearby-contct" style={{marginTop:'15px'}}>
                        {friendRequestSent.map(
                            userM =>
                                <li key={userM.id}>
                                    <div className="nearly-pepls">
                                        <figure>
                                            <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img src="https://wallpaperaccess.com/full/2213424.jpg" alt="" /></a>
                                        </figure>
                                        <div className="pepl-info">
                                            <h4><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.firstName} ${userM.lastName}`}</a></h4>
                                            <p><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.email}`}</a></p>
                                            {/* <span>Engr</span> */}
                                            <a href="#" title="#" className="add-butn more-action" data-ripple onClick={() => console.log("temp")}>unfriend</a>

                                        </div>
                                    </div>
                                </li>
                        )}
                    </ul>
                    <div className="lodmore"><button className="btn-view btn-load-more" /></div>
                </div>
            </div>
        );
    }

    const FriendRequestRecievedComponentFunction = () => {
        return (
            <div className="tab-content">
                <input type="text" id="header-search" placeholder="Search Followers" name="s" onChange={handleSearchedFollowers} />
                <div className="tab-pane active fade show " id="following">
                    <ul className="nearby-contct" style={{marginTop:'15px'}}>
                        {friendRequestRecieved.map(
                            userM =>
                                <li key={userM.id}>
                                    <div className="nearly-pepls" key={userM.id}>
                                        <figure>
                                            <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img src="https://wallpaperaccess.com/full/2213424.jpg" alt="" /></a>
                                        </figure>
                                        <div className="pepl-info">
                                            <h4><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.firstName} ${userM.lastName}`}</a></h4>
                                            <p><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.email}`}</a></p>
                                            <span>Engr</span>
                                            <a href="#" title="#" className="add-butn more-action" data-ripple onClick={() => console.log("temp")}>unfriend</a>

                                        </div>
                                    </div>
                                </li>
                        )}
                    </ul>
                    <div className="lodmore"><button className="btn-view btn-load-more" /></div>
                </div>
            </div>
        );
    }

    const getAllUser = async () => {
        await UserService.getUsers().then(res => {
            setAllUser(res.data)
            allUser.map((Auser)=>{
                if(Auser.id==user.id){
                    setFriendsCount(Auser.numberOfFriends);
                    setFollowingCount(Auser.numberOfFollowing);
                    setFollowersCount(Auser.numberOfFollowers);

                }
                console.log(friendsCount,'useeeeeeeeeeeeeeeeeeeeeerrr')
            })
        })
        // console.log(user.email + " This is the users")
    }

    const getFriendsList = async () => {
        await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
            setFriendsList(res.data)
            setSearchedUser	(res.data)
        })
    }

    const getAllFollowing = async () => {
        await UserService.getFollowing(AuthService.getCurrentUser().username).then(res => {
            setFollowing(res.data)
            setSearchedFollowing(res.data)
        })
    }


    const getAllFollowers = async () => {
        await UserService.getFollowers(AuthService.getCurrentUser().username).then(res => {
            setFollowers(res.data)
            setSearchedFollowers(res.data)

        })
    }

    const getAllFriendRequestSent = async () => {
        await UserService.getFriendRequestSent(AuthService.getCurrentUser().username).then(res => {
            setFriendRequestSent(res.data)
        })
    }

    const getAllFriendRequestRecieved = async () => {
        await UserService.getFriendRequestRecieved(AuthService.getCurrentUser().username).then(res => {
            setFriendRequestRecieved(res.data)
        })
    }

    const handleSearchedUser = (event) => {
        if (event.target.value === "") {
            setSearchedUser(friendsList)
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
            setSearchedUser(temp)
            console.log(temp)
        }

    }

    useEffect(() => {
        setGroup(props.group)
        setMembers(group.members)
        // getFriendsList()
    }, [props])

    useEffect(() => {
        testScript()

    }, [])

    // console.log(friendsList)

    return (
		<div className="">
			<div className="central-meta swap-pg-cont">
				<div className="frnds">
					{/* <ul className="nav nav-tabs"> */}
					
					{handleShowComp('members')}
				</div>
			</div>
			
		</div>
);
}
export default MembersComponent;