import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import FriendsService from '../../services/FriendService';
import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import PostService from '../../services/PostService';

function EditPostComponent({ post, set }) {
    let history = useHistory();

    const [editContent, setEditContent] = useState([]);

    useEffect(() => {

    }, [])

    const handleCancelEdit = (event) => {
        event.preventDefault();
        set(null)
    }

    const handleEditContent = (event) => {
        console.log(event.target.value)
        setEditContent(event.target.value)
    }

    const handleUpdatePost = (event) => {
        event.preventDefault();
        if(editContent === ""){
            console.log("please enter something")
            return
        }
        const content = {content:editContent}
        PostService.updatePost(post.id, content).then(res => {
            set(null) 
        })
    }

    return (
        <div className="friend-info">
            <figure>
                <img src={post.user.profilePicturePath} width={50} alt="" />
            </figure>
            <div className="friend-name">

                <ins>
                    <a href="time-line.html" title style={{ textTransform: 'capitalize' }}>{`${post.user.firstName} ${post.user.lastName}`}</a>
                </ins>
                <span>published: {`${post.published}`}</span>
                <span>Edit Mode</span>
            </div>
            <div className="post-meta">
                {post.postImagePath ?
                    <img style={{ maxWidth: "100%", height: "auto" }} src={post.postImagePath} /> : null
                }

            <textarea rows={2} placeholder="write something" name="post_content" defaultValue={post.content} onChange={handleEditContent} />

                <div className="we-video-info">
                    <ul>
                        <li><span className="views" data-toggle="tooltip" title="views">{`${post.views}`} <i className="fa fa-eye" />

                        </span></li>
                        <li><span className="comment" data-toggle="tooltip" title="Comments">{`${post.comments.length}`} <i className="fa fa-comments-o" />


                        </span></li>
                        <li><span className="like" data-toggle="tooltip" title="like">{`${post.reactions.length}`} <i className="fa fa-trophy" aria-hidden="true" />

                        </span></li>
                        <li><span onClick={handleCancelEdit}>Cancel</span></li>
                        <li><span onClick={handleUpdatePost}>Save</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default EditPostComponent;