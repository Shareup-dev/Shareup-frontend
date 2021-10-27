import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import SwapService from '../../services/SwapService';
import AuthService from '../../services/auth.services';

import fileStorage from '../../config/fileStorage';
import ButtonImageSelect from './ButtonImageSelect.js';
import CreatePostComponentFieldText from './CreatePostComponentFieldText.js';
import CreatePostComponentSelectPrivacy from './CreatePostComponentSelectPrivacy.js';
import CreatePostComponentUserAvatar from './CreatePostComponentUserAvatar';
import CreatePostComponentUserName from './CreatePostComponentUserName.js';
import CreatePostComponentBodyOptions from './CreatePostComponentBodyOptions.js';

import './CreatePostComponent.css';

// UPDATED UI HERE
const CreatePostComponent = ({ title = 'Create Swap Post', type = 'Swap' }) => {
  let history = useHistory();

  const currentUser = useContext(UserContext).user;
  const [user, setUser] = useState([]);
  const [userError, setUserError] = useState(null);
  const [post, setPost] = useState({ privacy: 'Public', content: '' });
  const [uploadError, setUploadError] = useState('');

  const { ButtonImageUI, images, imagesCount, imageSchema, imageDeleteAll, imageDeleteByIndex } = ButtonImageSelect({
    buttonSelectText: 'Add Image',
    multipleFiles: true,
  });

  const handlePostChange = (event) => {
    const { name, value } = event.target;
    const changedProp = { [name]: value };
    setPost((previousValue) => {
      return { ...previousValue, ...changedProp };
    });
  };

  const handleRemoveImage = () => {
    imageDeleteAll();
  };

  const handleUploadPost = async (event) => {
    event.preventDefault();
    setUploadError('');
    const hasUpdatedContent = post.content.length <= 0 && imagesCount <= 0;

    if (hasUpdatedContent) {
      setUploadError('Please Insert A Text or an Image');
      return;
    }
    const files = images.map((images) => images.image);
    const formData = new FormData();
    formData.append('content', post.content);
    formData.append(`files`, files);
    formData.append(`privacy`, post.privacy);

    const swapResponse = await SwapService.createSwap(user.id, formData);
    console.log('swap response', swapResponse);
    setPost({ privacy: '', content: '' });
    handleRemoveImage();

    history.push('/swapFeed');
    console.log('retrieving swaps');
    const swapsResponse = await SwapService.getSwapForUser(user.id);
    console.log('SWAPS response', swapsResponse);
  };

  const getUser = async () => {
    try {
      let user;
      const hasCurrentUser = currentUser != null;

      if (!hasCurrentUser) {
        user = await UserService.getUserByEmail(AuthService.getCurrentUser().username);
      } else {
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

  const PostImagesRemove = () => (
    <button onClick={handleRemoveImage}>
      <i class="las la-times"></i>
    </button>
  );

  const PostImages = () =>
    images.map((image, index) => {
      if (image.isReading) return <p>loading</p>;

      return (
        <img
          src={image.preview}
          alt={`preview${index}`}
          onClick={() => {
            imageDeleteByIndex(index);
          }}
        />
      );
    });

  const PostButton = () => (
    <button className="create-post-submit-swap" type="submit" onClick={handleUploadPost}>
      Share Swap
    </button>
  );

  return (
    <div className="container__create-post">
      {<ShowUserError />}
      <h1 className="create-post_title">{title}</h1>
      {uploadError}
      <div className="create-post_header">
        <CreatePostComponentUserAvatar imagePath={fileStorage.baseUrl + user.profilePicturePath} />
        <div className="header_info">
          <CreatePostComponentUserName user={user} />
          <CreatePostComponentSelectPrivacy privacy={post.privacy} handlePostChange={handlePostChange} />
        </div>
      </div>
      <div className="create-post-body">
        <CreatePostComponentFieldText content={post.content} handlePostChange={handlePostChange} />
        <CreatePostComponentBodyOptions>
          <ButtonImageUI />
        </CreatePostComponentBodyOptions>

        <PostImagesRemove />
        <PostImages />
        <PostButton />
      </div>
    </div>
  );
};

export default CreatePostComponent;
