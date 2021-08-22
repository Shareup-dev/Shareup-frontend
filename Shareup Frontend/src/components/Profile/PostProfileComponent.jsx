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

export default function PostProfileComponent({ posts, setRefresh }) {
   

    return (
        <div className="row">
                   
                  {/* <div className="col-lg-4">
                  <div className="widget-prof">
                    <div className="head-widgt">Profile Summary</div>
                    <ul><li>Edit Details</li>
                    <li>Add Hobbies</li>
                    <li>Add Featured</li>
                    </ul>
                  </div>
				  <div className="widget-prof">
                    <div className="head-widgt">Photos</div>
                    
                  </div>
				  <div className="widget-prof">
           <div className="head-widgt">Friends</div>
				  <FriendProfWidgtComponent/></div>
                  </div>
                  <div className="col-lg-8"> */}
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