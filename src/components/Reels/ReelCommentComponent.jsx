import React, { useState, useEffect, useContext, useRef } from 'react';
import UserContext from '../../contexts/UserContext';

import Form from 'react-bootstrap/Form';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import Picker from 'emoji-picker-react';
import PickerGif from 'react-giphy-picker';
import Giphy from "../Giphy";
import Stickers from "../Stickers";
import $ from 'jquery'
import ReelsService from '../../services/ReelsServices';
import CommentsService from '../../services/CommentsService';
import moment from 'moment';
import ReelReplyCommentComponent from './ReelReplyCommentComponent';
import  { handleSendNotification } from "../dashboard/ShareupInsideHeaderComponent";

export default function ReelCommentComponent(props) {

    const { user } = useContext(UserContext)
    const [comments, setComments] = useState([])

    const ref = useRef(null);
    const [commentContent, setCommentContent] = useState(props.editComment ? props.editComment.content : "");
    const [showEmojis, setShowEmojis] = useState(false)
    const [showGifs, setShowGifs] = useState(false)
    const [showSticker, setShowSticker] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [chosenGif, setChosenGif] = useState(null);
    const [chosenSticker, setSticker] = useState(null);
    const [reel, setReel] = useState(props.reel);
    const [activeCommentId, setActiveCommentId] = useState()

    const [likedCommentId, setLikedCommentId] = useState()
    const [likedCommentIdArr, setLikedCommentIdArr] = useState([])
    const [replyListShowFlag, setReplyListShowFlag] = useState(false)

    const [replyCommentFlag, setReplyCommentFlag] = useState(false)
    const [replyCommentId, setReplyCommentId] = useState(false)
    const [replies, setReplies] = useState([])
    const [repliesShowId, setRepliesShowId] = useState(true)
    const [editCommentId, setEditCommentId] = useState()
    const [editCommentFlag, setEditCommentFlag] = useState(false)
    const [reactions, setReactions] = useState([])
    const [editReplyId, setEditReplyId] = useState()
    const [editReplyFlag, setEditReplyFlag] = useState(false)


    useEffect(() => {
        sortComment()
        console.log('fff')
    }, [props.reel]);

    const sortComment = async () => {
        // console.log('sort called',propPost)
        // let postId = {}
        // if(propPost) { 
        //   postId = propPost
        // }else{
        //   postId = post.id
        // }
        await ReelsService.getCommentsForReel(reel.id).then((res) => {

            setComments(res.data)
            // if (comments && comments.length>0) {

            //   // const comments = [...comments]
            //   comments.sort(function (a, b) {
            //     var dateA = new Date(a.published), dateB = new Date(b.published);
            //     return dateA - dateB;
            //   });
            //   setComments(comments)
            // }
            console.log(comments)
        })

    }
    const checkIfLiked = (comment) => {
        if (comment.reactions) {
            const result = comment.reactions.filter(
                (reaction) => reaction.user.id == user.id
            );
            if (result.length > 0) {
                // setLikedCommentId(comment.id)
                return true;
            }
            return false;
        }
    }
    const onEmojiClick = (event, emojiObject) => {
        const cursor = ref.current.selectionStart;
        const start = commentContent.substring(0, cursor)
        const end = commentContent.substring(cursor)
        const text = start + emojiObject.emoji + end;

        setChosenEmoji(emojiObject);
        setCommentContent(text);
        ref.current.focus();
    };
    const handleCommentContent = (event) => {
        // console.log(event.target.value)
        setCommentContent(event.target.value)
    }

    const handlePostingComment = (reelid) => {
        if (commentContent === "") {
            return null;
        } else {
            let comment ={}
            comment.content = commentContent
            const formData = new FormData();
            formData.append("content", commentContent);
            if (props.editComment) {
                ReelsService.editCommentForReels(props.editComment.id, formData).then(res => {
                    console.log(res.data)
                    props.checkEditComment(false)
                    // props.setRefresh(res.data)
                    setCommentContent("")
                    // setComments
                })
            } else {
                ReelsService.addCommentsForReel(user.id, reelid, comment).then(res => {
                    console.log(res.data)
                    sortComment()
                    // props.setRefresh(res.data)
                    setCommentContent("")
                })
            }
        }
    }
    const handleDeleteComment = async (comment, post) => {
        await CommentsService.deleteComment(comment.id).then((res) => {
            sortComment()


            // props.setRefresh(res.data)
        })

    }
    const likeComment = async (comment) => {

        await CommentsService.LikeComment(user.id, comment.id, {}).then((res) => {
            console.log("like comment")
            console.log(res.data)
            handleSendNotification(res.data.user.id,'Liked your comment',user?.firstName,user?.lastName,user?.email,"comment",comment.id)
            sortComment()
            // getReplies(res.data)
            // checkIfLiked(comment)
        })
    }
    const replyClicked = (commentId) => {
        setActiveCommentId(commentId)
        setReplyListShowFlag(!replyListShowFlag)
        // setReplyCommentFlag(!replyCommentFlag)
        // console.log(replyListShowFlag,'replylist')
        // setReplyCommentId(commentId)
        // getReplies(commentId)
      }
      const editComment = (e,commentId)=>{
        e.preventDefault();
        console.log(commentId)
        setEditCommentId(commentId)
        setEditCommentFlag(true)
      }
      const replyInputClicked = (commentId) =>{
        
        setActiveCommentId(commentId)
        
        setReplyCommentFlag(!replyCommentFlag)
        console.log('input',replyCommentFlag)
      }
    const commentInput = () => {
        console.log('hiii')
        return (
            <li className="post-comment">
                <div className="comet-avatar">
                    <img src={fileStorage.baseUrl + user.profilePicturePath} alt="" />
                </div>
                <div className="post-comt-box">
                    <Form>
                        <textarea rows={2} placeholder={"Write a comment.."} name="comment" value={commentContent} ref={ref} onKeyPress={(e) => e.key === 'Enter' && handlePostingComment(props.reel.id)} onChange={handleCommentContent} autoFocus />
                        <div className="add-smiles">
                            <span title="add icon" onClick={() => setShowEmojis(!showEmojis)}><i className="lar la-laugh"></i></span>
                        </div>
                        {showEmojis &&
                            <div className="smiles-bunch active">
                                <div >
                                    {chosenEmoji ? (
                                        <span>You chose: {chosenEmoji.emoji}</span>
                                    ) : (
                                        <span>No emoji Chosen</span>
                                    )}

                                    <Picker onEmojiClick={onEmojiClick} disableSearchBar={'true'} pickerStyle={{ height: "310px" }} />
                                </div>
                            </div>
                        }
                        <div className="stickers" style={{ zIndex: '1' }}>
                            <img src="/assets/images/sticker-svgrepo-com.svg" style={{ height: '19px' }} alt="" onClick={() => setShowSticker(!showSticker)} /></div>
                        {showSticker &&
                            <div className="stickers-bunch active">
                                <div style={{ height: '326px', overflowX: 'hidden', overflowY: 'scroll' }} >
                                    {chosenSticker ? (
                                        <span>You chose: {chosenSticker.sticker}</span>
                                    ) : (
                                        <span>No Gif Chosen</span>
                                    )}
                                    <Stickers />
                                    {/* <PickerGif onSelected={onGiphySelect}  pickerStyle={{ height: "210px" }} /> */}
                                </div>
                            </div>
                        }
                        <div className="gifs">
                            <img src="/assets/images/gif.svg" alt="" onClick={() => setShowGifs(!showGifs)} /></div>
                        {showGifs &&
                            <div className="gifs-bunch active">
                                <div style={{ height: '326px', overflowX: 'hidden', overflowY: 'scroll' }} >
                                    {chosenGif ? (
                                        <span>You chose: {chosenGif.gif}</span>
                                    ) : (
                                        <span>No Gif Chosen</span>
                                    )}
                                    <Giphy />
                                    {/* <PickerGif onSelected={onGiphySelect}  pickerStyle={{ height: "210px" }} /> */}
                                </div>
                            </div>
                        }
                        <div className="btncmnt">
                            <button type="button" onClick={() => handlePostingComment(props.post.id)} style={{ color: 'blue', padding: '1px', }}>

                                <img src="/assets/images/ei_camera.svg" alt="" style={{ padding: "3px", marginTop: "6px", borderStyle: "2px solid black", paddingRight: "0px" }} />
                                {/* </div> */}
                                {/* <svg className="svg-icon" viewBox="0 0 20 20">
                            <path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
                          </svg> */}
                            </button>
                        </div>
                    </Form>
                </div>
            </li>
        )
    }
    const dropdwonOpen = () =>{
        if($('.reel-comment-section .dropdown.more-btn.comnt-more-opt').hasClass('open')){
            $('.reel-comment-section .dropdown.more-btn.comnt-more-opt').removeClass('open')
        }else
        $('.reel-comment-section .dropdown.more-btn.comnt-more-opt').addClass('open')
    }
    const commentList = (comment) => {
        let time = moment(comment.published, "DD MMMM YYYY hh:mm:ss").fromNow()

        return (
            <li key={comment.id}>
                <div className="comet-avatar">
                    <img src={fileStorage.baseUrl + comment.user.profilePicturePath} alt="" />
                </div>
                <div style={{ width: '100%' }}>
                    <div className="we-comment-cont" >
                        <div style={{ paddingTop: '2px', display: 'table-cell' }}>
                            <div>
                                <div className="we-comment">
                                    <div className="coment-head">
                                        <h5><a href={`/profile/${comment.user.email}`} title={`${comment.user.email}`}>{`${comment.user.firstName} ${comment.user.lastName}`}</a></h5>
                                        <span>{`${comment.published ? time : ''}`}</span>
                                    </div>
                                    <p>{`${comment.content}`}</p>
                                </div>
                                <div style={{ paddingTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <a className="we-reply" title="Like" onClick={() => likeComment(comment)} >
                                            {checkIfLiked(comment) ?
                                                <i className="fas fa-star" style={{ color: 'rgb(216, 53, 53)' }}></i>
                                                : <i className="far fa-star" ></i>
                                            }
                                        </a>
                                        <a className="we-reply" title="Reply" onClick={() => replyInputClicked(comment.id)}>Reply</a>
                                    </div>
                                    {(comment.user.id === user.id) ?

                                        <a className="deleteComment" href="#!" onClick={() => handleDeleteComment(comment)}><i style={{ color: 'gray', fontSize: '13px', paddingRight: '10px' }} className="fa fa-trash" /></a>
                                        :
                                        <></>
                                    }
                                </div>
                            </div>
                            {comment.numberOfReplies > 0
                                ? (activeCommentId === comment.id)
                                    ? replyListShowFlag === false
                                        ? <div className='reply-count' onClick={() => replyClicked(comment.id)}>{comment.numberOfReplies + ''} Replies </div>
                                        : null
                                    : <div className='reply-count' onClick={() => replyClicked(comment.id)}>{comment.numberOfReplies + ''} Replies </div>
                                : null}
                        </div>
                        {(comment.user.id === user.id) &&
                            <div className="dropdown more-btn comnt-more-opt">
                                <button className="drp-btn dropdown-toggle " type="button" data-toggle="dropdown" style={{ background: "transparent", border: "none" }} onClick={dropdwonOpen}>
                                    <i style={{ float: "right", fontSize: 20, height: '10px' }} className="las la-ellipsis-v" ></i>
                                    {/* <span className="caret"></span> */}
                                </button>
                                <ul className="dropdown-menu">
                                    <li ><a href={""} onClick={(e) => editComment(e, comment.id)}>Edit </a></li>
                                </ul>
                            </div>
                        }


                    </div>
                    {
                (activeCommentId===comment.id)?
                <ReelReplyCommentComponent  comment={comment} showReplyInput={replyCommentFlag} replyListFlag={replyListShowFlag} activeCommentId={activeCommentId}/>
                :null
            }
                </div>

            </li>
        )
    }
    return (
        reel &&

        <div className="coment-area">
            <ul className="we-comet">
                {commentInput()}
                {/* {showComment && <PostComponentBoxComponent post={post} setRefresh={setRefresh} />} */}
                {
                    comments && comments.length > 0 && comments.map(comment => 
                        commentList(comment)
                    )}
            </ul>
        </div>
    );
}

