import React, { useState, useEffect, useContext, cloneElement } from 'react';
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
import settings from '../../services/Settings';
import EditPostComponent from './EditPostComponent'
import Modal from 'react-modal';


import Layout from '../LayoutComponent';
import GuideComponent from './GuideComponent';
import SwapPostComponent from '../post/SwapPostComponent';
import StoriesComponent from '../Stories/StoriesComponent';
import Popup from 'reactjs-popup';
import FriendsService from '../../services/FriendService';
import PostComponent from '../post/PostComponent';
import fileStorage from '../../config/fileStorage';

import LocSearchComponent from '../AccountSettings/LocSearchComponent';
import  { handleSendNotification } from "../dashboard/ShareupInsideHeaderComponent";
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
  const [showComp, setShowComp] = useState("AllSwaps");
  const [showCompont, setShowCompont] = useState();
  const [posts, setPosts] = useState([]);
  
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


  const [swapsForUser, setSwapsForUser] = useState([]);

  const [swapsForUserFriends, setSwapsForUserFriends] = useState([]);



  const [searchedSwap, setSearchedSwap] = useState([]);
  const [searchedSwapFriend, setSearchedSwapFriend] = useState([]);

  const [searchedUser, setSearchedUser] = useState([]);

  const [privacy, setprivacy] = useState('privacy');


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
    getSwapsForUser()
    getSwapForUserFriends()
    getSavedPost()
    testScript()
  }, [editPostId, refresh])

  useEffect(() => {
    getSwapsForUser()
    getSwapForUserFriends()
    getSavedPost()
    testScript()
  }, [user])
  useEffect(() => {
    getStoriesForUser()
    testScript()
  }, [stories])

  const uploadStories = (event) => {
    event.preventDefault();
    setUploadError("")


    const formData = new FormData();
    formData.append(`stryfiles`, filesStry)
    StoriesService.createStories(user.id, formData).then(res => {
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
      const sorting = res.data.sort(function (a, b) {
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
  const getSwapsForUser = async () => {

    await SwapService.getSwapForUser(AuthService.getCurrentUser().username).then(res => {
      const sorting = res.data.sort(function (a, b) {
        let dateA = new Date(a.published), dateB = new Date(b.published);
        return dateB - dateA;
      });
      const uniquePost = Array.from(new Set(sorting.map(a => a.id)))
        .map(id => {
          return res.data.find(a => a.id === id)
        })
      setSwapsForUser(uniquePost)
      setSearchedSwap(uniquePost)
    })
  }

  const getSwapForUserFriends = async () => {

    await SwapService.getSwapForUserFriends(AuthService.getCurrentUser().username).then(res => {
      const sorting = res.data.sort(function (a, b) {
        let dateA = new Date(a.published), dateB = new Date(b.published);
        return dateB - dateA;
      });
      const uniquePost = Array.from(new Set(sorting.map(a => a.id)))
        .map(id => {
          return res.data.find(a => a.id === id)
        })
      setSwapsForUserFriends(uniquePost)
      setSearchedSwapFriend(uniquePost)

    })
  }


  const mySwaps = async () => {

    getSwapsForUser()



  }
  const allSwaps = async () => {
    // setSwapsForUser(swapsForUser)
    getSwapForUserFriends()

  }



  const handleFileStry = (event) => {
    setFilesStry(event.target.files[0])
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setStoriesImage(reader.result)
      }
    }
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
    GroupService.leaveGroup(user.id, group_id).then(res => {
      setRefresh(res.data)
      setGroup(res.data)
    })
  }
  const handleChange = e => {
    const target = e.target;
    if (target.checked) {
      setprivacy(target.value);
    }
  };


  const handleJoinGroup = (group_id) => {
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
    setPostContent(event.target.value)
  }

  const handleDeletePost = (postid) => {
    PostService.deletePost(postid).then(res => {
      setRefresh(res.data)
      // window.location.reload();
    })
  }

  const handleCommentContent = (event) => {
    setCommentContent(event.target.value)
  }

  const handlePostingComment = (postid) => {
    if (commentContent === "") {
      return null;
    }
    const comment = { content: commentContent }
    PostService.addComment(user.id, postid, comment).then(res => {
      setRefresh(res.data)
      setCommentContent("")
    })
  }
  const handleCount = (opertator) => {
    if (opertator === "+") {
      let counting = count + 1
      setCount(counting)

    }
  }
  const handleEditPost = (id) => {
    setEditPostId(id)
  }

  const handleFile = (event) => {
    setFiles(event.target.files[0])
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPostImage(reader.result)
      }
    }
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
    // window.location.reload();
  }

  const checkIfLiked = (post) => {
    // maybe this is more effecient
    // post.reactions.map(r => {
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
    // maybe this is more effecient
    // post.savedByUsers.map(r => {
    // if(r.user.id === user.id){
    //   return true
    // }else{
    //   return false
    // }
    // })
    const result = post.savedByUsers.filter(userz => userz.id == user.id)
    if (result.length > 0) {
      return true
    }
    return false
  }

  const handleDeleteComment = (commentid) => {
    PostService.deleteComment(commentid).then(res => {
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
    setPrivacy(event.target.value)
  }
  const uploadPost = (event) => {
    event.preventDefault();
    setUploadError("")
    if (postContent === "" && (Object.keys(files).length === 0 && files.constructor === Object)) {
      setUploadError("Please Insert A Text or an Image")
      return
    }

    const formData = new FormData();
    formData.append('content', postContent)

    formData.append(`files`, files)
    formData.append(`swapfiles`, swapfiles)
    formData.append(`privacy`, Privacy)
    if (userF === null) {
      PostService.createPost(user.id, formData, null).then(res => {
        setPostContent("")
        handleRemoveImage()
        setRefresh(res.data)
      })
    } else
      PostService.createPost(user.id, formData, userF.id).then(res => {
        setPostContent("")
        handleRemoveImage()
        setRefresh(res.data)
      })
  }

  const handleLikePost = async (post_id) => {
    UserService.likePost(user.id, post_id).then(res => {
      handleSendNotification(res.data.userdata.id,'Liked your swap',user.firstName,user.lastName,user.email,"post",post_id)

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
    setSwapContent(event.target.value)
  }
  const handleFileSwap = (event) => {
    setSwapfiles(event.target.files);
    let filesAmount = event.target.files.length;
    if (filesAmount < 6) {
      let tempImage = [];
      for (let i = 0; i < filesAmount; i++) {
        //tempImage=[...tempImage,URL.createObjectURL(event.target.files[i])]
        tempImage.push(URL.createObjectURL(event.target.files[i]));
      }

      setSwapImage(tempImage);
      setShowSwapImage(true);
    } else {
      alert('5 files are allowed');
      event.preventDefault();
    }
  };
  const handleRemoveImageSwap = () => {
    setSwapfiles({})
    setShowSwapImage(false)
  }
  // const uploadSwap = (event) => {
  //   event.preventDefault();
  //   setUploadError("")
  //   if (swapContent === "" && (Object.keys(files).length === 0 && files.constructor === Object)) {
  //     setUploadError("Please Insert A Text or an Image")
  //     return
  //   }

  //   const formData = new FormData();
  //   formData.append('content', swapContent)
  //   formData.append(`files`, files)
  //   SwapService.createSwap(user.id, formData).then(res => {
  //     setSwapContent("")
  //     handleRemoveImage()
  //     setRefresh(res.data)
  //   })
  // }

  const imageshowSwap = () => {
    return (
      <div style={{ margin: '0 11px', padding: '15px', boxShadow: '0 0 3px rgb(0 0 0 / 16%)', borderRadius: '5px' }}>
        <div style={{ display: 'inline' }}>What has to be swapped?</div>

        <div className='add-smilespopup'>
          <label className='fileContainer'>
            <input type='file' name='swap_image' accept='image/*' onChange={handleFileSwap}></input>
            <i className='lar la-file-image'></i>
          </label>
        </div>
        <div className='gifpopup' style={{ fontSize: '28px', paddingBottom: '14px' }}>
          <Popup
            trigger={
              <a href='#!'>
                <i className='las la-user-tag' ></i>
              </a>
            }
            modal
            nested
          >
            {(close) => (
              <Form style={{ margin: '5px' }} className='popwidth'>
                <div className='search-container'>
                  <i className='las la-search'></i>
                  <input
                    className='friend-search'
                    type='text'
                    id='header-search'
                    placeholder='Search Friends'
                    name='s'
                    onChange={handleSearchedUser}
                  />
                  <span onClick={close}>Done</span>
                </div>
                {userF ? (
                  <>
                    <div className='Tag'>Tagged:{`${userF.firstName} ${userF.lastName}`}</div>
                  </>
                ) : null}
                <div>
                  <ul>
                    {friendsList.length > 0 ? (
                      <>
                        {friendsList.map((userM) =>
                          user.id !== userM.id ? (
                            <li key={userM.id} className='friends-card'>
                              <a href='#!' onClick={() => handleTag(userM)}>
                                {' '}
                                <div className='grid-container'>
                                  {/* <figure> */}
                                  <div className='item1'>
                                    <a href={`/profile/${userM.email}`} title={`${userM.email}`}>
                                      <img style={{ objectFit: 'cover' }} src={userM.profilePicturePath} alt='' />
                                    </a>
                                    {/* </figure> */}
                                  </div>
                                  <div className='item2'>
                                    <p className='nameTagMsg'>{`${userM.firstName} ${userM.lastName}`}</p>
                                  </div>
                                  {/* <div className="  "> */}
                                </div>
                              </a>
                            </li>
                          ) : null
                        )}
                      </>
                    ) : (
                      <div style={{ padding: '10% 0', textAlign: 'center' }}>You have no friends to tag</div>
                    )}
                  </ul>
                </div>
              </Form>
            )}
          </Popup>
        </div>
        <div className='campopup'>
          <Popup
            trigger={
              <a href='#!'>
                <i className='las la-map-marker-alt'></i>
              </a>
            }
            nested
            modal
          >
            {(close) => (
              <Form style={{ margin: '5px' }} className='popwidth'>
                <LocSearchComponent />
              </Form>
            )}
          </Popup>{' '}
        </div>

        {/* <ul style={{marginLeft:'10px'}}>
      <li style={{fontSize:'12px'}}>What's in hang?</li>
      <li><label className="fileContainer"><i className="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
    </label></li></ul>*/}
      </div>
    );
  };
  const uploadSwap = (event) => {
    event.preventDefault();
    setUploadError('');
    if (swapContent === '' && Object.keys(swapfiles).length === 0 && swapfiles.constructor === Object) {
      setUploadError('Please Insert A Text or an Image');
      return;
    }

    const formData = new FormData();

    formData.append('content', swapContent);
    for (let i = 0; i < swapfiles.length; i++) {
      formData.append(`files`, swapfiles[i]);
    }


    formData.append(`swapfiles`, swapfiles);
    formData.append(`privacy`, Privacy);
    if (userF === null) {
      SwapService.createSwap(user.id, formData, null).then((res) => {

        setSwapContent('');
        handleRemoveImageSwap();
        setRefresh(res.data);

      });
    } else
      SwapService.createSwap(user.id, formData, userF.id).then((res) => {
        setSwapContent('');
        handleRemoveImageSwap();
        setRefresh(res.data);
      });
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
  const getUser = async () => {
    if (user === null) {
      await UserService.getUserByEmail(AuthService.getCurrentUser().username).then(res => {
        setUserR(res.data);
      })
    } else {
      setUserR(user)
    }
  }
  const imageshow = () => {

    return (
      <div style={{ margin: '0 11px', padding: '15px', boxShadow: '0 0 3px rgb(0 0 0 / 16%)', borderRadius: '5px' }}>
        <div style={{ display: 'inline' }}>What's in hang?</div>

        <div className="add-smilespopup"><label className="fileContainer"><i className="lar la-file-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
        </label></div>
        <div className="gifpopup"><Popup trigger={<a href="#!"><i className="las la-user-tag"></i></a>} nested modal>
          {close => (<Form style={{ margin: '5px' }} className="popwidth">
            <div className="search-container">
              <i className="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Friends" name="s" onChange={handleSearchedUser} /><span onClick={close}>Done</span>
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
                            <div className="item1">
                              <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{ objectFit: 'cover' }} src={fileStorage.baseUrl + userM.profilePicturePath} alt="" /></a>
                              {/* </figure> */}

                            </div>
                            <div className="item2"><p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
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
        <div className="campopup"><label className="fileContainer"><i className="las la-map-marker-alt"></i><input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
        </label></div>


        {/* <ul style={{marginLeft:'10px'}}>
      <li style={{fontSize:'12px'}}>What's in hang?</li>
      <li><label className="fileContainer"><i className="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
    </label></li></ul>*/}</div>
    )


  }
  const imageshowPost = () => {

    return (
      <div style={{ margin: '0 11px', padding: '15px', boxShadow: '0 0 3px rgb(0 0 0 / 16%)', borderRadius: '5px' }}>
        <div style={{ display: 'inline' }}>Add More</div>

        <div className="add-smilespopup"><label className="fileContainer"><i className="lar la-file-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
        </label></div>
        <div className="gifpopup"><Popup trigger={<a href="#!"><i className="las la-user-tag"></i></a>} nested modal>
          {close => (<Form style={{ margin: '5px' }} className="popwidth">
            <div className="search-container">
              <i className="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Friends" name="s" onChange={handleSearchedUser} /><span onClick={close}>Done</span>
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
                            <div className="item1">
                              <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{ objectFit: 'cover' }} src={fileStorage.baseUrl + userM.profilePicturePath} alt="" /></a>
                              {/* </figure> */}

                            </div>
                            <div className="item2"><p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
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
        <div className="campopup"><label className="fileContainer"><i className="las la-map-marker-alt"></i><input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
        </label></div>


        {/* <ul style={{marginLeft:'10px'}}>
        <li style={{fontSize:'12px'}}>What's in hang?</li>
        <li><label className="fileContainer"><i className="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
      </label></li></ul>*/}</div>
    )


  }



  const popUp = () => {
    return (
      <Popup trigger={<span style={{ cursor: "pointer" }} ><span style={{ marginRight: '5px' }}><img style={{ verticalAlign: 'middle', width: '15px' }} src="/assets/images/hangshare.svg" alt="img" /></span>Hang Share</span>} modal nested>
        {close => (<Form className="popwidth" style={{ margin: '5px' }}>

          <div className="headpop">
            <div className="row"><div style={{ width: '5%' }}><a href="#!" style={{ padding: '10px 80px 10px 0' }} onClick={close}><i className="las la-times"></i></a></div>
              <div style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold', width: '70%', textAlign: 'center' }}> <span>Today to me, Tomorrow to you</span></div>
              <div style={{ width: '25%', textAlign: 'right' }}><a className="popup-btn" href="/HangGift" >Keep Hang</a></div>
            </div></div>

          <div style={{ padding: '0 11px 11px 11px' }}><div className="popupimg">
            <img src={user ? fileStorage.baseUrl + user.profilePicturePath : fileStorage.baseUrl + userR.profilePicturePath} alt="" /></div>
            <div className="popupuser-name"><div style={{ float: 'left', display: 'inline' }}><span>{`${user.firstName} ${user.lastName}`}{(userF) ? <> with {`${userF.firstName} ${userF.lastName}`}</> : null}</span>
              <span style={{ display: 'block', fontSize: '12px' }}><div className="dropdown">
                <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                  <option value="Friends">Friends</option>
                  <option value="Public">Public</option>
                  <option value="Only Me">Only Me</option>
                </select></div> </span></div> </div> </div>
          <div style={{ margin: '0 0 100px 11px' }}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
            {showPostImage ?
              <>
                <img id="preview" src={postImage} style={{ width: "100%", objectFit: 'cover' }} />
                <button onClick={handleRemoveImage} style={{ right: '25px', position: 'absolute', borderRadius: '100%', background: '#b7b7b738', padding: '10px 10px' }}><i className="las la-times"></i></button>
              </>
              :
              null
            }
          </span>
            {/* <a href="#!" onClick={() => setShowCompont("image")}><span style={{float:'right',padding:'5px',margin:'5px',background:'#033347',padding: '2px 5px',color:'#fff',borderRadius:'5px'}}>+</span></a>*/}</div>

          {
            imageshow()
          }
          <div style={{ textAlign: 'center', background: '#C4C4C4', fontWeight: 'bold', color: 'rgb(68 68 68)', margin: '11px 11px', padding: '15px', borderRadius: '5px', fontSize: '14px', cursor: "pointer" }} onClick={uploadPost}>Post</div>
        </Form>
        )}
      </Popup>
    )
  }
  const popAudience = () => {
    return (

      <Popup
        trigger={
          <span style={{ fontSize: '11px', padding: '4px', cursor: 'pointer', backgroundColor: '#0333471a', borderRadius: '5px' }}>
            {privacy}

            <img src="assets/images/Vector.svg"
              style={{ paddingLeft: '4px', verticalAlign: 'middle' }} />
          </span>
        }
        modal
        nested
      >
        {(close) => (
          <Form style={{ paddingRight: '11px', paddinLeft: '11px', paddingBottom: '0px' }}
            className='popwidth' onSubmit={close}>
            <div className='headpop' style={{ padding: '0px' }}>
              <div className='row' style={{ paddingBottom: '10px', paddingtop: '10px' }}>
                <div style={{ width: '5%', paddingBottom: '10px' }}>
                  <a href='#!' style={{ padding: '10px 80px 10px 0' }} onClick={close}>
                    <i className='las la-times' style={{ fontSize: '20px', background: '#C4C4C4', borderRadius: '50%' }}></i>
                  </a>
                </div>

                <div
                  style={{ color: '#000000', fontSize: '21px', fontWeight: 'bold', width: '95%', textAlign: 'center' }}

                >
                  {' '}
                  <span>Select Audience</span>
                </div>

              </div>

              <div className="headaudience"

              >
                {' '}
                <span style={{ fontWeight: 'bold' }}
                >Who can see your post?</span>
                <p style={{ fontSize: '13px', paddingTop: '2px' }}>
                  <p style={{ color: '#525050', fontweight: '400 !important' }}>
                    your post will apear in newsfeed, on your profile and search results</p>
                </p>
              </div>
              <div>

                <fieldset>
                  <div className="form-card">
                    <ul className="nearby-contct">

                      <yi >
                        <div className="grid-containeraudience">
                          <div className="item11">

                            <img src="assets/images/publicicon.svg" style={{ width: '49%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div className="item22">

                            <p style={{ fontSize: '17px', fontWeight: 'bold', color: 'black' }}>
                              Public
                            </p>
                            <p style={{ fontSize: '11px', paddingTop: '1px' }}>
                              <p style={{ color: '#525050' }}>
                                anyone on or off facebook</p>
                            </p>


                          </div>

                          <input type="radio" Value="Public" name="privacy" onChange={handleChange} style={{ height: '60%', width: '100%' }} />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}

                        </div>
                      </yi>

                      <yi>
                        <div className="grid-containeraudience">
                          <div className="item11">

                            <img src="assets/images/friendsicon.svg" style={{ width: '46%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div className="item22">

                            <p style={{ fontSize: '17px', fontWeight: 'bold', color: 'black' }}>
                              Friends
                            </p>

                            <p style={{ fontSize: '11px', fontweight: '300', paddingTop: '1px', color: '#525050' }}>
                              your shareup friends
                            </p>


                          </div>

                          <input type="radio" Value="Friends" name="privacy" onChange={handleChange} style={{ height: '60%', width: '100%' }} />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}

                        </div>
                      </yi>

                      <yi >
                        <div className="grid-containeraudience">
                          <div className="item11">

                            <img src="assets/images/friendexcepticon.svg" style={{ width: '46%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div className="item22">

                            <p style={{ fontSize: '17px', fontWeight: 'bold', color: 'black' }}>
                              Friends except
                            </p>
                            <p style={{ fontSize: '11px', fontweight: '300', paddingTop: '1px', color: '#525050' }}>
                              don't show some friends
                            </p>

                          </div>

                          <input type="radio" Value="Friends except" name="privacy" onChange={handleChange} style={{ height: '60%', width: '100%' }} />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}

                        </div>
                      </yi>

                      <yi  >
                        <div className="grid-containeraudience">
                          <div className="item11">

                            <img src="assets/images/groupicon.svg" style={{ width: '46%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div className="item22">

                            <p style={{ fontSize: '17px', fontWeight: 'bold', color: 'black' }}>
                              Group
                            </p>
                            <p style={{ fontSize: '11px', fontweight: '300', paddingTop: '1px', color: '#525050' }}>
                              select to show for group
                            </p>
                          </div>

                          <input type="radio" Value="Group" name="privacy" onChange={handleChange} style={{ height: '60%', width: '100%' }} />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}

                        </div>
                      </yi>

                      <yi  >
                        <div className="grid-containeraudience">
                          <div className="item11">

                            <img src="assets/images/onlymeicon.svg" style={{ width: '39%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div className="item22">
                            <p style={{ fontSize: '17px', fontWeight: 'bold', color: 'black' }}>
                              Only Me
                            </p>
                            <p style={{ fontSize: '11px', fontweight: '300', paddingTop: '1px', color: '#525050' }}>
                              private to all shareup users
                            </p>
                          </div>

                          <input type="radio" Value="Only Me" name="privacy" style={{ height: '60%', width: '100%' }} />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}

                        </div>
                      </yi>


                    </ul>
                  </div>
                </fieldset>



              </div>
            </div>

          </Form>
        )}
      </Popup>
    );
  };



  //Adding new swap
  const postSwap = () => {
    return (
      <Popup trigger={
        <span style={{ cursor: 'pointer' }}>
          <span style={{ padding: '5px' }}>
            <i className="las la-sync-alt" aria-hidden="true" style={{ fontSize: '18px' }}></i>
          </span>
          Swap
        </span>
        // <div className="textbox"><span style={{cursor: "pointer"}}>Do you want to swap anything?</span></div>
      }
        modal nested>
        {close => (
          <Form style={{ margin: '5px' }} className='popwidth' onSubmit={(e) => {
            uploadSwap(e); close();
          }}>

            <div className='headpop'>
              <div className='row'>
                <div style={{ width: '20%' }}>
                  <a href='#!' style={{ padding: '10px 80px 10px 0' }} onClick={close}>
                    <i className='las la-times'></i>
                  </a>
                </div>
                <div
                  style={{ color: '#000000', fontSize: '18px', fontWeight: 'bold', width: '60%', textAlign: 'center' }}
                >
                  {' '}
                  <span>Create Swap</span>
                </div>
                <div style={{ width: '20%', textAlign: 'right', padding: '0' }}>
                  <a className='popup-btn' href='/HangGift'>
                    Keep Swap
                  </a>
                </div>
              </div>
            </div>
            <div style={{ padding: '0 11px 11px 11px' }}>
              <div className='popupimg'>
                <img
                  src={
                    user
                      ? fileStorage.baseUrl + user.profilePicturePath
                      : fileStorage.baseUrl + userR.profilePicturePath
                  }
                  alt=''
                />
              </div>
              <div className='popupuser-name'>
                <div style={{ display: 'inline' }}>
                  <span>
                    {`${user.firstName} ${user.lastName}`}
                    {userF ? <> with {`${userF.firstName} ${userF.lastName}`}</> : null}
                  </span>
                  <span style={{ marginTop: '4px ', display: 'block', fontSize: '10px' }}>
                    <li style={{ paddingLeft: '0%', paddingTop: '1%', listStyleType: 'none' }}>
                      {popAudience()}
                    </li>

                    {/* <div className='dropdownnewsfeed'>
                      <select name='privacy' id='privacy' value={Privacy} onChange={handlePrivacy}>
                        <option value='Friends'>Friends</option>
                        <option value='Public'>Public</option>
                        <option value='Only Me'>Only Me</option>
                      </select>
                    </div>{' '} */}
                  </span>
                </div>{' '}
              </div>{' '}
            </div>
            <div style={{ minHeight: '150px' }}>
              <span className='textPop'>
                <textarea
                  className='textpopup'
                  rows={2}
                  placeholder={uploadError ? `${uploadError}` : 'We share,do you?'}
                  name='swap_content'
                  value={swapContent}
                  onChange={handleSwapContent}
                />

                {showSwapImage ? (
                  <>
                    <div style={{ position: 'relative' }}>
                      {swapImage.map((item, key) => (
                        <img
                          src={item}
                          key={key}
                          style={{
                            padding: '10px',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                      ))}

                      {/* <img id="preview" src={postImage} style={{ width: "100%",objectFit:'cover' }} /> */}
                      <button
                        onClick={handleRemoveImageSwap}
                        style={{
                          right: '10px',
                          top: '10px',
                          position: 'absolute',
                          borderRadius: '100%',
                          background: '#b7b7b738',
                          padding: '10px 10px',
                        }}
                      >
                        <i className='las la-times'></i>
                      </button>
                    </div>

                  </>
                ) : null}
              </span>
              {/* <a href="#!" onClick={() => setShowCompont("image")}><span style={{float:'right',padding:'5px',margin:'5px',background:'#033347',padding: '2px 5px',color:'#fff',borderRadius:'5px'}}>+</span></a>*/}
            </div>

            {imageshowSwap()}
            <button
              type='submit'
              value='Submit'
              className="popsbmt-btn"
            // onClick={uploadSwap}
            >
              SWAP
            </button>
          </Form>
        )}
      </Popup>
    )
  }

  //ends swap here

  const postUp = () => {
    return (
      <Popup trigger={<div className="textbox"><span style={{ cursor: "pointer" }}>We share,do you?</span></div>} modal nested>
        {close => (<Form className="popwidth">

          <div className="headpop">
            <div className="row"><div style={{ width: '5%' }}><a href="#!" onClick={close}><i className="las la-times"></i></a></div>
              <div style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold', width: '95%', textAlign: 'center' }}><span>We share, do you?</span></div>

            </div></div>

          <div style={{ padding: '0 11px 11px 11px' }}><div className="popupimg">
            <img src={user ? fileStorage.baseUrl + user.profilePicturePath : fileStorage.baseUrl + userR.profilePicturePath} alt="" /></div>
            <div className="popupuser-name"><div style={{ float: 'left', display: 'inline' }}><span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{`${user.firstName} ${user.lastName}`}{(userF) ? <> with {`${userF.firstName} ${userF.lastName}`}</> : null}</span>
              <span style={{ display: 'block', fontSize: '12px' }}><div className="dropdown">
                <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                  <option value="Friends">Friends</option>
                  <option value="Public">Public</option>
                  <option value="Only Me">Only Me</option>
                </select></div> </span></div> </div> </div>
          <div style={{ margin: '0 11px 100px 11px' }}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
            {showPostImage ?
              <>
                <img id="preview" src={postImage} style={{ width: "100%" }} />
                <button onClick={handleRemoveImage} style={{ right: '20px', position: 'absolute', borderRadius: '100%', background: '#b7b7b738', padding: '10px 10px' }}><i className="las la-times"></i></button>
              </>
              :
              null
            }</span>
          </div>

          {
            imageshowPost()
          }
          <div style={{ textAlign: 'center', background: '#C4C4C4', fontWeight: 'bold', color: 'rgb(68 68 68)', margin: '11px 11px', padding: '15px', borderRadius: '5px', fontSize: '14px', cursor: "pointer" }} onClick={uploadPost}>Post</div>

        </Form>
        )
        }
      </Popup>
    )
  }

  const shareUp = () => {
    return (
      <Popup trigger={<span style={{ cursor: "pointer" }}><img style={{ verticalAlign: 'middle' }} src="/assets/images/share-2.svg" alt="img" />Share Up</span>} modal nested>
        {close => (<Form className="popwidth">

          <div className="headpop">
            <div className="row"><div style={{ width: '5%' }}><span><a href="#!" onClick={close} ><i className="las la-times"></i></a></span></div>
              <div style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold', width: '85%', textAlign: 'center' }}><span>Share up</span></div>
              <div style={{ width: '10%', textAlign: 'center' }}><span style={{ float: 'right' }}>  <button style={{ float: 'right', borderRadius: '20px' }} type="submit" onClick={uploadPost}>Post</button></span></div>
            </div></div>

          <div style={{ padding: '0 11px 11px 11px' }}>  <div className="popupimg">
            <img src={user ? fileStorage.baseUrl + user.profilePicturePath : fileStorage.baseUrl + userR.profilePicturePath} alt="" /></div>
            <div className="popupuser-name"><div style={{ float: 'left', display: 'inline' }}><span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{`${user.firstName} ${user.lastName}`}{(userF) ? <> with {`${userF.firstName} ${userF.lastName}`}</> : null}</span>
              <span style={{ display: 'block', fontSize: '12px' }}><div className="dropdown">
                <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                  <option value="Friends">Friends</option>
                  <option value="Public">Public</option>
                  <option value="Only Me">Only Me</option>
                </select></div> </span></div> </div> </div>
          <div style={{ margin: '0 11px 100px 11px' }}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
            {showPostImage ?
              <>
                <img id="preview" src={postImage} style={{ width: "100%" }} />
                <button onClick={handleRemoveImage} style={{ right: '20px', position: 'absolute', borderRadius: '100%', background: '#b7b7b738', padding: '10px 10px' }}><i className="las la-times"></i></button>
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
    return (
      <Popup trigger={<span style={{ cursor: "pointer" }}><img style={{ verticalAlign: "middle", padding: '5px' }} src="assets/images/images.svg" /><span>Photos</span></span>} modal>
        {close => (<Form className="popwidth">

          <div className="headpop">

            <div className="row"><div style={{ width: '5%' }}><span><a href="#!" onClick={close}  ><i className="las la-times"></i></a></span></div>
              <div style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold', width: '85%', textAlign: 'center' }}><span>Let's swap</span></div>
              <div style={{ width: '10%', textAlign: 'center' }}><span style={{ float: 'right' }}>  <button style={{ float: 'right', borderRadius: '20px' }} type="submit" onClick={uploadPost}>Post</button></span></div>
            </div></div>
          <div style={{ padding: '0 11px 11px 11px' }}>  <div className="popupimg">
            <img src={user ? fileStorage.baseUrl + user.profilePicturePath : fileStorage.baseUrl + userR.profilePicturePath} alt="" /></div>
            <div className="popupuser-name"><div style={{ float: 'left', display: 'inline' }}><span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{`${user.firstName} ${user.lastName}`}</span>
              <span style={{ display: 'block', fontSize: '12px' }}><div className="dropdown">
                <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                  <option value="Friends">Friends</option>
                  <option value="Public">Public</option>
                  <option value="Only Me">Only Me</option>
                </select></div> </span></div> </div> </div>
          <div style={{ margin: '0 11px 0x 11px' }}><span className="textPop"><textarea className="textpopup" rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="swap_content" value={postContent} onChange={handlePostContent} />



          </span>

          </div>
          {/* <div className="popupimg"> 
                                    <img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /></div>
                                       <div className="popupuser-name"><div style={{float:'left', display: 'inline'}}><span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{`${user.firstName} ${user.lastName}`}</span>
                                       <span style={{display: 'block', fontSize: '12px'}}><div className="dropdown">
                                  <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                                    <option value="Friends">Friends</option>
                                    <option value="Public">Public</option>
                                    <option value="Only Me">Only Me</option>
                                  </select></div> </span></div> </div>  */}
          <div className="row mrginbtm"><div style={{ width: '50%', display: 'inline', textAlign: 'center' }}>
            <div style={{ height: '230px' }}>
              {showPostImage ?
                <>
                  <img id="preview" src={postImage} />
                  <button onClick={handleRemoveImage} className="buttonClosePrvw lftbtn"><i className="las la-times"></i></button>
                </>
                :
                null
              }
            </div>
            <div className="swaptext">Provide clear image of object to swap</div>
            <div style={{ textAlign: 'center' }}><label className="fileContainer" ><button className="swapPopupBtn" type="submit"><input type="file" name="swap_image" accept="image/*" onChange={handleFile}></input>Add photo</button>
            </label></div>
          </div>

            {/* <label className="fileContainer"><div style={{textAlign:'center',background:'#C4C4C4',fontWeight:'bold',color:'rgb(68 68 68)', margin:'11px 11px', padding:'15px',borderRadius:'5px'}} > Let's take picture<input type="file" name="post_image" accept="image/*" onChange={handleFile}></input></div></label> */}
            <div style={{ width: '50%', display: 'inline', textAlign: 'center' }}>
              <div style={{ height: '230px' }}>
                {showSwapImage ?
                  <>
                    <img id="preview" src={swapImage} />
                    <button onClick={handleRemoveImageSwap} className="buttonClosePrvw rtbtn"><i className="las la-times"></i></button>
                  </>
                  :
                  null
                }</div>
              <div className="swaptext">Provide image of object in return</div>
              <div style={{ textAlign: 'center' }}><label className="fileContainer" ><button className="swapPopupBtn" type="submit"><input type="file" name="swap_image" accept="image/*" onChange={handleFileSwap}></input>Add photo</button>
              </label></div></div></div>




        </Form>
        )}
      </Popup>
    )
  }
  const testFanc = (post) => {
    return (<PostComponent post={post} setRefresh={setRefresh} />)
  }

  const show = () => {
    return (
      <div className="loadMore">
        {swapsForUserFriends && swapsForUserFriends.length > 0
          ? swapsForUserFriends.map(
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
          : <div style={{textAlign:"center"}}>No Swaps</div>
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
  const handleTag = (userM) => {
    setUserF(userM)
  }
  const handleSearchedUser = (event) => {
    if (event.target.value === "") {
      setSearchedUser(allUser)
    } else {
      let temp = []
      allUser.map(u => {
        const email = u.email.toLowerCase()
        const searchedvalue = event.target.value.toLowerCase()
        if (email.includes(searchedvalue) ) {
          temp.push(u)
        }
      })
      setSearchedUser(temp)
    }
  }
  

  const handleSearchedSwap = (event) => {
    if (event.target.value === "") {
      setSearchedSwap(swapsForUser)
    } else {
      let temp = []
      swapsForUser.map(u => {
        const content = u.content.toLowerCase()
      
        const searchedvalue = event.target.value.toLowerCase()
        if (content.includes(searchedvalue) ) {
          temp.push(u)
        }
      })
      setSearchedSwap(temp)
    }
  }



  const handleSearchedSwapFriend = (event) => {
    if (event.target.value === "") {
      setSearchedSwap(swapsForUserFriends)
    } else {
      let temp = []
      swapsForUserFriends.map(u => {
        const content = u.content.toLowerCase()
      
        const searchedvalue = event.target.value.toLowerCase()
        if (content.includes(searchedvalue) ) {
          setSearchedSwapFriend(temp)

          temp.push(u)
        }
      })
      setSearchedSwapFriend(temp)
    }
  }
 

  
  const getAllUser = async () => {
    await UserService.getUsers().then(res => {
      setAllUser(res.data)
      setSearchedUser(res.data)
    })
  }
  const getFriendsList = async () => {
    await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
      setFriendsList(res.data)
    })
  }



const AllswapscomponentFunction = () => {
    return (
      <div className="loadMore">
         <div className="friends-search-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input className="friend-search" type="text" placeholder="Search Swap" name="s" onChange={handleSearchedSwapFriend} style={{ width: "100%" }} />
            </div>
        {searchedSwapFriend && searchedSwapFriend.length > 0
          ? searchedSwapFriend.map(
            post =>
              <div style={{paddingBottom:'10px'}} key={post.id}>
                {
                  post.group ?
                    post.group.members.some(member => member.email === AuthService.getCurrentUser().username) ?
                      testFanc(post) : null
                    :
                    testFanc(post)
                }
              </div>
          )
          : <div className="center" style={{padding: "20px"}}>No Swaps</div>
        }


      </div>
    )
  }

  const MySwapsComponentFunction = () => {
    return (
      <div className="loadMore">
         <div className="friends-search-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input className="friend-search" type="text" placeholder="Search Swap" name="s" onChange={handleSearchedSwap} style={{ width: "100%" }} />
            </div>
        {searchedSwap && searchedSwap.length > 0
          ? searchedSwap.map(
            post =>
              <div style={{paddingBottom:'10px'}} key={post.id}>
                {
                  post.group ?
                    post.group.members.some(member => member.email === AuthService.getCurrentUser().username) ?
                      testFanc(post) : null
                    :
                    testFanc(post)
                }
              </div>
          )
          : <div className="center" style={{padding: "20px"}}>No Swaps</div>
        }

      </div>
    )
  }
  
	const handleShowComp = () => {
		if (showComp === "AllSwaps") {
			return AllswapscomponentFunction()
		} else if (showComp === "MySwaps") {
			return MySwapsComponentFunction()
		}
		}

  if (isLoading) {
    return <div>Loading... Please Wait</div>
  }

  if (user.newUser) {
    return <GuideComponent />
  }

  return (
    <Layout user={user}>
      <div className="col-lg-6">
        <div className="central-meta swap-pg-cont">
          <div className="frnds">
            <div>
              <p className="Friends-Title common-title">Swaps</p>
              <i style={{ float: "right", fontSize: 20 }} className="fas fa-ellipsis-v"></i>
            </div>
            <div className="navContent">

              <ul className="nav nav-pills swap-page-nav" role="tablist">
                <li className="nav-item" style={{ justifyContent: 'flex-start' }}>
                  <div className="all" onClick={() => setShowComp("AllSwaps")}>
                    <span style={{ cursor: 'pointer' }}>
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                        <i className="fas fa-retweet" style={{ fontSize: '20px' }}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      All Swaps
                    </span>
                  </div>
                </li>
                <li className="nav-item" style={{ justifyContent: 'center' }}>
                  <div className="my" onClick={() => setShowComp("MySwaps")}>
                    <span style={{ cursor: 'pointer' }}>
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                        <i className="ti-control-shuffle" style={{ fontSize: '20px' }}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      My Swaps
                    </span>
                  </div>
                </li>
                <li className="nav-item" style={{ justifyContent: 'flex-end' }}>
                  <div className="new">
                   

                    {postSwap()}
                  </div>
                </li>
                {/* <li className="nav-item">
                  <span style={{ cursor: 'pointer' }}>
                    <span style={{ marginRight: '5px', padding: '5px' }}>
                      <i className="fas fa-bell" style={{fontSize:'25px'}}></i>
                    </span>
                    Notifications
                  </span>
								</li> */}

              </ul>

            </div>
           
            {handleShowComp()}
          </div>

        </div>
       

      </div>
    </Layout>

  );
}
export default SwapFeedComponent;