import React, { useState, useEffect, useContext, useRef } from 'react';
import UserContext from '../../contexts/UserContext';
// import PostService from '../../services/PostService';
import CommentsService from '../../services/CommentsService';

import Form from 'react-bootstrap/Form';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import Picker from 'emoji-picker-react';
import PickerGif from 'react-giphy-picker';
import Giphy from "../Giphy";
import Stickers from "../Stickers";
import $ from 'jquery'
import moment from 'moment';
import  { handleSendNotification } from "../dashboard/ShareupInsideHeaderComponent";
export default function ReplyCommentComponent(props) {
    const { user } = useContext(UserContext)
    const ref = useRef(null);
    const [replyContent, setReplyContent] = useState("");
    const [showEmojis, setShowEmojis] = useState(false)
    const [showGifs, setShowGifs] = useState(false)
    const [showSticker, setShowSticker] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [repliesShowFlag,setRepliesShowFlag] = useState()
    const [chosenGif, setChosenGif] = useState(null);
    const [chosenSticker, setSticker] = useState(null);
    const [replyCommentId, setReplyCommentId] = useState(false)
    const [replies, setReplies] = useState([])
    const [repliesShowId, setRepliesShowId] = useState(true)
    const [editReplyId,setEditReplyId]  = useState()
    const [editReplyFlag,setEditReplyFlag]  = useState(false)
    const [replyListFlag,setReplyListFlag] = useState(false)
    const [showReplyInput,setShowReplyInput] = useState(false)

// const[comment,setComment] = useState()


    const onEmojiClick = (event, emojiObject) => {
        const cursor = ref.current.selectionStart;
        const start = replyContent.substring(0, cursor)
        const end = replyContent.substring(cursor)
        const text = start + emojiObject.emoji + end;

        setChosenEmoji(emojiObject);
        setReplyContent(text);
        ref.current.focus();
  };
  
  
 const handleReplyContent = (event) => {
    setReplyContent(event.target.value)
  }

  const handleReplyComment = () => {
    if (replyContent === "") {
      return null;
    }else{
        const replyCon = { content: replyContent }
        const formData = new FormData();
      formData.append("content", replyContent);
        if(editReplyId){
          CommentsService.editReplyForComment(editReplyId,replyCon).then(res=>{
              setEditReplyFlag(false)
              getReplies(props.comment.id)
              setReplyContent("")
            })
        }else{
            CommentsService.replyComment(user.id, props.comment.id, replyCon).then(res => {
                // console.log(res.status)
                // setReplyCommentFlag(false)
                getReplies(props.comment.id)
                setReplyContent("")
                setReplyListFlag(true)
            })
        }
    }
    
    // await PostService.replyComment(user.id, comment.id, reply).then(res => {
     
    //   setReplyCommentFlag(false)
    //   setreplyContent("")
    //   setRefresh(res.data)
    // })
  }
//   const getReplies = (commentId)=>{
//     PostService.getReplies(commentId).then((res)=>{
//         setReplies(res.data)
//     })
//   }
    const likeReply = async (reply) => {
        let params = await {}
        await CommentsService.LikeReply(user.id, reply.id, params).then((res) => {
            console.log("like reply")
            console.log(res.data)
            handleSendNotification(res.data.user.id,'Liked your reply',user?.firstName,user?.lastName,user?.email)
            getReplies(props.comment.id)
      })
   }
    const handleDeleteReply = (rid,commentId) => {
        CommentsService.deleteReply(rid).then(res => {
        console.log(res.status)
        // props.setRefresh(res.data)
        getReplies(commentId)
        })
    }
    const getReplies = async (commentId) => {
        await CommentsService.getReplies(user.id,commentId).then((res) => {
            setReplies(res.data)
        
        })
   }
   const checkEditReply = (e)=>{
        setEditReplyFlag(e)
   }
    const editReply = async (e,reply)=>{
        await e.preventDefault();
        await setEditReplyId(reply.id)
        // if(editReplyId===reply.id){
            await setEditReplyFlag(true)
            await setReplyContent(reply.content)
            await setShowReplyInput(false)
        // }
    }
    const checkIfLiked = (reply) => {
        if (reply.reactions) {
            const result = reply.reactions.filter(
            (reaction) => reaction.user.id == user.id
            );
            if (result.length > 0) {
            // setLikedCommentId(comment.id)
            return true;
            }
            return false;
        }
    }
    const cancelEdit = () =>{
        setEditReplyFlag(false)
        setReplyContent("")
        setEditReplyId()
    }
    useEffect (()=>{
        setShowReplyInput(props.showReplyInput)
        setReplyListFlag(props.replyListFlag)
    },[props.replyListFlag,props.showReplyInput])
    useEffect(() => {
        getReplies(props.comment.id)
       
    //   getReplies(comment.id)
    }, [props]);

    const replyInput = (reply) =>{
        return(
            
        <li className="post-comment reply-comment">
        <div className="comet-avatar">
            <img src={fileStorage.baseUrl + user.profilePicturePath} alt="" />
        </div>
        <div className="post-comt-box">
            <Form>
            <textarea rows={2} placeholder={"Reply to "+props.comment.user.firstName+' '+props.comment.user.lastName} name="comment" ref={ref} value={replyContent} onKeyPress={(e) => e.key === 'Enter' && handleReplyComment()} onChange={handleReplyContent} />
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
                <button type="button" onClick={() => handleReplyComment()} style={{ color: 'blue', padding: '1px', }}>
                <img src="/assets/images/ei_camera.svg" alt="" style={{ padding: "3px", marginTop: "6px", borderStyle: "2px solid black" , paddingRight: "0px"}} />
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
    return (
      <>



            {
              showReplyInput ?
                replyInput()
                : null

            }
            {replyListFlag?  
                replies && replies.length > 0 ? 
                <ul style={{ marginLeft: '0px', marginTop: '0px' }}>
                    {replies.map(reply => {
                        return (
                            editReplyId===reply.id&&editReplyFlag
                            ? <div>{replyInput(reply)}<a onClick={cancelEdit} className="edit-cancel-text">cancel</a></div>
                            : <li key={reply.id} className="post-comment reply-comment d-flex mb-0" >
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
                                        <a className="we-reply" title="Like" onClick={() => likeReply(reply)} >
                                        {checkIfLiked(reply)?
                                            <i class="fas fa-star" style={{color:'rgb(216, 53, 53)'}}></i>
                                            :<i class="far fa-star" ></i>
                                        }
                                        </a>
                                        {/* <a className="we-reply" title="Reply" onClick={() => { setReplyCommentId(comment.id); setReplyCommentFlag(!replyCommentFlag) }}>Reply</a> */}
                                    </div>
                                    {(reply.user.id === user.id) ?

                                        <a className="deleteComment" href="#!" style={{}} onClick={() => handleDeleteReply(reply.id,props.comment.id)}><i style={{ color: 'gray', fontSize: '13px', paddingRight: '10px' }} className="fa fa-trash" /></a>
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
                                    <li ><a href={""} onClick={(e)=>editReply(e,reply)}>Edit Reply</a></li>
                                    </ul>
                                </div>
                                }
                            
                            </li>
                        )
                    })}
                </ul>
                    
                
            :null
            :null}
      </>
      
    
  );
}



