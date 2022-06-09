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
    testScript()
  }, [])



  useEffect(() => {
    getReelsForUser().then(() => {
      setIsLoading(false)
    })
    if(user&&user.id){
        getAllReels().then(() => {
        setIsLoading(false)
      })
      getSavedPost().then(() => {
        setIsLoading(false)
      })
      testScript()
    }
  }, [user])
  
  useEffect(() => {
    testScript()
  }, [reels])

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
    canvas.width = video.videoWidth / 10;
    canvas.height = video.videoHeight / 10;
    canvas.getContext('2d').drawImage(video, 10, 10);



    const formData = new FormData();
    var content = "";
    formData.append('content', reelContent);
    formData.append(`reelfiles`, filesReel);
    formData.append(`thumbnail`, filesReel);
    ReelsServices.createReels(user.id, formData).then((res) => {
      handleRemoveReelVideo();
      setReels(res.data);
      setReelContent("");
      setRefresh(res.data);
      console.log("Reels Uploaded");

    });


  };
  const likeReel = async(reelId,reaction)=>{
    
    await ReelsServices.likeReel(user.id,reelId,reaction).then((res) => {
      console.log(res)
      getReelsForUser()
      getAllReels()

    })
  }
  

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
    reader.readAsDataURL(event.target.files[0]);
    setShowReelVideo(true);


  };
  




  


  const getSavedPost = async () => {
    await PostService.getSavedPostForUser(AuthService.getCurrentUser().username).then(res => {
      setSavedPost(res.data)
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
    reader.readAsDataURL(event.target.files[0])
    setShowPostImage(true)
  }


  const handleRemoveImage = () => {
    setFiles({})
    setShowPostImage(false)
  }

  const handleEditingSave = (value) => {
    setEditPostId(value)

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
  
  //Adding new swap
  const addReel = () => {
    return (

      <Popup trigger={<div className='my'>
          <span style={{ cursor: 'pointer' }}>
                      <span style={{ marginRight: '0px', padding: '5px' }}>
                      <i class="fa fa-plus" style={{fontSize: '15px'}}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      Add Reels
                    </span>
         </div>} modal>
      {(close) => (
        <Form className='popwidth'>

          <div className="headpop">
            <span>
              <a
                href="#!"
                onClick={close}
              >
                <i className="las la-times"></i>
              </a>
            </span>
            <span
              className="poptitle"
            >
              Lets Add Reels
            </span>

            {/* { checkIfUserAlreadyPostStory(storyauth.user) ?  */}
            <span style={{ float: "right" }}>
              {" "}
              <button
                style={{
                  float: "right",
                  borderRadius: "20px",
                  padding: "5px 20px",
                }}
                type="submit"
                onClick={uploadReels}
              >
                Upload
              </button>
            </span>
        </div>


          <div style={{ margin: '0 11px 10px 11px' }}>
            <span className='textPop'>
              {ShowReelVideo ? (
                <>
                  <video id='video' src={ReelVideo} width="100%" height={"350px"} controls="controls">
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
                    <i className='las la-times'></i>
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
        <button  class="popsbmt-btn" type="submit"
            onClick={uploadReels}>SHARE REEL</button>
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
const reelPopup =(reel,index)=>{
  return(
      <Popup
      style={{ padding: "0px" }}
      trigger={
        <li
          className="slideitemreelcom center"
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
      className='reel-popup'
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
                  className="las la-times"
                ></i>
              </a>
          </div>
          <DisplayFriendsReelsComponent key={reel.id} id={index} 
            reel={ reel}
            likeReel={likeReel}
            setRefresh={setRefresh}
            index={index}
          />
        </Form> 
        )}
      </Popup>            
    )
  }


  const AllReelscomponentFunction = () => {
    return (
      <div className="loadMore">
         <div className="friends-search-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <input className="friend-search" type="text" placeholder="Search Reels" name="s" onChange={handleSearchedSwapFriend} style={{ width: "100%" }} />
          </div>
          {searchedReel && searchedReel.length > 0
          ? (
            <ul className="slidesreel center">
            {searchedReel.map((reel, index) => 
                reelPopup(reel,index)
              )}
              </ul>
          )
          : <div className="center" style={{padding: "20px"}}>No Reels to show</div>
        }

      </div>
    )
  }


  const MyReelsComponentFunction = () => {
    return (
      <div className="loadMore">
         <div className="friends-search-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input className="friend-search" type="text" placeholder="Search Reel" name="s" onChange={handleSearchedSwap} style={{ width: "100%" }} />
            </div>
        {searchedReelforUser && searchedReelforUser.length > 0
          ? (
            <ul className="slidesreel">
              {searchedReelforUser.map((reel, index) => (
                reelPopup(reel,index)

              ))}
            </ul>

          )
          : <div className="center" style={{padding: "20px"}}>No Reels to show</div>
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
              <p className="Friends-Title common-title">Reels</p>
              <i style={{ float: "right", fontSize: 20 }} className="fas fa-ellipsis-v"></i>
            </div>
            <div className="navContent">

              <ul className="nav nav-pills swap-page-nav" role="tablist">
                <li className="nav-item" style={{ justifyContent: 'flex-start' }}>
                  <div className="all" onClick={() => setShowComp("AllReels")}>
                    <span style={{ cursor: 'pointer' }}>
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                      <i class="fa fa-film" style={{fontSize:'20px'}}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      All Reels
                    </span>
                  </div>
                </li>
                <li className="nav-item" style={{ justifyContent: 'center' }}>
                  <div className="my" onClick={() => setShowComp("MyReels")}>
                    <span style={{ cursor: 'pointer' }}>
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                        <i className="fa fa-video-camera" style={{ fontSize: '18px' }}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      My Reels
                    </span>
                  </div>
                </li>
                <li className="nav-item" style={{ justifyContent: 'flex-end' }}>
                 
                   

                    {addReel()}
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
export default ReelFeedComponent;