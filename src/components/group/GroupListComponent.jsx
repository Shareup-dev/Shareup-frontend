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
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import Grpicon from '../../images/grpicon.png'
import GroupViewComponent from './GroupViewComponent';
import { set } from 'nprogress';


function GroupListComponent({post}) {
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


	const [searchedGroups, setSearchedGroups] = useState([]);

	const [myGroups, setMyGroups] = useState([]);
	const [requestFlag, setRequestFlag] = useState(false);

	const [searchedMyGroups, setSearchedMyGroups] = useState([]);
	const [joinRequests, setJoinRequests] = useState([]);


	const [showComp, setShowComp] = useState("allgroups");

	const getAllGroups = async () => {
		await GroupService.getAllGroups().then(res => {
			setAllGroups(res.data)
			setSearchedGroups(res.data)
		})
	}

	const getMyGroups = async () => {
		if(user){
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
		if(user){
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
			return showAllGroupsComponent()
		}
		else {
			return showMyGroupsComponent()
		}
	}
	const handleLeaveGroup = (e,group_id) => {
		e.preventDefault();
		// console.log(group_id)
		GroupService.leaveGroup(user.id, group_id).then(res => {
			setRefresh(res.data)
			setGroup(res.data)
		})
	}

	const handleJoinGroup = (e,group) => {
		e.preventDefault();
		// console.log(group.id)
		if(group.privacySetting===true){
			GroupService.joinGroup(user.id, group.id).then(res => {
				setRefresh(res.data)
				setGroup(res.data)

			})
		}else{
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
	const showAllGroupsComponent = () => {
		// console.log(group)
		return (
			
			<div className="tab-content">
					<div className="friends-search-container grp-search" >
							<input className="friend-search" type="text" id="header-search" placeholder="Search Groups" name="s" onChange={handleSearchGroup} style={{width:'100%',marginLeft:'0'}}/>
						</div>
				<div className="tab-pane active fade show " id="">
					<ul className="nearby-contct" style={{marginTop:'15px'}}>
						
						{searchedGroups.map((group) =>
								
							<GroupViewComponent key={group.id} group={group} cancelRequestGroup = {cancelRequestGroup } handleLeaveGroup={handleLeaveGroup} handleJoinGroup={handleJoinGroup} checkIfInGroup={checkIfInGroup} joinRequests={joinRequests}/>

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
							<input className="friend-search" type="text" id="header-search" placeholder="Search Groups" name="s" onChange={handleSearchMyGroup} style={{width:'100%',marginLeft:'0'}}/>
						</div>
			<div className="tab-pane active fade show " id="">
				{/* <div>Groups You Manage</div> */}
				<ul className="nearby-contct" style={{marginTop:'15px'}}>
					{searchedMyGroups.map((group,index) =>
							<li key={group.id} className="friends-card groupalign" style={((index+1)/3==0)?{marginRight:'0px'}:{marginRight:'10px'}}>
								<a href={`/groups/${group.id}`}>
									<div className="group-li-item">
										{/* <figure> */}
										<div class="item12">
											<a href={`/groups/${group.id}`} title="#"> <img src={group.groupImagePath} alt="" className={group.groupImagePath ? "img" : "no-img"} /></a>

											{/* </figure> */}
											{/* <button className="preview-btn" onClick={() => handleJoinGroup(group.id)}>Preview</button>	 */}
										</div>
										{/* <div className="  "> */}
										<div className="item23">
											<p className="grpnametag" style={{ height: '20px', fontWeight: '600'}}><a href={`/groups/${group.id}`} title="#">{`${group.name}`}</a></p>
											<p className="grp-mem-text">{group.members.length} Members</p>
											<div style={{width: '100%' , display: 'flex' , alignItems: 'center' , justifyContent: 'center'}}>
												{
														checkIfInGroup(group.members) ?
															<a href className="button grp-btn leave-grp-btn" onClick={(e) => handleLeaveGroup(e,group.id)}>Leave Group</a>
															:
															<a href className="button grp-btn join-grp-btn"  onClick={(e) => handleJoinGroup(e,group.id)}>Join Group</a>
													}
												{/* <div className="button" style={{ color: "#000000",background:'#EAEAEA', fontSize:'12px', width: '45%' , padding: '5px' , fontWeight: '600' }}>Preview</div>	 */}
											</div>

											
										</div>
										
										{/* <div className="item6">
											{/* <span>Engr</span> */}
											{/* <i style={{ float: "right", fontSize: 25 }} className="las la-ellipsis-v"></i> */}
										{/* </div> */}
										


										{/* </div> */}

									</div>
								</a>
							</li>
					)}
				</ul>
				<div className="lodmore"><button className="btn-view btn-load-more" /></div>
			</div>
		</div>
		)
	}

	const getMyJoinRequests = () => {
		// console.log(gid)
		if(user&&user.id){
			GroupService.getMyJoinRequests(user.id).then(res => {
				// console.log('yes',res.data)
				setJoinRequests(res.data)
				// setRefresh(res.data);
				// setRequestFlag(true)
			})
		}
    }
	const cancelRequestGroup = (e,gid) => {
		e.preventDefault();
		// console.log(gid)
		let reqId ;
		if(joinRequests&&joinRequests.length>0){
			joinRequests.some(req=>req.group_id===gid?reqId=req.id:null)
			// console.log(reqId)
			GroupService.cancelRequestGroup(reqId).then(res => {
				// console.log('done delete')
				setRefresh(res.data);
				// setRequestFlag(true)
			})
		}
		
	}
	useEffect(() => {
		getAllGroups()
		getMyGroups()
		getMyJoinRequests()
	}, [showComp, refresh])

	useEffect(() => {
		testScript()
	}, [])


	return (
		<Layout user={user}>
			<div className="col-lg-6">
				<div className="central-meta swap-pg-cont">
					<div className="frnds">
						<div>
							<p className="Friends-Title common-title">Groups</p>
							<i style={{ float: "right", fontSize: 20 }} className="fas fa-ellipsis-v"></i>
						</div>
						
							
						</div>
						<div className="navContent">
							<ul className="nav nav-pills swap-page-nav " role="tablist">
								<li className="nav-item" style={{justifyContent:'flex-start'}}>
									<div className="all">
										<span style={{ cursor: 'pointer' }} onClick={() => setShowComp("allgroups")}>
											<span style={{  padding: '5px',marginRight:'5px' }}> 
											<i className="fa fa-users" style={{fontSize:'18px'}}></i>
											{/* <span>{`${following.length}`}</span> */}
											</span>
										All Groups
										</span>
									</div>	
								</li> 
								<li className="nav-item" style={{justifyContent:'center'}}>
									<div className="my">
										<span style={{ cursor: 'pointer' }} onClick={() => setShowComp("mygroups")}>
											<span style={{  padding: '5px',marginRight:'5px' }}> 
											<i className="fa fa-user-friends" style={{fontSize:'18px'}}></i>
											{/* <span>{`${following.length}`}</span> */}
											</span>
											My Groups 
										</span>
									</div>
								</li>
								<li className="nav-item" style={{justifyContent:'flex-end'}}>
									<div className="new">
										<span style={{ cursor: 'pointer' }} onClick={() => history.push('/group/create')}>
											<span style={{  padding: '5px',marginRight:'5px' }}> 
											<i class="fa fa-plus" style={{fontSize:'18px'}}></i>
											{/* <span>{`${following.length}`}</span> */}
											</span>
											Create group
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