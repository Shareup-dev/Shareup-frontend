import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import SwapService from '../../services/SwapService';
import AuthService from '../../services/auth.services';
import SimpleReactLightbox from 'simple-react-lightbox'
import { testScript } from '../../js/script';
import GroupService from '../../services/GroupService';
import StoriesService from '../../services/StoriesService';

import EditPostComponent from './EditPostComponent'
import Modal from 'react-modal';

import Layout from '../LayoutComponent';
import GuideComponent from './GuideComponent';
import SwapPostComponent from '../post/SwapPostComponent'; 
import StoriesComponent from '../Stories/StoriesComponent';
import Popup from 'reactjs-popup';
import FriendsService from '../../services/FriendService';



function SwapFeedComponent() {
  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  const { user } = useContext(UserContext)

  // const []

  // const inputRef = createRef();

  const [refresh, setRefresh] = useState(null)
  const [stories, setStories] = useState([]);
  const [storiesImage, setStoriesImage] = useState([]);
  const [filesStry, setFilesStry] = useState({});
  const [showstoriesImage, setShowstoriesImage] = useState(false);
  const [showComp, setShowComp] = useState("newsfeed");
const[showCompont,setShowCompont]= useState();
  const [posts, setPosts] = useState([]);
  const [postsForUser, setPostsForUser] = useState([]);
  const [storiesForUser, setStoriesForUser] = useState([]);
  const [savedPost, setSavedPost] = useState([]);
  const [userR, setUserR] = useState([]);
  const [group, setGroup] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [searchedGroups, setSearchedGroups] = useState([]);
  
  const [count, setCount] = useState(1);

  const [swapContent, setSwapContent] = useState("");
  const [swapImage, setSwapImage] = useState({});
  const [showSwapImage, setShowSwapImage] = useState(false);
  
  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [files, setFiles] = useState({});
  const [swapfiles, setSwapfiles] = useState({});
  const [postImage, setPostImage] = useState({});
  const [showPostImage, setShowPostImage] = useState(false);
 
  const [uploadError, setUploadError] = useState("");

  const [editPostId, setEditPostId] = useState(null)

  const [img, setImage] = useState("");
  const [Privacy, setPrivacy] = useState("");

  const [friendsList, setFriendsList] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [userF, setUserF] = useState(null);
    const [searchedUser, setSearchedUser] = useState([]);

  // const [cursorPosition, setCursorPosition] = useState();
  // const pickEmoji = (e, {emoji}) => {
  //   const ref = inputRef.current;
  //   ref.focus();
  //   const start = commentContent.substring(0, ref.seletionStart);
  //   const end = commentContent.substring(ref.selectionStart);
  //   const text = start + emoji + end;
  //   setCommentContent(text)
  //   setCursorPosition(start.length+emoji.length)
  // }

  // useEffect(() => {
  //   inputRef.current.selectionEnd = cursorPosition;
  // },[cursorPosition])
  // const getStories = async () => {
  //   await StoriesService.getStories().then(res => {
  //     setStories(res.data)
  //   })
  // }

  const uploadStories = (event) => {
    event.preventDefault();
    setUploadError("")
    console.log("uploading stories working")
    

    const formData = new FormData();
    console.log(" this is the files" + filesStry)
    formData.append(`stryfiles`, filesStry)
    StoriesService.createStories(user.id, formData).then(res => {
      console.log(JSON.stringify(res))
      handleRemoveImageStry()
      setStories(res.data)
      setRefresh(res.data)

    })
  }
  
  
    // const checkIfUserAlreadyPostStory = (story) => {
    //   const found = story.some(el => el.id === user.id);
    //   return found
    // }
  
  const getStoriesForUser = async () => {
    await StoriesService.getStoriesForUser(AuthService.getCurrentUser().username).then(res => {
      const sorting = res.data.sort(function(a, b) {
        let dateA = new Date(a.date), dateB = new Date(b.date);
        return dateB - dateA;
    });
      const uniqueStories = Array.from(new Set(sorting.map(a => a.id)))
        .map(id => {
          return res.data.find(a => a.id === id)
        })
      setStoriesForUser(uniqueStories)
    })
  }
  const getPostForUser = async () => {
    await PostService.getPostForUser(AuthService.getCurrentUser().username).then(res => {
      const sorting = res.data.sort(function(a, b) {
        let dateA = new Date(a.published), dateB = new Date(b.published);
        return dateB - dateA;
    });
      const uniquePost = Array.from(new Set(sorting.map(a => a.id)))
        .map(id => {
          return res.data.find(a => a.id === id)
        })
      setPostsForUser(uniquePost)
    })
  }
  const handleFileStry = (event) => {
    console.log(event.target.files[0])
    setFilesStry(event.target.files[0])
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setStoriesImage(reader.result)
      }
    }
    console.log(event.target.files[0])
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0])
    // }
    setShowstoriesImage(true)
  }
  const handleRemoveImageStry = () => {
    setFilesStry({})
    setShowstoriesImage(false)
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
  const getAllGroups = async () => {
		await GroupService.getAllGroups().then(res => {
			setAllGroups(res.data)
			setSearchedGroups(res.data)
		})
	}

	
  const getPost = async () => {
    await PostService.getPost().then(res => {
      setPosts(res.data)
    })
  }
  

 

  const getSavedPost = async () => {
    await PostService.getSavedPostForUser(AuthService.getCurrentUser().username).then(res => {
      setSavedPost(res.data)
    })
  }

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
    if (commentContent === "") {
      return null;
    }
    const comment = { content: commentContent }
    PostService.addComment(user.id, postid, comment).then(res => {
      console.log(res.status)
      setRefresh(res.data)
      setCommentContent("")
    })
  }
  const handleCount=(opertator) => {
    if(opertator === "+"){
      let counting = count + 1
      console.log(counting+"hi count")
      setCount(counting)
    
    }
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
    
    const result = post.reactions.filter(reaction => reaction.user.id == userR.id)
    if (result.length > 0) {
      return true
    }
    return false
  }

  const checkIfSaved = (post) => {
    console.log(post.savedByUsers)
    // maybe this is more effecient
    // post.savedByUsers.map(r => {
    //   console.log("runninggg")
    //   console.log(JSON.stringify(r.user) + " i p pp p p")
    // if(r.user.id === user.id){
    //   return true
    // }else{
    //   return false
    // }
    // })
    console.log(post.savedByUsers.length + " yaa")
    const result = post.savedByUsers.filter(userz => userz.id == user.id)
    if (result.length > 0) {
      console.log(" FOUND")
      return true
    }
    console.log(" Not found")
    return false
  }

  const handleDeleteComment = (commentid) => {
    PostService.deleteComment(commentid).then(res => {
      console.log(res.status)
      setRefresh(res.data)
    })
  }

  const getCommentCounter = (comments) => {
    let counter = 0
    comments.map(comment => {
      counter += comment.replies.length + 1
    })
    return counter
  }
  const handlePrivacy=(event)=>{
    console.log(event.target.value)
      setPrivacy(event.target.value)
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
    console.log(" this is the files" + files)
    console.log(" this is the swapfiles" + swapfiles)
    formData.append(`files`, files)
    formData.append(`swapfiles`, swapfiles)
    formData.append(`privacy`, Privacy)
    if (userF === null) {
      PostService.createPost(user.id, formData, null).then(res => {
        console.log(JSON.stringify(res))
        setPostContent("")
        handleRemoveImage()
        setRefresh(res.data)
      })
    }else
    PostService.createPost(user.id, formData, userF.id).then(res => {
      console.log(JSON.stringify(res))
      setPostContent("")
      handleRemoveImage()
      setRefresh(res.data)
    })
  }

  const handleLikePost = async (post_id) => {
    UserService.likePost(user.id, post_id).then(res => {
      setRefresh(res.data)
    })
  }

  const handleSavePost = async (post_id) => {
    UserService.savePost(user.id, post_id).then(res => {
      setRefresh(res.data)
    })
  }
  const [modalIsOpen,setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
//swapcomponents
const handleSwapContent = (event) => {
  console.log(event.target.value)
  setSwapContent(event.target.value)
}
const handleFileSwap = (event) => {
  console.log(event.target.files[0])
  setSwapfiles(event.target.files[0])
  const reader = new FileReader();
  reader.onload = () => {
    if (reader.readyState === 2) {
      setSwapImage(reader.result)
    }
  }
  console.log(event.target.files[0])
  // if(event.target.files[0].type === blob){
  reader.readAsDataURL(event.target.files[0])
  // }
  setShowSwapImage(true)
}
const handleRemoveImageSwap = () => {
  setSwapfiles({})
  setShowSwapImage(false)
}
// const uploadSwap = (event) => {
//   event.preventDefault();
//   setUploadError("")
//   console.log("uploading post working")
//   if (swapContent === "" && (Object.keys(files).length === 0 && files.constructor === Object)) {
//     console.log("cant be null")
//     setUploadError("Please Insert A Text or an Image")
//     return
//   }

//   const formData = new FormData();
//   formData.append('content', swapContent)
//   console.log(" this is the files" + files)
//   formData.append(`files`, files)
//   SwapService.createSwap(user.id, formData).then(res => {
//     console.log(JSON.stringify(res))
//     setSwapContent("")
//     handleRemoveImage()
//     setRefresh(res.data)
//   })
// }




  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal(){
    setIsOpen(false);
  }
  const getUser = async () => {
    if (user === null) {
      console.log("RUNNING")
      await UserService.getUserByEmail(AuthService.getCurrentUser().username).then(res => {
        setUserR(res.data);
      })
    } else {
      console.log("WALKING" + JSON.stringify(user))
      setUserR(user)
    }
  }
  const imageshow =() =>{
  
  return( 
    <div style={{margin:'0 11px', padding:'15px',boxShadow: '0 0 3px rgb(0 0 0 / 16%)',borderRadius:'5px'}}> 
    <div style={{display:'inline'}}>What's in hang?</div>
 
     <div className="add-smilespopup"><label className="fileContainer"><i class="lar la-file-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
    </label></div>
    <div className="gifpopup"><Popup  trigger={<a href="#!"><i class="las la-user-tag"></i></a>} nested modal>
                       {close => ( <Form style={{margin:'5px'}} className="popwidth">
                       <div class="search-container">
            <i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Friends" name="s" onChange={handleSearchedUser} /><span onClick={close}>Done</span>
        </div>
        {(userF) ? <><div className="Tag">Tagged:{`${userF.firstName} ${userF.lastName}`}</div></>:null}
        <div>
        <ul>
        {(friendsList.length > 0) ? <>
                {friendsList.map(
                    userM =>
                    (user.id !== userM.id) ?
                        <li key={userM.id} className="friends-card">
                        <a href="#!" onClick={() => handleTag(userM)}> <div className="grid-container">
                                {/* <figure> */}
                                <div class="item1">
                                    <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{objectFit:'cover'}} src={userM.profilePicturePath} alt="" /></a>
                                    {/* </figure> */}
                                    
                                </div>
                                <div class="item2"><p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                                </div>
                                {/* <div className="  "> */}
                              </div></a>
                        </li>
                         :null
                )}</>:<div style={{padding:'10% 0',textAlign:'center'}}>You have no friends to tag</div>}
            </ul></div>   
                       </Form>
                  )}                 
  </Popup></div>
    <div className="campopup"><label className="fileContainer"><i class="las la-map-marker-alt"></i><input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
    </label></div>
      
   
    {/* <ul style={{marginLeft:'10px'}}>
      <li style={{fontSize:'12px'}}>What's in hang?</li>
      <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
    </label></li></ul>*/}</div> 
  )
    
  
  }
  const imageshowPost =() =>{
  
    return( 
      <div style={{margin:'0 11px', padding:'15px',boxShadow: '0 0 3px rgb(0 0 0 / 16%)',borderRadius:'5px'}}> 
      <div style={{display:'inline'}}>Add More</div>
   
       <div className="add-smilespopup"><label className="fileContainer"><i class="lar la-file-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
      </label></div>
      <div className="gifpopup"><Popup  trigger={<a href="#!"><i class="las la-user-tag"></i></a>} nested modal>
                       {close => ( <Form style={{margin:'5px'}} className="popwidth">
                       <div class="search-container">
            <i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Friends" name="s" onChange={handleSearchedUser} /><span onClick={close}>Done</span>
        </div>
        {(userF) ? <><div className="Tag">Tagged:{`${userF.firstName} ${userF.lastName}`}</div></>:null}
        <div>
        <ul>
        {(friendsList.length > 0) ? <>
                {friendsList.map(
                    userM =>
                    (user.id !== userM.id) ?
                        <li key={userM.id} className="friends-card">
                        <a href="#!" onClick={() => handleTag(userM)}> <div className="grid-container">
                                {/* <figure> */}
                                <div class="item1">
                                    <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{objectFit:'cover'}} src={userM.profilePicturePath} alt="" /></a>
                                    {/* </figure> */}
                                    
                                </div>
                                <div class="item2"><p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                                </div>
                                {/* <div className="  "> */}
                              </div></a>
                        </li>
                         :null
                )}</>:<div style={{padding:'10% 0',textAlign:'center'}}>You have no friends to tag</div>}
            </ul></div>   
                       </Form>
                  )}                 
  </Popup></div>
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
 <Popup  trigger={<span style={{cursor: "pointer"}} ><span style={{marginRight:'5px'}}><img style={{verticalAlign:'middle',width:'15px'}} src="/assets/images/hangshare.svg" alt="img" /></span>Hang Share</span>} modal nested>
                       {close => ( <Form className="popwidth" style={{margin:'5px'}}>
                    
    <div className="headpop">
      
    <div className="row"><div style={{width:'5%'}}><a href="#!" style={{padding:'10px 80px 10px 0'}} onClick={close}><i class="las la-times"></i></a></div>
    <div style={{ color:'#000000',fontSize:'14px',fontWeight:'bold',width:'70%',textAlign: 'center'}}> <span>Today to me, Tomorrow to you</span></div>
    <div style={{width:'25%',textAlign:'right'}}><a className="popup-btn" href="/HangGift" >Keep Hang</a></div>
    </div></div>

    <div style={{padding:'0 11px 11px 11px'}}><div className="popupimg"> 
    <img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /></div>
       <div class="popupuser-name"><div style={{float:'left', display: 'inline'}}><span>{`${user.firstName} ${user.lastName}`}{(userF)?<> with {`${userF.firstName} ${userF.lastName}`}</>:null}</span>
       <span style={{display: 'block', fontSize: '12px'}}><div className="dropdown">
  <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
    <option value="Friends">Friends</option>
    <option value="Public">Public</option>
    <option value="Only Me">Only Me</option>
  </select></div> </span></div> </div> </div>
  <div style={{margin:'0 0 100px 11px'}}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
                    {showPostImage ?
                      <>
                        <img id="preview" src={postImage} style={{ width: "100%",objectFit:'cover' }} />
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
                <Popup trigger={<div className="textbox"><span style={{cursor: "pointer"}}>We share,do you?</span></div>} modal nested>
                                       {close => (<Form className="popwidth">
                                    
                    <div className="headpop">
                    <div className="row"><div style={{width:'5%'}}><a href="#!"  onClick={close}><i class="las la-times"></i></a></div>
                    <div style={{ color:'#000000',fontSize:'14px',fontWeight:'bold',width:'95%',textAlign: 'center'}}><span>We share, do you?</span></div>
                    
                    </div></div>
                
                    <div style={{padding:'0 11px 11px 11px'}}><div className="popupimg"> 
                    <img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /></div>
                       <div class="popupuser-name"><div style={{float:'left', display: 'inline'}}><span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{`${user.firstName} ${user.lastName}`}{(userF)?<> with {`${userF.firstName} ${userF.lastName}`}</>:null}</span>
                       <span style={{display: 'block', fontSize: '12px'}}><div className="dropdown">
                  <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                    <option value="Friends">Friends</option>
                    <option value="Public">Public</option>
                    <option value="Only Me">Only Me</option>
                  </select></div> </span></div> </div> </div>
                 <div style={{margin:'0 11px 100px 11px'}}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
                                    {showPostImage ?
                                      <>
                                        <img id="preview" src={postImage} style={{ width: "100%" }} />
                                                        <button onClick={handleRemoveImage} style={{ right: '20px',position: 'absolute',borderRadius:'100%',background:'#b7b7b738',padding:'10px 10px'}}><i class="las la-times"></i></button>
                                      </>
                                      :
                                      null
                                    }</span>
                                   </div>
                
                                  {
                                     imageshowPost()
                                   }
                 <div style={{textAlign:'center',background:'#C4C4C4',fontWeight:'bold',color:'rgb(68 68 68)', margin:'11px 11px', padding:'15px',borderRadius:'5px',fontSize:'14px',cursor:"pointer"}} onClick={uploadPost}>Post</div>
                
                                  </Form>  
                    )
                                  }               
                  </Popup>
                    )
                                  }
                
 const shareUp = () => {
                    return(
                <Popup trigger={<span style={{cursor: "pointer"}}><img style={{verticalAlign:'middle'}} src="/assets/images/share-2.svg" alt="img" />Share Up</span>} modal nested>
                                       {close =>( <Form className="popwidth">
                                    
                    <div className="headpop">
                    <div className="row"><div style={{width:'5%'}}><span><a href="#!" onClick={close} ><i class="las la-times"></i></a></span></div>
                    <div style={{ color:'#000000',fontSize:'14px',fontWeight:'bold',width:'85%',textAlign: 'center'}}><span>Share up</span></div>
                    <div style={{ width:'10%',textAlign: 'center'}}><span style={{float:'right'}}>  <button style={{float: 'right', borderRadius:'20px'}} type="submit" onClick={uploadPost}>Post</button></span></div>
                    </div></div>
                
                    <div style={{padding:'0 11px 11px 11px'}}>  <div className="popupimg"> 
                    <img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /></div>
                       <div class="popupuser-name"><div style={{float:'left', display: 'inline'}}><span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{`${user.firstName} ${user.lastName}`}{(userF)?<> with {`${userF.firstName} ${userF.lastName}`}</>:null}</span>
                       <span style={{display: 'block', fontSize: '12px'}}><div className="dropdown">
                  <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                    <option value="Friends">Friends</option>
                    <option value="Public">Public</option>
                    <option value="Only Me">Only Me</option>
                  </select></div> </span></div> </div> </div>
                  <div style={{margin:'0 11px 100px 11px'}}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
                                    {showPostImage ?
                                      <>
                                        <img id="preview" src={postImage} style={{ width: "100%" }} />
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
      const swapUp = () => {
                                    return(
                                <Popup trigger={<span style={{cursor: "pointer"}}><img style={{verticalAlign: "middle",padding:'5px'}} src="assets/images/images.svg"/><span>Photos</span></span>} modal>
                                                   {close =>(     <Form className="popwidth">
                                                    
                                    <div className="headpop">
                                      
                                    <div className="row"><div style={{width:'5%'}}><span><a href="#!"  onClick={close}  ><i class="las la-times"></i></a></span></div>
                                    <div style={{ color:'#000000',fontSize:'14px',fontWeight:'bold',width:'85%',textAlign: 'center'}}><span>Let's swap</span></div>
                                    <div style={{ width:'10%',textAlign: 'center'}}><span style={{float:'right'}}>  <button style={{float: 'right', borderRadius:'20px'}} type="submit" onClick={uploadPost}>Post</button></span></div>
                                    </div></div>
                                    <div style={{padding:'0 11px 11px 11px'}}>  <div className="popupimg"> 
                    <img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /></div>
                       <div class="popupuser-name"><div style={{float:'left', display: 'inline'}}><span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{`${user.firstName} ${user.lastName}`}</span>
                       <span style={{display: 'block', fontSize: '12px'}}><div className="dropdown">
                  <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                    <option value="Friends">Friends</option>
                    <option value="Public">Public</option>
                    <option value="Only Me">Only Me</option>
                  </select></div> </span></div> </div> </div>
                                    <div style={{margin:'0 11px 0x 11px'}}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="swap_content" value={postContent} onChange={handlePostContent} />
                                                   
                                                    
                                
                                </span>
                                
                                                                    </div>
                                    {/* <div className="popupimg"> 
                                    <img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /></div>
                                       <div class="popupuser-name"><div style={{float:'left', display: 'inline'}}><span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{`${user.firstName} ${user.lastName}`}</span>
                                       <span style={{display: 'block', fontSize: '12px'}}><div className="dropdown">
                                  <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                                    <option value="Friends">Friends</option>
                                    <option value="Public">Public</option>
                                    <option value="Only Me">Only Me</option>
                                  </select></div> </span></div> </div>  */}
                                  <div className="row mrginbtm"><div style={{width:'50%', display: 'inline',textAlign: 'center'}}>
                                    <div style={{height:'230px'}}>
                                  {showPostImage ?
                                                      <>
                                                        <img id="preview" src={postImage}  />
                                                        <button onClick={handleRemoveImage} className="buttonClosePrvw lftbtn"><i class="las la-times"></i></button>
                                                      </>
                                                      :
                                                      null
                                                    }
                                                    </div>
                                                     <div className="swaptext">Provide clear image of object to swap</div>
                                   <div style={{textAlign: 'center'}}><label className="fileContainer" ><button className="swapPopupBtn" type="submit"><input type="file" name="swap_image" accept="image/*" onChange={handleFile}></input>Add photo</button> 
    </label></div>
                                 </div>
                                  
                                  {/* <label className="fileContainer"><div style={{textAlign:'center',background:'#C4C4C4',fontWeight:'bold',color:'rgb(68 68 68)', margin:'11px 11px', padding:'15px',borderRadius:'5px'}} > Let's take picture<input type="file" name="post_image" accept="image/*" onChange={handleFile}></input></div></label> */}
                                  <div style={{width:'50%', display: 'inline',textAlign: 'center'}}> 
                                  <div style={{height:'230px'}}>
                                  {showSwapImage ?
                                                      <>
                                                        <img id="preview" src={swapImage}  />
                                                        <button onClick={handleRemoveImageSwap} className="buttonClosePrvw rtbtn"><i class="las la-times"></i></button>
                                                      </>
                                                      :
                                                      null
                                                    }</div>
                                                     <div className="swaptext">Provide image of object in return</div>
                                   <div style={{textAlign: 'center'}}><label className="fileContainer" ><button className="swapPopupBtn" type="submit"><input type="file" name="swap_image" accept="image/*" onChange={handleFileSwap}></input>Add photo</button> 
    </label></div></div></div>
                                   
                                                
                                                                  
                                
                                                  </Form> 
                                                   )}                
                                  </Popup>
                                    )
                                                  }
  const testFanc = (post) => {
    return ( <SwapPostComponent post={post} setRefresh={setRefresh}/>)
  }

  const show = () => {
    
      return (
        <div className="loadMore">
          {
            postsForUser.map(
              post =>
                <div key={post.id}>
                  {
                    post.group ?
                      post.group.members.some(member => member.email === AuthService.getCurrentUser().username) ?
                        testFanc(post) : null
                      :
                      testFanc(post)
                  }
                </div>
            )
          }

        </div>
      )
    } 
  //   if (showComp === "newsfeed") {
  //   else {
  //     return (
  //       <div className="loadMore">
  //         {
  //           savedPost.map(
  //             post =>
  //               <div key={post.id}>
  //                 {
  //                   post.group ?
  //                     post.group.members.some(member => member.email === AuthService.getCurrentUser().username) ?
  //                       testFanc(post) : null
  //                     :
  //                     testFanc(post)
  //                 }
  //               </div>
  //           )
  //         }

  //       </div>
  //     )
  //   }
  // }
  const handleTag = (userM)=>{
    setUserF(userM)
    console.log(userM) 
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

useEffect(() => {
    getAllUser()
    getFriendsList()
    testScript()
},[])


  useEffect(() => {
		getAllGroups()
		
	}, [showComp, group])

	useEffect(() => {
		testScript()
	}, [])


  useEffect(() => {
    getUser()
    getPost().then(() => {
      setIsLoading(false)
    })
    getPostForUser()
    getSavedPost()
    testScript()
  }, [editPostId, refresh])

  useEffect(() => {
    getPostForUser()
    getSavedPost()
    testScript()
  }, [user])
   useEffect(() => {
    getStoriesForUser()
    testScript()
  }, [stories])
  if (isLoading) {
    return <div>Loading... Please Wait</div>
  }

  if (user.newUser) {
    return <GuideComponent />
  }

  return (
    <Layout user={user ? user : userR}>
      {
        user.newUser ? <GuideComponent /> :

          <div className="col-lg-6">
            
            
   
 

            <div className="central-meta newsfeed">
              <div className="new-postbox">
                <figure>
                  <img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" />
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
                        <li>{swapUp()}</li>
                        {/* <li><i class="las la-camera"></i> <label className="fileContainer"> <input type="file" />
                        </label></li> */}
                        
                          
                       
                      </ul>
                      
                    </div>
                    
                  </Form>
                </div>
              </div>
            </div>
        
            {/* add post new box */}
            {/* <p className="showCompNewsfeed" style={{ fontWeight: 'bold', color: 'rgb(207, 144, 7)', textAlign: 'center' }}><span onClick={() => setShowComp("newsfeed")}>Newsfeed</span> | <span onClick={() => setShowComp("saved")}>Saved Posts</span>|<span onClick={() => setShowComp("saved")}>SharePosts</span>|<span onClick={() => setShowComp("saved")}>Swap Posts</span></p> */}
            {
              show()
            }
          </div>
      }
    </Layout>

  );
}
export default SwapFeedComponent;