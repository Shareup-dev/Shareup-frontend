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


import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import Layout from '../LayoutComponent';
import { MiddlewareArray } from '@reduxjs/toolkit';

export default function SwapComponent() {
  const [isLoading, setIsLoading] = useState(true);
  let history = useHistory();

    const { user } = useContext(UserContext)
    const [showHang, setShowHang] = useState("hangGifts");
    const [refresh, setRefresh] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [showComp, setShowComp] = useState("members");
    const [Privacy, setPrivacy] = useState("");
    const [count, setCount] = useState(1);
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
  // const [Privacy, setPrivacy] = useState("");
    const handlePrivacy=(event)=>{
      console.log(event.target.value)
        setPrivacy(event.target.value)
    }
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
    const uploadPost = (event) => {
      event.preventDefault();
      setUploadError("")
      console.log("uploading post working")
      if (postContent === "" && (Object.keys(files).length === 0 && files.constructor === Object)) {
        console.log("cant be null")
        setUploadError("Please Insert A Text or an Image")
        return
      }
    }
    const getSavedPost = async () => {
      await PostService.getSavedPostForUser(AuthService.getCurrentUser().username).then(res => {
        setSavedPost(res.data)
      })
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
    useEffect(() => {
      const parsedCount = Number(localStorage.getItem("count") || 0)
      setCount(parsedCount)
    }, [])
    
    useEffect(() => {
      localStorage.setItem("count", count)
    }, [count])
    const handleshowH = () => {
      if (showHang === "hangGifts") {
        return (
          <div className="loadMore">
              <div style={{textAlign: 'center',padding:'11px 0'}}><img style={{verticalAlign:'middle'}} src="/assets/images/swapicon.png" alt="img" /></div>
                                    <div style={{textAlign: 'center',margin:'0 11px 11px 11px',fontSize:'12px'
                                }}>To Swap, provide clear image of object to swap</div>
                                
                                  <div style={{textAlign: 'center',width:'100%',marginTop:'50px'}}><label className="fileContainer" style={{width:'100%'}}><button style={{float: 'right', borderRadius:'5px',padding:'15px',width:'100%',background:'#C4C4C4',fontWeight:'bold',fontSize:'14px',color:'rgb(68 68 68)',cursor:"pointer"}} type="submit">Let's take picture</button> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                                  </label> </div>
          {/* <div className="brands"><div className="row"> */}
 {/* <div className="swaap"><i className="las la-sync-alt" aria-hidden="true"></i> </div> */}
 {/* <div className="branddesrptn" >
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px',fontWeight:'bold'}}>Best Buy</div> 
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px'}}>All popular items</div> 
   <div style={{padding:'5px 0 0 5px',fontSize:'12px'}}>100+items</div> 
   </div> */}
 <div className="arrow">  
 
     
     {/* <a style={{ color:'#000000',padding:'5px',fontSize:'18px'}} href="#"  ><i class="las la-angle-down"></i></a> */}
     
  </div>
</div>
 
         
        )
      }
      if (showHang === "hangMeals") {
        return (
          <div className="loadMore">
          <div className="brands"><div className="row">
 <div className="brandlogo"><img src="assets/images/Talabatlogo.png"/> </div>
 <div className="branddesrptn">
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px',fontWeight:'bold'}}>Best Buy</div> 
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px'}}>All popular items</div> 
   <div style={{padding:'5px 0 0 5px',fontSize:'12px'}}>100+items</div> 
   </div>
   <div className="arrow">  
 
     
     {/* <a style={{ color:'#000000',padding:'5px',fontSize:'18px'}} href="#"  ><i class="las la-angle-down"></i></a> */}
     
   </div>
</div></div>
 
         </div>
        )
      }
      if (showHang === "hangOutfits") {
        return (
          <div className="loadMore">
          <div className="brands"><div className="row">
 <div className="brandlogo"><img  src="assets/images/bestbuy.jpg"/> </div>
 <div className="branddesrptn" >
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px',fontWeight:'bold'}}>Best Buy</div> 
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px'}}>All popular items</div> 
   <div style={{padding:'5px 0 0 5px',fontSize:'12px'}}>100+items</div> 
   </div>
   <div className="arrow">  
 
     <a style={{ color:'#000000',padding:'5px',fontSize:'18px'}} href="#"  ><i class="las la-angle-down"></i></a>
     
   </div>
</div></div>
 
         </div>
        )
      }
    
      else {
        return (null)
      }
    }
//     const handleshowH = () => {
//       if (showHang === "hangGifts") {
//         return (
//           <div className="loadMore">
//            <div className="brands"><div className="row">
//   <div style={{display:'inline',width:'20%'}}><img style={{objectFit:'fill',width:'100%',height:'100px',borderRadius:'11px',verticalAlign: 'middle',padding:'5px'}} src="assets/images/bestbuy.jpg"/> </div>
//   <div style={{display:'inline',width:'60%',padding:'10px',textAlign:'left'}}>
//     <div style={{padding:'0px 0 5px 5px',fontSize:'14px',fontWeight:'bold'}}>Best Buy</div> 
//     <div style={{padding:'0px 0 5px 5px',fontSize:'14px'}}>All popular items</div> 
//     <div style={{padding:'5px 0 0 5px',fontSize:'12px'}}>100+items</div> 
//     </div>
//   <div style={{display:'inline',width:'20%',float:'right'}}>  
//   <div style={{float:'right',marginTop:'30px',padding:'5px 10px',borderRadius:'5px'}}>
      
//       <a style={{ color:'#000000',padding:'5px',fontSize:'18px'}} href="#"  ><i class="las la-angle-down"></i></a>
      
//     </div></div>
// </div></div>
  
//           </div>
//         )
//       } 
//       if (show === "friends") {
//         return (
//           <FriendProfileComponent />
//         )
//       }
      
//       else {
//         return (
//           <div className="loadMore">
//             <div>Meals</div>
  
//           </div>
//         )
//       }
//     }
    


    return (
      <>
    <Layout user={user}>
      <div className="col-lg-6">
     <div className="central-meta hanggift"> 
     <h1 style={{textAlign:'center',padding:'10px', fontSize:'18px',fontWeight:'bold'}}>Let's Swap</h1>
     <div className="containerHang"> <div className="row rowalin">
     <h1 style={{textAlign:'center',padding:'10px', fontSize:'18px',fontWeight:'lighter'}}>To Swap You will have to Provide clear image of the object you want to swap</h1>
   {/* <div className="col-lg-3 flow"> <a className={(showHang === "hangGifts" ? "active" : "")} style={{}} title="" data-ripple="" onClick={() => setShowHang("hangGifts")} ><i class="las la-gift"style={{fontSize:'32px'}}></i><div >Hang Gifts</div></a></div>
   <div className="col-lg-3 flow"> <a className={(showHang === "hangMeals" ? "active" : "")} style={{}} title="" data-ripple="" onClick={() => setShowHang("hangMeals")} ><i class="las la-utensils" style={{fontSize:'32px'}}></i><div >Hang Meals</div></a></div>
   <div className="col-lg-3 flow"> <a className={(showHang === "hangOutfits" ? "active" : "")} style={{}} title="" data-ripple="" onClick={() => setShowHang("hangOutfits")} ><i class="las la-gift"style={{fontSize:'32px'}}></i><div >Hang Outfits</div></a></div> */}
   </div></div>
  <div style={{borderBottom:'1px solid #e2e2e2',marginTop:'20px'}}></div>
  <div className="contentArea">
    {
      handleshowH()
    }
</div>
   
   </div>
          </div>
          
          {/* <button style={{float: 'right', borderRadius:'20px'}} type="submit" onClick={uploadPost}>Post</button> */}
          
      </Layout>
      </>     
    )
}