import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import SwapService from '../../services/SwapService';
import AuthService from '../../services/auth.services';

import fileStorage from '../../config/fileStorage';

// UPDATED UI HERE
const SwapComponent = () => {
  let history = useHistory();

  const currentUser = useContext(UserContext).user;

  const [user, setUser] = useState([]);
  const [userError, setUserError] = useState(null);

  const [postContent, setPostContent] = useState('');
  const [postPrivacy, setPostPrivacy] = useState('');

  const [files, setFiles] = useState({});
  const [postImage, setPostImage] = useState({});
  const [showPostImage, setShowPostImage] = useState(false);

  const [swapfiles, setSwapfiles] = useState({});
  const [swapImage, setSwapImage] = useState({});
  const [showSwapImage, setShowSwapImage] = useState(false);

  const [uploadError, setUploadError] = useState('');

  const handlePrivacy = (event) => {
    setPostPrivacy(event.target.value);
  };

  const handlePostContent = (event) => {
    setPostContent(event.target.value);
  };

  const handleFile = (event) => {
    console.log('@handle file init', event.target.files[0]);

    const reader = new FileReader();

    setFiles(event.target.files[0]);

    reader.onload = () => {
      if (reader.readyState === 2) {
        setPostImage(reader.result);
      }
    };

    reader.readAsDataURL(event.target.files[0]);
    setShowPostImage(true);
    console.log('@handle file done', postImage);
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

  const handleRemoveImage = () => {
    setFiles({});
    setShowPostImage(false);
  };

  const handleUploadPost = async (event) => {
    event.preventDefault();
    setUploadError('');
    console.log('uploading post working');
    if (postContent === '' && Object.keys(files).length === 0 && files.constructor === Object) {
      setUploadError('Please Insert A Text or an Image');
      return;
    }

    const formData = new FormData();
    formData.append('content', postContent);
    console.log(' this is the files', files);
    console.log(' this is the swapfiles', swapfiles);
    formData.append(`files`, files);
    formData.append(`swapfiles`, swapfiles);
    formData.append(`privacy`, postPrivacy);

    const swapResponse = await SwapService.createSwap(user.id, formData);
    console.log('swap response', swapResponse);
    setPostContent('');
    handleRemoveImage();
    handleRemoveImageSwap();

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
    try {
      let user;

      if (currentUser === null) {
        console.log('currentUser null', currentUser);
        user = await UserService.getUserByEmail(AuthService.getCurrentUser().username);
      } else {
        console.log('currentUser not null', currentUser);
        user = currentUser;
      }

      setUser(user);
    } catch (error) {
      setUserError(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const ShowUserError = () => (userError ? <p>{JSON.stringify(userError)}</p> : '');

  return (
    <>
      <div>
        <ShowUserError />
        <div className="central-meta hanggift">
          <div style={{ textAlign: 'center' }}>
            <Form>
              <div className="headpop">
                {/* adding */}
                <div style={{ float: 'left', width: '50%', textAlign: 'left' }}>
                  <div style={{ padding: '0 11px 11px 11px' }}>
                    <div className="popupimg">
                      <img src={fileStorage.baseUrl + user.profilePicturePath} alt="" />
                    </div>
                    <div class="popupuser-name">
                      <div style={{ float: 'left', display: 'inline' }}>
                        <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                          {`${user.firstName} ${user.lastName}`}
                        </span>
                        <span style={{ display: 'block', fontSize: '12px' }}>
                          <div className="dropdown">
                            <select name="privacy" id="privacy" value={postPrivacy} onChange={handlePrivacy}>
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
                    <button style={{ float: 'right', borderRadius: '20px' }} type="submit" onClick={handleUploadPost}>
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
                  <img style={{ verticalAlign: 'middle' }} src="/assets/images/swapicon.png" alt="img" />
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
};

export default SwapComponent;
