import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import ReplyCommentComponent from './ReplyCommentComponent';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import moment from 'moment';
import PostComponentBoxComponent from "./PostCommentBoxComponent";
import { TramRounded } from '@mui/icons-material';

export default function CommentPostComponent(props) {
  const { user } = useContext(UserContext)

  const [likedFlag, setLikedFlag] = useState(false);

  const [comment, setComment] = useState(props.comment)
  const [activeCommentId, setActiveCommentId] = useState()

  const [likedCommentId, setLikedCommentId] = useState()
  const [likedCommentIdArr, setLikedCommentIdArr] = useState([])
  const [replyListShowFlag, setReplyListShowFlag] = useState(false)

  
  const [replyCommentFlag, setReplyCommentFlag] = useState(false)
  const [replyCommentId, setReplyCommentId] = useState(false)
  const [replies, setReplies] = useState([])
  const [repliesShowId, setRepliesShowId] = useState(true)
  const [editCommentId,setEditCommentId]  = useState()
  const [editCommentFlag,setEditCommentFlag]  = useState(false)
  const [reactions,setReactions] = useState([])
  const [editReplyId,setEditReplyId]  = useState()
  const [editReplyFlag,setEditReplyFlag]  = useState(false)

  
 
  // const sortComment = async () => {
  //   // console.log(user.id, post.id)
  //   await PostService.getCommentsForPosts(user.id, post.id).then((res) => {

  //     setComments(res.data)
  //     // console.log(showComment , comments)
  //     if (comments && comments.length>0) {
  //       console.log(showComment , comments)
  
  //       // const comments = [...comments]
  //       comments.sort(function (a, b) {
  //         var dateA = new Date(a.published), dateB = new Date(b.published);
  //         return dateA - dateB;
  //       });
  //       setComments(comments)
  //     }
  //   })

  // }
  const checkEditComment = (e)=>{
    console.log(e)
    setEditCommentFlag(e)
    console.log(editCommentFlag,'edit')
  }
  
  const checkEditReply = (e)=>{
    console.log(e)
    setEditReplyFlag(e)
    console.log(editCommentFlag,'edit')
  }
  useEffect( () => {
    // console.log(props.comments)
    setComment(props.comment)
    // console.log(comments)
    // await sortComment()
    // await getLikedComments()
    // if(comments) {getReplies();}
  }, [props.comments])
 
  // const date1 = (comment) => {
  //   let date = new Date(comment.published);
  //   let today = new Date();
  //   var Difference_In_Time = today.getTime() - date.getTime();
  //   var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  //   if ((Difference_In_Days % 1) > 0.5) {
  //     let d = (Difference_In_Days % 1) > 0.5
  //     console.log(Difference_In_Days, d, Math.round(Difference_In_Days - 1))

  //   }
  //   // const month = date.toLocaleString('default', { month: 'long' })
  // }
  // const likeComment = async (e, cid) => {
  //   await e.preventDefault();
  //   await setLikedFlag(!likedFlag)
  //   let params;
  //   if(likedCommentId===cid){
  //     setLikedCommentId(null)
  //     params = await { is_comment_liked: false }

  //   }else{

  //   await setLikedCommentId(cid)
  //     params = await { is_comment_liked: true  }

  //   }
  //   await PostService.LikeComment(user.id, cid, params).then((res) => {
  //     console.log(res.data)
  //   })
  // }
  const getReplies = async (commentId) => {
    await PostService.getReplies(user.id,commentId).then((res) => {
      setReplies(res.data)
      // console.log(res.data.reactions)
      
    })
    // await console.log(likedCommentIdArr)
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
  const handleDeleteComment = (comment) => {
    props.handleDeleteComment(comment,props.post)
  }
  const likeComment = async (comment) => {
    props.likeComment(comment)

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
  const commentDisplay = (comment) => {
    let time = moment(comment.published, "DD MMMM YYYY hh:mm:ss").fromNow()
    console.log('hhhh')
    return (
      editCommentId===comment.id&&editCommentFlag?
      <PostComponentBoxComponent post={props.post} setRefresh={props.setRefresh} editComment={comment} checkEditComment={checkEditComment}/>
      :
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
                      {checkIfLiked(comment)?
                      <i class="fas fa-star" style={{color:'rgb(216, 53, 53)'}}></i>
                      :<i class="far fa-star" ></i>
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
              ?(activeCommentId===comment.id)
                ?replyListShowFlag===false 
                  ? <div className='reply-count' onClick={() => replyClicked(comment.id)}>{comment.numberOfReplies + ''} Replies </div> 
                  : null
                :<div className='reply-count' onClick={() => replyClicked(comment.id)}>{comment.numberOfReplies + ''} Replies </div>
              : null}
            </div>
            {(comment.user.id === user.id) &&
              <div className="dropdown more-btn comnt-more-opt">
                <button className="drp-btn dropdown-toggle " type="button" data-toggle="dropdown" style={{ background: "transparent", border: "none" }}>
                  <i style={{ float: "right", fontSize: 20, height: '10px' }} className="las la-ellipsis-v" ></i>
                  {/* <span className="caret"></span> */}
                </button>
                <ul className="dropdown-menu">
                  <li ><a href={""} onClick={(e)=>editComment(e,comment.id)}>Edit </a></li>
                </ul>
              </div>
            }

            
          </div>
          {
            (activeCommentId===comment.id)?
              <ReplyCommentComponent  comment={comment} showReplyInput={replyCommentFlag} replyListFlag={replyListShowFlag} activeCommentId={activeCommentId}/>
            :null
          }
        </div>

      </li>
    )
  }
  return (
    
     
        comment&&
        commentDisplay(comment) 
       
  
  );
}