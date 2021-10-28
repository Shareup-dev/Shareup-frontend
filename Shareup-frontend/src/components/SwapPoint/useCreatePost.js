import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import SwapService from '../../services/SwapService';
import AuthService from '../../services/auth.services';

const useCreatePost = () => {
  let history = useHistory();

  const currentUser = useContext(UserContext).user;
  const [user, setUser] = useState([]);
  const [post, setPost] = useState({ privacy: 'Public', content: '' });

  const postUpdate = ({ name, value }) => {
    const changedProp = { [name]: value };
    setPost((previousValue) => {
      return { ...previousValue, ...changedProp };
    });
  };

  const postUpload = async (files = []) => {
    const hasUpdatedContent = post.content.length > 0;
    const hasImages = files.length > 0;

    if (hasUpdatedContent && hasImages) {
      return;
    }

    const formData = new FormData();
    formData.append('content', post.content);
    formData.append(`files`, files);
    formData.append(`privacy`, post.privacy);

    const swapResponse = await SwapService.createSwap(user.id, formData);
    console.log('swap response', swapResponse);
    postUpdate({ privacy: '', content: '' });

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
    } catch (error) {}
  };

  useEffect(() => {
    getUser();
  }, []);

  return { post: { ...post, postUpdate, postUpload }, user };
};

export default useCreatePost;
