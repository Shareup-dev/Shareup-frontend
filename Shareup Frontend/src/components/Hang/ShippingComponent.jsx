import React, { useState, useEffect, useContext,  useCallback, useRef} from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import AuthService from '../../services/auth.services';
import SimpleReactLightbox from 'simple-react-lightbox'
import { testScript } from '../../js/script';
import GoogleMapReact from 'google-map-react';


import EditPostComponent from '../post/EditPostComponent'

import Layout from '../LayoutComponent';

import PostComponent from '../post/PostComponent';
import Popup from 'reactjs-popup';
import PhoneInput from 'react-phone-number-input'


function ShippingComponent(props)  {
  

  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  const { user } = useContext(UserContext)

  // const []

  // const inputRef = createRef();

  const [refresh, setRefresh] = useState(null)

  const [showComp, setShowComp] = useState("newsfeed");
  const [showLoc, setShowLoc] = useState("yes");
  const [posts, setPosts] = useState([]);
  const [postsForUser, setPostsForUser] = useState([]);
  const [savedPost, setSavedPost] = useState([]);
  const [userR, setUserR] = useState([]);
  const refMap = useRef(null);



  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [files, setFiles] = useState({});
  const [postImage, setPostImage] = useState({});
  const [showPostImage, setShowPostImage] = useState(false);

  const [uploadError, setUploadError] = useState("");



  const [editPostId, setEditPostId] = useState(null)

  const [img, setImage] = useState("");
  const [value, setValue] = useState();
  
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };

  
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
  const AnyReactComponent = ({ text }) => <div>{text}</div>;

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

  const testFanc = (post) => {
    return ( <PostComponent post={post} setRefresh={setRefresh}/>)
  }
  const showMap = () => {
    if (showLoc === "yes"){
    return (
      <div style={{ height: '50vh', width: '100%' }}>
<GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCUqRf-EB8vo-P_BYx0dRES5A3h78u1Xzc" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={59.955413}
          lng={30.337844}
          text="My Marker"
        />
      </GoogleMapReact>
</div>
    )
  }
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

//   useEffect(()=>{
//     refMap.current.map.panTo(props.location)
// },[props.location])

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
  useEffect(() =>{
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
  }
  )
  if (isLoading) {
    return <div>Loading... Please Wait</div>
  }

  // const handleBoundsChanged = () => {
  //   if (refMap.current) {
  //       const mapCenter = {
  //           lat: refMap.current.map.center.lat(),
  //           lng: refMap.current.map.center.lng()
  //       }
  //       setListing({...listing, latLng: mapCenter})
  //   }
  // };
  

  return (
    <Layout user={user}>
    <div className="col-lg-6">
            <div className="central-meta newsfeed metaSip">
              
                 <div className="new-postbox shipping">
                <h1>Location</h1>
                <div className="newpst-input">
                  <Form>
<p>Please provide your location</p>
<p style={{fontSize:'12px'}}>So that we can deliver this item to your doorstep</p>



<p>Share your location via google maps</p>
{/* <a href="#" className="openmap" onClick={() => setShowLoc("yes")}>Open map</a> */}
{
              showMap()
            }

    
<div className="phno">
<PhoneInput
      placeholder="Enter phone number"
      value={value}
      onChange={setValue}/></div>
      <div style={{textAlign:'center'}}>
      
 <Popup  trigger={<a href="#" className="buttonShip">Let's Care it</a>} modal>
                       {close => ( 
               <div>  
   <div><a href="#!" style={{padding:'10px 80px 10px 0'}} onClick={close}><i class="las la-times"></i></a></div>
    <div style={{ color:'#000000',textAlign:'center',fontSize:'14px',fontWeight:'bold',marginTop:'30px'}}><div style={{fontSize:'42px',fontWeight:'bold'}}><i class="las la-shipping-fast"></i></div>Your have successfully done
    <p style={{ color:'#9AAAAE',padding:'20px 0 30px 0'}}>Your item is successfully booked</p>
    
    
    <div style={{padding:'0 40% 10% 40%'}}><a href="/newsfeed" className="buttonCnfirmShip">Ok,Thanks</a></div></div>
    
    

   
 </div>  
                  )}                 
  </Popup> 
    

      </div>

                    {/* <textarea rows={2} placeholder={uploadError ? `${uploadError}` : "We share,do you?"} name="post_content" value={postContent} onChange={handlePostContent} />
                    {showPostImage ?
                      <>
                        <img id="preview" src={postImage} style={{ width: "80%", border: "3px solid" }} />
                        <button onClick={handleRemoveImage}>x</button>
                      </>
                      :
                      null
                    }

                    <div className="attachments">
                      <ul>
                      
                        <li><Popup trigger={<span>Hang Share</span>} position="right center">
    <div className="headpop">
    <div style={{padding:'10px'}}><span><a href="#!" style={{padding:'10px'}} ><i class="las la-times"></i></a></span>
    <span style={{ color:'#000000',fontSize:'14px'}}>Today to me, Tomorrow to you</span>
    <span style={{float:'right'}}><a className="popup-btn" href="#!" >Keep Hang</a></span>
    </div></div>
    <div className="popupimg"> 
    <img src={user ? user.profilePicturePath : userR.profilePicturePath} alt="" /><span>{`${user.firstName} ${user.lastName}`}</span>
                            </div>
  </Popup> </li>

                        <li><label className="fileContainer"><img src="/assets/images/share-2.png" alt="img" /><span>Share Up</span> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                        </label></li>
                        <li><label className="fileContainer"><i class="las la-sync"></i><span>Swap</span> <input type="file" name="post_video" />
                        </label></li>
                        {/* <li><i class="las la-camera"></i> <label className="fileContainer"> <input type="file" />
                        </label></li> 
                        
                          
                       
                      </ul>
                      
                    </div>
                    <button style={{float: 'right',borderRadius:'20px'}} type="submit" onClick={uploadPost}>Post</button> */}
                  </Form>
                </div>
              </div>
            </div>
            </div>
            </Layout>
           
  );
}
export default ShippingComponent;