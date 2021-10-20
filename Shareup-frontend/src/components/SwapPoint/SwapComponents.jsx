import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import SwapService from '../../services/SwapService';
import AuthService from '../../services/auth.services';
import { testScript } from '../../js/script';
import GroupService from '../../services/GroupService';
import FriendsService from '../../services/FriendService';

import fileStorage from '../../config/fileStorage';

export default function SwapComponents() {
  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  const { user } = useContext(UserContext);

  const [refresh, setRefresh] = useState(null);
  const [stories, setStories] = useState([]);
  const [storiesImage, setStoriesImage] = useState([]);
  const [filesStry, setFilesStry] = useState({});
  const [showstoriesImage, setShowstoriesImage] = useState(false);
  const [showComp, setShowComp] = useState('newsfeed');
  const [showCompont, setShowCompont] = useState();
  const [posts, setPosts] = useState([]);
  const [postsForUser, setPostsForUser] = useState([]);
  const [storiesForUser, setStoriesForUser] = useState([]);
  const [savedPost, setSavedPost] = useState([]);
  const [userR, setUserR] = useState([]);
  const [group, setGroup] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [searchedGroups, setSearchedGroups] = useState([]);
  const [postContent, setPostContent] = useState('');

  const [files, setFiles] = useState({});
  const [postImage, setPostImage] = useState({});
  const [showPostImage, setShowPostImage] = useState(false);

  const [swapfiles, setSwapfiles] = useState({});
  const [swapImage, setSwapImage] = useState({});
  const [showSwapImage, setShowSwapImage] = useState(false);

  const [uploadError, setUploadError] = useState('');

  const [editPostId, setEditPostId] = useState(null);

  const [img, setImage] = useState('');
  const [Privacy, setPrivacy] = useState('');

  const [friendsList, setFriendsList] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [userF, setUserF] = useState(null);
  const [searchedUser, setSearchedUser] = useState([]);

  const getPostForUser = async () => {
    await PostService.getPostForUser(AuthService.getCurrentUser().username).then((res) => {
      const sorting = res.data.sort(function (a, b) {
        let dateA = new Date(a.published),
          dateB = new Date(b.published);
        return dateB - dateA;
      });
      const uniquePost = Array.from(new Set(sorting.map((a) => a.id))).map((id) => {
        return res.data.find((a) => a.id === id);
      });
      setPostsForUser(uniquePost);
    });
  };

  const getAllGroups = async () => {
    await GroupService.getAllGroups().then((res) => {
      setAllGroups(res.data);
      setSearchedGroups(res.data);
    });
  };

  const getPost = async () => {
    await PostService.getPost().then((res) => {
      setPosts(res.data);
    });
  };

  const getSavedPost = async () => {
    await PostService.getSavedPostForUser(AuthService.getCurrentUser().username).then((res) => {
      setSavedPost(res.data);
    });
  };

  const handlePostContent = (event) => {
    console.log(event.target.value);
    setPostContent(event.target.value);
  };

  const handleFile = (event) => {
    console.log(event.target.files[0]);
    setFiles(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPostImage(reader.result);
      }
    };
    console.log(event.target.files[0]);
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0]);
    // }
    setShowPostImage(true);
  };

  const handleFileSwap = (event) => {
    console.log(event.target.files[0]);
    setSwapfiles(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setSwapImage(reader.result);
      }
    };
    console.log(event.target.files[0]);
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0]);
    // }
    setShowSwapImage(true);
  };

  const handleSwapImages = (e) => {
    e.preventDefault();
    console.log('From handle swap images');
  };

  const handleRemoveImage = () => {
    setFiles({});
    setShowPostImage(false);
  };

  const handlePrivacy = (event) => {
    console.log(event.target.value);
    setPrivacy(event.target.value);
  };
  const uploadPost = async (event) => {
    event.preventDefault();
    setUploadError('');
    console.log('uploading post working');
    if (postContent === '' && Object.keys(files).length === 0 && files.constructor === Object) {
      console.log('cant be null');
      setUploadError('Please Insert A Text or an Image');
      return;
    }

    const formData = new FormData();
    formData.append('content', postContent);
    console.log(' this is the files', files);
    console.log(' this is the swapfiles', swapfiles);
    formData.append(`files`, files);
    formData.append(`swapfiles`, swapfiles);
    formData.append(`privacy`, Privacy);

    const swapResponse = await SwapService.createSwap(user.id, formData);
    console.log('swap response', swapResponse);
    setPostContent('');
    handleRemoveImage();
    handleRemoveImageSwap();
    setRefresh(swapResponse.data);
    history.push('/swapFeed');
    console.log('retrieving swaps');
    const swapsResponse = await SwapService.getSwapForUser(user.id);
    console.log('SWAPS response', swapsResponse);
  };

  const handleRemoveImageSwap = () => {
    setSwapfiles({});
    setShowSwapImage(false);
  };

  const getUser = async () => {
    if (user === null) {
      console.log('RUNNING');
      await UserService.getUserByEmail(AuthService.getCurrentUser().username).then((res) => {
        setUserR(res.data);
      });
    } else {
      console.log('WALKING' + JSON.stringify(user));
      setUserR(user);
    }
  };

  const getAllUser = async () => {
    await UserService.getUsers().then((res) => {
      setAllUser(res.data);
      setSearchedUser(res.data);
    });
    console.log(user.email + ' This is the users');
  };
  const getFriendsList = async () => {
    await FriendsService.getFriends(AuthService.getCurrentUser().username).then((res) => {
      setFriendsList(res.data);
    });
  };

  useEffect(() => {
    getAllUser();
    getFriendsList();
    testScript();
  }, []);

  useEffect(() => {
    getAllGroups();
  }, [showComp, group]);

  useEffect(() => {
    testScript();
  }, []);

  useEffect(() => {
    getUser();
    getPost().then(() => {
      setIsLoading(false);
    });
    getPostForUser();
    getSavedPost();
    testScript();
  }, [editPostId, refresh]);

  useEffect(() => {
    getPostForUser();
    getSavedPost();
    testScript();
  }, [user]);

  if (isLoading) {
    return <div>Loading... Please Wait</div>;
  }

  return (
    <>
      <div>
        <div className="central-meta hanggift">
          <div style={{ textAlign: 'center' }}>
            <Form>
              <div className="headpop">
                {/* adding */}
                <div style={{ float: 'left', width: '50%', textAlign: 'left' }}>
                  <div style={{ padding: '0 11px 11px 11px' }}>
                    <div className="popupimg">
                      <img
                        src={
                          user
                            ? fileStorage.baseUrl + user.profilePicturePath
                            : fileStorage.baseUrl + userR.profilePicturePath
                        }
                        alt=""
                      />
                    </div>
                    <div class="popupuser-name">
                      <div style={{ float: 'left', display: 'inline' }}>
                        <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                          {`${user.firstName} ${user.lastName}`}
                          {userF ? <> with {`${userF.firstName} ${userF.lastName}`}</> : null}
                        </span>
                        <span style={{ display: 'block', fontSize: '12px' }}>
                          <div className="dropdown">
                            <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy}>
                              <option value="Friends">Friends</option>
                              <option value="Public">Public</option>
                              <option value="Only Me">Only Me</option>
                            </select>
                          </div>{' '}
                        </span>
                      </div>{' '}
                    </div>{' '}
                  </div>
                </div>
                <div className="row" style={{ width: '50%', float: 'left' }}>
                  <div
                    style={{
                      color: '#000000',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      width: '25%',
                      textAlign: 'center',
                    }}
                  >
                    <span></span>
                  </div>
                  <span style={{ float: 'right', width: '80%' }}>
                    {' '}
                    <button style={{ float: 'right', borderRadius: '20px' }} type="submit" onClick={uploadPost}>
                      Swap
                    </button>
                  </span>
                </div>
                <div style={{ padding: '0 14px 14px 14px' }}></div>
              </div>
              {/* <div style={{padding:'0 14px 14px 14px'}}>  
                                     </div> */}
              <div style={{ margin: '0 11px 0x 11px' }}>
                <span className="textPop">
                  <textarea
                    className="textpopup"
                    rows={2}
                    placeholder={uploadError ? `${uploadError}` : 'We share,do you?'}
                    name="swap_content"
                    value={postContent}
                    onChange={handlePostContent}
                  />
                </span>
              </div>

              <div className="row mrginbtm">
                <div style={{ width: '40%', display: 'inline', textAlign: 'center' }}>
                  <div style={{ height: '230px' }}>
                    {showPostImage ? (
                      <>
                        <img id="preview" src={postImage} style={{ maxWidth: '200px' }} />
                        <button onClick={handleRemoveImage} className="buttonClosePrvw lftbtn">
                          <i class="las la-times"></i>
                        </button>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <label className="fileContainer">
                          <div className="swappic" type="submit">
                            <input type="file" name="swap_image" accept="image/*" onChange={handleFile}></input>
                            <i class="lar la-file-image"></i>
                            <div style={{ fontSize: '12px' }}>Add Swap Image</div>{' '}
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ width: '20%', display: 'inline', textAlign: 'center', padding: '75px 0' }}>
                  <img
                    style={{ verticalAlign: 'middle', cursor: 'pointer' }}
                    src="/assets/images/swapicon.png"
                    alt="img"
                    onClick={handleSwapImages}
                  />
                </div>
                <div style={{ width: '40%', display: 'inline', textAlign: 'center' }}>
                  <div style={{ height: '230px' }}>
                    {showSwapImage ? (
                      <>
                        <img id="preview" src={swapImage} style={{ maxWidth: '150px' }} />
                        <button onClick={handleRemoveImageSwap} className="buttonClosePrvw rtbtn">
                          <i class="las la-times"></i>
                        </button>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <label className="fileContainer">
                          <div className="swappic" type="submit">
                            <input type="file" name="swap_image" accept="image/*" onChange={handleFileSwap}></input>
                            <i class="lar la-file-image"></i>
                            <div style={{ fontSize: '12px' }}>Add Image to be swapped</div>{' '}
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
