import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import ShortcutWidgetComponent from '../dashboard/ShortcutWidgetComponent';
import Layout from '../LayoutComponent';
import { testScript } from '../../js/script';

function FriendsTestComponent() {
    let history = useHistory();

    const { user } = useContext(UserContext)

    const [refresh, setRefresh] = useState([]);


    // const []

    const [allUser, setAllUser] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [searchedUser, setSearchedUser] = useState([]);

    const [showComp, setShowComp] = useState("members");

    const [following, setFollowing] = useState([]);
    const [searchedFollowing, setSearchedFollowing] = useState([]);

    const [followers, setFollowers] = useState([]);
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

    const handleSearchedFollowing = (event) => {
        if (event.target.value === "") {
            setSearchedFollowing(following)
        } else {
            let temp = []
            following.map(u => {
                if (u.email.includes(event.target.value)) {
                    temp.push(u)
                }
            })
            setSearchedFollowing(temp)
            console.log(temp)
        }

    }

    const handleSearchedFollowers = (event) => {
        if (event.target.value === "") {
            setSearchedFollowers(followers)
        } else {
            let temp = []
            following.map(u => {
                if (u.email.includes(event.target.value)) {
                    temp.push(u)
                }
            })
            setSearchedFollowers(temp)
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
        if (showComp === "members") {
            return FcomponentFunction()
        } else if (showComp === "followers") {
            return FollowersComponentFunction()
        } else if (showComp === "following") {
            return FollowingComponentFunction()
        } else if (showComp === "friendRequestSent") {
            return FriendRequestSentComponentFunction()
        } else if (showComp === "friendRequestRecieved") {
            return FriendRequestRecievedComponentFunction()
        }
        else {
            return "<h1>None To Show</h1>"
        }
    }

    const FcomponentFunction = () => {
        return (<div className="tab-content">
            <input type="text" id="header-search" placeholder="Search users" name="s" onChange={handleSearchedUser} />
            <div className="tab-pane active fade show " id="frends">
                <ul className="nearby-contct">
                    <div className="container friends">

                    


                    {searchedUser.map(
                        userM =>
                            <li key={userM.id}>
                                <div className="cardprofile">
                                    <figure className="snip1336"><img src={userM.coverPicturePath ? userM.coverPicturePath : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample69.jpg"} style={{height:'218px'}}  alt="sample69" />
                                        <figcaption>
                                            <img src={userM.profilePicturePath} alt="profile-sample5" className="profile" />
                                            <h2>{`${userM.firstName} ${userM.lastName}`}<span>{userM.job ? userM.job : `No Job`}</span> <ul className="social-icons">
                                                <li><a href="#"><i className="fa fa-instagram" /></a></li>
                                                <li><a href="#"><i className="fa fa-twitter" /></a></li>
                                                <li><a href="#"><i className="fa fa-linkedin" /></a></li>
                                                <li><a href="#"><i className="fa fa-codepen" /></a></li>
                                            </ul></h2>
                                            <div className="grid-container">
                                                <div className="grid-child-posts">{userM.numberOfFriends} Friends</div>
                                                <div className="grid-child-followers">{userM.numberOfFollowers} Followers</div>
                                                <div className="grid-child-posts">{userM.numberOfFollowing} Following</div>
                                                {/* <div className="grid-child-followers">1300 Likes</div> */}
                                            </div>
                                            <p>If you want to stay dad you've got to polish your image. I think the image we need to create for you is "repentant but learning".</p>
                                            {/* <a href="#" className="follow">Follow</a>
                                            <a href="#" className="info">More Info</a>
                                            <a href="#" className="follow">Follow</a>
                                            <a href="#" className="info">More Info</a> */}
                                                {
                                                    (user.id !== userM.id) ?
                                                        (!friendsList.some(el => el.id === userM.id)) ?
                                                            friendRequestRecieved.some(el => el.id === userM.id)
                                                                ?
                                                                <>
                                                                    <a href="#!" title="#" className="follow"  data-ripple onClick={() => acceptFriendRequest(user.id, userM.id)}>Accept Friend Request</a>
                                                                    <a href="#!" title="#" className="info" data-ripple onClick={() => declineFriendRequest(user.id, userM.id)}>Decline Friend Request</a>
                                                                </>
                                                                :
                                                                friendRequestSent.some(el => el.id === userM.id)
                                                                    ?
                                                                    <p><a href="#!" title="#" className="info" data-ripple onClick={() => unsendFriendRequest(user.id, userM.id)}>Unsend Friend Request</a></p>
                                                                    :
                                                                    <p><a href="#!" title="#" className="follow"  data-ripple onClick={() => sendFriendRequest(user.id, userM.id)}>Send Friend Request</a></p>
                                                            :
                                                            <>
                                                                <a href="#" title="#!" className="info" data-ripple onClick={() => removeFriend(user.id, userM.id)}>unfriend</a>
                                                                <p>Already a friend</p>
                                                            </>
                                                        :
                                                        <p style={{ float: "right" }}>Your own profile</p>
                                                }
                                                {
                                                    (user.id !== userM.id) ?
                                                        (!following.some(el => el.id === userM.id)) ?
                                                            <p><a style={{ display: "block", float: "right" }} href="#!" onClick={() => handleFollow(userM.id)} >Follow</a></p>
                                                            :
                                                            <p><a style={{ display: "block", float: "right", color: "red" }} href="#!" onClick={() => handleUnfollow(userM.id)}>Unfollow</a></p>
                                                        :
                                                        null
                                                }



                                        </figcaption>

                                    </figure>
                                </div>
                            </li>
                    )}
                    </div>
                </ul>
                <div className="lodmore"><button className="btn-view btn-load-more" /></div>
            </div>
        </div>)
    }

    const FollowingComponentFunction = () => {
        return (
            <div className="tab-content">
                <input type="text" id="header-search" placeholder="Search Following" name="s" onChange={handleSearchedFollowing} />
                <div className="tab-pane active fade show " id="following">
                    <ul className="nearby-contct">
                        {following.map(
                            userM =>
                                <li key={userM.id}>
                                    <div className="nearly-pepls">
                                        <figure>
                                            <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img src="https://wallpaperaccess.com/full/2213424.jpg" alt="" /></a>
                                        </figure>
                                        <div className="pepl-info">
                                            <h4><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.firstName} ${userM.lastName}`}</a></h4>
                                            <p><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.email}`}</a></p>
                                            <span>Engr</span>
                                            <a href="#" title="#" className="add-butn more-action" data-ripple onClick={() => handleUnfollow(userM.id)}>unfollow</a>

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

    const FollowersComponentFunction = () => {
        return (
            <div className="tab-content">
                <input type="text" id="header-search" placeholder="Search Followers" name="s" onChange={handleSearchedFollowers} />
                <div className="tab-pane active fade show " id="following">
                    <ul className="nearby-contct">
                        {followers.map(
                            userM =>
                                <li key={userM.id}>
                                    <div className="nearly-pepls">
                                        <figure>
                                            <a href={`/profile/${userM.email}`} title="#"><img src="https://wallpaperaccess.com/full/2213424.jpg" alt="" /></a>
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

    const FriendRequestSentComponentFunction = () => {
        return (
            <div className="tab-content">
                <input type="text" id="header-search" placeholder="Search Followers" name="s" onChange={handleSearchedFollowers} />
                <div className="tab-pane active fade show " id="following">
                    <ul className="nearby-contct">
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

    const FriendRequestRecievedComponentFunction = () => {
        return (
            <div className="tab-content">
                <input type="text" id="header-search" placeholder="Search Followers" name="s" onChange={handleSearchedFollowers} />
                <div className="tab-pane active fade show " id="following">
                    <ul className="nearby-contct">
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
            setSearchedUser(res.data)
        })
        console.log(user.email + " This is the users")
        // console.log(JSON.stringify(allUser[0]) + " This is the object")
    }

    const getFriendsList = async () => {
        await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
            setFriendsList(res.data)
        })
    }

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
            setSearchedUser(allUser)
        } else {
            let temp = []
            allUser.map(u => {
                if (u.email.includes(event.target.value)) {
                    temp.push(u)
                }
            })
            setSearchedUser(temp)
            console.log(temp)
        }

    }

    useEffect(() => {
        getAllUser()
        getFriendsList()
        getAllFollowing()
        getAllFollowers()
        getAllFriendRequestSent()
        getAllFriendRequestRecieved()

        console.log("Users = " + allUser)
        console.log("Friends = " + friendsList)
    }, [showComp, refresh])

    useEffect(() => {
        testScript()
    }, [])


    return (
        <Layout user={user}>
            <div className="col-lg-6">
                <div className="central-meta">
                    <div className="frnds">
                        <ul className="nav nav-tabs">
                            <li className="nav-item"><a className="" href="#!" onClick={() => setShowComp("members")}
                                data-toggle="tab">Members</a> <span>{`${allUser.length}`}</span></li>
                            <li className="nav-item"><a className="" href="#!" onClick={() => setShowComp("following")}
                                data-toggle="tab">Following</a> <span>{`${following.length}`}</span></li>
                            <li className="nav-item"><a className="" href="#!" onClick={() => setShowComp("followers")}
                                data-toggle="tab">Followers</a> <span>{`${followers.length}`}</span></li>
                            <li className="nav-item"><a className="" href="#!" onClick={() => setShowComp("friendRequestSent")}
                                data-toggle="tab">Request Sent</a><span>{`${friendRequestSent.length}`}</span></li>
                            <li className="nav-item"><a className="" href="#!" onClick={() => setShowComp("friendRequestRecieved")}
                                data-toggle="tab">Request Recieved</a><span>{`${friendRequestRecieved.length}`}</span></li>
                        </ul>
                        <br></br>
                        {handleShowComp()}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default FriendsTestComponent;