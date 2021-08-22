import React, { useState, useEffect, useContext, useRef  } from 'react';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import Form from 'react-bootstrap/Form';

export default function PostComponentBoxComponent({post, setRefresh}) {
    const { user } = useContext(UserContext)
    const ref = useRef(null);

    const [commentContent, setCommentContent] = useState("");
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false)

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
    

    return(
        post &&
        <li className="post-comment">
                <div className="comet-avatar">
                  <img src={user.profilePicturePath}  alt="" />
                </div>
                <div className="post-comt-box">
                  <Form>

                    <textarea rows={2} placeholder="write something" name="comment" value={commentContent} ref={ref} onKeyPress={(e) => e.key === 'Enter' && handlePostingComment(post.id)} onChange={handleCommentContent} />

                    
                    <div className="add-smiles">

                      <span title="add icon" onClick={() => setShowEmojis(!showEmojis)}><i class="lar la-laugh"></i></span>
                    </div>
                    {
                      showEmojis && <div className="smiles-bunch active">
                         <i class="em em---1"></i>
																<i class="em em-smiley"></i>
																<i class="em em-anguished"></i>
																<i class="em em-laughing"></i>
																<i class="em em-angry"></i>
																<i class="em em-astonished"></i>
																<i class="em em-blush"></i>
																<i class="em em-disappointed"></i>
																<i class="em em-worried"></i>
																<i class="em em-kissing_heart"></i>
																<i class="em em-rage"></i>
																<i class="em em-stuck_out_tongue"></i>
                      {/* <Picker onEmojiClick={onEmojiClick} /> */}
                      {/* <h1>hi</h1> */}
                      </div>
                    }
                      <div className="gif"><img style={{objectFit:'cover'}} src="/assets/images/pic.svg" alt="" /></div>
                      <div className="cam"><img  src="/assets/images/gif.svg" alt="" /></div>
                      {/* <div className="sticker"><i class="lar la-sticky-note"></i></div> */}

                    {/*<div className="btncmnt">

                       <button type="button" onClick={() => handlePostingComment(post.id)} style={{ color: 'blue', padding: '5px' }}><svg class="svg-icon" viewBox="0 0 20 20">
                        <path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path>
                      </svg></button> 
                    </div>*/}
                  </Form></div>
              </li>
    );
}



const handle = () => console.log('Enter pressed');