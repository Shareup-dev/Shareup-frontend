import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import SwapService from '../../services/SwapService';
import AuthService from '../../services/auth.services';

const postResponseScheme = { ok: false, loading: false, message: '', result: null };
const useCreatePost = () => {
  let history = useHistory();

  const currentUser = useContext(UserContext).user;
  const [user, setUser] = useState([]);
  const [post, setPost] = useState({ privacy: 'Public', content: '' });
  const [postResponse, setPostResponse] = useState({ ...postResponseScheme });

  const postUpdate = ({ name, value }) => {
    const changedProp = { [name]: value };
    setPost((previousValue) => {
      return { ...previousValue, ...changedProp };
    });
  };

  const postReset = () => {
    setPost({ privacy: 'Public', content: '' });
  };

  const postUpload = async (files = [], isSwap = true) => {
    setPostResponse({ ok: false, loading: true, message: 'Posting...', result: null });

    const hasUpdatedContent = post.content.length > 0;
    const hasImages = files.length > 0;

    if (isSwap) files = files[0];
    if (!hasImages) return setPostResponse({ ok: false, loading: false, message: 'No images found.', result: null });
    if (!hasImages && !hasUpdatedContent)
      return setPostResponse({ ok: false, loading: false, message: 'No images and content found.', result: null });

    const formData = new FormData();
    formData.append('content', post.content);
    formData.append('files', files);
    formData.append('privacy', post.privacy);

    try {
      const swapResponse = await SwapService.createSwap(user.id, formData);
      history.push('/swapFeed');
      return setPostResponse({ ok: true, loading: false, message: 'Posting successful', result: { ...swapResponse } });
    } catch (error) {
      return setPostResponse({ ok: false, loading: false, message: 'Posting error', result: { ...error } });
    }
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
    } catch (error) {}
  };

  useEffect(() => {
    getUser();
  }, []);

  return { user, postResponse, post: { ...post, postUpdate, postUpload, postReset } };
};

export default useCreatePost;
