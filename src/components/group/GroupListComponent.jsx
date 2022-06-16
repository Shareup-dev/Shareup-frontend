import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory, useParams } from "react-router-dom";
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
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import Grpicon from '../../images/grpicon.png'
import GroupViewComponent from './GroupViewComponent';
import { set } from 'nprogress';
import PostProfileComponent from "../Profile/PostProfileComponent";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext } from "@mui/lab";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";

function GroupListComponent({ post }) {
	const { id: stringId } = useParams();
	const groupid = 1 * stringId
	testScript()
	let history = useHistory();

	const { user } = useContext(UserContext)
	// console.log("this is the user data on Groups"+(user) )

	// const []
	const [refresh, setRefresh] = useState([]);
	const [members, setMembers] = useState([]);
	const [userInGroup, setUserInGroup] = useState(false);
	const [group, setGroup] = useState([]);
	const [allGroups, setAllGroups] = useState([]);
	const [ownedGroups, setOwnedGroups] = useState([]);
	const [suggestedGroups, setSuggestedGroups] = useState([]);


	const [groupsPost, setGroupsPost] = useState([]);
	const [value, setValue] = React.useState("1");

	const [searchedGroups, setSearchedGroups] = useState([]);

	const [myGroups, setMyGroups] = useState([]);
	const [requestFlag, setRequestFlag] = useState(false);

	const [searchedMyGroups, setSearchedMyGroups] = useState([]);
	const [joinRequests, setJoinRequests] = useState([]);
	const [inviteDetails, setInviteDetails] = useState([]);


	const [showComp, setShowComp] = useState("groupFeed");

	const getAllGroups = async () => {
		await GroupService.getAllGroups().then(res => {
			setAllGroups(res.data)
			setSearchedGroups(res.data)
		})
	}
	const getSuggestedGroup = async () => {
		await GroupService.getSuggestedGroups(user.id).then(res => {
			setSuggestedGroups(res.data)
			// setSearchedGroups(res.data)
		})
	}
	const getOwnedGroups = async () => {
		await GroupService.getGroupByCurrentUser(user.id).then(res => {
			setOwnedGroups(res.data)
			// setSearchedGroups(res.data)
		})
	}

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const getMyGroups = async () => {
		if (user) {
			await GroupService.getGroupByCurrentUser(user.id).then(res => {
				const uniqueGroups = Array.from(new Set(res.data.map(a => a.id)))
					.map(id => {
						return res.data.find(a => a.id === id)
					})
				setMyGroups(uniqueGroups)
				setSearchedMyGroups(uniqueGroups)
			})
		}
	}
	const getMyMemberGroups = async () => {
		if (user) {
			// console.log(user)
			// await GroupService.getMyGroups(user.id).then(res => {
			// 	const uniqueGroups = Array.from(new Set(res.data.map(a => a.id)))
			// .map(id => {
			// return res.data.find(a => a.id === id)
			// })
			// 	setMyGroups(uniqueGroups)
			// 	setSearchedMyGroups(uniqueGroups)
			// })
		}
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
			// console.log(temp)
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
			// console.log(temp)
		}
	}

	const handleShowComp = () => {
		if (showComp === "allgroups") {
			return showGroupsComponent()
		} else if (showComp === "ownedgroups") {
			return showOwnedGroupsComponent()
		} else if (showComp === "groupFeed") {
			return showGroupFeedComponent()
		}
	}
	const getGroupsFeed = () => {
		GroupService.getGroupFeed(user.id).then(res => {
			// setRefresh(res.data)
			setGroupsPost(res.data)
			console.log(res.data)
		})
	}
	const showGroupFeedComponent = () => {
		return (<div className="tab-content" style={{borderTop:'1px solid rgba(117, 117, 117, 0.19)'}}>
			<PostProfileComponent posts={groupsPost} setRefresh={setRefresh} />
		</div>)
	}
	const handleLeaveGroup = (e, group_id) => {
		e.preventDefault();
		// console.log(group_id)
		GroupService.leaveGroup(user.id, group_id).then(res => {
			setRefresh(res.data)
			setGroup(res.data)
		})
	}

	const handleJoinGroup = (e, group) => {
		e.preventDefault();
		// console.log(group.id)
		if (group.privacySetting === true) {
			GroupService.joinGroup(user.id, group.id).then(res => {
				setRefresh(res.data)
				setGroup(res.data)

			})
		} else {
			GroupService.joinRequestGroup(user.id, group.id).then(res => {
				setRefresh(res.data)
				setGroup(res.data)
			})
		}

	}

	const checkIfInGroup = (members) => {
		const found = members.some(el => el.id === user.id);
		return found
	}
	// const handleJoinRequestGroup = (e,gid) => {
	// 	e.preventDefault();
	// 	console.log(user.id,gid)
	// 	GroupService.joinRequestGroup(user.id,gid).then(res => {
	// 		setRequestFlag(true)
	// 		setGroup(res.data)
	// 		console.log(group)
	// 	})
	// }
	// const cancelRequestGroup = () =>{

	// }
	const showGroupsComponent = () => {
		// console.log(group)
		return (
			<div className="pb-5">
				<Box sx={{ width: "100%", typography: "body1" }}>
					<TabContext value={value}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<TabList
								onChange={handleChange}
								aria-label="lab API tabs example"
							>
								<Tab
									style={{ textTransform: "capitalize" }}
									label="Suggested Groups"
									value="1"
								/>
								<Tab
									style={{ textTransform: "capitalize" }}
									label="My Groups"
									value="2"
								/>
							</TabList>
						</Box>
						<TabPanel value="1" style={{ padding: '0' }}>{showSuggestedGroups()}</TabPanel>
						<TabPanel value="2" style={{ padding: '0' }}>{showMyGroupsComponent()}</TabPanel>
					</TabContext>
				</Box>
			</div>

		)
	}
	const showSuggestedGroups = () => {
		return (
			<div className="tab-content">
				<div className="friends-search-container grp-search" >
					<input className="friend-search" type="text" id="header-search" placeholder="Search Groups" name="s" onChange={handleSearchGroup} style={{ width: '100%', marginLeft: '0' }} />
				</div>
				<div className="tab-pane active fade show " id="">
					<ul className="nearby-contct" style={{ marginTop: '15px' }}>

						{suggestedGroups.map((group) =>

							<GroupViewComponent key={group.id} group={group} cancelRequestGroup={cancelRequestGroup} handleLeaveGroup={handleLeaveGroup} handleJoinGroup={handleJoinGroup} checkIfInGroup={checkIfInGroup} joinRequests={joinRequests} />

						)}
					</ul>
					<div className="lodmore"><button className="btn-view btn-load-more" /></div>
				</div>
			</div>
		)
	}
	const showMyGroupsComponent = () => {
		return (
			<div className="tab-content">
				<div className="friends-search-container grp-search" >
					<input className="friend-search" type="text" id="header-search" placeholder="Search Groups" name="s" onChange={handleSearchGroup} style={{ width: '100%', marginLeft: '0' }} />
				</div>
				<div className="tab-pane active fade show " id="">
					<ul className="nearby-contct" style={{ marginTop: '15px' }}>

						{searchedMyGroups.map((group) =>

							<GroupViewComponent key={group.id} group={group} cancelRequestGroup={cancelRequestGroup} handleLeaveGroup={handleLeaveGroup} handleJoinGroup={handleJoinGroup} checkIfInGroup={checkIfInGroup} joinRequests={joinRequests} />

						)}
					</ul>
					<div className="lodmore"><button className="btn-view btn-load-more" /></div>
				</div>
			</div>
		)
	}
	const showOwnedGroupsComponent = () => {
		return (
			<div className="tab-content">
				<div className="friends-search-container grp-search" >
					<input className="friend-search" type="text" id="header-search" placeholder="Search Groups" name="s" onChange={handleSearchGroup} style={{ width: '100%', marginLeft: '0' }} />
				</div>
				<div className="tab-pane active fade show " id="">
					<ul className="nearby-contct" style={{ marginTop: '15px' }}>

						{ownedGroups.map((group) =>

							<GroupViewComponent key={group.id} group={group} cancelRequestGroup={cancelRequestGroup} handleLeaveGroup={handleLeaveGroup} handleJoinGroup={handleJoinGroup} checkIfInGroup={checkIfInGroup} joinRequests={joinRequests} />

						)}
					</ul>
					<div className="lodmore"><button className="btn-view btn-load-more" /></div>
				</div>
			</div>
		)
	}

	const getMyJoinRequests = () => {
		// console.log(gid)
		if (user && user.id) {
			GroupService.getMyJoinRequests(user.id).then(res => {
				// console.log('yes',res.data)
				setJoinRequests(res.data)
				// setRefresh(res.data);
				// setRequestFlag(true)
			})
		}
	}
	const cancelRequestGroup = (e, gid) => {
		e.preventDefault();
		// console.log(gid)
		let reqId;
		if (joinRequests && joinRequests.length > 0) {
			joinRequests.some(req => req.group_id === gid ? reqId = req.id : null)
			// console.log(reqId)
			GroupService.cancelRequestGroup(reqId).then(res => {
				// console.log('done delete')
				setRefresh(res.data);
				// setRequestFlag(true)
			})
		}

	}

	useEffect(() => {
		if (user && user.id) {
			getGroupsFeed()
			getAllGroups()
			getSuggestedGroup()
			getMyGroups()
			getOwnedGroups()
			getMyJoinRequests()
		}
		// getGroupJoinInvites()
	}, [showComp, refresh])

	useEffect(() => {
		testScript()
	}, [])


	return (
		<Layout user={user}>
			<div className="col-lg-6">
				<div className="central-meta swap-pg-cont">
					<div className="frnds">
						<div className='d-flex justify-content-between'>
							<p className="Friends-Title common-title">Groups</p>
							<div className='d-flex'>
								<span className='add-reel-icon' title="create group" onClick={() => history.push('/group/create')}>
									<i className="fa fa-plus" style={{ fontSize: '13px' }}  ></i>
									{/* <span>{`${following.length}`}</span> */}
								</span>
								<i style={{ float: "right", fontSize: 18 }} className="fas fa-ellipsis-v"></i>
							</div>
						</div>
					</div>
					<div className="navContent">
						<ul className="nav nav-pills swap-page-nav " role="tablist">
							<li className="nav-item" style={{ justifyContent: 'flex-start' }}>
								<div className="all">
									<span style={{ cursor: 'pointer' }} onClick={() => setShowComp("groupFeed")}>
										<span style={{ padding: '5px', marginRight: '5px' }}>
											<i className="fa fa-feed" style={{ fontSize: '18px' }}></i>
											{/* <span>{`${following.length}`}</span> */}
										</span>
										GroupFeed
									</span>
								</div>
							</li>
							<li className="nav-item" style={{ justifyContent: 'center' }}>
								<div className="my">
									<span style={{ cursor: 'pointer' }} onClick={() => setShowComp("allgroups")}>
										<span style={{ padding: '5px', marginRight: '5px' }}>
											<i className="fa fa-users" style={{ fontSize: '18px' }}></i>
											{/* <span>{`${following.length}`}</span> */}
										</span>
										Groups
									</span>
								</div>
							</li>
							<li className="nav-item" style={{ justifyContent: 'flex-end' }}>
								<div className="new">

									<span style={{ cursor: 'pointer' }} onClick={() => setShowComp("ownedgroups")}>
										<span style={{ padding: '5px', marginRight: '5px' }}>
											<i className="fa fa-user-friends" style={{ fontSize: '18px' }}></i>
											
											{/* <span>{`${following.length}`}</span> */}
										</span>
										My Groups
									</span>
								</div>
							</li>
						</ul>

					</div>

					{handleShowComp()}
				</div>
			</div>
		</Layout>
	);
}
export default GroupListComponent;