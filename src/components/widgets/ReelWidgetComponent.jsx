import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import fileStorage from "../../config/fileStorage";
import ReelsServices from "../../services/ReelsServices";

import Popup from "reactjs-popup";

import ReelsComponentFriends from "../Reels/ReelsComponentFriends";
import DisplayFriendsReelsComponent from "../Reels/DisplayFriendsReelsComponent";

export default function ReelWidgetComponent(props) {
  let history = useHistory();

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
      handleRemoveReelVideo();
      setReels(res.data);
      setReelContent("")
      setRefresh(res.data);
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
    // if(event.target.files[0].type === blob){
    reader.readAsDataURL(event.target.files[0]);
    // }
    setShowReelVideo(true);
  };
  const handleReelContent = (event) => {
    setReelContent(event.target.value);
  };
  const likeReel = async (reelId) => {
    let params = {}
    await ReelsServices.likeReel(user.id, reelId, params).then((res) => {
      getReelForUserFriends()

    })
  }
  const handleRemoveReelVideo = () => {
    setFilesReel({});
    setShowReelVideo(false);
  };
  return (
    <div className="sidebar-news sidebar-reel">
      <div className="media-date">REELS</div>
      <div style={{}}>
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
                    className='reel-popup'
                  >
                    {(close) => (
                      <Form  >
                        <div style={{ width: "5%" }}>
                          <a href="#!" onClick={close}>
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
                        <DisplayFriendsReelsComponent key={reel.id} id={index}
                          reel={reel}
                          likeReel={likeReel}
                          setRefresh={setRefresh}
                          index={index}
                        />
                      </Form>
                    )}
                  </Popup>
                ))}
              {
                reelPreviewPath.length > 2 ?
                  <li className="more-reels" >
                    <a href="/reelFeed"><i className="fas fa-arrow-right"></i></a>
                  </li>
                  : null
              }
            </ul>
          ) : (
            <div
              className="center"
              style={{ padding: "20px" }}
            >
              No Reels to show
            </div>
          )}
          <div className="d-flex justify-content-between pl-15 pr-15 pt-10 pb-10">
            <Popup
              trigger={
                <div className="add-reel"> Add Reel</div>
              }
              modal
            >
              {(close) => (
                <Form className="popwidth">
                  <div className="headpop">
                    <span>
                      <a
                        href="#!"
                        onClick={close}
                      >
                        <i className="las la-times"></i>
                      </a>
                    </span>
                    <span
                      className="poptitle"
                    >
                      Lets Add Reels
                    </span>

                    {/* { checkIfUserAlreadyPostStory(storyauth.user) ?  */}
                    <span style={{ float: "right" }}>
                      {" "}
                      {/* <button
                        style={{
                          float: "right",
                          borderRadius: "20px",
                          padding: "5px 20px",
                        }}
                        type="submit"
                        onClick={uploadReels}
                      >
                        Upload
                      </button> */}
                    </span>
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
                            src={ReelVideo}
                            height={"350px"}
                            controls="controls"
                          >
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
                  <button className="popsbmt-btn" type="submit" onClick={uploadReels}>SHARE REEL</button>
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
          </div>
        </div>
      </div>
    </div>

  )
}

