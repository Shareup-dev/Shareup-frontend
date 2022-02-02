import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import UserContext from '../contexts/UserContext';
import PostService from '../services/PostService';
import ShareupInsideHeaderComponent from './dashboard/ShareupInsideHeaderComponent';
import EditPostComponent from './user/EditPostComponent'
import FollowingWidgetComponent from './widgets/FollowingWidgetComponent';
import FriendsWidgetComponent from './widgets/FriendsWidgetComponent';
import GroupsWidgetComponent from './widgets/GroupsWidgetComponent';
import settings from '../services/Settings';
import fileStorage from '../config/fileStorage';
import ReelsServices from '../services/ReelsServices';

import Popup from 'reactjs-popup';

import img1 from '../images/news1.jpg'

export default function Layout(props) {

  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  useEffect(() => {
    if (props.user) {
      setIsLoading(false)
    }

  }, [])

  const { user } = useContext(UserContext)

  const [refresh, setRefresh] = useState(null);
  const [reels, setReels] = useState([]);

  const [filesReel, setFilesReel] = useState({});
  const [ReelVideo, setReelVideo] = useState([]);
  const [ShowReelVideo, setShowReelVideo] = useState(false);
  const [uploadErrorReel, setUploadErrorReel] = useState('');



  const uploadReels = (event) => {
    event.preventDefault();
    setUploadErrorReel('');
    console.log('uploading reels working');

    if (Object.keys(filesReel).length === 0 && filesReel.constructor === Object) {
      console.log('cant be null');
      setUploadErrorReel('Please Add reel video');
      console.log(uploadErrorReel);
      return;
    }

    var video = document.getElementById("video");
    const canvas = document.createElement("canvas");
    // scale the canvas accordingly
    canvas.width = video.videoWidth/10;
    canvas.height = video.videoHeight/10;
    // draw the video at that frame
    canvas.getContext('2d').drawImage(video,10,10);
    // convert it to a usable data URL
    const dataURL = canvas.toDataURL();
    var img = document.createElement("img");
    img.src = fileStorage.baseUrl+"/user-stories/1643529794109/Picture.jpg";
    

    const formData = new FormData();
    var thumbnails = img.src;
    var content = "asdsadasd";
   
    console.log("dataaaaaaaaaa", formData);
    // console.log("thumbnails", thumbnails);
    // console.log("content", content);

    formData.append(`content`, content);
    formData.append(`thumbnails`, thumbnails);
    formData.append(`reelfiles`, filesReel);


   ReelsServices.createReels(user.id, formData).then((res) => {
    console.log("jsonnn" ,JSON.stringify(res));
    handleRemoveReelVideo();
    setReels(res.data);
    setRefresh(res.data);

    console.log("response", reels);

  });

  
  };







  const handleFileReel = (event) => {

    setFilesReel(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setReelVideo(reader.result);
      }
    };
    console.log(event.target.files[0]);
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0]);
    // }
    setShowReelVideo(true);


  };

  const handleRemoveReelVideo = () => {
    setFilesReel({});
    setShowReelVideo(false);
  };





  if (isLoading) {
    return null
  }
  const curdate = () => {
    let date = new Date()
    let dd = date.getDate()
    let mm = date.getMonth()
    let yy = date.getFullYear()
    return `${dd}/ ${mm}/ ${yy}`
  }
  console.log("User: ", user);
  return (
    props.user &&
    <>
      <ShareupInsideHeaderComponent />
      {/* topbar */}
      <div className="container">
        <section>
          <div className="gap gray-bg">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row" id="page-contents">
                    <div className="col-lg-3" style={{ maxWidth: '21%' }}>
                      <aside className="sidebar static" style={{ width: '91%', marginRight: '0px', paddingLeft: '3px' }}>
                        <div className="widget" style={{ borderBottom: '1px solid #75757530' }}>
                          {/* <div className="row"><img src="../assets/images/unnamed.png"/><p className="widget-title">User</p></div>   */}
                          <div className="user" >
                            <img src={fileStorage.baseUrl + user.profilePicturePath} />
                            <a href="/profile" ><p style={{ fontWeight: "bold" }}>{`${props.user.firstName} ${props.user.lastName}`}</p></a>
                          </div>
                        </div>



                        <div className="widget navmenu">
                          {/* <div className="row"><img src="../assets/images/menu-1899421-1606840.png"/><p className="widget-title">Menu</p></div>  */}
                          <div><ul className="naves">
                            <li>
                              <div style={{ marginRight: "12px", display: "inline" }}><i className="ti-clipboard" /></div>
                              <a href="/newsfeed" title="#">ShareFeed</a>
                            </li>
                            <li>
                              <div style={{ marginRight: "12px", display: "inline" }}><i className="ti-write" /></div>
                              <a href="/savedShares" title="#">SavedShares</a>
                            </li>
                            <li>
                              <div style={{ marginRight: "12px", display: "inline" }}><i className="ti-comments" /></div>
                              <a href="/messages" title="#">Messages</a>
                            </li>
                            <li>
                              <div style={{ marginRight: "12px", display: "inline" }}><i className="ti-user" /></div>
                              <a href="/friends" title="#">ShareFriends</a>
                            </li>
                            <li>
                              <div style={{ marginRight: "12px", display: "inline" }}>
                                <i className="ti-user" />
                                <p style={{ fontSize: "18px", color: "blue", marginLeft: "-8px", display: "inline" }}>+
                                </p>
                              </div>

                              <a href="/Addfriends" title="#">Add Friends</a>
                            </li>










                            <li>
                              <div style={{ marginRight: "5px", display: "inline" }}><i className="ti-user" /><i className="ti-user" style={{ marginLeft: "-19px" }} /></div>
                              <a href="/groups" title="#">ShareGroups</a>
                            </li>
                            <li>
                              <div style={{ marginRight: "12px", display: "inline" }}><i className="ti-link" /></div>

                              <a href="/shareFeed" title="#">SharePoint</a>
                            </li>
                            <li>
                              <div style={{ marginRight: "12px", display: "inline" }}><i className="ti-control-shuffle" /></div>

                              <a href="/swapFeed" title="#">SwapPoint</a>
                            </li>
                          </ul></div>
                        </div>{/* Shortcuts */}

                      </aside>
                    </div>{/* sidebar */}
                    {/* ------------------------------------------------------------------------- */}
                    {props.children}
                    {/* --------------------------------------------------------------------------------- */}
                    {/* centerl meta */}
                    <div className="col-lg-3">
                      <aside className="sidebar static " style={{ paddingTop: '10px' }}>
                        {/* <div className="widget friend-list stick-widget">
                        <div className="row"><img src="../assets/images/1865023.png"/><p className="widget-title">Ads</p></div>
                          <div className="ads"><a href="https://technology-signals.com/wp-content/uploads/2019/05/images.martechadvisor.comvoice_technology_5cecf0b8-3f280e5abac0da913f8aa0868cf970c6a429a128.jpg" data-lightbox="image-1" data-title="My caption"><img src="https://technology-signals.com/wp-content/uploads/2019/05/images.martechadvisor.comvoice_technology_5cecf0b8-3f280e5abac0da913f8aa0868cf970c6a429a128.jpg"></img></a>
                        </div>
                      </div> */}

                        {/* <div className="widget friend-list stick-widget">
                        <div className="row" ><img src="../assets/images/Trends1.jpg"/><p className="widget-title">News</p></div>
                          <div className="news">
                            <a href="#" data-lightbox="image-1" data-title="My caption">
                              <img src="../assets/images/Trends1.jpg"></img>
                            </a>
                          </div>
                        </div> */}

                        <div style={{
                          paddingBottom: '20px',
                          // borderBottom: '1px solid #75757530'
                        }} >
                          <div className="sidebar-news">
                            <div class="media-date">What's trending</div>
                            <div style={{}}>
                              <ul>
                                <li>
                                  <div className="headline-cont">
                                    <p className="headline">
                                      Omicron variant of COVID-19: New travel guidelines to come into force from December 1
                                    </p>
                                    <img src={img1} />
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <a href=" https://www.aljazeera.com/where/qatar/" target="_blank" className="source">Aljazeera Qatar News</a>
                                    <p className="date">12/1/2021</p>
                                  </div>

                                </li>

                                <li>
                                  <div className="headline-cont">
                                    <p className="headline" >Prime Minister Scott Morrison says big tech firms have responsibility to ensure their platforms are safe.</p>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <a href="https://www.theverge.com/tech" target="_blank" className="source">Technology</a>
                                    <p className="date">12/1/2021</p>
                                  </div>
                                </li>
                                <li>
                                  <div className="headline-cont">
                                    <p className="headline">Comprehensive Guide to Qatar Business ....</p>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <a href="https://thepeninsulaqatar.com/category/Qatar-Business" target="_blank" className="source">Business</a>
                                    <p className="date">12/1/2021</p>
                                  </div>
                                </li>
                                <li>
                                  <div className="headline-cont">
                                    <p className="headline">The #FIFArabCup Qatar 2021 kicks off today, coinciding with the inauguration of Al Bayt Stadium and Stadium 974, the latest stadiums to be ready for the FIFA World Cup 2022</p>
                                  </div>

                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <a href="https://www.dohanews.co/category/sports/" target="_blank" className="source">Sports</a>
                                    <p className="date">12/1/2021</p>
                                  </div>
                                </li>
                                <li style={{ textAlign: "center", paddingTop: '10px' }}><a href="https://www.aljazeera.com/" style={{ fontSize: '12px', color: "#258eae" }} target="_blank">Show More</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>





                        <div className="sidebar-news" style={{}}>
                          <div class="media-date">REELS</div>
                          <div style={{}}>
                            <ul>
                              <li>
                                <div className="headline-cont">

                                  <img src="/assets/images/reelimage.PNG" alt=""
                                    style={{ height: '160px', objectFit: "fill", width: '100%', bottom: '16px', padding: '0px' }}
                                  />
                                </div>


                              </li>

                              <Popup trigger={<div className='add-reel'> Add Reel</div>} modal>
                                {(close) => (
                                  <Form className='popwidth'>

                                    <div className='headpop'>
                                      <div style={{ padding: '10px' }}>
                                        <span>
                                          <a href='#!' style={{ padding: '10px 150px 10px 0' }} onClick={close}>
                                            <i class='las la-times'></i>
                                          </a>
                                        </span>
                                        <span style={{ color: '#000000', fontSize: '14px', fontWeight: 'bold' }}>
                                          Lets Add Reel Video
                                        </span>

                                        {/* { checkIfUserAlreadyPostStory(storyauth.user) ?  */}
                                        <span style={{ float: 'right' }}>
                                          {' '}
                                          <button
                                            style={{ float: 'right', borderRadius: '20px', padding: '5px 20px' }}
                                            type='submit'
                                            onClick={uploadReels}
                                          >
                                            Upload
                                          </button>
                                        </span>
                                        {/* :null}  */}
                                      </div>
                                    </div>

                                    <div style={{ margin: '0 11px 10px 11px' }}>
                                      <span className='textPop'>
                                        {ShowReelVideo ? (
                                          <>

                                            <video id='video' width="100%" height={"350px"} controls="controls">
                                              <source src={ReelVideo} />
                                            </video>


                                            <button
                                              onClick={handleRemoveReelVideo}
                                              style={{
                                                right: '20px',
                                                position: 'absolute',
                                                borderRadius: '100%',
                                                background: '#b7b7b738',
                                                padding: '10px 10px',
                                              }}
                                            >
                                              <i class='las la-times'></i>
                                            </button>
                                          </>
                                        ) : (
                                          <div style={{ textAlign: 'center' }}>
                                            <label className='fileContainer'>
                                              <div className='reelvideo' type='submit'>
                                                <input
                                                  type='file'
                                                  name='reel_video'
                                                  accept='video/*'
                                                  onChange={handleFileReel}
                                                ></input>
                                                Add Reel Video
                                              </div>
                                            </label>
                                          </div>
                                        )}
                                      </span>
                                      {/* <div className='storyErr'>{uploadErrorStory ? `${uploadErrorStory}` : null}</div> */}
                                    </div>
                                    {/* </> 
                                                   
                                 )}  */}
                                  </Form>
                                )}
                              </Popup>



                              <div className='add-reel'> 
                              <a href="/reelFeed" title="#"  style={{color: 'white'}}> Explore Reels </a>

                             </div>

                            </ul>
                          </div>
                        </div>




                        <FriendsWidgetComponent />
                        <FollowingWidgetComponent />
                        <GroupsWidgetComponent />
                      </aside>
                    </div>
                    {/* sidebar */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}