import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../contexts/UserContext";
import PostService from "../../services/PostService";
import CommentsService from "../../services/CommentsService";

import ReplyCommentComponent from "./ReplyCommentComponent";
import settings from "../../services/Settings";
import fileStorage from "../../config/fileStorage";
import moment from "moment";
import PostComponentBoxComponent from "./PostCommentBoxComponent";
import { TramRounded } from "@mui/icons-material";
import UserService from "../../services/UserService";

export default function CommentPostComponent(props) {
  const { user } = useContext(UserContext);

  const [likedFlag, setLikedFlag] = useState(false);

  const [comment, setComment] = useState(props.comment);
  const [activeCommentId, setActiveCommentId] = useState();

  const [likedCommentId, setLikedCommentId] = useState();
  const [likedCommentIdArr, setLikedCommentIdArr] = useState([]);
  const [replyListShowFlag, setReplyListShowFlag] = useState(false);

  const [replyCommentFlag, setReplyCommentFlag] = useState(false);
  const [replyCommentId, setReplyCommentId] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesShowId, setRepliesShowId] = useState(true);
  const [editCommentId, setEditCommentId] = useState();
  const [editCommentFlag, setEditCommentFlag] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [editReplyId, setEditReplyId] = useState();
  const [editReplyFlag, setEditReplyFlag] = useState(false);
  const [showUserReactions, setShowUserReactions] = useState(false);
  const [showCommentReactions, setShowCommentReactions] = useState(false);

  const handleShowingCommentReaction = () => {
    setTimeout(function () {
      setShowCommentReactions(true);
    }, 200);
  };

  const handleUnshowingCommentReaction = () => {
    setTimeout(function () {
      setShowCommentReactions(false);
    }, 200);
  };

  const checkEditComment = (e) => {
    setEditCommentFlag(e);
  };

  const checkEditReply = (e) => {
    setEditReplyFlag(e);
  };
  useEffect(() => {
    setComment(props.comment);
  }, [props.comments]);

  const getReplies = async (commentId) => {
    await CommentsService.getReplies(user.id, commentId).then((res) => {
      setReplies(res.data);
    });
  };
  const checkIfLiked = (comment) => {
    if (comment?.commentLiked !== "false") {
      return true;
    }
    return false;
  };
  const handleSettingReactions = (reaction) => {
    if (!checkIfLiked(comment)) {
      likeComment(comment, reaction);
    }
  };
  const handleReaction = () => {
    return (
      <>
        {(() => {
          switch (comment?.commentLiked) {
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
  const handleReplyReactions = (comment) => {
    return (
      <>
        {comment.countOfEachReaction.star > 0 ? (
          <i
            className="fas fa-star"
            style={{ fontSize: "12px", color: "#d83535" }}
          ></i>
        ) : (
          <></>
        )}
        {comment.countOfEachReaction.smiley > 0 ? (
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
        {comment.countOfEachReaction.wow > 0 ? (
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
        {comment.countOfEachReaction.laugh > 0 ? (
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

        {comment.countOfEachReaction.cry > 0 ? (
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
        {comment.countOfEachReaction.love > 0 ? (
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
        {comment.countOfEachReaction.celebrate > 0 ? (
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
        {comment.countOfEachReaction.angry > 0 ? (
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
  const handleDeleteComment = (comment) => {
    props.handleDeleteComment(comment, props.post);
  };
  const likeComment = async (comment, reaction) => {
    props.likeComment(comment, reaction);
  };

  const replyClicked = (commentId) => {
    setActiveCommentId(commentId);
    setReplyListShowFlag(!replyListShowFlag);
  };
  const editComment = (e, commentId) => {
    e.preventDefault();
    setEditCommentId(commentId);
    setEditCommentFlag(true);
  };
  const replyInputClicked = (commentId) => {
    setActiveCommentId(commentId);

    setReplyCommentFlag(!replyCommentFlag);
  };
  const commentDisplay = (comment) => {
    let time = moment(comment.published, "DD MMMM YYYY hh:mm:ss").fromNow();
    return editCommentId === comment.id && editCommentFlag ? (
      <PostComponentBoxComponent
        post={props.post}
        setRefresh={props.setRefresh}
        editComment={comment}
        checkEditComment={checkEditComment}
      />
    ) : (
      <li key={comment.id}>
        <div className="comet-avatar">
          <img
            src={fileStorage.baseUrl + comment.user.profilePicturePath}
            alt=""
          />
        </div>
        <div style={{ width: "100%" }}>
          <div className="we-comment-cont">
            <div style={{ paddingTop: "2px", display: "table-cell" }}>
              <div style={{ position: "relative" }}>
                <div className="we-comment">
                  <div className="coment-head">
                    <h5>
                      <a
                        href={`/profile/${comment.user.email}`}
                        title={`${comment.user.email}`}
                      >{`${comment.user.firstName} ${comment.user.lastName}`}</a>
                    </h5>
                    <span>{`${comment.published ? time : ""}`}</span>
                  </div>
                  <p>{`${comment.content}`}</p>
                  <span
                    className="float-right"
                    style={{ fontSize: "10px", paddingRight: "5px" }}
                  >
                    {comment.numberOfReaction > 0 ? (
                      <span>
                        {handleReplyReactions(comment)}{" "}
                        {comment.numberOfReaction}
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>

                {showCommentReactions && (
                  <div
                    onMouseEnter={handleShowingCommentReaction}
                    onMouseLeave={handleUnshowingCommentReaction}
                    className="reaction-bunch active"
                  >
                    <img
                      src={"../assets/images/gif/smiley.gif"}
                      onClick={() => handleSettingReactions("smiley")}
                    />
                    <img
                      src={"../assets/images/gif/wow.gif"}
                      onClick={() => handleSettingReactions("wow")}
                    />
                    <img
                      src={"../assets/images/gif/laughing.gif"}
                      onClick={() => handleSettingReactions("laugh")}
                    />
                    <img
                      src={"../assets/images/gif/crying.gif"}
                      onClick={() => handleSettingReactions("cry")}
                    />
                    <img
                      src={"../assets/images/gif/love.gif"}
                      onClick={() => handleSettingReactions("love")}
                    />
                    <img
                      src={"../assets/images/gif/angry.gif"}
                      onClick={() => handleSettingReactions("angry")}
                    />
                    <img
                      src={"../assets/images/gif/celebrate.gif"}
                      onClick={() => handleSettingReactions("celebrate")}
                    />
                  </div>
                )}
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
                      onClick={() => likeComment(comment, "star")}
                    >
                      {checkIfLiked(comment) ? (
                        <>
                          <span className="like" data-toggle="tooltip" title="">
                            {handleReaction()}
                          </span>
                        </>
                      ) : (
                        <div className="">
                          <span
                            className="dislike"
                            onMouseEnter={handleShowingCommentReaction}
                            onMouseLeave={handleUnshowingCommentReaction}
                          >
                            <i className="far fa-star"></i>
                          </span>
                        </div>
                      )}
                    </a>
                    <a
                      className="we-reply"
                      title="Reply"
                      onClick={() => replyInputClicked(comment.id)}
                    >
                      Reply
                    </a>
                  </div>
                  {comment.user.id === user.id ? (
                    <a
                      className="deleteComment"
                      href="#!"
                      onClick={() => handleDeleteComment(comment)}
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
              {comment.numberOfReplies > 0 ? (
                activeCommentId === comment.id ? (
                  replyListShowFlag === false ? (
                    <div
                      className="reply-count"
                      onClick={() => replyClicked(comment.id)}
                    >
                      {comment.numberOfReplies + ""} Replies{" "}
                    </div>
                  ) : null
                ) : (
                  <div
                    className="reply-count"
                    onClick={() => replyClicked(comment.id)}
                  >
                    {comment.numberOfReplies + ""} Replies{" "}
                  </div>
                )
              ) : null}
            </div>
            {comment.user.id === user.id && (
              <div className="dropdown more-btn comnt-more-opt">
                <button
                  className="drp-btn dropdown-toggle "
                  type="button"
                  data-toggle="dropdown"
                  style={{ background: "transparent", border: "none" }}
                >
                  <i
                    style={{ float: "right", fontSize: 20, height: "10px" }}
                    className="las la-ellipsis-v"
                  ></i>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a href={""} onClick={(e) => editComment(e, comment.id)}>
                      Edit Comment
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {activeCommentId === comment.id ? (
            <ReplyCommentComponent
              comment={comment}
              showReplyInput={replyCommentFlag}
              replyListFlag={replyListShowFlag}
              activeCommentId={activeCommentId}
            />
          ) : null}
        </div>
      </li>
    );
  };
  return comment && commentDisplay(comment);
}
