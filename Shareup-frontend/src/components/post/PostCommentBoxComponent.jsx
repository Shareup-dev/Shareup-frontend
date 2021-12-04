import React, { useState, useEffect, useContext, useRef } from 'react';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import Form from 'react-bootstrap/Form';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import Picker from 'emoji-picker-react';
import PickerGif from 'react-giphy-picker';
import Giphy from "../Giphy";
import Stickers from "../Stickers";
import $ from 'jquery'







export default function PostComponentBoxComponent({ post, setRefresh }) {



  
  const { user } = useContext(UserContext)
  const ref = useRef(null);

  const [commentContent, setCommentContent] = useState("");
  const [showEmojis, setShowEmojis] = useState(false)
  const [showGifs, setShowGifs] = useState(false)

  
                  



  const [showSticker, setShowSticker] = useState(false)

  const [chosenEmoji, setChosenEmoji] = useState(null);


  const onEmojiClick = (event, emojiObject) => {
    const cursor = ref.current.selectionStart;
    const start = commentContent.substring(0, cursor)
    const end = commentContent.substring(cursor)
    const text = start + emojiObject.emoji + end;

    setChosenEmoji(emojiObject);
    setCommentContent(text);
    ref.current.focus();
  };

  const [chosenGif, setChosenGif] = useState(null);


  const [chosenSticker, setSticker] = useState(null);




  const handleCommentContent = (event) => {
    console.log(event.target.value)
    setCommentContent(event.target.value)
  }

  const handlePostingComment = (postid) => {
    if (commentContent === "") {
      return null;
    }
    const comment = { content: commentContent }
    PostService.addComment(user.id, postid, comment).then(res => {
      console.log(res.status)
      setRefresh(res.data)
      setCommentContent("")
    })
  }



 

    

  return (
    post &&
    <li className="post-comment">
      <div className="comet-avatar">
        <img src={fileStorage.baseUrl + user.profilePicturePath} alt="" />
      </div>
      <div className="post-comt-box">
        <Form>

          <textarea rows={2} placeholder="Write a comment.." name="comment" value={commentContent} ref={ref} onKeyPress={(e) => e.key === 'Enter' && handlePostingComment(post.id)} onChange={handleCommentContent} />


          <div className="add-smiles">

            <span title="add icon" onClick={() => setShowEmojis(!showEmojis)}><i class="lar la-laugh"></i></span>
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





<div className="stickers" style={{zIndex:'999'}}>
            <img src="/assets/images/sticker-svgrepo-com.svg"  style={{height:'19px'}} alt="" onClick={() => setShowSticker(!showSticker)} /></div>
          {showSticker &&
            <div className="stickers-bunch active">
              <div style={{ height: '326px', overflowX: 'hidden', overflowY: 'scroll' }} >
                {chosenSticker ? (
                  <span>You chose: {chosenSticker.sticker}</span>
                ) : (
                  <span>No Gif Chosen</span>
                )}
                <Stickers/>
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

            <button type="button" onClick={() => handlePostingComment(post.id)} style={{ color: 'blue', padding: '1px', }}>

              <img src="/assets/images/photoscomment.svg" alt="" style={{  padding: "3px", marginTop: "8px", borderStyle: "2px solid black" }} />
              {/* </div> */}
              {/* <svg class="svg-icon" viewBox="0 0 20 20">
                          <path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
                        </svg> */}
            </button>
          </div>
        </Form></div>
    </li>
  );
}



const handle = () => console.log('Enter pressed');