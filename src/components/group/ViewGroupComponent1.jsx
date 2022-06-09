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
import Layout from '../LayoutComponent';
import EditPostComponent from '../user/EditPostComponent'
import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import GroupsWidgetComponent from '../widgets/GroupsWidgetComponent';
import FollowingWidgetComponent from '../widgets/FollowingWidgetComponent';
import FriendsWidgetComponent from '../widgets/FriendsWidgetComponent';
import PostComponent from '../post/PostComponent';
import MenuWidgetComponent from '../widgets/MenuWidgetComponent';
import { testScript } from '../../js/script';
import Popup from 'reactjs-popup';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import {Tab,Tabs} from 'react-bootstrap'
import CommonComposer from '../composer/CommonComposer';
import MembersComponent from './MembersComponent'
import moment from 'moment';
import InviteMembersComponent from './InviteMembersComponent'
import MemberRequests from './MemberRequests'
import {Modal} from 'react-bootstrap';
import $ from 'jquery';
import { getInputAdornmentUtilityClass } from '@mui/material';
import { fontSize } from '@mui/system';
import  { handleSendNotification } from "../dashboard/ShareupInsideHeaderComponent";

function ViewGroupComponent1({post}) {
	const { id: stringId } = useParams();
	const groupid = 1 * stringId

	let history = useHistory();

	const { user } = useContext(UserContext)

	const [group, setGroup] = useState([]);
	const [groupState, setGroupState] = useState([]);
	const [members, setMembers] = useState([]);
	const [owner, setOwner] = useState(null);

	const [groupPosts, setGroupPosts] = useState([]);
	const [userInGroup, setUserInGroup] = useState(false);
	const [userR, setUserR] = useState([]);
	const [Privacy, setPrivacy] = useState("");


	//
	const [refresh, setRefresh] = useState(null)
	const [requestFlag, setRequestFlag] = useState(false)
	const [moreFlag, setMoreFlag] = useState(false)
	let [joinedFlag, setJoinedFlag] = useState(false)


	const [postContent, setPostContent] = useState("");
	const [commentContent, setCommentContent] = useState("");
	const [files, setFiles] = useState({});
	const [postImage, setPostImage] = useState({});
	const [showPostImage, setShowPostImage] = useState(false);
	 const [showComment, setShowComment] = useState(false)
	 const [showReactions, setShowReactions] = useState(false)
	 const [likeReaction, setLikeReaction] = useState(null)

	const [uploadError, setUploadError] = useState("");
	

    const [showInviteModal, setShowInviteModal] = useState(false);


	const [editPostId, setEditPostId] = useState(null)
	const [groupCover, setGroupCover] = useState(null)
	
	
    const [coverRender, setCoverRender] = useState(null)

	const [img, setImage] = useState("");
    const [postsForUser, setPostsForUser] = useState([]);
    const [userF, setUserF] = useState(null);
    const [admins,setAdmins] = useState([]);
	const [inviteDetails,setInviteDetails] = useState([]);

    //functions

    useEffect(async() => {
		await getGroupById()
		await getGroupMembers()
		await getGroupPosts()
		// console.log(user)
		if(user&&groupid){
			console.log(user.id)
			// if()
			await didJoinRequestSent(groupid);
			await getGroupJoinInvites();
		}
		
	}, [joinedFlag])

	const getGroupJoinInvites = () =>{
		GroupService.getGroupInvitedOrNot(user.id,groupid).then((res)=>{
			console.log(res.data)
			setInviteDetails(res.data)
			inviteDetails.some(invite=>invite.group_id ===groupid?console.log('fff'):console.log('ddddddddddddddd'))
		})
	}

	const photos =[{
		id:1,
		img:'https://iso.500px.com/wp-content/uploads/2014/07/big-one.jpg'
		
	}, {
		id:2,
		img:'https://images.ctfassets.net/u0haasspfa6q/2sMNoIuT9uGQjKd7UQ2SMQ/1bb98e383745b240920678ea2daa32e5/sell_landscape_photography_online'
	}]
	const setGroupData = async (data) =>{
		await setCoverRender(data.groupCoverPath)
		await setGroup(data)
		await console.log(coverRender,"YOIASOIODA")
			
	}
    const getGroupById = async () => {
		await GroupService.getGroupById(groupid).then(async(res) => {
			await setGroupData(res.data)
			// await setMembers(res.data.members)
            // setOwner(res.owner)
			// console.log(JSON.stringify(res.data) + " helooo");
		})
	}
	// const getAdmins = async() =>{
	// 	await GroupService.getAdmins(groupid).then(res => {
	// 		setAdmins(res.data)
    //         // setOwner(res.owner)
	// 		// console.log("YOIASOIODA")
	// 		// console.log(JSON.stringify(res.data) + " helooo");
	// 	})
	// }
	const getGroupMembers = async () => {
		await GroupService.getGroupMembers(groupid).then(res => {
			// setGroup(res.data)
			setMembers(res.data)
			console.log(res.data)
			if(user&&res.data.some(member=>member.id===user.id)){
				setJoinedFlag(true)
			}
            // setOwner(res.owner)
			// console.log("YOIASOIODA")
			// console.log(JSON.stringify(res.data) + " helooo");
			
		})
	}
	const getGroupPosts = async () => {
		await GroupService.getGroupsPostsById(groupid).then(res => {
			setGroupPosts(res.data)
		})
	}
    const handlePrivacy=(event)=>{
		console.log(event.target.value)
		  setPrivacy(event.target.value)
	  }

    // const getCommentCounter = (comments) => {
    //     let counter = 0
    //     comments.map(comment => {
    //         counter += comment.replies.length + 1
    //     })
    //     return counter
    // }
    const handlePostContent = (event) => {
		console.log(event.target.value)
		setPostContent(event.target.value)
	}

	const handleDeletePost = (postid) => {
		PostService.deletePost(postid).then(res => {
			console.log(res.status)
			setRefresh(res.data)
			// window.location.reload();
		})
	}

	const handleCommentContent = (event) => {
		console.log(event.target.value)
		setCommentContent(event.target.value)
	}

	const handlePostingComment = (postid) => {
		const comment = { content: commentContent }
		PostService.addComment(user.id, postid, comment).then(res => {
			console.log(res.status)
			// setRefresh(res.data)
			window.location.reload();
		})
	}

	const handleEditPost = (id) => {
		setEditPostId(id)
	}

	const handleFile = (event) => {
		console.log(event.target.files[0])
		setFiles(event.target.files[0])
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2) {
				setPostImage(reader.result)
			}
		}
		console.log(event.target.files[0])
		// if(event.target.files[0].type === blob){
		reader.readAsDataURL(event.target.files[0])
		// }
		setShowPostImage(true)
	}

	const handleRemoveImage = () => {
		setFiles({})
		setShowPostImage(false)
	}

	const handleEditingSave = (value) => {
		setEditPostId(value)
		// console.log(res.status)
		// window.location.reload();
	}

	const checkIfLiked = (post) => {
		// maybe this is more effecient
		// post.reactions.map(r => {
		//   console.log(JSON.stringify(r.user))
		//   if(r.user.id === user.id){
		//     return true
		//   }else{
		//     return false
		//   }
		// })
		const result = post.reactions.filter(reaction => reaction.user.id == user.id)
		if (result.length > 0) {
			return true
		}
		return false
	}

	// Multiple files
	// const uploadFile = () => {
	//   const formData = new FormData();
	//   for (let i = 0; i < files.length; i++) {
	//     formData.append(`files`, files[i])
	//   }
	//   console.log("formdata: " + formData);
	//   UserService.uploadFiles(formData).then(res => {
	//     console.log(res.data)
	//   })
	// }

	const handleDeleteComment = (commentid) => {
		PostService.deleteComment(commentid).then(res => {
			console.log(res.status)
			setRefresh(res.data)
			// window.location.reload();
		})
	}

	const uploadPost = (event) => {
		event.preventDefault();
		setUploadError("")
		console.log("uploading post working")
		if (postContent === "" && (Object.keys(files).length === 0 && files.constructor === Object)) {
			console.log("cant be null")
			setUploadError("Please Insert A Text or an Image")
			return
		}

		const formData = new FormData();
		formData.append('content', postContent)
		formData.append('groupid', groupid)
		// if(files === {}){
		//   setFiles(null)
		// }
		console.log(" this is the files" + files)
		formData.append(`files`, files)
		PostService.createPost(user.id, formData).then(res => {
			console.log(JSON.stringify(res))
			setPostContent("")
			handleRemoveImage()
			setRefresh(res.data)
			// window.location.reload();
		})
	}

	const handleLeaveGroup = () => {
		GroupService.leaveGroup(user.id, group.id).then(res => {
			setGroupState(res.data)
			setGroup(res.data)
		})
	}
    const handleDeleteGroup = (e) => {
        e.preventDefault()
        if(group.owner){
            console.log(group.owner,'d')
            GroupService.deleteGroup( group.owner.id, group.id).then(res => {
                setTimeout(function () { history.push(`/groups`) }, 2000);
            })
        }

	}
	const handleJoinGroup = async () => {
		await GroupService.joinGroup(user.id, group.id).then(res => {
			setJoinedFlag(true)
			setGroupState(res.data)
			setGroup(res.data)
			console.log(joinedFlag)
		})
	}

	const handleLikePost = async (post_id) => {
		UserService.likePost(user.id, post_id).then(res => {
			handleSendNotification(res.data.user.id,'Liked your post',user.firstName,user.lastName,user.email,"post",post_id)

			setRefresh(res.data)
		})
	}
	const didJoinRequestSent = (gid) => {
		// console.log(gid)
        GroupService.joinRequestSent(user.id,gid).then(res => {
			// setRefresh(res.data);
			console.log('yes',res.data)
			// setRequestFlag(res.data)
		})
    }
	const acceptRequest = (rid) => {
        GroupService.acceptMemberRequest(rid).then(res => {
			setRefresh(res.data);
		})
    }
    const rejectRequest = (rid) => {
		GroupService.rejectMemberRequest(rid).then(res => {
			setRefresh(res.data);
		})
    }
	const handleShowingReaction = () => {
        setTimeout(function () { setShowReactions(true) }, 200);
    }

    const handleUnshowingReaction = () => {
        setTimeout(function () { setShowReactions(false) }, 200);
    }

    const handleReaction = () => {
        if(likeReaction) {
            return (<img width={30} style={{marginTop:'-5px'}} src={`../assets/images/gif/${likeReaction}.gif`}/>)
        }
        return (<i class="far fa-star"></i>)
    }

    const handleSettingReactions = (reaction) => {
        setLikeReaction(reaction)
        if (!checkIfLiked(post)) {
            handleLikePost(post.id)  
        }
    }
    const handleCounterReaction = () => {
        if(likeReaction) {
            return (<img width={20} style={{marginTop:'-5px'}} src={`../assets/images/gif/${likeReaction}.gif`}/>)
        }
        return (<i class="las la-star"></i>)
    }
	const checkIfInGroup = (members) => {
		const found = members.some(el => el.id === user.id);
		return found
	}
	const cancelRequestGroup = (members) => {

	}
	const handleCloseInviteModal = () => {setShowInviteModal(false);}
	const handleShowInviteModal = () => {setShowInviteModal(true);}
	// $(".invitefrienddrp").click(function(){
	// 	$("#uncontrolled-tab-example-tab-people").addClass("active nav-link nav-item"); 
	// 	$("#uncontrolled-tab-example-tabpane-people").addClass("active"); 
	// 	return false;
	// });
	const handleSearchedAdmins = () =>{}
	const removeAdmin = () =>{}


	const changeCover = async (event) =>{
		console.log(event.target.files[0])
		await setGroupCover(event.target.files[0])
        const reader = new FileReader();
		console.log(groupCover)
        reader.onload = () => {
            if (reader.readyState === 2) {
                setCoverRender(reader.result)
            }
        }
        reader.readAsDataURL(event.target.files[0])
		const formData = await new FormData();
		await formData.append('group_cover_image', groupCover)
		if(groupCover!==null){
			await GroupService.uploadGroupCoverImage(groupid,formData).then(res => {
				console.log(res.data)
			})
		}
        // // setShowCoverPicture(true)
	}
	// const handleGroupCover = (event) => {
    //     let validated = false
    //     setGroupCover(event.target.files[0])
    //     const reader = new FileReader();

    //     reader.onload = () => {
    //         if (reader.readyState === 2) {
    //             setCoverRender(reader.result)
    //         }
    //     }
    //     reader.readAsDataURL(event.target.files[0])
    //     setShowCoverPicture(true)
    // }
	const acceptInvite = () =>{
		let inviteId;
		inviteDetails.map((invite)=>{
			if(invite.group_id === groupid && invite.inviteAccepted === false){
				inviteId = invite.id
			}
		})
		GroupService.acceptInvite(inviteId).then((res)=>{
			if(res.data&&res.data.inviteAccepted===true){
				setJoinedFlag(true)
				getGroupMembers()
			}			
		})
	} 
    return(
        <div id="group-page">
            <ShareupInsideHeaderComponent />
            <div className='feature-photo'>
				<div style={{height:'20px'}}></div>
                <div className='gp-cov-img'>
                    <div  className='cover-img' style={coverRender&&{backgroundImage: `url(${coverRender})`,backgroundColor:'#c4c4c4',backgroundSize:'cover'}}></div>
					{group&& group.owner&&
							user.id === group.owner.id
							?
						<>
							<label for="file-input" className='change-cvr-opt'><i className="fas fa-edit" style={{fontSize:'20px'}} ></i></label>
							<input id="file-input" type="file" name="cover_image" accept="image/*" onChange={changeCover}></input>
						</>
						:null
					}
                </div>
                <div className='pagetype-2 grp-det'>
                    <div>
                        <div className='grp-name'>{group.name}</div>
                        <div className='grp-desc'>{group.description}</div>
                        <div className='mt-15 d-flex'>{group.privacySetting&&group.privacySetting==true ?<div><i className="fa fa-globe pad-r-5" aria-hidden="true"></i>Public</div>
						:<div><i className="fa fa-lock pad-r-5" aria-hidden="true"></i>Private</div>} <span className='pl-15 fw-6'>{group.members&&group.members.length} Members</span></div>      
                    </div>
                    <div className='grp-det-btns'>
								{
                                    members&&checkIfInGroup(members)&& joinedFlag ?
										<div className="dropdown ">
											<button className="drp-btn dropdown-toggle grp-page-btn join-grp-btn" type="button" data-toggle="dropdown">Joined
											{/* <span className="caret"></span> */}
											</button>
											<ul className="dropdown-menu">
												<li><a href="#" onClick={handleLeaveGroup}>Leave group</a></li>
												{group.owner.id===user.id?<li><a href="javascript:void(0)" onClick={handleDeleteGroup}>Delete group</a></li>:null}

											</ul>
										</div>
                                    : requestFlag
                                           ? <button className="button drp-btn grp-page-btn join-grp-btn" onClick={handleJoinGroup}>Cancel Request</button>

                                    	   : (inviteDetails.some(invite=>invite.group_id===groupid)?
										   	<button className="button drp-btn grp-page-btn join-grp-btn" onClick={acceptInvite}>Accept Request</button>
											   :<button className="button drp-btn grp-page-btn join-grp-btn" onClick={handleJoinGroup}>Join Group</button>)
                                          
                                }
                 
                            {/* { members&&members.length>0 
								?members.some(member=>member.id===user.id)
									?
									<div className="dropdown ">
										<button className="drp-btn dropdown-toggle grp-page-btn join-grp-btn" type="button" data-toggle="dropdown">Joined
										</button>
										<ul className="dropdown-menu">
											<li><a href="#" onClick={handleLeaveGroup}>Leave group</a></li>
											<li><a href="javascript:void(0)" onClick={handleDeleteGroup}>Delete group</a></li>

										</ul>
									</div>
									:requestFlag?
									<button className="button drp-btn grp-page-btn join-grp-btn" onClick={handleJoinGroup}>Cancel Request</button>
									:<button className="button drp-btn grp-page-btn join-grp-btn" onClick={handleJoinGroup}>Join Group</button>
								
								:requestFlag?
									<button className="button drp-btn grp-page-btn join-grp-btn" onClick={handleJoinGroup}>Cancel Request</button>
									:<button className="button drp-btn grp-page-btn join-grp-btn" onClick={handleJoinGroup}>Join Group</button>
							} */}
										                        
                        {	group&& group.owner&&
							user.id === group.owner.id
							?<div className="dropdown ">
								<button className="drp-btn dropdown-toggle grp-page-btn leave-grp-btn" type="button" data-toggle="dropdown">Invite
								{/* <span className="caret"></span> */}
								</button>
								<ul className="dropdown-menu">
									<li> <a  className='invitefrienddrp'> Invite friends in shareup</a></li>
									<li><a href="javascript:void(0)" onClick={handleDeleteGroup}>Invite via email</a></li>
									<li><a href="javascript:void(0)" onClick={handleDeleteGroup}>Invite via link</a></li>


								</ul>
							</div>
							:group.admins&&group.admins.length>0?
								group.admins.some(admin=>admin.id===user.id?
                                    <div className="dropdown ">
											<button className="drp-btn dropdown-toggle grp-page-btn leave-grp-btn" type="button" data-toggle="dropdown">Invite
											{/* <span className="caret"></span> */}
											</button>
											<ul className="dropdown-menu">
												<li><a className='invitefrienddrp'>Invite friends in shareup</a></li>
												<li><a href="javascript:void(0)" >Invite via email</a></li>
												<li><a href="javascript:void(0)" >Invite via link</a></li>


											</ul>
										</div>
								:null)
								:null
							}
                        
							{ group.owner&&group.owner.id===user.id?
								<div className="dropdown more-btn">
								<button className="drp-btn dropdown-toggle " type="button" data-toggle="dropdown" style={{background:"transparent",border:"none"}}>
									<i style={{ float: "right", fontSize: 30 ,height:'30px',color:"black" }} className="las la-ellipsis-v" ></i>
								{/* <span className="caret"></span> */}
								</button>
								<ul className="dropdown-menu">
									{group&&<li ><a href={"/groups/"+group.id+"/edit"} >Edit group</a></li>}
								</ul>
							</div>
							:null
							}
                    </div>
                </div>
                <div className=' grp-det-tabs'>
                <Tabs defaultActiveKey={group.privacySetting==true?"discussion":(group&&(group.members&&group.members.some(member=>member.id===user.id)||group.owner&&group.owner.id===user.id))?"discussion":"about"} id="uncontrolled-tab-example" className="mb-3 " >
                    <Tab eventKey="about" title="About">
                        <div className='ab-1'>
                            <div className='fw-6 abt-title clr-blk'>About this group</div>
                            <div className='d-flex mb-30'>
                                { group.privacySetting && group.privacySetting === true ?
                                        <div className='d-flex'>
											<i className="fa fa-globe pr-15" aria-hidden="true"></i>
											<div>
												<div className='fw-6 clr-blk'>Public</div>
												<div className="ft-13 padtop-5">Anyone can see who's in the group and what they post.</div></div>
											</div>
										:<div className='d-flex'>
										<i className="fa fa-lock pr-15" aria-hidden="true"></i>
										<div>
											<div className='fw-6 clr-blk'>Private</div>
											<div className="ft-13 padtop-5">Only members can see who's in the group and what they post.</div></div>
										</div>
								}
							</div>
                            <div className='d-flex mb-30'><i className="fa fa-map-marker pr-15 d-flex" aria-hidden="true"></i> <div className='fw-6 clr-blk'>Doha ,Qatar</div></div>
                            <div className='d-flex mb-30'><i className="fa fa-history pr-15 " aria-hidden="true"></i> <div className='fw-6 clr-blk'>Created on {moment(group.created_at).format('MM/DD/YYYY')}</div></div>
                            <div className='d-flex'><i class="fa fa-user pr-15 d-flex" aria-hidden="true"></i> <div className='fw-6 clr-blk'>Created by {group&&group.owner&&group.owner.firstName+' '+group.owner.lastName}</div></div>
							
                        </div>
                        <div className='ab-2'> 
                            <div className='clr-blk fw-6 br-bottom pb-15 mb-15'>Members</div>
                            <div>{group.members&&group.members.length} Members</div>
                        </div>
                        <div className='ab-3'> 
                            <div className='clr-blk fw-6 br-bottom pb-15 mb-15'>Activity</div>
                            <div> No Activities</div>
                        </div>
                    </Tab>
                    {	group.privacySetting&&group.privacySetting==true|| group&&group.members&&group.members.length&&group.members.some(member=>member.id===user.id) ?
							<Tab eventKey="discussion" title="Discussion">
								<CommonComposer group={group}/>
							</Tab>
                        :null}
                    {
                        group.privacySetting&&group.privacySetting==true|| group&&group.members&&group.members.length&&group.members.some(member=>member.id===user.id) ?
						
							<Tab eventKey="events" title="Events" >
								<div className='ab-1'>
									<div className='fw-6 abt-title clr-blk '>Events</div>
									<div className='evnt'>
										<div className='no-evnt-text'>No Events yet</div> 
										<button className='ft-15 grp-page-btn leave-grp-btn'>Create Event</button>                     
									</div>
								</div>
							</Tab>
                                   
						:null}
                    { group.privacySetting&&group.privacySetting==true || members&&members.length>0&&members.some(member=>member.id===user.id)?
                            
							<Tab eventKey="members" title="Members" >
								{
									(group&&group.owner.id === user.id) || (group.admins&&group.admins.length>0&&group.admins.some(admin=>admin.id===user.id))?
									<Tabs>
										<Tab eventKey='member1' title={'Members '+members.length}>
											<MembersComponent group={group}/>  
										</Tab>
										
											<Tab eventKey="member2" title="Member Requests" >
												<MemberRequests group={group} acceptRequest={acceptRequest} rejectRequest={rejectRequest} /> 
											</Tab>
									</Tabs>
										: 
											<MembersComponent group={group}/>  
								}

							</Tab>
                               
                        :null}
						 {group.owner&&group.owner.id===user.id?
                            
							<Tab eventKey="people" title="People" >
								<InviteMembersComponent group={group} members={members}/> 
							</Tab>
                               
                        :null}
						{group.owner&&group.owner.id===user.id?
                            
							<Tab eventKey="admins" title="Admins" >
								 <div className="central-meta swap-pg-cont grp-pg-invite-cont">
									<div className="frnds">
										<div className='fw-6  abt-title no-brdr-btm  clr-blk'>Admins</div>
										<div class="friends-search-container grp-search">
											{/* <i class="las la-search"></i> */}
											<input className="friend-search" type="text" id="header-search" placeholder="Search Admins" name="s" onChange={handleSearchedAdmins} />
										</div>
										<div className="tab-pane active fade show " id="following">
											<ul className="nearby-contct" style={{marginTop:'15px'}}>
											{ 
												group.admins&&group.admins.length>0?
												// friendsList.map((friend)=>{
													group.admins.map(admin=> 
														<li key={admin.id} className="friends-card grp">
															<div className="grid-container">
																<div class="item1">
																	<a href={`/profile/${admin.email}`} title={`${admin.email}`}><img src={admin.profilePicturePath} alt="" /></a>
																</div>
																<div class="item2">
																	<p className="nameTag"><a href={`/profile/${admin.email}`} title={`${admin.email}`}>{`${admin.firstName} ${admin.lastName}`}</a></p>
																	<div  style={{fontSize:'12px',paddingTop:'5px'}}>10 Mutual admins</div>
																</div>
																
																<div className="item5">
																	<div className="dropdown ">
																		<button className="drp-btn dropdown-toggle admin-more" type="button" data-toggle="dropdown">
																		<i style={{ float: "right", fontSize: 25 }} class="las la-ellipsis-v" onClick={()=>setMoreFlag(!moreFlag)}></i>
																		{/* <span className="caret"></span> */}
																		</button>
																		<ul className="dropdown-menu">
																			<li><a onClick={removeAdmin} style={{fontSize:'13px'}}>Remove Admin</a></li>
																		</ul>
																	</div>
																</div>
															</div>
														</li>
													)
												
											: <div>No user found</div>
											}
											</ul>
										</div>
									
									</div>
								</div>
							</Tab>
                               
                        :null}
						{ group.privacySetting===true?
							<Tab eventKey="media" title="Media">
							<div style={{background:'white'}}>
								<Tabs>
									<Tab eventKey="photos" title="Photos">
									<div className='d-flex photos-cont'>
										{
											photos.map(photo=>
												<div className="mr-10"><img src={photo.img} width='185px' height='185px'/></div>
											)
										}
									</div>
									</Tab>
								
									<Tab eventKey="videos" title="Videos">
										<div style={{minHeight:'100px', display:'flex',alignItems:'center',justifyContent:'center'}}>
											No videos
										</div>
									</Tab>
								</Tabs>
							</div>
							
				
						</Tab>
						:null
						}	
                </Tabs>
                </div>
            </div>
			{
			showInviteModal?
			<Modal show={showInviteModal} onHide={handleCloseInviteModal}>
			<Modal.Header closeButton>
			</Modal.Header>
			<Modal.Body>
					
			</Modal.Body>
			<Modal.Footer>
			{/* <Button variant="secondary" onClick={handleClose}>
				Close
			</Button> */}
			<Button variant="primary" >
				Save 
			</Button>
			</Modal.Footer>
			</Modal>:''
		}
        </div>

		)
}
export default ViewGroupComponent1;
