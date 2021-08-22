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
        set("cancel")
    }

    const handleEditContent = (event) => {
        console.log(event.target.value)
        setEditContent(event.target.value)
    }

    const handleUpdatePost = async (event) => {
        event.preventDefault();
        console.log(editContent + ' HE ' + post.content)
        if(editContent.length <= 0 || editContent === '' || editContent === null){
            console.log("please make sure you made changes")
            return
        }
        if(post.content === editContent){
            console.log("please make sure you made changes")
            return
        }
        const content = {content:editContent}
        await PostService.updatePost(post.id, content).then(res => {
            set(`${res.data} saved`) 
        })
    }

    return (
        <div className="friend-info">
            <figure>
                <img src={post.user.profilePicturePath} alt="" />
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
                    <div className="row">
                        
                        <div className="col"><span onClick={handleCancelEdit}>Cancel</span></div>
                        <div className="col"><span onClick={handleUpdatePost}>Save</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EditPostComponent;