import React, { useState, useEffect, useContext, cloneElement } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import SwapService from '../../services/SwapService';
import ReelsServices from '../../services/ReelsServices';
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
import ReelPostComponent from '../post/ReelPostComponent';
import fileStorage from '../../config/fileStorage';
import LocSearchComponent from '../AccountSettings/LocSearchComponent';
import ReactPlayer from 'react-player';
import { Player } from 'video-react';
import ReelsComponentFriends from '../Reels/ReelsComponentFriends';
import DisplayFriendsReelsComponent from '../Reels/DisplayFriendsReelsComponent';


function ReelFeedComponent() {
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
  const [showComp, setShowComp] = useState("AllReels");
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
  const [reelContent, setReelContent] = useState("");


  const [uploadErrorReel, setUploadErrorReel] = useState('');
  const [searchedReelforUser, setSearchedReelforUser] = useState([]);
  const [searchedReel, setSearchedReel] = useState([]);
  const [filesReel, setFilesReel] = useState({});
  const [ReelVideo, setReelVideo] = useState([]);
  const [ShowReelVideo, setShowReelVideo] = useState(false);
  const [reels, setReels] = useState([]);

  const [searchedUser, setSearchedUser] = useState([]);

  const [privacy, setprivacy] = useState('privacy');


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
    getUser().then(() => {
      setIsLoading(false)
    })
    getPost().then(() => {
      setIsLoading(false)
    })
    getReelsForUser().then(() => {
      setIsLoading(false)
    })
    getAllReels().then(() => {
      setIsLoading(false)
    })
    getSavedPost()
    testScript()
  }, [editPostId, refresh])

  useEffect(() => {
    getReelsForUser().then(() => {
      setIsLoading(false)
    })
    getAllReels().then(() => {
      setIsLoading(false)
    })
    getSavedPost().then(() => {
      setIsLoading(false)
    })
    testScript()
  }, [user])
  
  useEffect(() => {
    testScript()
  }, [stories])

  const getReelsForUser = async () => {

    await ReelsServices.getReelForUser(user?.id).then(res => {
      const sorting = res.data.sort(function (a, b) {
        let dateA = new Date(a.published), dateB = new Date(b.published);
        return dateB - dateA;
      });
      
      const uniquePost = Array.from(new Set(sorting.map(a => a.id)))
        .map(id => {
          return res.data.find(a => a.id === id)
        })
      setSearchedReelforUser(uniquePost)
    })
  }

  const getAllReels = async () => {

    await ReelsServices.getReelForUserFriends(user?.id).then(res => {
      const sorting = res.data.sort(function (a, b) {
        let dateA = new Date(a.published), dateB = new Date(b.published);
        return dateB - dateA;
      });
      const uniquePost = Array.from(new Set(sorting.map(a => a.id)))
        .map(id => {
          return res.data.find(a => a.id === id)
        });
        
      setSearchedReel(uniquePost)

    });
  }
  const handleReelContent = (event) => {
    setReelContent(event.target.value);
  };

  const uploadReels = (event) => {
    event.preventDefault();
    setUploadErrorReel('');
    console.log('uploading reels working');

    if (Object.keys(filesReel).length === 0 && filesReel.constructor === Object) {
      setUploadErrorReel('Please Add reel video');
      return;
    }

    var video = document.getElementById("video");
    const canvas = document.createElement("canvas");
    // scale the canvas accordingly
    canvas.width = video.videoWidth / 10;
    canvas.height = video.videoHeight / 10;
    // draw the video at that frame
    canvas.getContext('2d').drawImage(video, 10, 10);
    // convert it to a usable data URL
    // const dataURL = canvas.toDataURL();
    // var img = document.createElement("img");


    const formData = new FormData();
    var content = "";
    formData.append('content', reelContent);
    formData.append(`reelfiles`, filesReel);
    formData.append(`thumbnail`, filesReel);
    ReelsServices.createReels(user.id, formData).then((res) => {
      handleRemoveReelVideo();
      setReels(res.data);
      setRefresh(res.data);

      console.log("response", reels);

    });


  };

  

  const handleRemoveReelVideo = () => {
    setFilesReel({});
    setShowReelVideo(false);
  };

  const handleFileReel = (event) => {

    setFilesReel(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setReelVideo(reader.result);
      }
    };
    console.log(event.target.files[0]);
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0]);
    // }
    setShowReelVideo(true);


  };
  




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
  const handleChange = e => {
    const target = e.target;
    if (target.checked) {
      setprivacy(target.value);
    }
  };


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
        setRefresh(res.data)
      })
    } else
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
    setSwapfiles(event.target.files);
    console.log(swapfiles);
    let filesAmount = event.target.files.length;
    if (filesAmount < 6) {
      let tempImage = [];
      for (let i = 0; i < filesAmount; i++) {
        //tempImage=[...tempImage,URL.createObjectURL(event.target.files[i])]
        tempImage.push(URL.createObjectURL(event.target.files[i]));
      }

      setSwapImage(tempImage);
      console.log('url ' + swapImage[1]);

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

  const imageshowSwap = () => {
    return (
      <div style={{ margin: '0 11px', padding: '15px', boxShadow: '0 0 3px rgb(0 0 0 / 16%)', borderRadius: '5px' }}>
        <div style={{ display: 'inline' }}>What has to be swapped?</div>

        <div className='add-smilespopup'>
          <label className='fileContainer'>
            <input type='file' name='swap_image' accept='image/*' onChange={handleFileSwap}></input>
            <i class='lar la-file-image'></i>
          </label>
        </div>
        <div className='gifpopup' style={{ fontSize: '28px', paddingBottom: '14px' }}>
          <Popup
            trigger={
              <a href='#!'>
                <i class='las la-user-tag' ></i>
              </a>
            }
            modal
            nested
          >
            {(close) => (
              <Form style={{ margin: '5px' }} className='popwidth'>
                <div class='search-container'>
                  <i class='las la-search'></i>
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
                                  <div class='item1'>
                                    <a href={`/profile/${userM.email}`} title={`${userM.email}`}>
                                      <img style={{ objectFit: 'cover' }} src={userM.profilePicturePath} alt='' />
                                    </a>
                                    {/* </figure> */}
                                  </div>
                                  <div class='item2'>
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
                <i class='las la-map-marker-alt'></i>
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
      <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
    </label></li></ul>*/}
      </div>
    );
  };
  const uploadSwap = (event) => {
    event.preventDefault();
    setUploadError('');
    console.log('uploading swap working');
    if (swapContent === '' && Object.keys(swapfiles).length === 0 && swapfiles.constructor === Object) {
      console.log('cant be null');
      setUploadError('Please Insert A Text or an Image');
      return;
    }

    const formData = new FormData();

    formData.append('content', swapContent);
    for (let i = 0; i < swapfiles.length; i++) {
      formData.append(`files`, swapfiles[i]);
    }
    console.log(formData.getAll(`files`));
    console.log(' this is the files' + files[0]);
    console.log(' this is the swapfiles' + swapfiles);
    for (let i = 0; i < `swapfiles`.length; i++) {
      console.log(swapfiles);
    }
    formData.append(`swapfiles`, swapfiles);
    formData.append(`privacy`, Privacy);
    if (userF === null) {
      SwapService.createSwap(user.id, formData, null).then((res) => {
        console.log(JSON.stringify(res));
        console.log(res.data);
        console.log(user.id);
        setSwapContent('');
        handleRemoveImageSwap();
        setRefresh(res.data);
        console.log('ssssssssssrefersh', refresh)

      });
    } else
      SwapService.createSwap(user.id, formData, userF.id).then((res) => {
        console.log(JSON.stringify(res));
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
                              <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{ objectFit: 'cover' }} src={fileStorage.baseUrl + userM.profilePicturePath} alt="" /></a>
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
                              <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{ objectFit: 'cover' }} src={fileStorage.baseUrl + userM.profilePicturePath} alt="" /></a>
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


        {/* <ul style={{marginLeft:'10px'}}>
        <li style={{fontSize:'12px'}}>What's in hang?</li>
        <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
      </label></li></ul>*/}</div>
    )


  }



  const popUp = () => {
    return (
      <Popup trigger={<span style={{ cursor: "pointer" }} ><span style={{ marginRight: '5px' }}><img style={{ verticalAlign: 'middle', width: '15px' }} src="/assets/images/hangshare.svg" alt="img" /></span>Hang Share</span>} modal nested>
        {close => (<Form className="popwidth" style={{ margin: '5px' }}>

          <div className="headpop">
            <div className="row"><div style={{ width: '5%' }}><a href="#!" style={{ padding: '10px 80px 10px 0' }} onClick={close}><i class="las la-times"></i></a></div>
              <div style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold', width: '70%', textAlign: 'center' }}> <span>Today to me, Tomorrow to you</span></div>
              <div style={{ width: '25%', textAlign: 'right' }}><a className="popup-btn" href="/HangGift" >Keep Hang</a></div>
            </div></div>

          <div style={{ padding: '0 11px 11px 11px' }}><div className="popupimg">
            <img src={user ? fileStorage.baseUrl + user.profilePicturePath : fileStorage.baseUrl + userR.profilePicturePath} alt="" /></div>
            <div class="popupuser-name"><div style={{ float: 'left', display: 'inline' }}><span>{`${user.firstName} ${user.lastName}`}{(userF) ? <> with {`${userF.firstName} ${userF.lastName}`}</> : null}</span>
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
                <button onClick={handleRemoveImage} style={{ right: '25px', position: 'absolute', borderRadius: '100%', background: '#b7b7b738', padding: '10px 10px' }}><i class="las la-times"></i></button>
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
                    <i class='las la-times' style={{ fontSize: '20px', background: '#C4C4C4', borderRadius: '50%' }}></i>
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
                          <div class="item11">

                            <img src="assets/images/publicicon.svg" style={{ width: '49%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div class="item22">

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
                          <div class="item11">

                            <img src="assets/images/friendsicon.svg" style={{ width: '46%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div class="item22">

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
                          <div class="item11">

                            <img src="assets/images/friendexcepticon.svg" style={{ width: '46%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div class="item22">

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
                          <div class="item11">

                            <img src="assets/images/groupicon.svg" style={{ width: '46%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div class="item22">

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
                          <div class="item11">

                            <img src="assets/images/onlymeicon.svg" style={{ width: '39%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div class="item22">
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
  const addReel = () => {
    return (

      <Popup trigger={<div className='my'>
          <span style={{ cursor: 'pointer' }}>
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                        <i class="ti-control-shuffle" style={{ fontSize: '20px' }}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      Add Reels
                    </span>
         </div>} modal>
      {(close) => (
        <Form className='popwidth'>

          <div className='headpop'>
            <div style={{ padding: '10px' }}>
              <span>
                <a href='#!' style={{ padding: '10px 150px 10px 0' }} onClick={close}>
                  <i class='las la-times'></i>
                </a>
              </span>
              <span style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold' }}>
                Lets Add Reel Video
              </span>
              {/* { checkIfUserAlreadyPostStory(storyauth.user) ?  */}
              <span style={{ float: 'right' }}>
                {' '}
                <button
                  style={{ float: 'right', borderRadius: '20px', padding: '5px 20px' }}
                  type='submit'
                  onClick={uploadReels}
                >
                  Upload
                </button>
              </span>
              {/* :null}  */}
            </div>
          </div>

          <div style={{ margin: '0 11px 10px 11px' }}>
            <span className='textPop'>
              {ShowReelVideo ? (
                <>
                  <video id='video' width="100%" height={"350px"} controls="controls">
                    <source src={ReelVideo} />
                  </video>


                  <button
                    onClick={handleRemoveReelVideo}
                    style={{
                      right: '20px',
                      position: 'absolute',
                      borderRadius: '100%',
                      background: '#b7b7b738',
                      padding: '10px 10px',
                    }}
                  >
                    <i class='las la-times'></i>
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <label className='fileContainer'>
                    <div className='reelvideo' type='submit'>
                      <input
                        type='file'
                        name='reel_video'
                        accept='video/*'
                        onChange={handleFileReel}
                      ></input>
                      Add Reel Video
                    </div>
                  </label>
                </div>
              )}
            </span>
            <textarea
                              className="textpopup"
                              rows={2}
                              placeholder={"Add Caption to your Reel"}
                              name="reel_content"
                              value={reelContent}
                              onChange={handleReelContent}
                            />
            {/* <div className='storyErr'>{uploadErrorStory ? `${uploadErrorStory}` : null}</div> */}
          </div>
          {/* </> 
                         
       )}  */}
        </Form>
      )}
    </Popup>

    )
  }

  //ends reel here

  

  
  
  const testFanc = (post) => {
    return (<ReelPostComponent post={post} setRefresh={setRefresh} />)
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
          : <div>No Reels to show</div>
        }

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
        const searchedvalue = event.target.value.toLowerCase()
        if (email.includes(searchedvalue) ) {
          temp.push(u)
        }
      })
      setSearchedUser(temp)
      console.log(temp)
    }
  }
  

  const handleSearchedSwap = (event) => {
    if (event.target.value === "") {
      setSearchedReelforUser(swapsForUser)
    } else {
      let temp = []
      swapsForUser.map(u => {
        const content = u.content.toLowerCase()
      
        const searchedvalue = event.target.value.toLowerCase()
        if (content.includes(searchedvalue) ) {
          temp.push(u)
        }
      })
      setSearchedReelforUser(temp)
      console.log(temp)
    }
  }



  const handleSearchedSwapFriend = (event) => {
    if (event.target.value === "") {
      setSearchedReelforUser(swapsForUserFriends)
    } else {
      let temp = []
      swapsForUserFriends.map(u => {
        const content = u.content.toLowerCase()
      
        const searchedvalue = event.target.value.toLowerCase()
        if (content.includes(searchedvalue) ) {
          setSearchedReel(temp)

          temp.push(u)
        }
      })
      setSearchedReel(temp)
      console.log(temp)
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



const AllReelscomponentFunction = () => {
    return (
      <div className="loadMore">
         <div class="friends-search-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input className="friend-search" type="text" placeholder="Search Reels" name="s" onChange={handleSearchedSwapFriend} style={{ width: "100%" }} />
            </div>
        {searchedReel && searchedReel.length > 0
          ? (
                        <ul class="slidesreel">
                          {searchedReel.map((reel, index) => (
                            <Popup
                              style={{ padding: "0px" }}
                              trigger={
                                <li
                                  className="slideitemreelcom"
                                  key={reel.id}
                                  id={index}
                                >
                                  <ReelsComponentFriends
                                    reel={reel}
                                    setRefresh={setRefresh}
                                  />
                                </li>
                              }
                              modal
                             >
                              {(close) => ( 
                                <Form  >
                                    <div style={{ width: "5%" }}>
                                      <a href="#!" onClick={close}>
                                        <i
                                          style={{
                                            color: "#fff",
                                            padding: "10px",
                                            fontSize: "30px",
                                          }}
                                          class="las la-times"
                                        ></i>
                                      </a>
                                  </div>
                                <DisplayFriendsReelsComponent key={reel.id} id={index} 
                                  reel={ reel}
                                  setRefresh={setRefresh}
                                  index={index}
                                />
                              </Form> 
                              )}
                            </Popup>
                          ))}
                        </ul>

          )
          : <div class="center" style={{padding: "20px"}}>No Reels to show</div>
        }

      </div>
    )
  }


  const MyReelsComponentFunction = () => {
    return (
      <div className="loadMore">
         <div class="friends-search-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input className="friend-search" type="text" placeholder="Search Swap" name="s" onChange={handleSearchedSwap} style={{ width: "100%" }} />
            </div>
        {searchedReelforUser && searchedReelforUser.length > 0
          ? (
            <ul class="slidesreel">
                          {searchedReelforUser.map((reel, index) => (
                            <Popup
                              style={{ padding: "0px" }}
                              trigger={
                                <li
                                  className="slideitemreelcom"
                                  key={reel.id}
                                  id={index}
                                >
                                  <ReelsComponentFriends
                                    reel={reel}
                                    setRefresh={setRefresh}
                                  />
                                </li>
                              }
                              modal
                             >
                              {(close) => ( 
                                <Form  >
                                    <div style={{ width: "5%" }}>
                                      <a href="#!" onClick={close}>
                                        <i
                                          style={{
                                            color: "#fff",
                                            padding: "10px",
                                            fontSize: "30px",
                                          }}
                                          class="las la-times"
                                        ></i>
                                      </a>
                                  </div>
                                <DisplayFriendsReelsComponent key={reel.id} id={index} 
                                  reel={ reel}
                                  setRefresh={setRefresh}
                                  index={index}
                                />
                              </Form> 
                              )}
                            </Popup>
                          ))}
                        </ul>

          )
          : <div class="center" style={{padding: "20px"}}>No Reels to show</div>
        }

      </div>
    )
  }
  
	const handleShowComp = () => {
		if (showComp === "AllReels") {
			return AllReelscomponentFunction()
		} else if (showComp === "MyReels") {
			return MyReelsComponentFunction()
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
              <p className="Friends-Title">Reels</p>
              <i style={{ float: "right", fontSize: 20 }} class="fas fa-ellipsis-v"></i>
            </div>
            <div class="navContent">

              <ul class="nav nav-pills swap-page-nav" role="tablist">
                <li class="nav-item" style={{ justifyContent: 'flex-start' }}>
                  <div className="all" onClick={() => setShowComp("AllReels")}>
                    <span style={{ cursor: 'pointer' }}>
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                        <i class="fas fa-retweet" style={{ fontSize: '20px' }}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      All Reels
                    </span>
                  </div>
                </li>
                <li class="nav-item" style={{ justifyContent: 'center' }}>
                  <div className="my" onClick={() => setShowComp("MyReels")}>
                    <span style={{ cursor: 'pointer' }}>
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                        <i class="ti-control-shuffle" style={{ fontSize: '20px' }}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      My Reels
                    </span>
                  </div>
                </li>
                <li class="nav-item" style={{ justifyContent: 'flex-end' }}>
                 
                   

                    {addReel()}
                </li>
                {/* <li class="nav-item">
                  <span style={{ cursor: 'pointer' }}>
                    <span style={{ marginRight: '5px', padding: '5px' }}>
                      <i class="fas fa-bell" style={{fontSize:'25px'}}></i>
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
export default ReelFeedComponent;