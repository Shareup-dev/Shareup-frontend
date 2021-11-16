import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import SwapService from '../../services/SwapService';
import settings from '../../configs/Settings';
import fileStorage from '../../configs/fileStorage';

function EditSwapComponent({ swap, set }) {
  let history = useHistory();

  const [editContent, setEditContent] = useState([]);

  useEffect(() => {}, []);

  const handleCancelEdit = (event) => {
    event.preventDefault();
    set('cancel');
  };

  const handleEditContent = (event) => {
    console.log(event.target.value);
    setEditContent(event.target.value);
  };

  const handleUpdateSwap = async (event) => {
    event.preventDefault();
    console.log(editContent + ' HE ' + swap.content);
    if (editContent.length <= 0 || editContent === '' || editContent === null) {
      console.log('please make sure you made changes');
      return;
    }
    if (swap.content === editContent) {
      console.log('please make sure you made changes');
      return;
    }
    const content = { content: editContent };
    await SwapService.updateSwap(swap.id, content).then((res) => {
      set(`${res.data} saved`);
    });
  };

  return (
    <div className='friend-info'>
      <figure>
        <img src={fileStorage.baseUrl + swap.user.profilePicturePath} alt='' />
      </figure>
      <div className='friend-name'>
        <ins>
          <a
            href='time-line.html'
            title
            style={{ textTransform: 'capitalize' }}
          >{`${swap.user.firstName} ${swap.user.lastName}`}</a>
        </ins>
        <span>published: {`${swap.published}`}</span>
        <span>Edit Mode</span>
      </div>
      <div className='post-meta'>
        {swap.postImagePath ? (
          <img style={{ maxWidth: '100%', height: 'auto' }} src={fileStorage.baseUrl + swap.imagePath} />
        ) : null}

        <textarea
          rows={2}
          placeholder='write something'
          name='post_content'
          defaultValue={swap.content}
          onChange={handleEditContent}
        />

        <div className='we-video-info'>
          <div className='row'>
            <div className='col'>
              <span onClick={handleCancelEdit}>Cancel</span>
            </div>
            <div className='col'>
              <span onClick={handleUpdateSwap}>Save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditSwapComponent;
