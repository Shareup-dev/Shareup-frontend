import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import UserService from '../../services/UserService';
import PostService from '../../services/PostService';
import EditPostComponent from './EditPostComponent';
import CommentPostComponent from './CommentPostComponent';
import PostComponentBoxComponent from './PostCommentBoxComponent';
import Popup from 'reactjs-popup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ImageGallery from 'react-image-gallery';
import storage from '../../configs/fileStorage';
import Carousel from 'react-bootstrap/Carousel';
import fileStorage from '../../configs/fileStorage';

import '../../css/dropoptions-style.css';


const my_url = `${storage.baseUrl}`;

export default function PostComponent({ post, setRefresh }) {
  const { user } = useContext(UserContext);
  const [editPostId, setEditPostId] = useState(null);
  const [userR, setUserR] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const [likeReaction, setLikeReaction] = useState(null);
  const [imgString, setimgString] = useState('');
  const images = [
    {
      original: `/user-post/${post.id}/${imgString[1]}`,
      thumbnail: `/user-post/${post.id}/${imgString[1]}`,
    },
  ];

  const something = (event) => {
    if (event.key === 'Enter') {
      console.log('enter');
    }
  };
  const handleEditPost = (id) => {
    setEditPostId(id);
    setRefresh(id);
  };

  const getCommentCounter = (comments) => {
    let counter = 0;
    comments.map((comment) => {
      counter += comment.replies.length + 1;
    });
    return counter;
  };

  const checkIfLiked = (post) => {
    const result = post.reactions.filter((reaction) => reaction.user.id == user.id);
    if (result.length > 0) {
      return true;
    }
    return false;
  };

  const checkIfSaved = (post) => {
    const result = post.savedByUsers.filter((userz) => userz.id == user.id);
    if (result.length > 0) {
      console.log(' FOUND');
      return true;
    }
    console.log(' Not found');
    return false;
  };

  const handleLikePost = async (post_id) => {
    await UserService.likePost(user.id, post_id).then((res) => {
      setRefresh(res.data);
    });
  };

  const handleSavePost = async (post_id) => {
    UserService.savePost(user.id, post_id).then((res) => {
      setRefresh(res.data);
    });
    setShowMoreOptions(false);
  };

  const handleDeletePost = (postid) => {
    PostService.deletePost(postid).then((res) => {
      console.log(res.status);
      setRefresh(res.data);
    });
  };

  const handleEditingSave = (value) => {
    setEditPostId(value);
    setRefresh(value);
    setShowMoreOptions(false);
  };

  const handleShowingReaction = () => {
    setTimeout(function () {
      setShowReactions(true);
    }, 200);
  };

  const handleUnshowingReaction = () => {
    setTimeout(function () {
      setShowReactions(false);
    }, 200);
  };

  

  const handleReaction = () => {

   if (likeReaction) {
      
       return (<img width={30} style={{marginTop:'-5px'}} src={`../assets/images/gif/${likeReaction}.gif`}/>)
    }
    return <img src='/assets/images/icons/star-like.svg' alt='' />;
  };


  const handleSettingReactions = (reaction) => {
    setLikeReaction(reaction);
    if (!checkIfLiked(post)) {
      handleLikePost(post.id);
    }
  };

  
  const handleCounterReaction = () => {

     if(checkIfLiked(post) ){
       return( 
       <div className='reaction' onClick={() => handleLikePost(post.id)}>
          <span className='like' data-toggle='tooltip' title=''>
              {handleReaction()}  
            <span style={{ paddingLeft: '10px' }}></span>
          </span>
        </div>
  );  
  }
       else{ 
       return(<div className='reaction' onClick={() => handleLikePost(post.id)}>
          <span className='dislike' data-toggle='tooltip' title=''>
            <img src='/assets/images/icons/star-icon.svg' alt='' />
            <span style={{ paddingLeft: '10px' }}></span>
          </span>
        </div>
       );
    }

    //  if (likeReaction) {
    //  return <img width={20} style={{ marginTop: '-5px' }} src={`../assets/images/icons/star-like.svg`} />;
    //   return <img src='/assets/images/icons/star-like.svg' alt='' />;
    //  }
    // return <img src='/assets/images/icons/star-icon.svg' alt='' />;
  };

  //array fetch
  const postImg = (str) => {
    if (str != null) {   
      let temps = [];
      for (let i = 0; i < str.length; i++) temps = [...temps, `/user-post/${post.id}/${str[i]}`];
      console.log('img string' + imgString);
    }
  };

  const toggleShowMoreOptions = (e) => {
    e.preventDefault();
    setShowMoreOptions(!showMoreOptions);
  };

  return (
    <div
      className='central-meta item'
      key={post.id}
      onClick={(e) => {
        if (showMoreOptions) toggleShowMoreOptions(e);
      }}
    >
      <div
        className='container_drop-options__transparent'
        hidden={!showMoreOptions}
        onClick={toggleShowMoreOptions}
      ></div>
      <div className='user-post'>
        {editPostId !== post.id ? (
          <div className='friend-info'>
            <div className='post-meta'>
              {post.swapImagePath ? (
                <>
                  <div className='grid-container1'>
                    <div className='itemS1'>
                      {post.postedimages.length > 0 ? (
                        <div className='postImage'>
                          {post.postedimages.map((postImage) => (
                            <React.Fragment>
                              <a
                                href={`${fileStorage.baseUrl}${postImage.imagePath}`}
                                data-lightbox={`image-user-${post.user.id}`}
                              >
                                <img
                                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                  src={`${fileStorage.baseUrl}${postImage.imagePath}`}
                                  alt={`${fileStorage.baseUrl}${postImage.imagePath}`}
                                />
                              </a>
                            </React.Fragment>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className='itemS2'>
                      <div className='swapbtnfeed'>
                        <i class='las la-sync'></i>
                      </div>
                    </div>
                    <div className='itemS3'>
                      <>
                        <div className='swapImage'>
                          <a href={post.swapImagePath} data-lightbox={`image-user-${post.user.id}`}>
                            <img
                              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                              src={post.swapImagePath}
                            />{' '}
                          </a>
                        </div>{' '}
                      </>
                    </div>
                  </div>

                  <div className='buttonS'>
                    <a href='/shipping' className='buttonshare' onClick={() => handleDeletePost(post.id)}>
                      Accept
                    </a>
                  </div>
                </>
              ) : (
                //single

                <>
                  {post.postImagePath && post.postImagePath.split(',').length > 1 ? (
                    <div>
                      <Carousel
                        height='200px'
                        thumbnails={true}
                        thumbnailWidth='100px'
                        style={{
                          textAlign: 'center',
                          maxWidth: '850px',
                          maxHeight: '500px',
                          margin: '40px auto',
                        }}
                      >
                        {
                          // (post.postImagePath.split(',')).map((item,key)=>{imgfun(item,key)})

                          post.postImagePath.split(',').map((item, key) => (
                            <Carousel.Item>
                              <a
                                href={`${fileStorage.baseUrl}/user-post/${post.id}/${item}`}
                                data-lightbox={`image-user-${post.user.id}`}
                              >
                                {' '}
                                <img
                                  className='d-block w-100'
                                  src={`${fileStorage.baseUrl}/user-post/${post.id}/${item}`}
                                  key={key}
                                />
                              </a>
                            </Carousel.Item>
                          ))
                        }
                      </Carousel>
                    </div>
                  ) : (
                    // <div className="postImage">
                    //     <div className="row">

                    //    {
                    //       // setimgString(post.postImagePath.split(','))
                    //      // <ImageGallery items={images}/>

                    //     (post.postImagePath.split(',')).map((item,key)=>(<div className="column">
                    //         <a href={`${storage.baseUrl}/user-post/${post.id}/${item}`}
                    //     data-lightbox={`image-user-${post.user.id}`}>
                    //        <img src={`${storage.baseUrl}/user-post/${post.id}/${item}`} key={key}
                    //        style={{ width: '300px', height: '250px',padding:'2px', display:''}}/></a></div>))

                    //    }
                    //     </div>

                    //    </div>

                    <></>
                  )}
                </>
              )}

              {/* {post.postImagePath ?
                                <div className="postImage">
                                    <a href={post.postImagePath} data-lightbox={`image-user-${post.user.id}`}><img style={{ maxWidth: "100%", height: "auto" }} src={post.postImagePath} /> </a></div> : null
                                }
                                {post.swapImagePath ?
                                <>
                                <div style={{textAlign: "center"}}><img  width="30" src="assets/images/swapicon.png"/></div>
                                    <div className="swapImage">
                                    <a href={post.swapImagePath} data-lightbox={`image-user-${post.user.id}`}><img style={{ maxWidth: "100%", height: "auto" }} src={post.swapImagePath} /> </a></div> </>: null
                                } */}

              <figure>
                <img src={fileStorage.baseUrl + post.user.profilePicturePath} alt='' />
              </figure>

              <div className='friend-name'>
                <div style={{ float: 'left', display: 'inline' }}>
                  <a
                    href={`/profile/${post.user.email}`}
                    title='#'
                    style={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                  >
                    {`${post.user.firstName} ${post.user.lastName}`}
                    {post.userTag ? (
                      <>
                        <span style={{ padding: '0 5px' }}>with</span>{' '}
                        <span className='tagPost'>{post.userTag.firstName}</span>
                        <span className='tagPost'>{post.userTag.lastName}</span>
                      </>
                    ) : null}
                  </a>

                  <span style={{ display: 'block', fontSize: '12px', paddingTop: '5px' }}>
                    on {`${post.published}`} {checkIfSaved(post) && <i class='las la-bookmark szbkmrk'></i>}
                  </span>
                  {/* {post.group ? <span className="groupName">Group: {`${post.group.name}`}</span> : null} */}
                </div>

                
                <div
                  style={{ float: 'right', display: 'inline', fontSize: '28px', fontWeight: '900', cursor: 'pointer' }}
                >
                  
                  
                  
                </div>
              </div>

              <div style={{float:'right', backgroundColor: 'white', color: 'black' }}>
                    <div className='add-dropdown' onClick={toggleShowMoreOptions}>
                      <span title='add icon'>
                        <i class='las la-ellipsis-h'></i>
                      </span>
                    </div>
                  </div>

              {post.content && (
                <p id={`post-content-${post.id}`}>
                  {`${post.content}`}
                  <br></br>
                </p>
              )}

              <div className='postImage'>
                {post.postedimages.map((postImage) => (
                  <React.Fragment>
                    <a
                      href={`${fileStorage.baseUrl}${postImage.imagePath}`}
                      data-lightbox={`image-user-${post.user.id}`}
                    >
                      <img
                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                        src={`${fileStorage.baseUrl}${postImage.imagePath}`}
                        alt={`${fileStorage.baseUrl}${postImage.imagePath}`}
                      />
                    </a>
                  </React.Fragment>
                ))}
              </div>

              <div className='counter'>
                
                              
                  <ul>
                  <li class="rate-count"> 
                    {handleCounterReaction()}
                    <span> {`${post.reactions.length}`} </span>
                  </li>
                  <li>
                  
                    <span
                      className='commentCounter'
                      style={{ marginRight: '5px' }}
                      onClick={() => setShowComment(!showComment)}
                    >
                      {/*<img src='/assets/images/icons/comment-icon.svg' alt='' />*/}
                     
                    </span>{' '}
                    <span> {`${getCommentCounter(post.comments)}`}</span> Comments
                  </li>
                  <li>
                    <span>
                      {' '}
                      {/*<img src='/assets/images/shareicnwhite.svg' alt='' />*/}
                     
                    </span>{' '}
                    <span> {`${getCommentCounter(post.comments)}`} </span> Share
                  </li>
                  {/*<li style={{ backgroundColor: 'white', color: 'black' }}>
                    <div className='add-dropdown' onClick={toggleShowMoreOptions}>
                      <span title='add icon'>
                        <i class='las la-ellipsis-h'>test</i>
                      </span>
                    </div>
                  </li>*/}
                </ul>
                
              </div>

              {showReactions && (
                <div
                  onMouseEnter={handleShowingReaction}
                  onMouseLeave={handleUnshowingReaction}
                  className='reaction-bunch active'
                >
                  <img src={'../assets/images/gif/smiley.gif'} onClick={() => handleSettingReactions('smiley')} />
                  <img src={'../assets/images/gif/cool.gif'} onClick={() => handleSettingReactions('cool')} />
                  <img src={'../assets/images/gif/laughing.gif'} onClick={() => handleSettingReactions('laughing')} />
                  <img src={'../assets/images/gif/tongue.gif'} onClick={() => handleSettingReactions('tongue')} />
                  <img src={'../assets/images/gif/angel.gif'} onClick={() => handleSettingReactions('angel')} />
                  <img src={'../assets/images/gif/devil.gif'} onClick={() => handleSettingReactions('devil')} />
                  <img src={'../assets/images/gif/angry.gif'} onClick={() => handleSettingReactions('angry')} />
                </div>
              )}
              <hr style={{marginTop: '3rem'}}></hr>

              <div className='we-video-info'>
                <div className='click'>
                  {/* {checkIfLiked(post) ? (
                    <div className='reaction' onClick={() => handleLikePost(post.id)}>
                      <span className='like' data-toggle='tooltip' title=''>
                          {handleReaction()}  
                        <span style={{ paddingLeft: '10px' }}>Star</span>
                      </span>
                    </div>
                  ) : ( */}
                    <div className='reaction' onClick={() => handleLikePost(post.id)}>
                      <span className='dislike' data-toggle='tooltip' title=''>
                        <img src='/assets/images/icons/star-icon.svg' alt='' />
                        <span style={{ paddingLeft: '10px' }}>Star</span>
                      </span>
                    </div>
                  {/* )} */}
                  <div className='commShare'>
                    <div className='btncmn' onClick={() => setShowComment(!showComment)}>
                      <span className='comment' data-toggle='tooltip' title='Comments'>
                        <img src='/assets/images/icons/comment-icon.svg' />
                        <span style={{ paddingLeft: '12px' }}>Comment</span>
                      </span>
                    </div>
                    <div className='btncmn' style={{float:'right', width:'auto'}}>
                      <span className='views' data-toggle='tooltip'>
                        <img src='/assets/images/icons/share-icon.svg' />
                        <span style={{ paddingLeft: '12px' }}>Share</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EditPostComponent post={post} set={handleEditingSave} />
        )}

        {showMoreOptions && (
          <div className='drop-options active' onClick={toggleShowMoreOptions}>
            <ul>
              <li className='head-up'>
                <h6>Post Options</h6>
              </li>
              {post.user.id === user.id ? (
                <li onClick={() => handleEditPost(post.id)}>
                  <i class='las la-pencil-alt'></i>
                  <span>Edit Post</span>
                </li>
              ) : (
                <></>
              )}
              <li onClick={() => handleSavePost(post.id)}>
                <i class='lar la-bookmark'></i>
                <span>Save Post</span>
              </li>
              {post.user.id === user.id ? (
                <li onClick={() => handleDeletePost(post.id)}>
                  <i class='las la-trash'></i>
                  <span>Delete</span>
                </li>
              ) : (
                <></>
              )}
              <li>
                <i class='las la-link'></i>
                <span>Copy Link</span>
              </li>
            </ul>
          </div>
        )}
        {/* Till here */}
        <div className='coment-area'>
          <ul className='we-comet'>
            <PostComponentBoxComponent post={post} setRefresh={setRefresh} />
            {showComment && <CommentPostComponent post={post} setRefresh={setRefresh} />}
          </ul>
        </div>
      </div>
    </div>
  );
}

// pushing to github
