import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import GroupService from '../../services/GroupService';
import Layout from '../LayoutComponent';
import AuthService from '../../services/auth.services';
import UserService from '../../services/UserService';
import FriendsService from '../../services/FriendService';


function GuideComponent() {
    let history = useHistory();

    const { user } = useContext(UserContext)

    const [refresh, setRefresh] = useState([]);


    const [allUser, setAllUser] = useState([]);
    const getAllUser = async () => {
        await UserService.getUsers().then(res => {
            setAllUser(res.data)
            // setSearchedUser(res.data)
        })
        console.log(user.email + " This is the users")
    }

    const [friendsList, setFriendsList] = useState([]);
    const getFriendsList = async () => {
        await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
            setFriendsList(res.data)
        })
    }

    const [friendRequestSent, setFriendRequestSent] = useState([]);
    const [friendRequestRecieved, setFriendRequestRecieved] = useState([]);
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


    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const getAllFollowing = async () => {
        await UserService.getFollowing(AuthService.getCurrentUser().username).then(res => {
            setFollowing(res.data)
        })
    }

    const getAllFollowers = async () => {
        await UserService.getFollowers(AuthService.getCurrentUser().username).then(res => {
            setFollowers(res.data)
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

    const removeFriend = (uid, fid) => {
        console.log("uid: " + uid + " fid: " + fid)
        FriendsService.removeFriends(uid, fid).then(res => {
            setRefresh(res.data)
        })
    }

    const [allGroups, setAllGroups] = useState([]);
    const getAllGroups = async () => {
        await GroupService.getAllGroups().then(res => {
            setAllGroups(res.data)
            // setSearchedGroups(res.data)
        })
    }

    const [myGroups, setMyGroups] = useState([]);
    const getMyGroups = async () => {
        await GroupService.getGroupByCurrentUser(user.email).then(res => {
            setMyGroups(res.data)
            // setSearchedMyGroups(res.data)
        })
    }

    const handleLeaveGroup = (group_id) => {
		GroupService.leaveGroup(user.id, group_id).then(res => {
			setRefresh(res.data)
		})
	}

	const handleJoinGroup = (group_id) => {
		GroupService.joinGroup(user.id, group_id).then(res => {
			setRefresh(res.data)
		})
	}

    const handleRedirect = () => {
         //setTimeout(() => history.push('/newsfeed'), 2000)
        setTimeout(() => window.location.reload(), 2000)
    }

    const [step, setStep] = useState(0);

    const activeOrNot = (num) => {
        return num <= step ? "active" : "";
    }

    const validateStep = (num) => {
        let validated = true
        // if (!groupName) {
        //     setGroupNameError("Please Ensure You Write The Group Name")
        //     validated = false
        // }
        // if (!groupDesc) {
        //     setGroupDescError("Please Ensure You Write The Group Description")
        //     validated = false
        // }
        // // if()
        // if (validated) {
        //     setStep(num)
        // }

        setStep(num)

    }


    const show = () => {
        if (step === 0) {
            return (
                <fieldset>
                    <div className="form-card">
                    <ul className="nearby-contct">
                            {allUser.slice(0, 8).map(userF =>
                                <li className="grp" key={userF.id}>
                                   <div className="grid-container">
                                   <div class="item1">
                                        <img src={userF.profilePicturePath} alt="" />
                                        {/* <span className="status f-online" /> */}
                                    </div>
                                    <div class="item2">
                                    <p className="nameTag"><a href={`/profile/${userF.email}`}>{`${userF.firstName} ${userF.lastName}`}</a></p>
                                        {
                                        (user.id !== userF.id) ?
                                            (!friendsList.some(el => el.id === userF.id)) ?
                                                friendRequestRecieved.some(el => el.id === userF.id)
                                                    ?
                                                    <>
                                                        <a href="#" className="button" style={{background:'#033347',fontSize:'12px'}} onClick={() => acceptFriendRequest(user.id, userF.id)}>Accept Request</a>
                                                        <a href="#" className="button" style={{color: "#000000",background:'#EAEAEA', fontSize:'12px'}} onClick={() => declineFriendRequest(user.id, userF.id)}>Decline Friend Request</a>
                                                        {/* <br></br>
                                                        <br></br> */}
                                                    </>
                                                    :
                                                    friendRequestSent.some(el => el.id === userF.id)
                                                        ?
                                                        <a href="#" className="button" style={{color: "#fff",background:'#033347',fontSize:'12px'}} onClick={() => unsendFriendRequest(user.id, userF.id)}>Unsend  Request</a>
                                                        :
                                                        <a href="#" className="button" style={{color: "#000000",background:'#EAEAEA', fontSize:'12px'}} onClick={() => sendFriendRequest(user.id, userF.id)}>Send  Request</a>
                                                :
                                                <>
                                                    <a href="#" className="button" style={{background:'#033347',fontSize:'12px'}} onClick={() => removeFriend(user.id, userF.id)}>Unfriend</a>
                                                    <p>Already a friend</p>
                                                </>
                                            :
                                            <div class="item5">
                                            <p style={{ float: "right" }}>Your own profile</p>
                                            </div>
                                    }
                                    </div>
                                    
                                    {/* <button onClick={() => sendFriendRequest(userF.id)}>Hi</button> */}
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                    <input type="button" name="" className="action-button" defaultValue="Next Step" onClick={() => validateStep(1)} />
                </fieldset>
            )
        }

        if (step === 1) {
            return (
                <fieldset>
                   <div className="form-card">
                    <ul className="nearby-contct">
                       
                            {
                                allUser.slice(0, 8).map(userF =>
                                    <li className="grp" key={userF.id}>
                                   <div className="grid-container">
                                   <div class="item1">
                                    
                                      
                                            <img src={userF.profilePicturePath} alt="" />
                                            {/* <span className="status f-online" /> */}
                                            </div>
                                        <div className="item2">
                                        <p className="nameTag"><a href={`/profile/${userF.email}`}>{`${userF.firstName} ${userF.lastName}`}</a></p>
                                            {
                                            (user.id !== userF.id) ?
                                                (!following.some(el => el.id === userF.id)) ?
                                                    <a href="#!" className="button" style={{ color: "#000000",background:'#EAEAEA',fontSize:'12px' }} href="#!" onClick={() => handleFollow(userF.id)} >Follow</a>
                                                    :
                                                    <a href="#!" className="button" style={{ color: "#fff",background:'#033347',fontSize:'12px' }} href="#!" onClick={() => handleUnfollow(userF.id)}>Unfollow</a>
                                                :
                                                null
                                        }
                                        </div>
                                        
                                        </div>
                                    </li>
                                )}
                        </ul>
                    </div>
                    <input type="button" name="previous" className="previous action-button-previous" defaultValue="Previous" onClick={() => setStep(0)} />
                    <input type="button" name="" className="action-button" defaultValue="Next Step" onClick={() => setStep(2)} />
                </fieldset>
            )
        }
        if (step === 2) {
            return (
                <fieldset>
                    <div className="form-card">
                    <ul className="nearby-contct">
                            {allGroups.slice(0, 8).map(group =>
                                <li key={group.id} className="grp">
                                   <div className="grid-container">
                                   <div class="item1">
                                        <img src={group.groupImagePath ? group.groupImagePath : "https://freeiconshop.com/wp-content/uploads/edd/many-people-outline.png"} alt="" />
                                        </div>
                                        <div class="item2">
                                        <p className="nameTag"><a href={`/groups/${group.id}`}>{`${group.name}`}</a></p>
                                        {
                                        (group.members.some(el => el.id === user.id)) ?
                                            <a href="#!" class="button" style={{ color: "#fff",background:'#033347',fontSize:'12px' }} onClick={() => handleLeaveGroup(group.id)}>Leave Group</a>
                                            :
                                            < a href="#!" class="button" style={{ color: "#000000",background:'#EAEAEA',fontSize:'12px' }} onClick={() => handleJoinGroup(group.id)}>Join Group</a>
                                    }
                                    </div>
                                    
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                    <input type="button" name="previous" className="previous action-button-previous" defaultValue="Previous" onClick={() => setStep(1)} />
                    <input type="button" name="" className="action-button" defaultValue="Next Step" onClick={() => {
                        setStep(3)
                        // handleCreateGroup()
                    }} />
                </fieldset>
            )
        }
        if (step === 3) {
            return (
                <fieldset>
                    <div className="form-card">
                        <h2 className="fs-title text-center">You Are Setup !</h2> <br /><br />
                        <div className="row justify-content-center">
                            <div className="col-3"> <img src="https://img.icons8.com/color/96/000000/ok--v2.png" className="fit-image" /> </div>
                        </div> <br /><br />
                        <div className="row justify-content-center">
                            <div className="col-7 text-center">
                                {/* <h5>You Are Set</h5> */}
                                <p style={{ color: "blue" }}>You will be redirected shortly...</p>
                                {
                                    handleRedirect()
                                }
                            </div>
                        </div>
                    </div>
                </fieldset>
            )
        }
    }

    useEffect(() => {
        getAllUser()
        getAllGroups()
        getFriendsList()
        getAllFriendRequestSent()
        getAllFriendRequestRecieved()
        getAllFollowing()
        getAllFollowers()
    }, [refresh])

    return (
        <Layout user={user}>
            <div className="col-lg-6">
                <div className="central-meta create-group">
                    <div className="card px-0 pt-4 pb-0 mt-3 mb-3">
                        <div style={{ contentAlign: 'center', textAlign: 'center' }}>
                            <h4><strong>Are you new?</strong></h4>
                            <p>Here are some suggestions</p>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mx-0">
                                <form id="msform">
                                    {/* progressbar */}
                                    <ul id="progressbar">
                                        <li id="account" className={activeOrNot(0)}><strong>{`Friends`}</strong></li>
                                        <li id="personal" className={activeOrNot(1)}><strong>Follower</strong></li>
                                        <li id="payment" className={activeOrNot(2)}><strong>Groups</strong></li>
                                        <li id="confirm" className={activeOrNot(3)}><strong>Success</strong></li>
                                    </ul> {/* fieldsets */}
                                    {
                                        show()
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default GuideComponent;