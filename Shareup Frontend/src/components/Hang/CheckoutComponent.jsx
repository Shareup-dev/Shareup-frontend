import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
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


function CheckoutComponent({ data }) {


  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  const { user } = useContext(UserContext)

  // const []

  // const inputRef = createRef();

  const [refresh, setRefresh] = useState(null)

  const [showComp, setShowComp] = useState("newsfeed");
  const [showLoc, setShowLoc] = useState("No");
  const [posts, setPosts] = useState([]);
  const [postsForUser, setPostsForUser] = useState([]);
  const [savedPost, setSavedPost] = useState([]);
  const [userR, setUserR] = useState([]);
  const refMap = useRef(null);
  const [count, setCount] = useState(1);
  const [amount, setAmount] = useState(50);


  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [files, setFiles] = useState({});
  const [postImage, setPostImage] = useState({});
  const [showPostImage, setShowPostImage] = useState(false);

  const [uploadError, setUploadError] = useState("");
  const [Privacy, setPrivacy] = useState("");



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
  const handlePrivacy = (event) => {
    console.log(event.target.value)
    setPrivacy(event.target.value)
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
    return (<PostComponent post={post} setRefresh={setRefresh} />)
  }
  const showMap = () => {
    if (showLoc === "yes") {
      return (
        <div style={{ height: '100vh', width: '100%' }}>
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

  const handleCountAndTotal = (opertator) => {
    if(opertator === "+"){
      let counting = count + 1
      setCount(counting)
      setAmount(counting*50)
    }
    if(opertator === "-"){
      let counting = count - 1
      setCount(counting)
      setAmount(counting*50)
    }
  }


  return (
    <Layout user={user}>

      <div className="col-lg-6 checkout">
        <div className="central-meta  pdngPay">

          <div className="new-postbox ">


            <Form>
              <h1 style={{ fontWeight: 'bold', padding: '0 0 30px 0', textAlign: 'center' }}>Checkout</h1>
              <h2 style={{ fontWeight: '600' }}>Billing Information</h2>
              <div className="billInpt"><span style={{ padding: '0 30% 0 0' }}>Total</span><span style={{ padding: '0 20% 0 0' }}>:</span> {amount}QR</div>

              <div className="prdct"><div className="row">
                <div style={{ display: 'inline', width: '33%' }}><img style={{ objectFit: 'cover', width: '100%', borderRadius: '11px', verticalAlign: 'middle', padding: '5px' }} src="assets/images/virtual-baby-showers-722x406.jpg" /> </div>
                <div style={{ display: 'inline', width: '33%', padding: '10px', textAlign: 'left' }}>
                  <div style={{ padding: '0px 0 5px 5px', fontSize: '12px' }}>Flowers</div>
                  <div> <span style={{ display: 'block', fontSize: '12px' }}><div className="dropdown">
                    <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                      <option value="Friends">Friends</option>
                      <option value="Public">Public</option>
                      <option value="Only Me">Only Me</option>
                    </select></div> </span></div>
                  <div style={{ padding: '5px 0 0 5px', fontSize: '12px' }}>QR {amount}</div>
                </div>
                <div style={{ display: 'inline', width: '33%', float: 'right', padding: '0 5px' }}>
                  <div style={{ float: 'right', marginTop: '5%' }}><a href="/HangGift"><i class="las la-times"></i></a></div>
                  <div style={{ float: 'right', marginTop: '25%', padding: '5px 10px', background: 'rgb(3, 51, 71)', color: '#fff', borderRadius: '5px' }}>
                  <a style={{ color: '#fff', padding: '5px', fontSize: '12px' }} href="#" onClick={() => handleCountAndTotal("-")}>-</a>
                    <span style={{ color: '#fff', padding: '5px', fontSize: '12px' }}>{count}</span>
                    <a style={{ color: '#fff', padding: '5px', fontSize: '12px' }} href="#" onClick={() => handleCountAndTotal("+")}>+</a>
                  </div></div>
              </div></div>
              <h1 style={{ fontWeight: '600' }}>Payment Method</h1>{data}
              <div style={{ padding: '20px' }}>
                <p style={{ fontSize: '14px' }}>Name on card</p>
                <div className='row'>
                  <input className="pay1" placeholder="Enter name on card" type="text" /></div>
                <p style={{ fontSize: '14px' }}>Card Number</p>
                <div className='row'>
                  <input className="pay1 see" id="search" name="search" placeholder="Enter card number" type="text" /></div>
                <div className='row'>
                  <div className='col pg'>
                    <p style={{ fontSize: '14px' }}>Expiry Date</p>
                    <input className="pay" placeholder="M/Y " type="text" />
                  </div>
                  <div className='col pg'>
                    <p style={{ fontSize: '14px' }}>CVV</p>
                    <input className="pay" placeholder="*** " type="text" />
                  </div></div>
                <div className='row mrgintp'>
                  <div className='col'><a href="#" style={{ background: 'rgb(234, 234, 234)', color: '#6b6b6b' }} className="butnpay">Cancel</a></div>
                  <div className='col'><a href="/PaymentConfirmation" style={{ background: 'rgb(3, 51, 71)', color: '#fff' }} className="butnpay">Pay</a></div>
                </div>
              </div>


            </Form>

          </div>
        </div>
      </div>
    </Layout>

  );
}
export default CheckoutComponent;