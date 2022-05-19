import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import ReplyCommentComponent from './ReplyCommentComponent';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import moment from 'moment'
import PostComponentBoxComponent from "./PostCommentBoxComponent";
import { TramRounded } from '@mui/icons-material';

export default function CommentPostComponent({ post, setRefresh }) {
  const { user } = useContext(UserContext)

  const [showComment, setShowComment] = useState(true);
  const [likedFlag, setLikedFlag] = useState(false);

  const [comments, setComments] = useState([])
  const [likedCommentId, setLikedCommentId] = useState()
  const [replyCommentFlag, setReplyCommentFlag] = useState(false)
  const [replyCommentId, setReplyCommentId] = useState(false)
  const [replies, setReplies] = useState([])
  const [repliesShowId, setRepliesShowId] = useState(true)
  const [editCommentId,setEditCommentId]  = useState()
  const [editCommentFlag,setEditCommentFlag]  = useState(false)
  const [reactions,setReactions] = useState([])
  const [editReplyId,setEditReplyId]  = useState()
  const [editReplyFlag,setEditReplyFlag]  = useState(false)

  const handleDeleteComment = (commentid) => {
    PostService.deleteComment(commentid).then(res => {
      console.log(res.status)
      setRefresh(res.data)
    })
  }
  const handleDeleteReply = (rid,commentId) => {
    PostService.deleteReply(rid).then(res => {
      console.log(res.status)
      setRefresh(res.data)
      getReplies(commentId)
    })
  }
  const sortComment = () => {
    console.log(user.id, post.id)
    PostService.getCommentsForPosts(user.id, post.id).then((res) => {

      setComments(res.data)
    })

    if (comments) {

      // const comments = [...comments]
      comments.sort(function (a, b) {
        var dateA = new Date(a.published), dateB = new Date(b.published);
        return dateA - dateB;
      });

      setComments(comments)
      console.log(comments)

    }
  }
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
  useEffect(() => {
    sortComment()
    // if(comments) {getReplies();}
  }, [post])

  const date1 = (comment) => {
    let date = new Date(comment.published);
    let today = new Date();
    var Difference_In_Time = today.getTime() - date.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if ((Difference_In_Days % 1) > 0.5) {
      let d = (Difference_In_Days % 1) > 0.5
      console.log(Difference_In_Days, d, Math.round(Difference_In_Days - 1))

    }
    // const month = date.toLocaleString('default', { month: 'long' })
  }
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
  const getReplies = (commentId) => {
    PostService.getReplies(commentId).then((res) => {
      console.log(res.data)
      setReplies(res.data)
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
  const likeComment = async (comment) => {
      await PostService.LikeComment(user.id, comment.id,{}).then((res) => {
        console.log(res.data)
        if(res.data.reactions&&res.data.reactions.length>0){
           res.data.reactions.map((rea)=>{
            if(rea.user.id===user.id){
              setLikedCommentId(comment.id)
              console.log('hiiiii')
            }
          })
        }else{
          setLikedCommentId(null)
          console.log('id')

        }
        // getReplies(res.data)
        // checkIfLiked(comment)
      })
  }
  const likeReply = async (reply) => {
    // console.log(checkIfLiked(reply))
    // if (checkIfLiked(reply)) {
    //   await setLikedReplyId(null)

      let params = await {}


      await PostService.LikeReply(user.id, reply.id, params).then((res) => {
        console.log(res.data)
        setReplies(res.data)
      })
    // } else {
    //   //  await handleLikePost(post.id);
    //   await setLikedreplyId(replyt.id)
    //   let params = await { is_replyt_liked: true }


    //   await PostService.LikeReply(user.id, reply.id, params).then((res) => {
    //     console.log(res.data)
    //     setreplies(res.data)
    //   })

    // }
  }
  const replyClicked = (commentId) => {
    setRepliesShowId(commentId)
    // setReplyCommentId(commentId)
    getReplies(commentId)
  }
  const editComment = (e,commentId)=>{
    e.preventDefault();
    console.log(commentId)
    setEditCommentId(commentId)
    setEditCommentFlag(true)
  }
  const editReply = (e,replyId)=>{
    e.preventDefault();
    console.log(replyId)
    setEditReplyId(replyId)
    setEditReplyFlag(true)
  }
  const commentDisplay = (comment) => {
    let time = moment(comment.published, "DD MMMM YYYY hh:mm:ss").fromNow()
    return (
      editCommentId===comment.id&&editCommentFlag?
      <PostComponentBoxComponent post={post} setRefresh={setRefresh} editComment={comment} checkEditComment={checkEditComment}/>
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
                    <a className="we-reply" title="Like" onClick={() => likeComment(comment)} style={checkIfLiked(comment)||(likedCommentId===comment.id)?{color:'red'}:{}}>Like</a>
                    <a className="we-reply" title="Reply" onClick={() => { setReplyCommentId(comment.id); setReplyCommentFlag(!replyCommentFlag) }}>Reply</a>
                  </div>
                  {(comment.user.id === user.id) ?

                    <a className="deleteComment" href="#!" style={{}} onClick={() => handleDeleteComment(comment.id)}><i style={{ color: 'gray', fontSize: '13px', paddingRight: '10px' }} className="fa fa-trash" /></a>
                    :
                    <></>
                  }
                </div>
              </div>
            {comment.numberOfReplies > 0 ? <div className='reply-count' onClick={() => replyClicked(comment.id)}>{comment.numberOfReplies + ''} Replies </div> : null}
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
              replyCommentFlag && replyCommentId === comment.id ?

                <ReplyCommentComponent comment={comment} setRefresh={setRefresh}  setReplyCommentFlag={setReplyCommentFlag}/>
                : null

            }
          {
            replies && replies.length > 0 ? (
              <>
                {comment.id === repliesShowId &&
                  <ul style={{ marginLeft: '0px', marginTop: '10px' }}>
                    {replies.map(reply => {
                      return (
                        editReplyId===reply.id&&editReplyFlag?
                        <ReplyCommentComponent comment={comment} setRefresh={setRefresh}  setReplyCommentFlag={setReplyCommentFlag} editReply={reply} checkEditReply={checkEditReply}/>
                        :<li key={reply.id} className="post-comment reply-comment d-flex mb-0" >
                          <div className="comet-avatar">
                            <img src={fileStorage.baseUrl + reply.user.profilePicturePath} alt="" />
                          </div>
                          <div style={{ paddingTop: '2px', display: 'table-cell' }}>
                            <div className="we-comment">
                              <div className="coment-head">
                                <h5><a href={`/profile/${reply.user.email}`} title={`${reply.user.email}`}>{`${reply.user.firstName} ${reply.user.lastName}`}</a></h5>
                                <span>{moment(reply.published, "DD MMMM YYYY hh:mm:ss").fromNow()}</span>
                              </div>
                              <p>{`${reply.content}`}</p>
                            </div>
                            <div style={{ paddingTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
                              <div>
                                <a className="we-reply" title="Like" onClick={() => likeReply(reply)} style={checkIfLiked(reply)?{color:'red'}:{}} >Like</a>
                                {/* <a className="we-reply" title="Reply" onClick={() => { setReplyCommentId(comment.id); setReplyCommentFlag(!replyCommentFlag) }}>Reply</a> */}
                              </div>
                              {(reply.user.id === user.id) ?

                                <a className="deleteComment" href="#!" style={{}} onClick={() => handleDeleteReply(reply.id,comment.id)}><i style={{ color: 'gray', fontSize: '13px', paddingRight: '10px' }} className="fa fa-trash" /></a>
                                :
                                <></>
                              }
                            </div>
                            
                          </div>
                          {(reply.user.id === user.id) &&
                              <div className="dropdown more-btn comnt-more-opt">
                                <button className="drp-btn dropdown-toggle " type="button" data-toggle="dropdown" style={{ background: "transparent", border: "none" }}>
                                  <i style={{ float: "right", fontSize: 20, height: '10px' }} className="las la-ellipsis-v" ></i>
                                  {/* <span className="caret"></span> */}
                                </button>
                                <ul className="dropdown-menu">
                                  <li ><a href={""} onClick={(e)=>editReply(e,reply.id)}>Edit </a></li>
                                </ul>
                              </div>
                            }
                          
                        </li>
                      )
                    }
                    )}
                  </ul>
                }
              </>
            )
          :null}
        </div>

      </li>
    )
  }
  return (
    post &&
    (showComment &&
      <>
        {comments && comments.length > 0 && comments.map(comment => {
          return commentDisplay(comment)
        })
        }
      </>
    )
  );
}