import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory,useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import GroupService from '../../services/GroupService';
import PostService from '../../services/PostService';
import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import Layout from '../LayoutComponent';
import PostComponent from '../post/PostComponent';
import { testScript } from '../../js/script';
import MenuWidgetComponent from '../widgets/MenuWidgetComponent';

function GroupComponent({post}) {
	const { id: stringId } = useParams();
	const groupid = 1 * stringId
	testScript()
	let history = useHistory();

	const { user } = useContext(UserContext)

	// const []
	const [refresh, setRefresh] = useState([]);
	const [members, setMembers] = useState([]);
	const [userInGroup, setUserInGroup] = useState(false);
	const [group, setGroup] = useState([]);
	const [allGroups, setAllGroups] = useState([]);
	const [searchedGroups, setSearchedGroups] = useState([]);

	const [myGroups, setMyGroups] = useState([]);
	const [searchedMyGroups, setSearchedMyGroups] = useState([]);

	const [showComp, setShowComp] = useState("allgroups");

	const getAllGroups = async () => {
		await GroupService.getAllGroups().then(res => {
			setAllGroups(res.data)
			setSearchedGroups(res.data)
		})
	}

	const getMyGroups = async () => {
		await GroupService.getGroupByCurrentUser(user.email).then(res => {
			const uniqueGroups = Array.from(new Set(res.data.map(a => a.id)))
        .map(id => {
          return res.data.find(a => a.id === id)
        })
			setMyGroups(uniqueGroups)
			setSearchedMyGroups(uniqueGroups)
		})
	}

	const handleSearchGroup = (event) => {
		if (event.target.value === "") {
			setSearchedGroups(allGroups)
		} else {
			let temp = []
			allGroups.map(u => {
				if (u.name.includes(event.target.value)) {
					temp.push(u)
				}
				
			})
			setSearchedGroups(temp)
			console.log(temp)
		}
	}

	const handleSearchMyGroup = (event) => {
		if (event.target.value === "") {
			setSearchedMyGroups(myGroups)
		} else {
			let temp = []
			myGroups.map(u => {
				if (u.name.includes(event.target.value)) {
					temp.push(u)
				}
			})
			setSearchedMyGroups(temp)
			console.log(temp)
		}
	}

	const handleShowComp = () => {
		if (showComp === "allgroups") {
			return showAllGroupsComponent()
		}
		else {
			return showMyGroupsComponent()
		}
	}
	const handleLeaveGroup = (group_id) => {
		console.log(group_id)
		GroupService.leaveGroup(user.id, group_id).then(res => {
			setRefresh(res.data)
			setGroup(res.data)
		})
	}

	const handleJoinGroup = (group_id) => {
		console.log(group_id)
		GroupService.joinGroup(user.id, group_id).then(res => {
			setRefresh(res.data)
			setGroup(res.data)
		})
	}

	const checkIfInGroup = (members) => {
		const found = members.some(el => el.id === user.id);
		return found
	}



	const showAllGroupsComponentR = () => {
		return (<div className="tab-content">
			<input type="text" id="header-search" placeholder="Search users" name="s" onChange={handleSearchGroup} />
			<div className="tab-pane active fade show " id="frends">
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
										{/* {
											(!friendsList.some(el => el.id === userM.id)) ?
												<a href="#" title="#" className="add-butn" style={{ color: "#fff" }} data-ripple onClick={() => addFriendsId(user.id, userM.id)}>add friend</a>
												:
												<>
													<a href="#" title="#" className="add-butn more-action" data-ripple onClick={() => removeFriend(user.id, userM.id)}>unfriend</a>
													<p>Already a friend</p>
												</>
										}
										{
											(!following.some(el => el.id === userM.id)) ?
											<p><a style={{display: "block",float: "right"}} href="#" onClick={() => handleFollow(userM.id)} >Follow</a></p>
												:
												<p><a style={{display: "block",float: "right", color:"red"}} href="#" onClick={() => handleUnfollow(userM.id)}>Unfollow</a></p>
										} */}


									</div>
								</div>
							</li>
					)}
				</ul>
				<div className="lodmore"><button className="btn-view btn-load-more" /></div>
			</div>
		</div>)
	}

	const showAllGroupsComponent = () => {
		return (
			<div className="tab-content">
				<div class="friends-search-container"><i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Groups" name="s" onChange={handleSearchGroup} /></div>
				<div className="tab-pane active fade show " id="frends">
					<ul className="nearby-contct">
						{searchedGroups.map(
							group =>
								<li key={group.id} className="friends-card grp">
									<div className="grid-container">
										{/* <figure> */}
										<div class="item1">
											<a href={`/groups/${group.id}`} title="#"> <img src={group.groupImagePath ? group.groupImagePath : "https://freeiconshop.com/wp-content/uploads/edd/many-people-outline.png"} alt="" /></a>
											{/* </figure> */}
										</div>
										{/* <div className="  "> */}
										<div class="item2">
											<p className="nameTag"><a href={`/groups/${group.id}`} title="#">{`${group.name}`}</a></p>
											{
													checkIfInGroup(group.members) ?
														<a href class="button" style={{ color: "#fff",background:'#033347', fontSize:'12px' }} onClick={() => handleLeaveGroup(group.id)}>Leave Group</a>
														:
														<a href class="button"style={{ color: "#000000",background:'#EAEAEA', fontSize:'12px' }}  onClick={() => handleJoinGroup(group.id)}>Join Group</a>
												}
										</div>
										
										<div class="item6">
											{/* <span>Engr</span> */}
											<i style={{ float: "right", fontSize: 25 }} class="las la-ellipsis-v"></i>
										</div>
										


										{/* </div> */}
									</div>
								</li>
						)}
					</ul>
					<div className="lodmore"><button className="btn-view btn-load-more" /></div>
				</div>
			</div>
		)
	}

	const showMyGroupsComponent = () => {
		return (<div className="tab-content">
		<div class="friends-search-container"><i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Groups" name="s" onChange={handleSearchGroup} /></div>
		<div className="tab-pane active fade show " id="frends">
			<ul className="nearby-contct">
				{searchedMyGroups.map(
					group =>
						<li key={group.id} className="friends-card grp">
							<div className="grid-container">
								{/* <figure> */}
								<div class="item1">
									<a href={`/groups/${group.id}`} title="#"> <img src={group.groupImagePath ? group.groupImagePath : "https://freeiconshop.com/wp-content/uploads/edd/many-people-outline.png"} alt="" /></a>
							
									{/* </figure> */}
								</div>
								{/* <div className="  "> */}
								<div class="item2">
									<p className="nameTag"><a href={`/groups/${group.id}`} title="#">{`${group.name}`}</a></p>
								</div>
								
								<div class="item6">
									{/* <span>Engr</span> */}
									<i style={{ float: "right", fontSize: 25 }} class="las la-ellipsis-v"></i>
								</div>
								


								{/* </div> */}
							</div>
						</li>
				)}
			</ul>
			<div className="lodmore"><button className="btn-view btn-load-more" /></div>
		</div>
	</div>)
	}

	useEffect(() => {
		getAllGroups()
		getMyGroups()
	}, [showComp, group])

	useEffect(() => {
		testScript()
	}, [])

	return (
		<Layout user={user}>
			<div className="col-lg-6">
				<div className="central-meta">
					<div className="frnds">
					<div>
						<p className="Friends-Title">Groups</p>
						<i style={{ float: "right", fontSize: 25 }} class="las la-ellipsis-v"></i>
					</div>
						<div class="navContent">

							<ul class="nav nav-pills" role="tablist">
								<li class="nav-item">
									<a class="nav-link active" data-toggle="pill" href="#!" onClick={() => setShowComp("allgroups")}> <i class="las la-users"></i> All Groups <a className='numberCircle'></a></a>
									{/* <span>{`${allUser.length}`}</span> */}
								</li>
								<li class="nav-item">
									<a class="nav-link active" data-toggle="pill" onClick={() => setShowComp("mygroups")}> <i class="las la-user-friends"></i> My Groups <a className='numberCircle'></a></a>
									{/* <span>{`${following.length}`}</span> */}
								</li>
								<li class="nav-item">
									<a class="nav-link active" data-toggle="pill" href="/group/create"> <i class="las la-plus-circle"></i> Create Group <a className='numberCircle'></a></a>
									{/* <span>{`${followers.length}`}</span> */}
								</li>
								
							</ul>
							
						</div>
						{handleShowComp()}
					</div>
				</div>
			</div>
		</Layout>
	);
}
export default GroupComponent;