import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import PostComponentBoxComponent from './PostCommentBoxComponent';

export default function CommentPostComponent({post, setRefresh}) {
    const { user } = useContext(UserContext)

    const [showComment, setShowComment] = useState(true);
    const [comments, setComments] = useState([])

    const handleDeleteComment = (commentid) => {
        PostService.deleteComment(commentid).then(res => {
          console.log(res.status)
          setRefresh(res.data)
        })
      }

    const sortComment = () => {
      const comments = [...post.comments]
      comments.sort(function(a, b) {
        var dateA = new Date(a.published), dateB = new Date(b.published);
        return dateA - dateB;
    });

      setComments(comments)
    }

    useEffect(() => {
      sortComment()
    }, [post])

    return(
        post && 
        (showComment && 
          <>
          {comments.map(comment =>
          <li key={comment.id}>
                  <div className="comet-avatar">
                    <img src={comment.user.profilePicturePath} alt="" />
                  </div>
                  <div className="we-comment">
                    <div className="coment-head">
                      <h5><a href={`/profile/${comment.user.email}`} title={`${comment.user.email}`}>{`${comment.user.firstName} ${comment.user.lastName}`}</a></h5>
                      <span>{`${comment.published}`}</span>
                      <a className="we-reply" href="#" title="Reply"><i className="fa fa-reply" /></a>
                      {(comment.user.id === user.id) ?
                        <a className="deleteComment" href="#!" onClick={() => handleDeleteComment(comment.id)}><i style={{ color: 'gray', marginLeft: '10px', marginTop: '2px' }} className="fa fa-trash" /></a>
                        :
                        <></>
                      }
                    </div>
                    <p>{`${comment.content}`}</p>
                  </div>
                  {
                    comment.replies.length > 0 && (
                      <ul>
                      {comment.replies.map(reply =>
                        <li key={reply.id}>
                          <div className="comet-avatar">
                            <img src={reply.user.profilePicturePath} style={{ width: 50 }} alt="" />
                          </div>
                          <div className="we-comment">
                            <div className="coment-head">
                              <h5><a href={`/profile/${reply.user.email}`} title={`${reply.user.email}`}>{`${reply.user.firstName} ${reply.user.lastName}`}</a></h5>
                              <span>{`${reply.published}`}</span>
                              <a className="we-reply" href="#" title="Reply"><i className="fa fa-reply" /></a>
                            </div>
                            <p>{`${reply.content}`}</p>
                          </div>
                        </li>
                      )}
                    </ul>
                    )
                  }
                </li>
        )}
        </>
        )
    );
}