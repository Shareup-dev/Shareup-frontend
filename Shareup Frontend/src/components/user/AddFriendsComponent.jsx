import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import Layout from '../LayoutComponent';
import { testScript } from '../../js/script';

function AddFriendsComponent() {
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
        <div class="friends-search-container">
            <i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Users" name="s" onChange={handleSearchedUser} />
        </div>
        <div className="tab-pane active fade show " id="frends">
            <div style={{ contentAlign: 'center', textAlign: 'center', paddingTop: '15px' }}>
                {(friendsList.length > 0) ? <p style={{ marginBottom: '5px', fontWeight: 'medium', fontSize: '24px', color: '#646464' }}>Add New Friends!</p>:
                <p style={{ fontWeight: 'medium', fontSize: '18px', color: '#646464' }}>There are no Friends!</p>}
            </div>
            <ul className="nearby-contct">
                {searchedUser.map(
                    userM =>
					(friendsList.some(el => el.id === userM.id)) ? null : <>
                        <li key={userM.id} className="friends-card grp">
                            <div className="grid-container">
                                {/* <figure> */}
                                <div class="item1">
                                    <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{objectFit:'cover'}} src={userM.profilePicturePath} alt="" /></a>
                                    {/* </figure> */}
                                </div>
                                {/* <div className="  "> */}
                                <div class="item2">
                                    <p className="nameTag"><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.firstName} ${userM.lastName}`}</a></p>
									{/* <button className="friends-button" onClick={() => unsendFriendRequest(user.id, userM.id)}>Request Sent</button> */}
									{
                                    (user.id !== userM.id) ?
                                        (!friendsList.some(el => el.id === userM.id)) ?
                                            friendRequestRecieved.some(el => el.id === userM.id)
                                                ?
                                                <>
                                                     <div class="item5">
                                                            <a href="#!" title="#" className="button" style={{ color: "#000000",background:'#EAEAEA', fontSize:'12px' }} data-ripple onClick={() => acceptFriendRequest(user.id, userM.id)}>Accept Request</a>
														
                                                        </div>
                                                        {/* <div class="item3">
                                                            <p><a style={{ display: "block", float: "right", color: "#fff",background:'#033347',fontSize:'12px' }} href="#" onClick={() => declineFriendRequest(user.id, userM.id)}>Decline Friend Request</a></p>
                                                            <br></br>
                                                            <br></br>
                                                        </div>  */}
                                                </>
                                                :
                                                friendRequestSent.some(el => el.id === userM.id)
                                                    ?
                                                    
                                                       <a href="#!"  className="button" style={{ color: "#fff",background:'#033347',fontSize:'12px' }} data-ripple onClick={() => unsendFriendRequest(user.id, userM.id)}>Unsend Request</a> 
                                                   
                                                    :
                                                   
                                                         <a href="#!"  className="button" style={{ color: "#000000",background:'#EAEAEA', fontSize:'12px' }} data-ripple onClick={() => sendFriendRequest(user.id, userM.id)}>Send Request</a> 
                                                    
                                            :
                                            <>
                                                
                                                     <a href="#"  style={{ color: "#fff",background:'#033347' }}
													 
													 className="button more-action" data-ripple onClick={() => removeFriend(user.id, userM.id)}>Unfriend</a> 
                                                
                                                {/* <div class="item5">
                                                     <p style={{ float: "right" }}>Already a friend</p> 
                                                </div> */}
                                            </>
                                        :
                                        <div class="item5">
                                            {/* <p style={{ float: "right" }}>Your own profile</p> */}
                                        </div>
                                }
								</div>
                                <div class="item4">
                                    
                                </div>
                                {/* <div class="item6">
                                     <span>Engr</span> 
                                    <i style={{ float: "right", fontSize: 35 }} class="las la-ellipsis-v"></i>
                                </div> */}
                               
                                {
                                    (user.id !== userM.id) ?
                                        (!following.some(el => el.id === userM.id)) ?
                                            <div class="item7">
                                                {/* <p><a className="button3" style={{ backgroundColor: "#0009b7", color: "#ffffff"}} href="#!" onClick={() => handleFollow(userM.id)} >Follow</a></p> */}
                                            </div>
                                            :
                                            <div class="item7">
                                                {/* <p><a className="button3" style={{ backgroundColor: "#e25555", color: "#ffffff"}} href="#!" onClick={() => handleUnfollow(userM.id)}>Unfollow</a></p> */}
                                            </div>
                                        :
                                        null
                                }


                                {/* </div> */}
                            </div>
                        </li></>
                )}
            </ul>
            <div className="lodmore"><button className="btn-view btn-load-more" /></div>
        </div>
    </div>)
}

const FollowingComponentFunction = () => {
    return (
        <div className="tab-content">
            <div class="friends-search-container">
                <i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Users" name="s" onChange={handleSearchedFollowing} />
            </div>
            <div className="tab-pane active fade show " id="following">
                <ul className="nearby-contct">
                    {following.map(
                        userM =>
                            <li key={userM.id} className="friends-card grp">
                                <div className="grid-container">
                                    {/* <div className="nearly-pepls"> */}
                                    {/* <figure> */}
                                    <div class="item1">
                                        <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img src={userM.profilePicturePath} alt="" /></a>
                                        {/* </figure> */}
                                    </div>
                                    {/* <div className="  "> */}
                                    <div class="item2">
                                        <p className="nameTag"><a href={`/profile/${userM.email}`} title={`${userM.email}`}>{`${userM.firstName} ${userM.lastName}`}</a></p>
										<a href="#"  className="add-butn more-action" data-ripple onClick={() => handleUnfollow(userM.id)}>unfollow</a>
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
                            </li>
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
            <div class="friends-search-container">
                <i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Users" name="s" onChange={handleSearchedFollowers} />
            </div>
            {/* <input type="text" id="header-search" placeholder="Search Followers" name="s" onChange={handleSearchedFollowers} /> */}
            <div className="tab-pane active fade show " id="following">
                <ul className="nearby-contct">
                    {followers.map(
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
										<a href="#"  className="add-butn more-action" data-ripple onClick={() => handleUnfollow(userM.id)}>unfollow</a>
										
                                    </div>
                                    
                                    <div class="item6">
                                        {/* <span>Engr</span> */}
                                        <i style={{ float: "right", fontSize: 35 }} class="las la-ellipsis-v"></i>
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
					{/* <ul className="nav nav-tabs"> */}
					<div>
						<p className="Friends-Title">Friends</p>
						<i style={{ float: "right", fontSize: 25 }} class="las la-ellipsis-v"></i>
					</div>
					<div class="navContent">

						<ul class="nav nav-pills" role="tablist">
							<li class="nav-item">
								<a class="nav-link active" data-toggle="pill" href="#!" onClick={() => setShowComp("members")}> <i class="las la-user"></i> Users <a className='numberCircle'>{`${allUser.length}`}</a></a>
								{/* <span>{`${allUser.length}`}</span> */}
							</li>
							<li class="nav-item">
								<a class="nav-link active" data-toggle="pill" onClick={() => setShowComp("following")}> <i class="las la-user-cog"></i> Following <a className='numberCircle'>{`${following.length}`}</a></a>
								{/* <span>{`${following.length}`}</span> */}
							</li>
							<li class="nav-item">
								<a class="nav-link active" data-toggle="pill" onClick={() => setShowComp("followers")}> <i class="las la-user-tag"></i> Followers <a className='numberCircle'>{`${followers.length}`}</a></a>
								{/* <span>{`${followers.length}`}</span> */}
							</li>
						</ul>
					</div>

					{/* <li className="nav-item"><a className="" href="#!" onClick={() => setShowComp("members")}
														data-toggle="tab">Members</a> <span>{`${allUser.length}`}</span></li>
													<li className="nav-item"><a className="" href="#!" onClick={() => setShowComp("following")}
														data-toggle="tab">Following</a> <span>{`${following.length}`}</span></li>
													<li className="nav-item"><a className="" href="#!" onClick={() => setShowComp("followers")}
														data-toggle="tab">Followers</a> <span>{`${followers.length}`}</span></li> */}
					{/* <li className="nav-item"><a className="" href="#!" onClick={() => setShowComp("friendRequestSent")}
														data-toggle="tab">Request Sent</a><span>{`${friendRequestSent.length}`}</span></li> */}
					{/* <li className="nav-item"><a className="" href="#!" onClick={() => setShowComp("friendRequestRecieved")}
														data-toggle="tab">Request Recieved</a><span>{`${friendRequestRecieved.length}`}</span></li> */}
					{/* </ul> */}
					{/* <br/> */}
					{handleShowComp()}
				</div>
			</div>
		</div>
	</Layout>
);
}
export default AddFriendsComponent;