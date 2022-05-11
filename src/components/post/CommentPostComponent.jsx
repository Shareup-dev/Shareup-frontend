import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import PostComponentBoxComponent from './PostCommentBoxComponent';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import moment from 'moment'

export default function CommentPostComponent({post, setRefresh}) {
    const { user } = useContext(UserContext)

    const [showComment, setShowComment] = useState(true);
    const [likedFlag, setLikedFlag] = useState(false);

    const [comments, setComments] = useState([])

    const handleDeleteComment = (commentid) => {
        PostService.deleteComment(commentid).then(res => {
          console.log(res.status)
          setRefresh(res.data)
        })
      }

    const sortComment = () => {
      PostService.getCommentsForPosts(user.id,post.id).then((res)=>
        setComments(res.data)
      )
      if(comments){
        // const comments = [...comments]
        comments.sort(function(a, b) {
          var dateA = new Date(a.published), dateB = new Date(b.published);
          return dateA - dateB;
      });

        setComments(comments)
        console.log(comments)
      }
    }

    useEffect(() => {
      sortComment()
    }, [post])

    const date1 = (comment) =>{
      let date = new Date(comment.published);
      let today = new Date();
      var Difference_In_Time = today.getTime() - date.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      if((Difference_In_Days%1)>0.5){
        let d=(Difference_In_Days%1)>0.5
        console.log(Difference_In_Days , d , Math.round(Difference_In_Days-1))

      }
      // const month = date.toLocaleString('default', { month: 'long' })
    }
    const likeComment =(e,cid)=>{
      e.preventDefault();
      setLikedFlag(!likedFlag)
      let params ;
      params= {is_comment_liked: likedFlag}
      PostService.LikeComment(user.id,cid,params).then((res)=>{
        console.log(res.data)
      })
    }
    return(
        post && 
        (showComment && 
          <>
          {comments&&comments.length>0&&comments.map(comment =>{
            let time=moment(comment.published, "DD MMMM YYYY hh:mm:ss").fromNow()
              // console.log(time)
              // let date = new Date(comment.published);
              // let today = new Date();
              // let time = null
              // var Difference_In_Time = today.getTime() - date.getTime();
              // console.log(Difference_In_Time)
              // if(Difference_In_Time<60000){
              //   time= Math.round(Difference_In_Time) + 's'
              // }else if((Difference_In_Time/60000)<60){
              //   time= Math.round(Difference_In_Time/60000) + 'm' 
              // }else if(Difference_In_Time/60000>3600){
              //   console.log('hour')
              //   time = Math.round(Difference_In_Time/3600000) + 'h'
              // }else if(Difference_In_Time/60000>360){

              // }
            // console.log(time)
            //  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            //  if((Difference_In_Days%1)>0.5){
            //    let d=(Difference_In_Days%1)>0.5
            //     time = Math.round(Difference_In_Days-1);
            //  }
            return(
              <li key={comment.id}>
                <div className="comet-avatar">
                  <img src={fileStorage.baseUrl+comment.user.profilePicturePath} alt="" />
                </div>
                <div style={{width: '65%'}}>
                  <div className="we-comment-cont">
                    <div className="we-comment">
                      <div className="coment-head">
                        <h5><a href={`/profile/${comment.user.email}`} title={`${comment.user.email}`}>{`${comment.user.firstName} ${comment.user.lastName}`}</a></h5>
                        <span>{`${comment.published?time:''}`}</span>
                      </div>
                      <p>{`${comment.content}`}</p>
                    </div>
                    <div style={{position: 'relative',paddingTop:'2px'}}>
                        <div>
                          <a className="we-reply" title="Reply" onClick={(e)=>likeComment(e,comment.id)} style={likedFlag?{color:'red'}:{color:'inherit'}}>Like</a>
                          <a className="we-reply" title="Reply">Reply</a>
                        </div>
                        {(comment.user.id === user.id) ?
                          <a className="deleteComment" href="#!"  style={{position:'absolute',left: '150px',bottom: '0px' }}onClick={() => handleDeleteComment(comment.id)}><i style={{ color: 'gray',  fontSize:'13px',}} className="fa fa-trash" /></a>
                          :
                          <></>
                        }
                      </div>
                  </div>
                  

                </div>

                {
                  comment.replies&&comment.replies.length > 0 && (
                    <ul>
                    {comment.replies.map(reply =>
                      <li key={reply.id}>
                        <div className="comet-avatar">
                          <img src={fileStorage.baseUrl+reply.user.profilePicturePath} style={{ width: 50 }} alt="" />
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
            )
          }
        )}
        </>
        )
    );
}