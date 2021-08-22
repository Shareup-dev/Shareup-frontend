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



function ViewGroupComponent({post}) {
	const { id: stringId } = useParams();
	const groupid = 1 * stringId

	let history = useHistory();

	const { user } = useContext(UserContext)

	const [group, setGroup] = useState([]);
	const [groupState, setGroupState] = useState([]);
	const [members, setMembers] = useState([]);
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
	const handlePrivacy=(event)=>{
		console.log(event.target.value)
		  setPrivacy(event.target.value)
	  }

 const getCommentCounter = (comments) => {
        let counter = 0
        comments.map(comment => {
            counter += comment.replies.length + 1
        })
        return counter
    }
	const getGroupById = async () => {
		await GroupService.getGroupById(groupid).then(res => {
			setGroup(res.data)
			setMembers(res.data.members)
			console.log("YOIASOIODA")
			console.log(JSON.stringify(res.data) + " helooo");
		})
	}

	const getGroupPosts = async () => {
		await GroupService.getGroupsPostsById(groupid).then(res => {
			setGroupPosts(res.data)
		})
	}

	//
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

	const showOrNot = () => {
		if (!group.members) {
			return (null)
		}
		if (group.members.some(member => member.id === user.id)) {
			return (<>
				<div className="central-meta">
					<div className="new-postbox">
						<figure>
							<img src={user.profilePicturePath}  alt="" />
						</figure>
						<div className="newpst-input">
                  <Form>
                   {postUp()}
                    {/* <textarea rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
                    {showPostImage ?
                      <>
                        <img id="preview" src={postImage} style={{ width: "80%", border: "3px solid" }} />
                        <button onClick={handleRemoveImage}>x</button>
                      </>
                      :
                      null
                    } */}

                    <div className="attachments">
                      <ul>
                        <li>
                        {popUp()}
                          
                          </li>
{/* <label className="fileContainer"><img src="/assets/images/share-2.png" alt="img" /><span>Share Up</span> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                        </label> */}
                        <li>{shareUp()}</li>
                        <li>{photos()}</li>
                        {/* <li><i class="las la-camera"></i> <label className="fileContainer"> <input type="file" />
                        </label></li> */}
                        
                          
                       
                      </ul>
                      
                    </div>
                    
                  </Form>
                </div>
					</div>
				</div>
				<div className="loadMore">
					{
						groupPosts.map(
							post =>
							<PostComponent post={post} setRefresh={setRefresh}/>	
							)
					}

				</div>
			</>)
		} else {
			return (
				<h3 style={{ textAlign: 'center' }}>Join Group To See Content</h3>
			)
		}
	}
	const imageshowPost =() =>{
  
		return( 
		  <div style={{margin:'0 11px', padding:'15px',boxShadow: '0 0 3px rgb(0 0 0 / 16%)',borderRadius:'5px'}}> 
		  <div style={{display:'inline'}}>Add More</div>
	   
		   <div className="add-smilespopup"><label className="fileContainer"><i class="lar la-file-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
		  </label></div>
		  <div className="gifpopup"><label className="fileContainer"><i class="las la-user-tag"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
		  </label></div>
		  <div className="campopup"><label className="fileContainer"><i class="las la-map-marker-alt"></i><input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
		  </label></div>
			
		 
		  {/* <ul style={{marginLeft:'10px'}}>
			<li style={{fontSize:'12px'}}>What's in hang?</li>
			<li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
		  </label></li></ul>*/}</div> 
		)
		  
		
		}
	   
		const imageshow =() =>{
  
			return( 
			  <div style={{margin:'0 11px', padding:'15px',boxShadow: '0 0 3px rgb(0 0 0 / 16%)',borderRadius:'5px'}}> 
			  <div style={{display:'inline'}}>What's in hang?</div>
		   
			   <div className="add-smilespopup"><label className="fileContainer"><i class="lar la-file-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
			  </label></div>
			  <div className="gifpopup"><label className="fileContainer"><i class="las la-user-tag"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
			  </label></div>
			  <div className="campopup"><label className="fileContainer"><i class="las la-map-marker-alt"></i><input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
			  </label></div>
				
			 
			  {/* <ul style={{marginLeft:'10px'}}>
				<li style={{fontSize:'12px'}}>What's in hang?</li>
				<li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
			  </label></li></ul>*/}</div> 
			)
			  
			
			}
	
	  const popUp = () => {
		return(
	 <Popup  trigger={<span style={{cursor: "pointer"}} ><span style={{marginRight:'5px',padding:'5px'}}><img style={{verticalAlign:'middle',width:'15px'}} src="/assets/images/hangshare.svg" alt="img" /></span>Hang Share</span>} modal>
						   {close => ( <Form style={{margin:'5px'}} className="popwidth">
						
		<div className="headpop">
		  
		<div className="row"><div style={{width:'5%'}}><a href="#!" style={{padding:'10px 80px 10px 0'}} onClick={close}><i class="las la-times"></i></a></div>
		<div style={{ color:'#000000',fontSize:'14px',fontWeight:'bold',width:'70%',textAlign: 'center'}}> <span>Today to me, Tomorrow to you</span></div>
		<div style={{width:'25%',textAlign:'right'}}><a className="popup-btn" href="/HangGift" >Keep Hang</a></div>
		</div></div>
	
		<div style={{padding:'0 11px 11px 11px'}}><div className="popupimg"> 
		<img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /></div>
		   <div class="popupuser-name"><div style={{ display: 'inline'}}><span>{`${user.firstName} ${user.lastName}`}</span>
		   <span style={{display: 'block', fontSize: '12px'}}><div className="dropdownnewsfeed">
	  <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
		<option value="Friends">Friends</option>
		<option value="Public">Public</option>
		<option value="Only Me">Only Me</option>
	  </select></div> </span></div> </div> </div>
	  <div style={{margin:'0 0 100px 11px'}}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
						{showPostImage ?
						  <>
							<img id="preview" src={postImage} style={{ width: "30%",objectFit:'cover' }} />
															<button onClick={handleRemoveImage} style={{ right: '25px',position: 'absolute',borderRadius:'100%',background:'#b7b7b738',padding:'10px 10px'}}><i class="las la-times"></i></button>
						  </>
						  :
						  null
						}
	
	</span>
										{/* <a href="#!" onClick={() => setShowCompont("image")}><span style={{float:'right',padding:'5px',margin:'5px',background:'#033347',padding: '2px 5px',color:'#fff',borderRadius:'5px'}}>+</span></a>*/}</div> 
			
									  {
										 imageshow()
									   }
									   <div style={{textAlign:'center',background:'#C4C4C4',fontWeight:'bold',color:'rgb(68 68 68)', margin:'11px 11px', padding:'15px',borderRadius:'5px', fontSize:'14px',cursor:"pointer"}} onClick={uploadPost}>Post</div>
									   
	
					  </Form>
					  )}                 
	  </Popup> 
		)
					  }
	
	  const postUp = () => {
						return(
					<Popup trigger={<div className="textbox"><span style={{cursor: "pointer",padding:'5px'}}>We share,do you?</span></div>} modal>
										   {close => (<Form className="popform popwidth">
										
						<div className="headpop">
						<div className="row"><div style={{width:'5%'}}><a href="#!"  onClick={close}><i class="las la-times"></i></a></div>
						<div style={{ color:'#000000',fontSize:'14px',fontWeight:'bold',width:'85%',textAlign: 'center'}}><span>We share, do you?</span></div>
						<div style={{ width:'10%',textAlign: 'center'}}><span style={{float:'right'}}>  <button style={{float: 'right', borderRadius:'20px'}} type="submit" onClick={uploadPost}>Post</button></span></div>
						</div></div>
					
						<div style={{padding:'0 11px 11px 11px'}}><div className="popupimg"> 
						<img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /></div>
						   <div class="popupuser-name"><div style={{float:'left', display: 'inline'}}><span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{`${user.firstName} ${user.lastName}`}</span>
						   <span style={{display: 'block', fontSize: '12px'}}><div className="dropdownnewsfeed">
					  <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
						<option value="Friends">Friends</option>
						<option value="Public">Public</option>
						<option value="Only Me">Only Me</option>
					  </select></div> </span></div> </div> </div>
					 <div style={{margin:'0 11px 100px 11px'}}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
										{showPostImage ?
										  <>
											<img id="preview" src={postImage} style={{ width: "30%" }} />
															<button onClick={handleRemoveImage} style={{ right: '20px',position: 'absolute',borderRadius:'100%',background:'#b7b7b738',padding:'10px 10px'}}><i class="las la-times"></i></button>
										  </>
										  :
										  null
										}</span>
									   </div>
					
									  {
										 imageshowPost()
									   }
					 
					
									  </Form>  
						)
									  }               
					  </Popup>
						)
									  }
					
	 const shareUp = () => {
						return(
					<Popup trigger={<span style={{cursor: "pointer"}}><img style={{verticalAlign:'middle',padding:'5px'}} src="/assets/images/share-2.svg" alt="img" />Share Up</span>} modal>
										   {close =>( <Form className="popform popwidth">
										
						<div className="headpop">
						<div className="row">
						<div style={{width:'5%'}}><a href="#!" style={{padding:'10px 150px 10px 0'}} onClick={close} ><i class="las la-times"></i></a></div>
						<div style={{ color:'#000000',fontSize:'14px',fontWeight:'bold',width:'85%',textAlign: 'center'}}>Share up</div>
						<div style={{ width:'10%',textAlign: 'center'}}><span style={{float:'right'}}> <button style={{float: 'right', borderRadius:'20px'}} type="submit" onClick={uploadPost}>Post</button></span></div>
						</div></div>
					
						<div style={{padding:'0 11px 11px 11px'}}>  <div className="popupimg"> 
						<img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /></div>
						   <div class="popupuser-name"><div style={{float:'left', display: 'inline'}}><span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{`${user.firstName} ${user.lastName}`}</span>
						   <span style={{display: 'block', fontSize: '12px'}}><div className="dropdownnewsfeed">
					  <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
						<option value="Friends">Friends</option>
						<option value="Public">Public</option>
						<option value="Only Me">Only Me</option>
					  </select></div> </span></div> </div> </div>
					  <div style={{margin:'0 11px 100px 11px'}}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
										{showPostImage ?
										  <>
											<img id="preview" src={postImage} style={{ width: "30%" }} />
															<button onClick={handleRemoveImage} style={{ right: '20px',position: 'absolute',borderRadius:'100%',background:'#b7b7b738',padding:'10px 10px'}}><i class="las la-times"></i></button>
										  </>
										  :
										  null
										}</span>
					
									   </div>
					
									  {
										 imageshowPost()
									   }
									   
									  </Form>  
										   )}               
					  </Popup>
						)
									  }
		  const photos = () => {
										return(<>
									   
									<Popup trigger={<span style={{cursor: "pointer"}}><img style={{verticalAlign: "middle",padding:'5px'}} src="/assets/images/images.svg"/><span>Photos</span></span>} modal>
													   {close =>(     <Form className="popform popwidth">
														
														<div className="headpop">
						<div className="row"><div style={{width:'5%'}}><a href="#!"  onClick={close}><i class="las la-times"></i></a></div>
						<div style={{ color:'#000000',fontSize:'14px',fontWeight:'bold',width:'85%',textAlign: 'center'}}><span>We share, do you?</span></div>
						<div style={{ width:'10%',textAlign: 'center'}}><span style={{float:'right'}}>  <button style={{float: 'right', borderRadius:'20px'}} type="submit" onClick={uploadPost}>Post</button></span></div>
						</div></div>
					
						<div style={{padding:'0 11px 11px 11px'}}><div className="popupimg"> 
						<img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /></div>
						   <div class="popupuser-name"><div style={{float:'left', display: 'inline'}}><span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{`${user.firstName} ${user.lastName}`}</span>
						   <span style={{display: 'block', fontSize: '12px'}}><div className="dropdownnewsfeed">
					  <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
						<option value="Friends">Friends</option>
						<option value="Public">Public</option>
						<option value="Only Me">Only Me</option>
					  </select></div> </span></div> </div> </div>
					 <div style={{margin:'0 11px 100px 11px'}}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
										{showPostImage ?
										  <>
											<img id="preview" src={postImage} style={{ width: "30%" }} />
															<button onClick={handleRemoveImage} style={{ right: '20px',position: 'absolute',borderRadius:'100%',background:'#b7b7b738',padding:'10px 10px'}}><i class="las la-times"></i></button>
										  </>
										  :
										  null
										}</span>
									   </div>
					
									  {
										 imageshowPost()
									   }
					
													
																	  
									
													  </Form> 
													   )}                
									  </Popup></>
										)
													  }



	useEffect(() => {
		getGroupPosts()
		getGroupById()
	}, [])

	const checkIfInGroup = (members) => {
		if (members){
			const found = members.some(el => el.id === user.id);
			return found
		}
		return false
	}

	return (
		<div>
			<ShareupInsideHeaderComponent />
			{/* topbar */}
			<div className="container">
		<div style={{marginLeft:'10px',marginRight:'10px'}}>
			<section>
				<div className="gap gray-bg">
					<div className="container-fluid">
						<div className="row">
							
								
									<div className="col-lg-3">
										<aside className="sidebar static">
											<div className="widget">
												<div className="row"><img src="../assets/images/unnamed.png" /><p className="widget-title">User</p></div>
												<div className="user"><img src={user.profilePicturePath} />
													<a href="/profile"><p style={{ fontWeight: "bold" }}>{`${user.firstName} ${user.lastName}`}</p></a>
												</div>
											</div>
											<MenuWidgetComponent/>
											<div className="widget">
												<div className="row"><img src="../assets/images/unnamed.png" /><p className="widget-title">Group</p></div>
												<div className="row"><div><img src={`../../assets/images/21964583.png`} style={{ width: '45px',height: '45px', float: "left", margin:'5px' }}></img></div>
												<div><a style={{ marginBottom:"0" }} href={`/profile`}><p style={{ fontWeight: "bold",marginBottom:"0" }}>{`${group.name}`}</p></a>
<span style={{ fontWeight: "bold",fontSize:"12px" }}>Description:{`${group.description}`}</span>
												<div>{
													checkIfInGroup(group.members) ?
														<a style={{ marginBottom:"0", fontSize:'14px', color:'#057b96' }} href type="button"  onClick={handleLeaveGroup}>Leave Group</a>
														:
														<a style={{ marginBottom:"0", fontSize:'14px', color:'#057b96' }} href type="button"  onClick={handleJoinGroup}>Join Group</a>
												}
												</div>
												</div>
												
												</div>
												
												
												
											</div>
											{/* <GroupsWidgetComponent /> */}
										</aside>
									</div>
									{/* ______________________________________________ */}
									<div className="col-lg-6">

										{/* add post new box */}
										{
											showOrNot()
										}
									</div>
									{/* ____________________________________________ */}
									<div className="col-lg-3">
										<aside className="sidebar static">
											<div className="widget friend-list stick-widget">
												<div className="row"><img src="../assets/images/1865023.png" /><p className="widget-title">Ads</p></div>
												<div className="ads"><a href="https://technology-signals.com/wp-content/uploads/2019/05/images.martechadvisor.comvoice_technology_5cecf0b8-3f280e5abac0da913f8aa0868cf970c6a429a128.jpg" data-lightbox="image-1" data-title="My caption"><img src="https://technology-signals.com/wp-content/uploads/2019/05/images.martechadvisor.comvoice_technology_5cecf0b8-3f280e5abac0da913f8aa0868cf970c6a429a128.jpg"></img></a></div>
											</div>
											<div className="widget">
												<div className="row"><img src="../assets/images/b76706b9814f347e841ff15b89a5d170-instagram-discover-people-icon-by-vexels.png" /><p className="widget-title">Groups Members</p></div>
												<ul className="followers">
													{
														members.slice(0, 5).map((member) =>
															<li>
																<figure>
																	<img src={member.profilePicturePath} alt="" />
																</figure>
																<div className="friend-meta">
																	<h4>
																		<a href={`/profile/${member.email}`} title="">{`${member.firstName} ${member.lastName}`}</a>
																	</h4>
																	<a href="#" title="" className="underline">Add Friend</a>
																</div>
															</li>
														)
													}
												</ul>
											</div>
										</aside>
									</div>
									{/* sidebar */}
								</div>
							</div>
						</div>
					
				
			</section>
			</div>
			</div>
			</div>
	
	);
}
export default ViewGroupComponent;