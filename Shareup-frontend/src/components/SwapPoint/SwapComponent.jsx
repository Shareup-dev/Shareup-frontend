import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import SwapService from '../../services/SwapService';
import AuthService from '../../services/auth.services';

import fileStorage from '../../config/fileStorage';

// UPDATED UI HERE
const SwapComponent = ({ title = 'Create Swap Post' }) => {
  let history = useHistory();

  const currentUser = useContext(UserContext).user;

  const [user, setUser] = useState([]);
  const [userError, setUserError] = useState(null);

  const [postContent, setPostContent] = useState('');
  const [postPrivacy, setPostPrivacy] = useState('');

  const [post, setPost] = useState({ privacy: 'Public', content: '' });

  const [files, setFiles] = useState({});
  const [postImage, setPostImage] = useState({});
  const [showPostImage, setShowPostImage] = useState(false);

  const [uploadError, setUploadError] = useState('');

  const handlePostChange = (event) => {
    const { name, value } = event.target;
    const changedProp = { [name]: value };
    setPost((previousValue) => {
      return { ...previousValue, ...changedProp };
    });
  };

  useEffect(() => {
    console.log('POST CHANGE', post);
  }, [post]);

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

  const handleRemoveImage = () => {
    setFiles({});
    setPostImage({});
    setShowPostImage(false);
  };

  const handleUploadPost = async (event) => {
    event.preventDefault();
    setUploadError('');
    if (postContent === '' && Object.keys(files).length === 0 && files.constructor === Object) {
      setUploadError('Please Insert A Text or an Image');
      return;
    }

    const formData = new FormData();
    formData.append('content', postContent);
    formData.append(`files`, files);
    formData.append(`privacy`, postPrivacy);

    const swapResponse = await SwapService.createSwap(user.id, formData);
    console.log('swap response', swapResponse);
    setPostContent('');
    handleRemoveImage();

    history.push('/swapFeed');
    console.log('retrieving swaps');
    const swapsResponse = await SwapService.getSwapForUser(user.id);
    console.log('SWAPS response', swapsResponse);
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

  const Header = () => (
    <Fragment>
      <img src={fileStorage.baseUrl + user.profilePicturePath} alt="" />

      {`${user.firstName} ${user.lastName}`}

      <select name="privacy" id="privacy" value={post.privacy} onChange={handlePostChange}>
        <option value="Friends">Friends</option>
        <option value="Public">Public</option>
        <option value="Only Me">Only Me</option>
      </select>
    </Fragment>
  );

  const PostContent = () => (
    <div style={{ margin: '0 11px 0x 11px' }}>
      <span className="textPop">
        <textarea
          className="textpopup"
          rows={2}
          placeholder={uploadError ? `${uploadError}` : 'We share,do you?'}
          name="content"
          value={post.content}
          onChange={handlePostChange}
        />
      </span>
    </div>
  );

  const PostImageRemove = () => (
    <button onClick={handleRemoveImage} className="buttonClosePrvw lftbtn">
      <i class="las la-times"></i>
    </button>
  );

  const PostImage = () =>
    showPostImage ? (
      <Fragment>
        <img id="preview" alt="" src={postImage} style={{ maxWidth: '200px' }} />
      </Fragment>
    ) : (
      <Fragment></Fragment>
    );

  const ImageOpen = () => (
    <label className="fileContainer">
      <div className="swappic" type="submit">
        <input type="file" name="swap_image" accept="image/*" onChange={handleFile}></input>
        <i class="lar la-file-image"></i>
        <div style={{ fontSize: '12px' }}>Add Swap Image</div>{' '}
      </div>
    </label>
  );
  const PostButton = () => (
    <button style={{ float: 'right', borderRadius: '20px' }} type="submit" onClick={handleUploadPost}>
      Swap
    </button>
  );

  return (
    <div>
      <ShowUserError />
      <h1>{title}</h1>
      <Header />
      <PostContent />
      <PostImageRemove />
      <PostImage />
      <ImageOpen />
      <PostButton />
    </div>
  );
};

export default SwapComponent;
