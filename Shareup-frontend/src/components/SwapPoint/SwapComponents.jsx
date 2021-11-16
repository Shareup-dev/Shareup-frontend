import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import AuthService from '../../services/auth.services';
import SimpleReactLightbox from 'simple-react-lightbox'
import { testScript } from '../../js/script';
import GroupService from '../../services/GroupService';
import Popup from 'reactjs-popup';
import FriendsService from '../../services/FriendService';

import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import Layout from '../LayoutComponent';
import { MiddlewareArray } from '@reduxjs/toolkit';
import fileStorage from '../../config/fileStorage';

export default function SwapComponents() {

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
  const [showCompont, setShowCompont] = useState();
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




  // const checkIfUserAlreadyPostStory = (story) => {
  //   const found = story.some(el => el.id === user.id);
  //   return found
  // }


  const getPostForUser = async () => {
    await PostService.getPostForUser(AuthService.getCurrentUser().username).then(res => {
      const sorting = res.data.sort(function (a, b) {
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
  const handleCount = (opertator) => {
    if (opertator === "+") {
      let counting = count + 1
      console.log(counting + "hi count")
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
  const handlePrivacy = (event) => {
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
        handleRemoveImageSwap()
        setRefresh(res.data)
        history.push("/swapFeed")
      })
    } else
      PostService.createPost(user.id, formData, userF.id).then(res => {
        console.log(JSON.stringify(res))
        setPostContent("")
        handleRemoveImage()
        handleRemoveImageSwap()
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
  const [modalIsOpen, setIsOpen] = React.useState(false);
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

  function closeModal() {
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
  const imageshow = () => {

    return (
      <div style={{ margin: '0 11px', padding: '15px', boxShadow: '0 0 3px rgb(0 0 0 / 16%)', borderRadius: '5px' }}>
        <div style={{ display: 'inline' }}>What's in hang?</div>

        <div className="add-smilespopup">
          <label className="fileContainer">
            <i class="lar la-file-image"></i>
            <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
          </label></div>

        <div className="gifpopup">


          <Popup trigger={
            <a href="#!">
              <i class="las la-user-tag"></i></a>}
            nested modal>
            {
              close => (
                <Form style={{ margin: '5px' }}
                  className="popwidth">
                  <div class="search-container">
                    <i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Friends" name="s" onChange={handleSearchedUser} /><span onClick={close}>Done</span>
                  </div>
                  {(userF) ? <><div className="Tag">Tagged:{`${userF.firstName} ${userF.lastName}`}</div></> : null}
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
                                    <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{ objectFit: 'cover' }} src={userM.profilePicturePath} alt="" /></a>
                                    {/* </figure> */}

                                  </div>
                                  <div class="item2"><p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                                  </div>
                                  {/* <div className="  "> */}
                                </div></a>
                              </li>
                              : null
                        )}</> : <div style={{ padding: '10% 0', textAlign: 'center' }}>You have no friends to tag</div>}
                    </ul></div>
                </Form>
              )}
          </Popup></div>
        <div className="campopup">
          <label className="fileContainer">
            <i class="las la-map-marker-alt"></i>
            <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
          </label></div>


        {/* <ul style={{marginLeft:'10px'}}>
      <li style={{fontSize:'12px'}}>What's in hang?</li>
      <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
    </label></li></ul>*/}</div>
    )


  }
  const imageshowPost = () => {

    return (
      <div style={{ margin: '0 11px', padding: '15px', boxShadow: '0 0 3px rgb(0 0 0 / 16%)', borderRadius: '5px' }}>
        <div style={{ display: 'inline' }}>Add More</div>

        <div className="add-smilespopup"><label className="fileContainer"><i class="lar la-file-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
        </label></div>
        <div className="gifpopup"><Popup trigger={<a href="#!"><i class="las la-user-tag"></i></a>} nested modal>
          {close => (<Form style={{ margin: '5px' }} className="popwidth">
            <div class="search-container">
              <i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Friends" name="s" onChange={handleSearchedUser} /><span onClick={close}>Done</span>
            </div>
            {(userF) ? <><div className="Tag">Tagged:{`${userF.firstName} ${userF.lastName}`}</div></> : null}
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
                              <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{ objectFit: 'cover' }} src={userM.profilePicturePath} alt="" /></a>
                              {/* </figure> */}

                            </div>
                            <div class="item2"><p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                            </div>
                            {/* <div className="  "> */}
                          </div></a>
                        </li>
                        : null
                  )}</> : <div style={{ padding: '10% 0', textAlign: 'center' }}>You have no friends to tag</div>}
              </ul></div>
          </Form>
          )}
        </Popup></div>
        <div className="campopup"><label className="fileContainer"><i class="las la-map-marker-alt"></i><input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
        </label></div>


      </div>
    )


  }
  const handleTag = (userM) => {
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
  }, [])


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

  if (isLoading) {
    return <div>Loading... Please Wait</div>
  }


  return (
    <>

      <div >
        <div className="central-meta hanggift">



          <div style={{ textAlign: 'center' }}>
            <Form>

              <div className="headpop">

                {/* adding */}
                <div style={{ float: 'left', width: '50%', textAlign: 'left' }}>
                  <div style={{ padding: '0 11px 11px 11px' }}><div className="popupimg">
                    <img src={user ? fileStorage.baseUrl + user.profilePicturePath : fileStorage.baseUrl + userR.profilePicturePath} alt="" /></div>
                    <div class="popupuser-name"><div style={{ float: 'left', display: 'inline' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{`${user.firstName} ${user.lastName}`}{(userF) ? <> with {`${userF.firstName} ${userF.lastName}`}</> : null}</span>
                      <span style={{ display: 'block', fontSize: '12px' }}>
                        <div className="dropdown">
                          <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                            <option value="Friends">Friends</option>
                            <option value="Public">Public</option>
                            <option value="Only Me">Only Me</option>
                          </select></div> </span></div> </div> </div></div>
                <div className="row" style={{ width: '50%', float: 'left' }}>
                  <div style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold', width: '25%', textAlign: 'center' }}><span></span></div>
                  <span style={{ float: 'right', width: '80%' }}>  <button style={{ float: 'right', borderRadius: '20px' }} type="submit" onClick={uploadPost}>Swap</button></span>
                </div>
                <div style={{ padding: '0 14px 14px 14px' }}>
                </div>
              </div>
              {/* <div style={{padding:'0 14px 14px 14px'}}>  
                                                     </div> */}
              <div style={{ margin: '0 11px 0x 11px' }}>
                <span className="textPop">
                  <textarea className="textpopup"
                    rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="swap_content" value={postContent} onChange={handlePostContent} />
                </span>

              </div>

              <div className="row mrginbtm">
                <div style={{ width: '40%', display: 'inline', textAlign: 'center' }}>
                  <div style={{ height: '230px' }}>
                    {showPostImage ?
                      <>
                        <img id="preview" src={postImage} style={{ maxWidth: "200px" }} />
                        <button onClick={handleRemoveImage} className="buttonClosePrvw lftbtn"><i class="las la-times"></i></button>
                      </>
                      :
                      <div style={{ textAlign: 'center' }}><label className="fileContainer" >
                        <div className="swappic" type="submit">
                          <input type="file" name="swap_image" accept="image/*" onChange={handleFile}>
                          </input>
                          <i class="lar la-file-image"></i><div style={{ fontSize: '12px' }}>Add Swap Image</div> </div>
                      </label></div>
                    }
                  </div>

                </div>

                <div style={{ width: '20%', display: 'inline', textAlign: 'center', padding: '75px 0' }}><img style={{ verticalAlign: 'middle' }} src="/assets/images/swapicon.png" alt="img" /></div>
                <div style={{ width: '40%', display: 'inline', textAlign: 'center' }}>
                  <div style={{ height: '230px' }}>
                    {showSwapImage ?
                      <>
                        <img id="preview" src={swapImage} style={{ maxWidth: "150px" }} />
                        <button onClick={handleRemoveImageSwap} className="buttonClosePrvw rtbtn"><i class="las la-times"></i></button>
                      </>
                      :
                      <div style={{ textAlign: 'center' }}><label className="fileContainer" >
                        <div className="swappic" type="submit">
                          <input type="file" name="swap_image" accept="image/*" onChange={handleFileSwap}></input><i class="lar la-file-image"></i>
                          <div style={{ fontSize: '12px' }}>Add Image to be swapped</div> </div>
                      </label></div>
                    }</div>
                </div></div>




            </Form>

          </div>
        </div>




      </div>



    </>
  )
}