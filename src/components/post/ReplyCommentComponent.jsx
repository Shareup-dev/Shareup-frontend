import React, { useState, useEffect, useContext, useRef } from "react";
import UserContext from "../../contexts/UserContext";
import PostService from "../../services/PostService";
import CommentsService from "../../services/CommentsService";

import Form from "react-bootstrap/Form";
import settings from "../../services/Settings";
import fileStorage from "../../config/fileStorage";
import Picker from "emoji-picker-react";
import PickerGif from "react-giphy-picker";
import Giphy from "../Giphy";
import Stickers from "../Stickers";
import $ from "jquery";
import moment from "moment";

export default function ReplyCommentComponent(props) {
  const { user } = useContext(UserContext);
  const ref = useRef(null);
  const [replyContent, setReplyContent] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [showGifs, setShowGifs] = useState(false);
  const [showSticker, setShowSticker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [repliesShowFlag, setRepliesShowFlag] = useState();
  const [chosenGif, setChosenGif] = useState(null);
  const [chosenSticker, setSticker] = useState(null);
  const [replyCommentId, setReplyCommentId] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesShowId, setRepliesShowId] = useState(true);
  const [editReplyId, setEditReplyId] = useState();
  const [editReplyFlag, setEditReplyFlag] = useState(false);
  const [replyListFlag, setReplyListFlag] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [likeReaction, setLikeReaction] = useState(null);
  const [showCommentReactions, setShowCommentReactions] = useState(false);
  const [replyID, setreplyID] = useState("");

  const handleShowingCommentReaction = (reply) => {
    setTimeout(function () {
      setShowCommentReactions(true);
    }, 200);
  };

  const handleUnshowingCommentReaction = () => {
    setTimeout(function () {
      setShowCommentReactions(false);
    }, 200);
  };

  const onEmojiClick = (event, emojiObject) => {
    const cursor = ref.current.selectionStart;
    const start = replyContent.substring(0, cursor);
    const end = replyContent.substring(cursor);
    const text = start + emojiObject.emoji + end;

    setChosenEmoji(emojiObject);
    setReplyContent(text);
    ref.current.focus();
  };

  const handleReplyContent = (event) => {
    setReplyContent(event.target.value);
  };

  const handleReplyComment = () => {
    if (replyContent === "") {
      return null;
    } else {
      const replyCon = { content: replyContent };
      const formData = new FormData();
      formData.append("content", replyContent);
      if (editReplyId) {
        CommentsService.editReplyForComment(editReplyId, formData).then(
          (res) => {
            setEditReplyFlag(false);
            getReplies(props.comment.id);
            setReplyContent("");
          }
        );
      } else {
        CommentsService.replyComment(user.id, props.comment.id, replyCon).then(
          (res) => {
            // console.log(res.status)
            // setReplyCommentFlag(false)
            getReplies(props.comment.id);
            setReplyContent("");
            setReplyListFlag(true);
          }
        );
      }
    }

    // await PostService.replyComment(user.id, comment.id, reply).then(res => {

    //   setReplyCommentFlag(false)
    //   setreplyContent("")
    //   setRefresh(res.data)
    // })
  };
  //   const getReplies = (commentId)=>{
  //     PostService.getReplies(commentId).then((res)=>{
  //         setReplies(res.data)
  //     })
  //   }
  const likeReply = async (reply,reaction) => {
    await CommentsService.LikeReply(user.id, reply.id, reaction).then((res) => {
      getReplies(props.comment.id);
    });
  };
    const handleSettingReactions = (reply,reaction) => {
      if (!checkIfLiked(reply)) {
        likeReply(reply, reaction);
      }
    };
      const handleReaction = (reply) => {
      return (
        <>
          {(() => {
            switch (reply?.replyLiked) {
              case "star":
                return (
                  <i
                    className="fas fa-star"
                    style={{
                      fontSize: "15px",
                      color: "#d83535",
                    }}
                  ></i>
                );
              case "smiley":
                return (
                  <i
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    😊
                  </i>
                );
              case "wow":
                return (
                  <i
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    😮
                  </i>
                );
              case "laugh":
                return (
                  <i
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    😂
                  </i>
                );
              case "cry":
                return (
                  <i
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    😭
                  </i>
                );
              case "love":
                return (
                  <i
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    😍
                  </i>
                );
              case "celebrate":
                return (
                  <i
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    🥳
                  </i>
                );
              case "angry":
                return (
                  <i
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    😡
                  </i>
                );
              default:
                return (
                  <i
                    className="fas fa-star"
                    style={{
                      fontSize: "15px",
                      color: "#d83535",
                    }}
                  ></i>
                );
            }
          })()}
        </>
      );
    };

    const handleReplyReactions = (reply) => {
        return (
          <>
            {reply.countOfEachReaction.star > 0 ? (
              <i
                className="fas fa-star"
                style={{ fontSize: "12px", color: "#d83535" }}
              ></i>
            ) : (
              <></>
            )}
            {reply.countOfEachReaction.smiley > 0 ? (
              <i
                style={{
                  fontSize: "12px",
                  paddingRight: "1px",
                }}
              >
                😊
              </i>
            ) : (
              <></>
            )}
            {reply.countOfEachReaction.wow > 0 ? (
              <i
                style={{
                  fontSize: "12px",
                  paddingRight: "1px",
                }}
              >
                😮
              </i>
            ) : (
              <></>
            )}
            {reply.countOfEachReaction.laugh > 0 ? (
              <i
                style={{
                  fontSize: "12px",
                  paddingRight: "1px",
                }}
              >
                😂
              </i>
            ) : (
              <></>
            )}
    
            {reply.countOfEachReaction.cry > 0 ? (
              <i
                style={{
                  fontSize: "12px",
                  paddingRight: "1px",
                }}
              >
                😭
              </i>
            ) : (
              <></>
            )}
            {reply.countOfEachReaction.love > 0 ? (
              <i
                style={{
                  fontSize: "12px",
                  paddingRight: "1px",
                }}
              >
                😍
              </i>
            ) : (
              <></>
            )}
            {reply.countOfEachReaction.celebrate > 0 ? (
              <i
                style={{
                  fontSize: "12px",
                  paddingRight: "1px",
                }}
              >
                🥳
              </i>
            ) : (
              <></>
            )}
            {reply.countOfEachReaction.angry > 0 ? (
              <i
                style={{
                  fontSize: "12px",
                  paddingRight: "1px",
                }}
              >
                😡
              </i>
            ) : (
              <></>
            )}
          </>
        );
      };

  const handleDeleteReply = (rid, commentId) => {
    CommentsService.deleteReply(rid).then((res) => {
      console.log(res.status);
      // props.setRefresh(res.data)
      getReplies(commentId);
    });
  };
  const getReplies = async (commentId) => {
    await CommentsService.getReplies(user.id, commentId).then((res) => {
      setReplies(res.data);
    });
  };
  const checkEditReply = (e) => {
    setEditReplyFlag(e);
  };
  const editReply = async (e, reply) => {
    await e.preventDefault();
    await setEditReplyId(reply.id);
    // if(editReplyId===reply.id){
    await setEditReplyFlag(true);
    await setReplyContent(reply.content);
    await setShowReplyInput(false);
    // }
  };
  const checkIfLiked = (reply) => {
    if (reply?.replyLiked !== "false") {
        return true;
      }
      return false;
    };
  const cancelEdit = () => {
    setEditReplyFlag(false);
    setReplyContent("");
    setEditReplyId();
  };
  useEffect(() => {
    setShowReplyInput(props.showReplyInput);
    setReplyListFlag(props.replyListFlag);
  }, [props.replyListFlag, props.showReplyInput]);
  useEffect(() => {
    getReplies(props.comment.id);

    //   getReplies(comment.id)
  }, [props]);

  const replyInput = (reply) => {
    return (
      <li className="post-comment reply-comment">
        <div className="comet-avatar">
          <img src={fileStorage.baseUrl + user.profilePicturePath} alt="" />
        </div>
        <div className="post-comt-box">
          <Form>
            <textarea
              rows={2}
              placeholder={
                "Reply to " +
                props.comment.user.firstName +
                " " +
                props.comment.user.lastName
              }
              name="comment"
              ref={ref}
              value={replyContent}
              onKeyPress={(e) => e.key === "Enter" && handleReplyComment()}
              onChange={handleReplyContent}
            />
            <div className="add-smiles">
              <span title="add icon" onClick={() => setShowEmojis(!showEmojis)}>
                <i className="lar la-laugh"></i>
              </span>
            </div>
            {showEmojis && (
              <div className="smiles-bunch active">
                <div>
                  {chosenEmoji ? (
                    <span>You chose: {chosenEmoji.emoji}</span>
                  ) : (
                    <span>No emoji Chosen</span>
                  )}

                  <Picker
                    onEmojiClick={onEmojiClick}
                    disableSearchBar={"true"}
                    pickerStyle={{ height: "310px" }}
                  />
                </div>
              </div>
            )}
            <div className="stickers" style={{ zIndex: "1" }}>
              <img
                src="/assets/images/sticker-svgrepo-com.svg"
                style={{ height: "19px" }}
                alt=""
                onClick={() => setShowSticker(!showSticker)}
              />
            </div>
            {showSticker && (
              <div className="stickers-bunch active">
                <div
                  style={{
                    height: "326px",
                    overflowX: "hidden",
                    overflowY: "scroll",
                  }}
                >
                  {chosenSticker ? (
                    <span>You chose: {chosenSticker.sticker}</span>
                  ) : (
                    <span>No Gif Chosen</span>
                  )}
                  <Stickers />
                  {/* <PickerGif onSelected={onGiphySelect}  pickerStyle={{ height: "210px" }} /> */}
                </div>
              </div>
            )}
            <div className="gifs">
              <img
                src="/assets/images/gif.svg"
                alt=""
                onClick={() => setShowGifs(!showGifs)}
              />
            </div>
            {showGifs && (
              <div className="gifs-bunch active">
                <div
                  style={{
                    height: "326px",
                    overflowX: "hidden",
                    overflowY: "scroll",
                  }}
                >
                  {chosenGif ? (
                    <span>You chose: {chosenGif.gif}</span>
                  ) : (
                    <span>No Gif Chosen</span>
                  )}
                  <Giphy />
                  {/* <PickerGif onSelected={onGiphySelect}  pickerStyle={{ height: "210px" }} /> */}
                </div>
              </div>
            )}
            <div className="btncmnt">
              <button
                type="button"
                onClick={() => handleReplyComment()}
                style={{ color: "blue", padding: "1px" }}
              >
                <img
                  src="/assets/images/ei_camera.svg"
                  alt=""
                  style={{
                    padding: "3px",
                    marginTop: "6px",
                    borderStyle: "2px solid black",
                    paddingRight: "0px",
                  }}
                />
              </button>
            </div>
          </Form>
        </div>
      </li>
    );
  };
  return (
    <>
      {showReplyInput ? replyInput() : null}
      {replyListFlag ? (
        replies && replies.length > 0 ? (
          <ul style={{ marginLeft: "0px", marginTop: "0px" }}>
            {replies.map((reply) => {
              return editReplyId === reply.id && editReplyFlag ? (
                <div>
                  {replyInput(reply)}
                  <a onClick={cancelEdit} className="edit-cancel-text">
                    cancel
                  </a>
                </div>
              ) : (
                <li
                  key={reply.id}
                  className="post-comment reply-comment d-flex mb-0"
                >
                  <div className="comet-avatar">
                    <img
                      src={fileStorage.baseUrl + reply.user.profilePicturePath}
                      alt=""
                    />
                  </div>
                  <div style={{ paddingTop: "2px", display: "table-cell" }}>
                    <div style={{ position: "relative" }}>
                      <div className="we-comment">
                        <div className="coment-head">
                          <h5>
                            <a
                              href={`/profile/${reply.user.email}`}
                              title={`${reply.user.email}`}
                            >{`${reply.user.firstName} ${reply.user.lastName}`}</a>
                          </h5>
                          <span>
                            {moment(
                              reply.published,
                              "DD MMMM YYYY hh:mm:ss"
                            ).fromNow()}
                          </span>
                        </div>
                        <p>{`${reply.content}`}</p>
                        <span
                          className="float-right"
                          style={{ fontSize: "10px", paddingRight: "5px" }}
                        >
                          <span>
                                  {handleReplyReactions(reply)}{" "}
                                  {reply.numberOfReaction}
                                </span>
                        </span>
                      </div>
                      {replyID === reply.id ? (
                        <>
                          {showCommentReactions && (
                            <div
                              onMouseEnter={handleShowingCommentReaction}
                              onMouseLeave={handleUnshowingCommentReaction}
                              className="reaction-bunch active"
                            >
                              <img
                                src={"../assets/images/gif/smiley.gif"}
                                onClick={() => handleSettingReactions(reply,"smiley")}
                              />
                              <img
                                src={"../assets/images/gif/wow.gif"}
                                onClick={() => handleSettingReactions(reply,"wow")}
                              />
                              <img
                                src={"../assets/images/gif/laughing.gif"}
                                onClick={() => handleSettingReactions(reply,"laugh")}
                              />
                              <img
                                src={"../assets/images/gif/crying.gif"}
                                onClick={() => handleSettingReactions(reply,"cry")}
                              />
                              <img
                                src={"../assets/images/gif/love.gif"}
                                onClick={() => handleSettingReactions(reply,"love")}
                              />
                              <img
                                src={"../assets/images/gif/angry.gif"}
                                onClick={() => handleSettingReactions(reply,"angry")}
                              />
                              <img
                                src={"../assets/images/gif/celebrate.gif"}
                                onClick={() => handleSettingReactions(reply,"celebrate")}
                              />
                            </div>
                          )}
                        </>
                      ) : null}
                      <div
                        style={{
                          paddingTop: "5px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <a
                            className="we-reply"
                            title="Like"
                            onClick={() => likeReply(reply,"star")}
                          >
                            {checkIfLiked(reply) ? (
                              <>
                                <span
                                  className="like"
                                  data-toggle="tooltip"
                                  title=""
                                >
                                  {handleReaction(reply)}
                                </span>
                              </>
                            ) : (
                              <span
                                className="dislike"
                                onMouseEnter={() => {
                                  setreplyID(reply.id);
                                  handleShowingCommentReaction();
                                }}
                                onMouseLeave={handleUnshowingCommentReaction}
                              >
                                <i className="far fa-star"></i>
                              </span>
                            )}
                          </a>
                        </div>
                        {reply.user.id === user.id ? (
                          <a
                            className="deleteComment"
                            href="#!"
                            style={{}}
                            onClick={() =>
                              handleDeleteReply(reply.id, props.comment.id)
                            }
                          >
                            <i
                              style={{
                                color: "gray",
                                fontSize: "13px",
                                paddingRight: "10px",
                              }}
                              className="fa fa-trash"
                            />
                          </a>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>

                  {reply.user.id === user.id && (
                    <div className="dropdown more-btn comnt-more-opt">
                      <button
                        className="drp-btn dropdown-toggle "
                        type="button"
                        data-toggle="dropdown"
                        style={{ background: "transparent", border: "none" }}
                      >
                        <i
                          style={{
                            float: "right",
                            fontSize: 20,
                            height: "10px",
                          }}
                          className="las la-ellipsis-v"
                        ></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <a href={""} onClick={(e) => editReply(e, reply)}>
                            Edit Reply
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null
      ) : null}
    </>
  );
}
