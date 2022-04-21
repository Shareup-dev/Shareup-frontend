import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import AuthService from "../../services/auth.services";
import FriendsService from "../../services/FriendService";
import ShareupInsideHeaderComponent from "../dashboard/ShareupInsideHeaderComponent";
import PostService from "../../services/PostService";
import settings from "../../services/Settings";
import fileStorage from "../../config/fileStorage";
import Popup from "reactjs-popup";
import LocSearchComponent from "../AccountSettings/LocSearchComponent";
import moment from "moment";
import SwapService from "../../services/SwapService";

function EditPostComponent({ post, set }) {
  let history = useHistory();
  const { user } = useContext(UserContext);

  const [editContent, setEditContent] = useState([]);
  const [editImage, setEditImage] = useState([]);
  const [showSwapImage, setShowSwapImage] = useState(true);
  const [swapfiles, setSwapfiles] = useState({});
  const [swapImage, setSwapImage] = useState(`${fileStorage.baseUrl}${post.media[0].media}`);
  const [userF, setUserF] = useState(null);
  const [searchedUser, setSearchedUser] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  const handleRemoveImageSwap = () => {
    setSwapfiles({});
    setShowSwapImage(false);
  };

  useEffect(() => {}, []);

  const handleFileSwap = (event) => {
    setSwapfiles(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setSwapImage(reader.result);
      }
    };

    console.log(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
    setShowSwapImage(true);
    };

    // const handleFileSwap = (event) => {
    //     setSwapfiles(event.target.files);
    //     console.log(swapfiles);
    //     let filesAmount = event.target.files.length;
    //     if (filesAmount < 6) {
    //       let tempImage = [];
    //       for (let i = 0; i < filesAmount; i++) {
    //         //tempImage=[...tempImage,URL.createObjectURL(event.target.files[i])]
    //         tempImage.push(URL.createObjectURL(event.target.files[i]));
    //       }
    
    //       setSwapImage(tempImage);
    //       setShowSwapImage(true);
    //     } else {
    //       alert('5 files are allowed');
    //       event.preventDefault();
    //     }
    //   };

  const handleTag = (userM) => {
    setUserF(userM);
    console.log(userM);
  };

  const getAllUser = async () => {
    await UserService.getUsers().then((res) => {
      setAllUser(res.data);
      setSearchedUser(res.data);
    });
  };
  useEffect(() => {
    getAllUser();
    getFriendsList();
  }, []);
  const getFriendsList = async () => {
    await FriendsService.getFriends(AuthService.getCurrentUser().username).then(
      (res) => {
        setFriendsList(res.data);
      }
    );
  };
  const handleSearchedUser = (event) => {
    if (event.target.value === "") {
      setSearchedUser(allUser);
    } else {
      let temp = [];
      allUser.map((u) => {
        const email = u.email.toLowerCase();
        const searchedvalue = event.target.value.toLowerCase();
        if (email.includes(searchedvalue)) {
          temp.push(u);
        }
      });
      setSearchedUser(temp);
      console.log(temp);
    }
  };

  const handleCancelEdit = (event) => {
    event.preventDefault();
    set("cancel");
  };

  const handleEditContent = (event) => {
    console.log(event.target.value);
    setEditContent(event.target.value);
  };

  const handleUpdatePost = async (event) => {
    event.preventDefault();
    console.log(editContent + " HE " + post.content);
    if (editContent.length <= 0 || editContent === "" || editContent === null) {
      console.log("please make sure you made changes");
      return;
    }
    if (post.content === editContent) {
      console.log("please make sure you made changes");
      return;
    }

    const formData = new FormData();
    formData.append('content', editContent);
    // formData.append(`files`, swapfiles);
    // const content = { content: editContent };
    console.log("uploading "+ post.allPostsType)
    if (post.allPostsType === "swap"){
        console.log("uploading swap")
    await SwapService.updateSwap(post.id, formData).then((res) => {
      set(`${res.data} saved`);
      setEditContent("");
      handleRemoveImageSwap();
      window.location.reload(false);
    })
}else{
    console.log("uploading post")
    await PostService.updatePost(post.id, formData).then((res) => {
        set(`${res.data} saved`);
        setEditContent("");
        handleRemoveImageSwap();
        window.location.reload(false);
      })
}
  };

  return ( 
    <div className="friend-info">
                <div
              style={{
                margin: "center",
                padding: "2px",
                borderRadius: "5px",
              }}
            >
              <div className="font-weight-bold border-bottom" style={{ padding:"15px" ,textAlign:"center" }}>Edit Post
              <button onClick={handleCancelEdit} className="buttonClosePrvw rtbtn" 
              style={{ display: "flex", margin: "-32px -10px",fontSize:"12px" }}>
              
              <i class="las la-times"></i></button>
              </div>
              
              <span class="border-bottom"></span>
              </div>
              <div style={{ display: "flex", marginTop: "10px" }}>
                  <figure>
                    <img
                      src={fileStorage.baseUrl + post.userdata.profilePicture}
                      alt=""
                      className="post-user-img"
                    />
                  </figure>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      paddingLeft: "10px",
                    }}
                  >
                    <a
                      href={`/profile/${post.userdata.email}`}
                      title="#"
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                    >
                      {`${post.userdata.firstName} ${post.userdata.lastName}`}

                      {post.allPostsType === "share" ? (
                        <span
                          style={{
                            paddingLeft: "10px",
                            textTransform: "lowercase",
                            fontWeight: "100",
                            fontSize: "14px",
                          }}
                        >
                          shared a post{" "}
                        </span>
                      ) : null}
                      {post.userTag ? (
                        <>
                          <span style={{ padding: "0 5px" }}>with</span>{" "}
                          <span className="tagPost">
                            {post.userTag.firstName}
                          </span>
                          <span className="tagPost">
                            {post.userTag.lastName}
                          </span>
                        </>
                      ) : null}
                    </a>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        paddingTop: "5px",
                      }}
                    >
                      on{" "}
                      {moment(
                        post.published,
                        "DD MMMM YYYY hh:mm:ss"
                      ).fromNow()}
                      {/* {checkIfSaved(post) && <i class='las la-bookmark szbkmrk'></i>} */}
                    </span>
                  </div>
                  </div>

                  
        <textarea
          class="md-textarea form-control" 
          rows={4}
          placeholder="write something"
          name="post_content"
          defaultValue={post.content}
          onChange={handleEditContent}
        />

      <figure>
        {/* <img src={`${fileStorage.baseUrl}${post.media[0].media}`
                        }alt={`${fileStorage.baseUrl}${post.media.media}`
                        }/> */}
                        {showSwapImage ?
                  <>
                  <div style={{padding: "5px"}}>
                    <img id="preview" src={swapImage} />
                    <button style={{  margin: "20px -10px", fontSize:"5px" }} onClick={handleRemoveImageSwap} className="buttonClosePrvw rtbtn "><i class="las la-times "></i></button>
                    </div>
                  </>
                  :
                  null
                }
            <div
              style={{
                margin: "5px 5px",
                padding: "15px",
                boxShadow: "0 0 3px rgb(0 0 0 / 16%)",
                borderRadius: "5px",
              }}
            >
              <div style={{ display: "inline" }}>      <div className="friend-name" 
                >
        <span>published: {`${post.published}`}</span>
      </div></div>

              <div className="add-smilespopup">
                <label className="fileContainer">
                  <input
                    type="file"
                    name="swap_image"
                    accept="image/*"
                    onChange={handleFileSwap}
                  ></input>
                  <i class="lar la-file-image"></i>
                </label>
              </div>
              <div
                className="gifpopup"
                style={{ fontSize: "28px", paddingBottom: "14px" }}
              >
                <Popup
                  trigger={
                    <a href="#!">
                      <i class="las la-user-tag"></i>
                    </a>
                  }
                  modal
                  nested
                >
                  {(close) => (
                    <Form style={{ margin: "5px" }} className="popwidth">
                      <div class="search-container">
                        <i class="las la-search"></i>
                        <input
                          className="friend-search"
                          type="text"
                          id="header-search"
                          placeholder="Search Friends"
                          name="s"
                          onChange={handleSearchedUser}
                        />
                        <span onClick={close}>Done</span>
                      </div>
                      {userF ? (
                        <>
                          <div className="Tag" >
                            Tagged:{`${userF.firstName} ${userF.lastName}`}
                          </div>
                        </>
                      ) : null}
                      <div>
                        <ul>
                          {friendsList.length > 0 ? (
                            <>
                              {friendsList.map((userM) =>
                                user.id !== userM.id ? (
                                  <li key={userM.id} className="friends-card">
                                    <a
                                      href="#!"
                                      onClick={() => handleTag(userM)}
                                    >
                                      {" "}
                                      <div className="grid-container">
                                        {/* <figure> */}
                                        <div class="item1">
                                          <a
                                            href={`/profile/${userM.email}`}
                                            title={`${userM.email}`}
                                          >
                                            <img
                                              style={{ objectFit: "cover" }}
                                              src={userM.profilePicture}
                                              alt=""
                                            />
                                          </a>
                                          {/* </figure> */}
                                        </div>
                                        <div class="item2">
                                          <p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                                        </div>
                                        {/* <div className="  "> */}
                                      </div>
                                    </a>
                                  </li>
                                ) : null
                              )}
                            </>
                          ) : (
                            <div
                              style={{ padding: "10% 0", textAlign: "center" }}
                            >
                              You have no friends to tag
                            </div>
                          )}
                        </ul>
                      </div>
                    </Form>
                  )}
                </Popup>
              </div>
              <div className="campopup">
                <Popup
                  trigger={
                    <a href="#!">
                      <i class="las la-map-marker-alt"></i>
                    </a>
                  }
                  nested
                  modal
                >
                  {(close) => (
                    <Form style={{ margin: "5px" }} className="popwidth">
                      <LocSearchComponent />
                    </Form>
                  )}
                </Popup>{" "}
              </div>

              {/* <ul style={{marginLeft:'10px'}}>
      <li style={{fontSize:'12px'}}>What's in hang?</li>
      <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
       </label></li></ul>*/}
            </div>
      </figure>

      <div className="post-meta">
        {post.postImagePath ? (
          <img
            style={{ maxWidth: "100%", height: "auto" }}
            src={fileStorage.baseUrl + post.imagePath}
          />
        ) : null}

        <div className="we-video-info">
          <div className="row">
            <div className="col">
              <button className="popsbmt-btn" onClick={handleUpdatePost}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditPostComponent;
