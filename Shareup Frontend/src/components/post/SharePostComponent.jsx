import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import UserService from '../../services/UserService';
import PostService from '../../services/PostService';
import EditPostComponent from './EditPostComponent'
import CommentPostComponent from './CommentPostComponent';
import PostComponentBoxComponent from './PostCommentBoxComponent';
import Popup from 'reactjs-popup';
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

export default function SharePostComponent({ post, setRefresh }) {
    const { user } = useContext(UserContext)
    const [editPostId, setEditPostId] = useState(null)
    const [userR, setUserR] = useState([]);
    const [showComment, setShowComment] = useState(false)
    const [showMoreOptions, setShowMoreOptions] = useState(false)
    const [showReactions, setShowReactions] = useState(false)
   
    const [likeReaction, setLikeReaction] = useState(null)

    const something=(event)=> {
        if (event.key === "Enter") {
            console.log('enter')
        }
    }
    const handleEditPost = (id) => {
        setEditPostId(id)
        setRefresh(id)
    }

    const getCommentCounter = (comments) => {
        let counter = 0
        comments.map(comment => {
            counter += comment.replies.length + 1
        })
        return counter
    }

    const checkIfLiked = (post) => {
        const result = post.reactions.filter(reaction => reaction.user.id == user.id)
        if (result.length > 0) {
            return true
        }
        return false
    }

    const checkIfSaved = (post) => {
        const result = post.savedByUsers.filter(userz => userz.id == user.id)
        if (result.length > 0) {
            console.log(" FOUND")
            return true
        }
        console.log(" Not found")
        return false
    }

    const handleLikePost = async (post_id) => {
        await UserService.likePost(user.id, post_id).then(res => {
            setRefresh(res.data)
        })
    }

    const handleSavePost = async (post_id) => {
        UserService.savePost(user.id, post_id).then(res => {
            setRefresh(res.data)
        })
        setShowMoreOptions(false);
    }

    const handleDeletePost = (postid) => {
        PostService.deletePost(postid).then(res => {
            console.log(res.status)
            setRefresh(res.data)
        })
    }

    const handleEditingSave = (value) => {
        setEditPostId(value)
        setRefresh(value)
        setShowMoreOptions(false)
    }

    const handleShowingReaction = () => {
        setTimeout(function () { setShowReactions(true) }, 200);
    }

    const handleUnshowingReaction = () => {
        setTimeout(function () { setShowReactions(false) }, 200);
    }

    const handleReaction = () => {
        if(likeReaction) {
            return (<img src="/assets/images/StarLike.svg" alt="" />)
            // return (<img width={30} style={{marginTop:'-5px'}} src={`../assets/images/gif/${likeReaction}.gif`}/>)
        }
        return (<img src="/assets/images/StarLike.svg" alt="" />)
    }

    const handleSettingReactions = (reaction) => {
        setLikeReaction(reaction)
        if (!checkIfLiked(post)) {
            handleLikePost(post.id)  
        }
    }
   
    const handleCounterReaction = () => {
        if(likeReaction) {
            return (<img width={20} style={{marginTop:'-5px'}} src={`../assets/images/gif/${likeReaction}.gif`}/>)
        }
        return (<img src="/assets/images/Starwhite.svg" alt="" />)
    }

    return (
        <div key={post.id}>
            {post.swapImagePath ?null:
        <div className="central-meta item" >
             
            <div className="user-post">
                {
                    editPostId !== post.id ?
                        <div className="friend-info">

                            <div className="post-meta">
                            
                           
                           
                       
                            {post.postImagePath ?
                                <div className="postImage">
                                    <a href={post.postImagePath} data-lightbox={`image-user-${post.user.id}`}><img style={{ width: '100%', height: '300px',objectFit:'cover' }} src={post.postImagePath} /> </a></div> : null
                                }




                                {/* {post.postImagePath ?
                                <div className="postImage">
                                    <a href={post.postImagePath} data-lightbox={`image-user-${post.user.id}`}><img style={{ maxWidth: "100%", height: "auto" }} src={post.postImagePath} /> </a></div> : null
                                }
                                {post.swapImagePath ?
                                <>
                                <div style={{textAlign: "center"}}><img  width="30" src="assets/images/swapicon.png"/></div>
                                    <div className="swapImage">
                                    <a href={post.swapImagePath} data-lightbox={`image-user-${post.user.id}`}><img style={{ maxWidth: "100%", height: "auto" }} src={post.swapImagePath} /> </a></div> </>: null
                                } */}

                                
<figure>
                                <img src={post.user.profilePicturePath} alt="" />
                            </figure>
                            
                            <div className="friend-name">
                                <div style={{ float: 'left', display: 'inline' }}>

                                    <a href={`/profile/${post.user.email}`} title="#" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{`${post.user.firstName} ${post.user.lastName}`}</a>

                                    <span style={{ display: 'block', fontSize: '12px',paddingTop:'5px' }}>on {`${post.published}`} {checkIfSaved(post) && <i class="las la-bookmark"></i>}</span>
                                    {post.group ? <span className="groupName">Group: {`${post.group.name}`}</span> : null}</div> <div style={{ float: 'right', display: 'inline', fontSize: '28px', fontWeight: '900', cursor: 'pointer' }} >
                                    


                                </div>
                               

                            </div>
                            <div className="counter">
                                <ul>
                                <li>{handleCounterReaction()}<span> {`${post.reactions.length}`} </span></li>
                                <li><span className='commentCounter' style={{ marginRight: '5px' }} onClick={() => setShowComment(!showComment)}><img src="/assets/images/commentwhite.svg" alt="" /></span> <span> {`${getCommentCounter(post.comments)}`}</span> 
                                   </li>
                                   <li><span> <img src="/assets/images/shareicnwhite.svg" alt="" /></span> <span> {`${getCommentCounter(post.comments)}`} </span>
                                  
                                    </li>
                                </ul>
                                </div>
                            {
                                    post.content && <p id={`post-content-${post.id}`}>
                                        {`${post.content}`}
                                        <br></br>
                                    </p>
                                }

                                
                                {
                                    showReactions && <div onMouseEnter={handleShowingReaction} onMouseLeave={handleUnshowingReaction} className="reaction-bunch active">
                                        <img src={'../assets/images/gif/smiley.gif'} onClick={() => handleSettingReactions('smiley')}/>
                                        <img src={'../assets/images/gif/cool.gif'} onClick={() => handleSettingReactions('cool')}/>
                                        <img src={'../assets/images/gif/laughing.gif'} onClick={() => handleSettingReactions('laughing')}/>
                                        <img src={'../assets/images/gif/tongue.gif'} onClick={() => handleSettingReactions('tongue')}/>
                                        <img src={'../assets/images/gif/angel.gif'} onClick={() => handleSettingReactions('angel')}/>
                                        <img src={'../assets/images/gif/devil.gif'} onClick={() => handleSettingReactions('devil')}/>
                                        <img src={'../assets/images/gif/angry.gif'} onClick={() => handleSettingReactions('angry')}/>

                                    </div>
                                }
                                
                                <div className="we-video-info">
                                    <div className='click'>

                                        {checkIfLiked(post) ?
                                            <div className="reaction"  onClick={() => handleLikePost(post.id)}>
                                                <span className="like" data-toggle="tooltip" title="">{handleReaction()}<span style={{ paddingLeft: '10px' }}></span></span></div>
                                            :
                                            <div className="reaction" onClick={() => handleLikePost(post.id)}>
                                                <span className="dislike" data-toggle="tooltip" title=""><img src="/assets/images/Star.svg" alt="" /><span style={{ paddingLeft: '10px' }}></span></span></div>
                                        }
                                        <div className="commShare"><div className="btncmn" onClick={() => setShowComment(!showComment)}><span className="comment" data-toggle="tooltip" title="Comments"><img src="assets/images/comment.svg"/><span style={{paddingLeft:'2px'}} >Comment</span>


                                        </span></div><div className="btncmn" ><span className="views" data-toggle="tooltip" ><img src="assets/images/shareicn.svg"/><span style={{paddingLeft:'2px'}}>Share</span>

                                           </span></div></div>
                                        
                                    </div>
                                </div>
                            </div>
                            
                           
                            
                            
                        </div>
                        :
                        <EditPostComponent post={post} set={handleEditingSave} />
                }
<div className="add-dropdown" onClick={() => setShowMoreOptions(!showMoreOptions)}>
                                        <span title="add icon" ><i class="las la-ellipsis-h"></i></span>
                                    </div>
                                    {
                                        showMoreOptions && <div className="drop-options active">
                                            <ul><li className="head-drop"><h6>Post Options</h6></li>
                                                {(post.user.id === user.id) ? <li onClick={() => handleEditPost(post.id)}>
                                                    <i class="las la-pencil-alt"></i><span>Edit Post</span></li>
                                                    :
                                                    <></>
                                                }
                                                <li onClick={() => handleSavePost(post.id)}><i class="lar la-bookmark"></i><span>Save Post</span></li>
                                                {(post.user.id === user.id) ? <li onClick={() => handleDeletePost(post.id)}>
                                                    <i class="las la-trash" ></i><span>Delete</span></li>
                                                    :
                                                    <></>
                                                }
                                                <li><i class="las la-link"></i><span>Copy Link</span></li>
                                            </ul>
                                        </div>
                                    }
                {/* Till here */}
                <div className="coment-area">
                    <ul className="we-comet">
                        <PostComponentBoxComponent post={post} setRefresh={setRefresh} />
                        {
                            showComment && <CommentPostComponent post={post} setRefresh={setRefresh} />
                        }
                    </ul>
                </div>
                
            </div>

        </div>
        }
        </div>
    );
}