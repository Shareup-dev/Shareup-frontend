import React, { useState, useEffect, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import UserContext from '../../contexts/UserContext';
import UserService from '../../services/UserService';
import PostService from '../../services/PostService';
import EditPostComponent from '../post/EditPostComponent'
import CommentPostComponent from '../post/CommentPostComponent';
import PostComponentBoxComponent from '../post/PostCommentBoxComponent';
import PostComponent from '../post/PostComponent';
import PostTextBoxComponent from '../post/PostTextBoxComponent';
import FriendProfWidgtComponent from './FriendProfWidgtComponent';
import settings from '../../services/Settings';

export default function PostProfileComponent({ posts, setRefresh }) {
   

    return (
        <div className="row">
                  
                  <PostTextBoxComponent/>
            {
                posts.map(post =>
                    <PostComponent post={post} setRefresh={setRefresh}/>
                    )
            }
        </div>
        // </div>
                  
        
    );
}