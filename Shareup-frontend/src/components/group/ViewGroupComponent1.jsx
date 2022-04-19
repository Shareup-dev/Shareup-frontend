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

	const [postContent, setPostContent] = useState("");
	const [commentContent, setCommentContent] = useState("");
	const [files, setFiles] = useState({});
	const [postImage, setPostImage] = useState({});
	const [showPostImage, setShowPostImage] = useState(false);
	 const [showComment, setShowComment] = useState(false)
	 const [showReactions, setShowReactions] = useState(false)
	 const [likeReaction, setLikeReaction] = useState(null)

	const [uploadError, setUploadError] = useState("");



	const [editPostId, setEditPostId] = useState(null)

	const [img, setImage] = useState("");
    const [postsForUser, setPostsForUser] = useState([]);
    const [userF, setUserF] = useState(null);
    

    //functions

    useEffect(() => {
		getGroupPosts()
		getGroupById()
	}, [])

    const getGroupById = async () => {
		await GroupService.getGroupById(groupid).then(res => {
			setGroup(res.data)
			setMembers(res.data.members)
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
	const handleJoinGroup = () => {
		GroupService.joinGroup(user.id, group.id).then(res => {
			setGroupState(res.data)
			setGroup(res.data)
		})
	}

	const handleLikePost = async (post_id) => {
		UserService.likePost(user.id, post_id).then(res => {
			setRefresh(res.data)
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
   
    
    return(
        <div id="group-page">
            <ShareupInsideHeaderComponent />
            <div className='feature-photo'>
                <div className='gp-cov-img'>
                    {/* <div className='gp-pf-img'></div> */}
                    <img src={group.groupCoverPath ? fileStorage.baseUrl+group.groupCoverPath : ''} alt=""  />
                </div>
                <div className='pagetype-2 grp-det'>
                    <div>
                        <div className='grp-name'>{group.name}</div>
                        <div className='mt-15'>{group.privacySetting&&group.privacySetting==true ?'Public':'Private'} <span className='pl-15 fw-6'>{group.members&&group.members.length} Members</span></div>      
                    </div>
                    <div className='btns'>
                 
                            { 
                                group.members&&group.members.length>0?
                                group.members.map((member)=>{
                                    if(member.id==user.id){
                                        return(  
                                            <div className="dropdown ">
                                                <button className="drp-btn dropdown-toggle grp-btn join-grp-btn" type="button" data-toggle="dropdown">Joined
                                                {/* <span className="caret"></span> */}
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><a href="#" onClick={handleLeaveGroup}>Leave group</a></li>
                                                    <li><a href="javascript:void(0)" onClick={handleDeleteGroup}>Delete group</a></li>

                                                </ul>
                                            </div>
                                        )
                                    }
                                })
                                :<button className="button drp-btn grp-btn join-grp-btn" onClick={handleJoinGroup}>Join</button>
                                
                            }
                        <button className='button ft-14 grp-btn'>
                        {
                        group.members&&group.members.length>0?
                            group.members.map((member)=>{
                                if(member.id == user.id){
                                    return('Invite')
                                }
                            })
                        :'Invite'}
                        </button>

                    </div>
                </div>
                <div className=' grp-det-tabs'>
                <Tabs defaultActiveKey={group.members&&group.members.length&&group.members.some(member=>user.id===member.id)?"discussion":"about"} id="uncontrolled-tab-example" className="mb-3 " >
                    <Tab eventKey="about" title="About">
                        <div className='ab-1'>
                            <div className='fw-6 abt-title clr-blk'>About this group</div>
                            <div className='d-flex mb-15'>
                                <i className="fa fa-globe pr-15" aria-hidden="true"></i>{ group.privacySetting && group.privacySetting === true ?
                                        <div><div className='fw-6 clr-blk'>Public</div><div className="ft-13 padtop-5">Anyone can see who's in the group and what they post.</div></div>:'Private'}</div>
                            <div className='d-flex mb-15'><i className="fa fa-map-marker pr-15 d-flex" aria-hidden="true"></i> <div className='fw-6 clr-blk'>Doha ,Qatar</div></div>
                            <div className='d-flex'><i className="fa fa-history pr-15 " aria-hidden="true"></i> <div className='fw-6 clr-blk'>Created on March 04 2021</div></div>
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
                    {
                        group.members&&group.members.length>0?
                            group.members.map((member)=>{
                                if(member.id == user.id){
                                    return(
                                        <Tab eventKey="discussion" title="Discussion">
                                            <CommonComposer />
                                        </Tab>
                                    )
                                }
                            }):''}
                    {
                        group.members&&group.members.length>0?
                            group.members.map((member)=>{
                                if(member.id == user.id){
                                    return(
                                        <Tab eventKey="events" title="Events" >
                                            <div className='ab-1'>
                                                <div className='fw-6 abt-title clr-blk '>Events</div>
                                                <div className='evnt'>
                                                    <div className='no-evnt-text'>No Events yet</div> 
                                                    <button className='ft-15 grp-btn leave-grp-btn'>Create Event</button>                     
                                                </div>
                                            </div>
                                        </Tab>
                                    )
                                }
                            }):''}
                    {group.members&&group.members.length>0?
                            group.members.map((member)=>{
                                if(member.id == user.id){
                                    return(
                                        <Tab eventKey="members" title="Members" >
                                               <MembersComponent group={group}/>  
                                        </Tab>
                                    )
                                }
                            })
                        :''}
                </Tabs>
                </div>
            </div>
        </div>)
}
export default ViewGroupComponent1;
