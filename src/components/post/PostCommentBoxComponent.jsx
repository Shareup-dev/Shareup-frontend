import React, { useState, useEffect, useContext, useRef } from 'react';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import CommentsService from '../../services/CommentsService';

import Form from 'react-bootstrap/Form';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import Picker from 'emoji-picker-react';
import PickerGif from 'react-giphy-picker';
import Giphy from "../Giphy";
import Stickers from "../Stickers";
import $ from 'jquery'
import CommentPostComponent from "./CommentPostComponent";
import  { handleSendNotification } from "../dashboard/ShareupInsideHeaderComponent";

export default function PostComponentBoxComponent(props) {

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
  const [post, setPost] = useState(props.post);



  useEffect(() => {
      sortComment()
  }, [props.post]);

  const sortComment = async (propPost) => {
    let postId = {}
    if(propPost) { 
      postId = propPost
    }else{
      postId = post.id
    }
    await PostService.getCommentsForPosts(user.id, postId).then((res) => {

      setComments(res.data)
      // if (comments && comments.length>0) {

      //   // const comments = [...comments]
      //   comments.sort(function (a, b) {
      //     var dateA = new Date(a.published), dateB = new Date(b.published);
      //     return dateA - dateB;
      //   });
      //   setComments(comments)
      // }
    })

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
    setCommentContent(event.target.value)
  }

  const handlePostingComment = (postid) => {
    if (commentContent === "") {
      return null;
    } else {
      let comment = {}
      comment.content = commentContent;
      const formData = new FormData();
      formData.append("content", commentContent);
      if (props.editComment) {
        PostService.editCommentForPosts(props.editComment.id, formData).then(res => {
          props.checkEditComment(false)
          props.setRefresh(res.data)
          setCommentContent("")
        })
      } else {
        PostService.addComment(user.id, postid, comment).then(res => {
          sortComment()
          // props.setRefresh(res.data)
          setCommentContent("")
        })
      }
    }
  }
  const handleDeleteComment = async (comment,post) => {
    await CommentsService.deleteComment(comment.id).then((res) => {
      sortComment(post.id)
   

      // props.setRefresh(res.data)
    })

  }
  const likeComment = async (comment,reaction) => {


    await CommentsService.LikeComment(user.id, comment.id, reaction).then((res) => {
      console.log("like comment")
      console.log(res.status) 
     if(res.status ===201){
      console.log("i am 201")
       handleSendNotification(res.data.user.id,'Liked your comment',user.firstName,user.lastName,user.email,"comment",comment.id)
      }else if(res.status ===200){
        console.log("i am 200")
      }
      sortComment()
      // getReplies(res.data)
      // checkIfLiked(comment)
    })
  }

  const commentInput = () => {
    return (
      <li className="post-comment">
        <div className="comet-avatar">
          <img src={fileStorage.baseUrl + user.profilePicturePath} alt="" />
        </div>
        <div className="post-comt-box">
          <Form>
            <textarea rows={2} placeholder={"Write a comment.."} name="comment" value={commentContent} ref={ref} onKeyPress={(e) => e.key === 'Enter' && handlePostingComment(props.post.id)} onChange={handleCommentContent} />
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
  return (
    post &&

    <div className="coment-area">
      <ul className="we-comet">
        {commentInput()}
        {/* {showComment && <PostComponentBoxComponent post={post} setRefresh={setRefresh} />} */}
        {props.showComment && 
          comments && comments.length > 0 && comments.map(comment => {
          return <CommentPostComponent post={post} comment={comment} comments={comments} setRefresh={props.setRefresh}  likeComment={likeComment} handleDeleteComment={handleDeleteComment} />
        })}
      </ul>
    </div>
  );
}



