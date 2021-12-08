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
			// setSearchedGroups(res.data)
		})
	}

	const getMyGroups = async () => {
		await GroupService.getGroupByCurrentUser(user.email).then(res => {
			const uniqueGroups = Array.from(new Set(res.data.map(a => a.id)))
        .map(id => {
          return res.data.find(a => a.id === id)
        })
			setMyGroups(uniqueGroups)
			// setSearchedMyGroups(uniqueGroups)
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
	const handleLeaveGroup = (e,group_id) => {
		e.preventDefault();
		console.log(group_id)
		GroupService.leaveGroup(user.id, group_id).then(res => {
			setRefresh(res.data)
			setGroup(res.data)
		})
	}

	const handleJoinGroup = (e,group_id) => {
		e.preventDefault();
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




	const showAllGroupsComponent = () => {
		// console.log(searchedGroups)
		return (
			<div className="tab-content">
				<div className="tab-pane active fade show " id="">
					<ul className="nearby-contct" style={{marginTop:'15px'}}>
						{/* <li class="friends-card groupalign" style={{marginRight: '10px'}}>
							<a href='/group/create'>
								<div className='groupsggstion-card' style={searchedGroups.length>0?{}:{height:'278px'}}>
									<div className='groupsggstion-img'>
										<div>
											<img src={Grpicon} className="no-img"/>
										</div>
										<i class="fas fa-plus-circle"></i>
									</div>
									<div className='groupsggstion-by'>
										<a href='/group/create'>
											<h5 style={{ fontWeight: 'bold',margin:'10px', fontSize: '13px', backgroundColor: 'rgb(3 51 71)', color: '#ffff', borderRadius: '5px' ,lineHeight:'35px' ,fontWeight: '600' }}>Create Group</h5>
										</a>
									</div>
								</div>
							</a>
						</li> */}
						{allGroups.map((group) =>
								<li key={group.id} className="friends-card groupalign" >
		                            <a href={`/groups/${group.id}`}>

										<div className="group-li-item">
											{/* <figure> */}
											<div class="item12">
												<a href={`/groups/${group.id}`} title="#"> <img src={group.groupImagePath ? fileStorage.baseUrl+group.groupImagePath : Grpicon} alt="" className={group.groupImagePath ? "img" : "no-img"} /></a>
												{/* </figure> */}
												{/* <button className="preview-btn" onClick={() => handleJoinGroup(group.id)}>Preview</button>	 */}
											</div>
											{/* <div className="  "> */}
											<div className="item23">
												<p className="grpnametag" style={{ height: '20px', fontWeight: '600'}}><a href={`/groups/${group.id}`} title="#">{`${group.name}`}</a></p>
												<p className="grp-mem-text">2.7K Members</p>
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
											
											{/* <div class="item6">
												{/* <span>Engr</span> */}
												{/* <i style={{ float: "right", fontSize: 25 }} class="las la-ellipsis-v"></i> */}
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

	const showMyGroupsComponent = () => {
		return (
			<div className="tab-content">
			
			<div className="tab-pane active fade show " id="">
				<ul className="nearby-contct" style={{marginTop:'15px'}}>
					{/* <li class="friends-card groupalign" style={{marginRight: '10px'}}>
						<a href='/group/create'>
							<div className='groupsggstion-card' style={searchedGroups.length>0?{}:{height:'270px'}}>
								<div className='groupsggstion-img'>
									<div>
										<img src={Grpicon} className="no-img"/>
									</div>
									<i class="fas fa-plus-circle"></i>
								</div>
								<div className='groupsggstion-by'>
									<a href='/group/create'>
										<h5 style={{ fontWeight: 'bold',margin:'10px', fontSize: '13px', backgroundColor: 'rgb(3 51 71)', color: '#ffff', borderRadius: '5px' ,lineHeight:'35px' ,fontWeight: '600' }}>Create Group</h5>
									</a>
								</div>
							</div>
						</a>
					</li> */}
					{myGroups.map((group,index) =>
							<li key={group.id} className="friends-card groupalign" style={((index+1)/3==0)?{marginRight:'0px'}:{marginRight:'10px'}}>
								<a href={`/groups/${group.id}`}>

									<div className="group-li-item">
										{/* <figure> */}
										<div class="item12">
											<a href={`/groups/${group.id}`} title="#"> <img src={group.groupImagePath ? fileStorage.baseUrl+group.groupImagePath : Grpicon} alt="" className={group.groupImagePath ? "img" : "no-img"} /></a>
											{/* </figure> */}
											{/* <button className="preview-btn" onClick={() => handleJoinGroup(group.id)}>Preview</button>	 */}
										</div>
										{/* <div className="  "> */}
										<div className="item23">
											<p className="grpnametag" style={{ height: '20px', fontWeight: '600'}}><a href={`/groups/${group.id}`} title="#">{`${group.name}`}</a></p>
											<p className="grp-mem-text">2.7K Members</p>
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
										
										{/* <div class="item6">
											{/* <span>Engr</span> */}
											{/* <i style={{ float: "right", fontSize: 25 }} class="las la-ellipsis-v"></i> */}
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

	useEffect(() => {
		getAllGroups()
		getMyGroups()
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
							<p className="Friends-Title">Groups</p>
							<i style={{ float: "right", fontSize: 20 }} class="fas fa-ellipsis-v"></i>
						</div>
						{/* <div class="navContent"> */}
							{/* <ul class="nav nav-pills " role="tablist"> */}
								{/* <li class="nav-item"> */}
									{/* <a class="nav-link active" data-toggle="pill" onClick={() => setShowComp("allgroups")}> <i class="las la-users"></i> All Groups <a className='numberCircle'></a></a> */}
									{/* <span>{`${allUser.length}`}</span> */}
								{/* </li> */}
								{/* <li class="nav-item"> */}
									{/* <a class="nav-link active" data-toggle="pill" onClick={() => setShowComp("mygroups")}> <i class="las la-user-friends"></i> My Groups <a className='numberCircle'></a></a> */}
									{/* <span>{`${following.length}`}</span> */}
								{/* </li> */}
								{/* <li class="nav-item"> */}
									{/* <a class="nav-link active" data-toggle="pill" onClick={()=>history.push('/group/create')}> <i class="las la-plus-circle"></i> Create Group <a className='numberCircle'></a></a> */}
									{/* <span>{`${followers.length}`}</span> */}
								{/* </li> */}
								
							{/* </ul> */}
							
						</div>
						<div class="navContent">
							<ul class="nav nav-pills swap-page-nav " role="tablist">
								<li class="nav-item" style={{justifyContent:'flex-start'}}>
									<div className="all">
										<span style={{ cursor: 'pointer' }} onClick={() => setShowComp("allgroups")}>
											<span style={{  padding: '5px' }}> 
											<i class="las la-users" style={{fontSize:'20px'}}></i>
											{/* <span>{`${following.length}`}</span> */}
											</span>
										All Groups
										</span>
									</div>	
								</li> 
								<li class="nav-item" style={{justifyContent:'center'}}>
									<div className="my">
										<span style={{ cursor: 'pointer' }} onClick={() => setShowComp("mygroups")}>
											<span style={{  padding: '5px' }}> 
											<i class="las la-user-friends" style={{fontSize:'20px'}}></i>
											{/* <span>{`${following.length}`}</span> */}
											</span>
											My Groups 
										</span>
									</div>
								</li>
								<li class="nav-item" style={{justifyContent:'flex-end'}}>
									<div className="new">
										<span style={{ cursor: 'pointer' }} onClick={() => history.push('/group/create')}>
											<span style={{  padding: '5px' }}> 
											<i class="las la-user-friends" style={{fontSize:'20px'}}></i>
											{/* <span>{`${following.length}`}</span> */}
											</span>
											Create group
										</span>
									</div>
								</li>
							</ul>
												
						</div>
						<div class="friends-search-container grp-search" >
							<input className="friend-search" type="text" id="header-search" placeholder="Search Groups" name="s" onChange={handleSearchGroup} style={{width:'100%',marginLeft:'0'}}/>
						</div>
						{handleShowComp()}
					</div>
			</div>
		</Layout>
	);
}
export default GroupComponent;