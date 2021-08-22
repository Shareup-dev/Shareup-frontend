import React, { useState, useEffect, useContext,useRef } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import AuthService from '../../services/auth.services';
import SimpleReactLightbox from 'simple-react-lightbox'
import { testScript } from '../../js/script';

import EditPostComponent from '../user/EditPostComponent'

import Layout from '../LayoutComponent';
import GuideComponent from '../user/GuideComponent';
import PostComponent from '../post/PostComponent';
import PostTextBoxComponent from '../post/PostTextBoxComponent';
import PostComponentBoxComponent from '../post/PostCommentBoxComponent';
import CommentPostComponent from '../post/CommentPostComponent';


function ShareItemComponent({post}) {
  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  const { user } = useContext(UserContext)

  // const []

  // const inputRef = createRef();

  const [refresh, setRefresh] = useState(null)
  const ref = useRef(null);
  const [showEmojis, setShowEmojis] = useState(false)

  const [showComp, setShowComp] = useState("newsfeed");
  
  const [posts, setPosts] = useState([]);
  const [postsForUser, setPostsForUser] = useState([]);
  const [savedPost, setSavedPost] = useState([]);
  const [userR, setUserR] = useState([]);


  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [files, setFiles] = useState({});
  const [postImage, setPostImage] = useState({});
  const [showPostImage, setShowPostImage] = useState(false);

  const [uploadError, setUploadError] = useState("");



  const [editPostId, setEditPostId] = useState(null)

  const [img, setImage] = useState("");






  
    
    
    const [showComment, setShowComment] = useState(false)
    const [showMoreOptions, setShowMoreOptions] = useState(false)
    const [showReactions, setShowReactions] = useState(false)
   
    const [likeReaction, setLikeReaction] = useState(null)

    const something=(event)=> {
        if (event.key === "Enter") {
            console.log('enter')
        }
    }
    
    

    const handleShowingReaction = () => {
        setTimeout(function () { setShowReactions(true) }, 200);
    }

    const handleUnshowingReaction = () => {
        setTimeout(function () { setShowReactions(false) }, 200);
    }

    const handleReaction = () => {
        if(likeReaction) {
            return (<img src="/assets/images/starred.png" alt="" />)
            // return (<img width={30} style={{marginTop:'-5px'}} src={`../assets/images/gif/${likeReaction}.gif`}/>)
        }
        return (<img src="/assets/images/starred.png" alt="" />)
    }

    
    

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

  const getPost = async () => {
    await PostService.getPost().then(res => {
      setPosts(res.data)
    })
  }

  const getPostForUser = async () => {
    await PostService.getPostForUser(AuthService.getCurrentUser().username).then(res => {
      const uniquePost = Array.from(new Set(res.data.map(a => a.id)))
        .map(id => {
          return res.data.find(a => a.id === id)
        })
      setPostsForUser(uniquePost)
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
    formData.append(`files`, files)
    PostService.createPost(user.id, formData).then(res => {
      console.log(JSON.stringify(res))
      setPostContent("")
      handleRemoveImage()
      setRefresh(res.data)
    })
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
  return (<img src="/assets/images/likeic.png" alt="" />)
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
const staticpost=()=>{

}
  const testFanc = (post) => {
    return ( <div><PostComponent post={post} setRefresh={setRefresh}/>
      
        
</div>
      
      
      )
  }

  const show = () => {
    if (showComp === "newsfeed") {
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
    } else {
      return (
        <div className="loadMore">
          {
            savedPost.map(
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
  }


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

  if (isLoading) {
    return <div>Loading... Please Wait</div>
  }

  if (user.newUser) {
    return <GuideComponent />
  }

  return (
    <Layout user={user ? user : userR}>
      
          <div className="col-lg-6">
            <PostTextBoxComponent/>
          
            {/* add post new box */}
            <p className="showCompNewsfeed" style={{ fontWeight: 'bold', color: 'rgb(207, 144, 7)', textAlign: 'center' }}><span onClick={() => setShowComp("newsfeed")}>SharePosts</span> | <span onClick={() => setShowComp("saved")}>Saved Posts</span></p>
            <div className="central-meta item">
<div className="user-post">
   
            <div className="friend-info">

                <div className="post-meta">
                    
                        <a href="#" data-lightbox="image"><img style={{ width: "100%", height: "auto",borderRadius:'10px' }} src="assets/images/virtual-baby-showers-722x406.jpg" /> </a> 
                    

                    
<figure>
                    <img src={user.profilePicturePath} alt="" />
                </figure>
                
                <div className="friend-name">
                    <div style={{ float: 'left', display: 'inline' }}>

                        <a href="#" title="#" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{user.firstName} {user.lastName}</a>

                        <span style={{ display: 'block', fontSize: '12px',paddingTop:'5px' }}>on 2/3/2021 </span>
                       
                        


                    </div>
                   

                </div>
                <div className="counter">
                    <ul>
                    <li>{handleCounterReaction()}<span> 0</span></li>
                    <li><span className='commentCounter' style={{ marginRight: '5px' }} onClick={() => setShowComment(!showComment)}><img src="/assets/images/commentwhite.svg" alt="" /></span> <span> 0</span> 
                       </li>
                       <li><span> <img src="/assets/images/shareicnwhite.svg" alt="" /></span> <span> 0 </span>
                      
                        </li>
                    </ul>
                    </div>
                <p>
                            I would like to share the surprise gift to you. anyone can take it
                            <br></br>
                        </p>
                        <div className="buttonS"><a href="/shipping" className="buttonshare">Accept</a></div>
                   

                    
                    {
                        showReactions && <div onMouseEnter={handleShowingReaction} onMouseLeave={handleUnshowingReaction} className="reaction-bunch active">
                            <img src={'../assets/images/gif/smiley.gif'} onClick={() => handleSettingReactions('smiley')}/>
                            <img src={'../assets/images/gif/cool.gif'} onClick={() => handleSettingReactions('cool')}/>
                            <img src={'../assets/images/gif/laughing.gif'} onClick={() => handleSettingReactions('laughing')}/>
                            <img src={'../assets/images/gif/tongue.gif'} onClick={() => handleSettingReactions('tongue')}/>
                            <img src={'../assets/images/gif/angel.gif'} onClick={() => handleSettingReactions('angel')}/>
                            <img src={'../assets/images/gif/devil.gif'} onClick={() => handleSettingReactions('devil')}/>
                            <img src={'../assets/images/gif/angry.gif'} onClick={() => handleSettingReactions('angry')}/>

                        </div>
                    }
                    
                    <div className="we-video-info">
                        <div className='click'>

                          
                       
                                         
                        <div className="commShare"><div className="btncmn" onClick={() => setShowComment(!showComment)}><span className="comment" data-toggle="tooltip" title="Comments"><img src="assets/images/comment.svg"/><span style={{paddingLeft:'2px'}} >Comment</span>


</span></div><div className="btncmn" ><span className="views" data-toggle="tooltip" ><img src="assets/images/shareicn.svg"/><span style={{paddingLeft:'2px'}}>Share</span>

   </span></div></div>
                            
                        </div>
                    </div>
                </div>
                
               
                
                
            </div>
            

    {/* Till here */}
    <div className="coment-area">
        <ul className="we-comet">
        <li className="post-comment">
                <div className="comet-avatar">
                  <img src={user.profilePicturePath}  alt="" />
                </div>
                <div className="post-comt-box">
                  <Form>

                    <textarea rows={2} placeholder="write something" name="comment" value={commentContent} ref={ref} onChange={handleCommentContent} />

                    
                    <div className="add-smiles">

                      <span title="add icon" onClick={() => setShowEmojis(!showEmojis)}><i class="lar la-laugh"></i></span>
                    </div>
                    {
                      showEmojis && <div className="smiles-bunch active">
                         <i class="em em---1"></i>
																<i class="em em-smiley"></i>
																<i class="em em-anguished"></i>
																<i class="em em-laughing"></i>
																<i class="em em-angry"></i>
																<i class="em em-astonished"></i>
																<i class="em em-blush"></i>
																<i class="em em-disappointed"></i>
																<i class="em em-worried"></i>
																<i class="em em-kissing_heart"></i>
																<i class="em em-rage"></i>
																<i class="em em-stuck_out_tongue"></i>
                      {/* <Picker onEmojiClick={onEmojiClick} /> */}
                      {/* <h1>hi</h1> */}
                      </div>
                    }
                      <div className="gif"><img style={{objectFit:'cover'}} src="/assets/images/sticker.png" alt="" /></div>
                      <div className="cam"><img  src="/assets/images/Group.png" alt="" /></div>
                      {/* <div className="sticker"><i class="lar la-sticky-note"></i></div> */}

                   
                  </Form></div>
              </li>
            {
                showComment && <CommentPostComponent post={post} setRefresh={setRefresh} />
            }
        </ul>
    </div>
    <div className="add-dropdown" onClick={() => setShowMoreOptions(!showMoreOptions)}>
                            <span title="add icon" ><i class="las la-ellipsis-h"></i></span>
                        </div>
                        {
                            showMoreOptions && <div className="drop-options active">
                                <ul><li className="head-drop"><h6>Post Options</h6></li>
                                   
                                    <li><i class="las la-link"></i><span>Copy Link</span></li>
                                </ul>
                            </div>
                        }
</div>
</div>


            {
              
              show()
            }
            
          </div>
      
    </Layout>

  );
}
export default ShareItemComponent;