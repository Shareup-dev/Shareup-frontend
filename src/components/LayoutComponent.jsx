import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import UserContext from "../contexts/UserContext";
import AuthService from "../services/auth.services";
import PostService from "../services/PostService";
import ShareupInsideHeaderComponent from "./dashboard/ShareupInsideHeaderComponent";
import EditPostComponent from "./user/EditPostComponent";
import FollowingWidgetComponent from "./widgets/FollowingWidgetComponent";
import FriendsWidgetComponent from "./widgets/FriendsWidgetComponent";
import GroupsWidgetComponent from "./widgets/GroupsWidgetComponent";
import settings from "../services/Settings";
import fileStorage from "../config/fileStorage";
import ReelsServices from "../services/ReelsServices";

import Popup from "reactjs-popup";

import img1 from "../images/news1.jpg";
import ReelsComponentFriends from "./Reels/ReelsComponentFriends";
import DisplayFriendsReelsComponent from "./Reels/DisplayFriendsReelsComponent";

export default function Layout(props) {
  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  useEffect(() => {
    if (props.user) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (props.user) {
      setIsLoading(false);
    }
  }, []);

  const { user } = useContext(UserContext);

  const [refresh, setRefresh] = useState(null);
  const [reels, setReels] = useState([]);
  const [reelContent, setReelContent] = useState("");
  const [filesReel, setFilesReel] = useState({});
  const [ReelVideo, setReelVideo] = useState([]);
  const [ShowReelVideo, setShowReelVideo] = useState(false);
  const [uploadErrorReel, setUploadErrorReel] = useState("");
  const [reelPreviewPath, setReelPreviewPath] = useState([]);

  const uploadReels = (event) => {
    event.preventDefault();
    setUploadErrorReel("");
    console.log("uploading reels working");
    if (
      Object.keys(filesReel).length === 0 &&
      filesReel.constructor === Object
    ) {
      console.log("cant be null");
      setUploadErrorReel("Please Add reel video");
      console.log(uploadErrorReel);
      return;
    }

    var video = document.getElementById("video");
    const canvas = document.createElement("canvas");
    // scale the canvas accordingly
    canvas.width = video.videoWidth / 10;
    canvas.height = video.videoHeight / 10;
    // draw the video at that frame
    canvas.getContext("2d").drawImage(video, 10, 10);
    // convert it to a usable data URL
    const dataURL = canvas.toDataURL();

    const formData = new FormData();
    var content = "";
    formData.append("content", reelContent);
    formData.append(`reelfiles`, filesReel);
    formData.append(`thumbnail`, filesReel);

    ReelsServices.createReels(user.id, formData).then((res) => {
      console.log("jsonnn", JSON.stringify(res));
      handleRemoveReelVideo();
      setReels(res.data);
      setRefresh(res.data);

      console.log("response", reels);
    });
  };

  useEffect(() => {
    // getPreviewReel()
    // getExploreReels();
    getReelForUserFriends();
  }, [refresh]);

  const getReelForUserFriends = async () => {
    await ReelsServices.getReelForUserFriends(user?.id).then((res) => {
      const sorting = res.data.sort(function (a, b) {
        let dateA = new Date(a.date),
          dateB = new Date(b.date);
        return dateB - dateA;
      });
      const uniqueStories = Array.from(new Set(sorting.map((a) => a.id))).map(
        (id) => {
          return res.data.find((a) => a.id === id);
        }
      );
      setReelPreviewPath(uniqueStories);
    });
  };

  const getExploreReels = async () => {
    await ReelsServices.getExploreReels(user?.id).then((res) => {
      setReelPreviewPath(res.data);
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
  const handleReelContent = (event) => {
    setReelContent(event.target.value);
  };
  const handleRemoveReelVideo = () => {
    setFilesReel({});
    setShowReelVideo(false);
  };

  if (isLoading) {
    return null;
  }
  const curdate = () => {
    let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth();
    let yy = date.getFullYear();
    return `${dd}/ ${mm}/ ${yy}`;
  };
  return (
    props.user && (
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
                      <div className="col-lg-3" style={{ maxWidth: "21%" }}>
                        <aside
                          className="sidebar static"
                          style={{
                            width: "91%",
                            marginRight: "0px",
                            paddingLeft: "3px",
                          }}
                        >
                          <div
                            className="widget"
                            style={{ borderBottom: "1px solid #75757530" }}
                          >
                            {/* <div className="row"><img src="../assets/images/unnamed.png"/><p className="widget-title">User</p></div>   */}
                            <div className="user">
                              <img
                                src={
                                  fileStorage.baseUrl + user.profilePicturePath
                                }
                              />
                              <a
                                href={`/profile/${
                                  AuthService.getCurrentUser().username
                                }`}
                              >
                                <p
                                  style={{ fontWeight: "bold" }}
                                >{`${props.user.firstName} ${props.user.lastName}`}</p>
                              </a>
                            </div>
                          </div>

                          <div className="widget navmenu">
                            {/* <div className="row"><img src="../assets/images/menu-1899421-1606840.png"/><p className="widget-title">Menu</p></div>  */}
                            <div>
                              <ul className="naves">
                                <li>
                                  <div
                                    style={{
                                      marginRight: "12px",
                                      display: "inline",
                                    }}
                                  >
                                    <i className="ti-clipboard" />
                                  </div>
                                  <a href="/newsfeed" title="#">
                                    ShareFeed
                                  </a>
                                </li>
                                <li>
                                  <div
                                    style={{
                                      marginRight: "12px",
                                      display: "inline",
                                    }}
                                  >
                                    <i className="ti-write" />
                                  </div>
                                  <a href="/savedShares" title="#">
                                    SavedShares
                                  </a>
                                </li>
                                <li>
                                  <div
                                    style={{
                                      marginRight: "12px",
                                      display: "inline",
                                    }}
                                  >
                                    <i className="ti-comments" />
                                  </div>
                                  <a href="/messages" title="#">
                                    Messages
                                  </a>
                                </li>
                                <li>
                                  <div
                                    style={{
                                      marginRight: "12px",
                                      display: "inline",
                                    }}
                                  >
                                    <i className="ti-user" />
                                  </div>
                                  <a href="/friends" title="#">
                                    ShareFriends
                                  </a>
                                </li>
                                <li>
                                  <div
                                    style={{
                                      marginRight: "12px",
                                      display: "inline",
                                    }}
                                  >
                                    <i className="ti-user" />
                                    <p
                                      style={{
                                        fontSize: "18px",
                                        color: "blue",
                                        marginLeft: "-8px",
                                        display: "inline",
                                      }}
                                    >
                                      +
                                    </p>
                                  </div>

                                  <a href="/Addfriends" title="#">
                                    Add Friends
                                  </a>
                                </li>

                                <li>
                                  <div
                                    style={{
                                      marginRight: "5px",
                                      display: "inline",
                                    }}
                                  >
                                    <i className="ti-user" />
                                    <i
                                      className="ti-user"
                                      style={{ marginLeft: "-19px" }}
                                    />
                                  </div>
                                  <a href="/groups" title="#">
                                    ShareGroups
                                  </a>
                                </li>
                                <li>
                                  <div
                                    style={{
                                      marginRight: "12px",
                                      display: "inline",
                                    }}
                                  >
                                    <i className="ti-link" />
                                  </div>

                                  <a href="/shareFeed" title="#">
                                    SharePoint
                                  </a>
                                </li>
                                <li>
                                  <div
                                    style={{
                                      marginRight: "12px",
                                      display: "inline",
                                    }}
                                  >
                                    <i className="ti-control-shuffle" />
                                  </div>

                                  <a href="/swapFeed" title="#">
                                    SwapPoint
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {/* Shortcuts */}
                        </aside>
                      </div>
                      {/* sidebar */}
                      {/* ------------------------------------------------------------------------- */}
                      {props.children}
                      {/* --------------------------------------------------------------------------------- */}
                      {/* centerl meta */}
                      <div className="col-lg-3">
                        <aside
                          className="sidebar static "
                          style={{ paddingTop: "20px" }}
                        >
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

                          <div
                            style={{
                              paddingBottom: "20px",
                              // borderBottom: '1px solid #75757530'
                            }}
                          >
                            <div className="sidebar-news">
                              <div className="media-date">What's trending</div>
                              <div style={{}}>
                                <ul>
                                  <li>
                                    <div className="headline-cont">
                                      <p className="headline">
                                        Omicron variant of COVID-19: New travel
                                        guidelines to come into force from
                                        December 1
                                      </p>
                                      <img src={img1} />
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <a
                                        href=" https://www.aljazeera.com/where/qatar/"
                                        target="_blank"
                                        className="source"
                                      >
                                        Aljazeera Qatar News
                                      </a>
                                      <p className="date">12/1/2021</p>
                                    </div>
                                  </li>

                                  <li>
                                    <div className="headline-cont">
                                      <p className="headline">
                                        Prime Minister Scott Morrison says big
                                        tech firms have responsibility to ensure
                                        their platforms are safe.
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <a
                                        href="https://www.theverge.com/tech"
                                        target="_blank"
                                        className="source"
                                      >
                                        Technology
                                      </a>
                                      <p className="date">12/1/2021</p>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="headline-cont">
                                      <p className="headline">
                                        Comprehensive Guide to Qatar Business
                                        ....
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <a
                                        href="https://thepeninsulaqatar.com/category/Qatar-Business"
                                        target="_blank"
                                        className="source"
                                      >
                                        Business
                                      </a>
                                      <p className="date">12/1/2021</p>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="headline-cont">
                                      <p className="headline">
                                        The #FIFArabCup Qatar 2021 kicks off
                                        today, coinciding with the inauguration
                                        of Al Bayt Stadium and Stadium 974, the
                                        latest stadiums to be ready for the FIFA
                                        World Cup 2022
                                      </p>
                                    </div>

                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <a
                                        href="https://www.dohanews.co/category/sports/"
                                        target="_blank"
                                        className="source"
                                      >
                                        Sports
                                      </a>
                                      <p className="date">12/1/2021</p>
                                    </div>
                                  </li>
                                  <li
                                    style={{
                                      textAlign: "center",
                                      paddingTop: "10px",
                                    }}
                                  >
                                    <a
                                      href="https://www.aljazeera.com/"
                                      style={{
                                        fontSize: "12px",
                                        color: "#258eae",
                                      }}
                                      target="_blank"
                                    >
                                      Show More
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="sidebar-news" style={{}}>
                            <div className="media-date">REELS</div>
                            <div style={{}}>
                              <ul>
                                <li>
                                  <div>
                                    {reelPreviewPath &&
                                    reelPreviewPath.length > 0 ? (
                                      <ul className="slidestry">
                                        {reelPreviewPath
                                          .slice(0, 2)
                                          .map((reel, index) => (
                                            <Popup
                                              trigger={
                                                <li
                                                  className="slideitemreelside"
                                                  key={reel.id}
                                                  id={index}
                                                >
                                                  <ReelsComponentFriends
                                                    reel={reel}
                                                    setRefresh={setRefresh}
                                                  />
                                                </li>
                                              }
                                              modal
                                            >
                                              {(close) => (
                                                <Form>
                                                  <div style={{ width: "5%" }}>
                                                    <a
                                                      href="#!"
                                                      onClick={close}
                                                    >
                                                      <i
                                                        style={{
                                                          color: "#fff",
                                                          padding: "10px",
                                                          fontSize: "30px",
                                                        }}
                                                        className="las la-times"
                                                      ></i>
                                                    </a>
                                                  </div>
                                                  <DisplayFriendsReelsComponent
                                                    key={reel.id}
                                                    id={index}
                                                    reel={reel}
                                                    setRefresh={setRefresh}
                                                    index={index}
                                                  />
                                                </Form>
                                              )}
                                            </Popup>
                                          ))}
                                      </ul>
                                    ) : (
                                      <div
                                        className="center"
                                        style={{ padding: "20px" }}
                                      >
                                        No Reels to show
                                      </div>
                                    )}
                                  </div>
                                </li>

                                <Popup
                                  trigger={
                                    <div className="add-reel"> Add Reel</div>
                                  }
                                  modal
                                >
                                  {(close) => (
                                    <Form className="popwidth">
                                      <div className="headpop">
                                        <div style={{ padding: "10px" }}>
                                          <span>
                                            <a
                                              href="#!"
                                              style={{
                                                padding: "10px 150px 10px 0",
                                              }}
                                              onClick={close}
                                            >
                                              <i className="las la-times"></i>
                                            </a>
                                          </span>
                                          <span
                                            style={{
                                              color: "#000000",
                                              fontSize: "14px",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Lets Add Reel Video
                                          </span>

                                          {/* { checkIfUserAlreadyPostStory(storyauth.user) ?  */}
                                          <span style={{ float: "right" }}>
                                            {" "}
                                            <button
                                              style={{
                                                float: "right",
                                                borderRadius: "20px",
                                                padding: "5px 20px",
                                              }}
                                              type="submit"
                                              onClick={uploadReels}
                                            >
                                              Upload
                                            </button>
                                          </span>
                                          {/* :null}  */}
                                        </div>
                                      </div>

                                      <div
                                        style={{ margin: "0 11px 10px 11px" }}
                                      >
                                        <span className="textPop">
                                          {ShowReelVideo ? (
                                            <>
                                              <video
                                                id="video"
                                                width="100%"
                                                height={"350px"}
                                                controls="controls"
                                              >
                                                <source src={ReelVideo} />
                                              </video>

                                              <button
                                                onClick={handleRemoveReelVideo}
                                                style={{
                                                  right: "20px",
                                                  position: "absolute",
                                                  borderRadius: "100%",
                                                  background: "#b7b7b738",
                                                  padding: "10px 10px",
                                                }}
                                              >
                                                <i className="las la-times"></i>
                                              </button>
                                            </>
                                          ) : (
                                            <div
                                              style={{ textAlign: "center" }}
                                            >
                                              <label className="fileContainer">
                                                <div
                                                  className="reelvideo"
                                                  type="submit"
                                                >
                                                  <input
                                                    type="file"
                                                    name="reel_video"
                                                    accept="video/*"
                                                    onChange={handleFileReel}
                                                  ></input>
                                                  Add Reel Video
                                                </div>
                                              </label>
                                            </div>
                                          )}
                                        </span>
                                        <textarea
                                          className="textpopup"
                                          rows={2}
                                          placeholder={
                                            "Add Caption to your Reel"
                                          }
                                          name="reel_content"
                                          value={reelContent}
                                          onChange={handleReelContent}
                                        />
                                        {/* <div className='storyErr'>{uploadErrorStory ? `${uploadErrorStory}` : null}</div> */}
                                      </div>
                                      {/* </> 
                                                   
                                 )}  */}
                                    </Form>
                                  )}
                                </Popup>

                                <div className="add-reel">
                                  <a
                                    href="/reelFeed"
                                    style={{ color: "white" }}
                                  >
                                    {" "}
                                    Explore Reels{" "}
                                  </a>
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
    )
  );
}
