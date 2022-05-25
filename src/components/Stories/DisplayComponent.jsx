import React, { useState, useEffect, useContext, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import AuthService from "../../services/auth.services";
import { testScript } from "../../js/script";
import StoriesService from "../../services/StoriesService";
import ShareupInsideHeaderComponent from "../dashboard/ShareupInsideHeaderComponent";
import settings from "../../services/Settings";
import fileStorage from "../../config/fileStorage";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Popup from "reactjs-popup";
import Form from "react-bootstrap/Form";
import ViewersListComponent from "./ViewersListComponent";

function DisplayComponent() {
  let history = useHistory();

  const { user } = useContext(UserContext);
  // const inputRef = createRef();
  const [hasTimeElapsed, setHasTimeElapsed] = React.useState(false);
  const [storiesForUser, setStoriesForUser] = useState([]);
  const [storiesForUserFriends, setStoriesForUserFriends] = useState([]);
  const [stories, setStories] = useState([]);
  const [FriendsStories, setFriendsStories] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [uploadErrorStory, setUploadErrorStory] = useState("");
  const [storiesS, setStoriesS] = useState([]);
  const [userR, setUserR] = useState([]);
  const [filesStry, setFilesStry] = useState({});
  const [showstoriesImage, setShowstoriesImage] = useState(false);
  const [storiesImage, setStoriesImage] = useState([]);
  const [storyContent, setStoryContent] = useState("");

  const delay = 5000;

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const updateStories = (event) => {
    event.preventDefault();
    setUploadErrorStory("");
    if (
      storyContent === "" &&
      Object.keys(filesStry).length === 0 &&
      filesStry.constructor === Object
    ) {
      setUploadErrorStory("Please Add Image for Stories");
      console.log(uploadErrorStory);
      return;
    }

    const formData = new FormData();
    handleFileStry();
    handleStoryContent();
    formData.append("caption", storyContent);
    formData.append(`stryfiles`, filesStry);
    StoriesService.updateStories(stories.id, formData).then((res) => {
      handleRemoveImageStry();
      setStories(res.data);
      setRefresh(res.data);
    });
  };
  const handleFileStry = (event) => {
    setFilesStry(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setStoriesImage(reader.result);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
    setShowstoriesImage(true);
  };

  const handleEditeFileStry = (StoryImg) => {
    setStoriesImage(StoryImg);
    setShowstoriesImage(true);
  };

  const handleRemoveImageStry = () => {
    setFilesStry({});
    setShowstoriesImage(false);
  };
  const handleStoryContent = (event) => {
    setStoryContent(event.target.value);
  };
  const handleEditStoryContent = (StoryCaption) => {
    setStoryContent(StoryCaption);
  };
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const getStoriesForUser = async () => {
    await StoriesService.getStoriesForUser(
      AuthService.getCurrentUser().username
    ).then((res) => {
      const sorting = res.data.sort(function (a, b) {
        let dateA = new Date(a.date),
          dateB = new Date(b.date);
        return dateA - dateB;
      });
      const uniqueStories = Array.from(new Set(sorting.map((a) => a.id))).map(
        (id) => {
          return res.data.find((a) => a.id === id);
        }
      );

      setStoriesForUser(uniqueStories);
    });
  };
  const [refresh, setRefresh] = useState(null);

  const handleEditStory = (id) => {};

  const handleDeleteStory = (storyId) => {
    StoriesService.deleteStories(storyId).then((res) => {
      console.log("Story deleted");
      setRefresh(res.data);
    });
  };
  const getUser = async () => {
    if (user === null) {
      await UserService.getUserByEmail(
        AuthService.getCurrentUser().username
      ).then((res) => {
        setUserR(res.data);
      });
    } else {
      setUserR(user);
    }
  };

  function getFileExtension(filename){
    const extension = filename.split('.').pop();
    return extension;
}


  useEffect(() => {
    testScript();
  }, []);
  useEffect(() => {
    getUser();
    getStoriesForUser();
    testScript();
  }, [stories]);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === storiesForUser.length - 1
            ? setTimeout(
                () =>
                  (document.querySelector(".popup-overlay").style.display =
                    "none"),
                200
              )
            : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <>
      <div className="stryDsply">
        <div className="container">
          <div className="strydivcontnr">
            <div className="strydiv">
              <div className="slideshow">
                <div
                  className="slideshowSlider"
                  style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
                >
                  {storiesForUser.map((background, index) => (
                    <>
                      {background.image ? (
                        <div className="slide" key={index} id={index}>
                          <div className="strydisplay-Profimg">
                            <img
                              src={
                                fileStorage.baseUrl +
                                background.user.profilePicturePath
                              }
                              alt=""
                            />
                            <span>
                              {background.user.firstName}

                              <div style={{ marginLeft: "380px" }}>
                                <DropdownButton
                                  // style={{marginLeft: "400px" }}
                                  className={`bi bi-three-dots-vertical`}
                                  onClick={() =>
                                    window.clearTimeout(timeoutRef.current)
                                  }
                                >
                                  <Dropdown.Item>
                                    <Popup
                                      trigger={
                                        <div>
                                          <i className="las la-pencil-alt"></i>
                                          <span>Edit Story</span>
                                        </div>
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
                                                    padding:
                                                      "10px 150px 10px 0",
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
                                                Lets update Stories
                                              </span>

                                              <span style={{ float: "right" }}>
                                                {" "}
                                                <button
                                                  style={{
                                                    float: "right",
                                                    borderRadius: "20px",
                                                    padding: "5px 20px",
                                                  }}
                                                  type="submit"
                                                  onClick={updateStories}
                                                >
                                                  Update
                                                </button>
                                              </span>
                                            </div>
                                          </div>

                                          <div
                                            style={{
                                              margin: "0 11px 10px 11px",
                                            }}
                                          >
                                            <span className="textPop">
                                              {showstoriesImage ? (
                                                <>
                                                  <img
                                                    id="preview"
                                                    src={
                                                      fileStorage.baseUrl +
                                                      background.storiesImagePath
                                                    }
                                                    style={{ width: "100%" }}
                                                  />

                                                  <button
                                                    onClick={
                                                      handleRemoveImageStry
                                                    }
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
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  <label className="fileContainer">
                                                    <div
                                                      className="storypic"
                                                      type="submit"
                                                    >
                                                      <input
                                                        type="file"
                                                        name="swap_image"
                                                        accept="image/*"
                                                        onChange={handleEditeFileStry(
                                                          fileStorage.baseUrl +
                                                            background.image
                                                        )}
                                                      ></input>
                                                      Add Story
                                                    </div>
                                                  </label>
                                                </div>
                                              )}
                                              <textarea
                                                className="textpopup"
                                                rows={2}
                                                placeholder={
                                                  "Add text to your Story"
                                                }
                                                name="story_content"
                                                value={storyContent}
                                                onChange={handleEditStoryContent(
                                                  background.caption
                                                )}
                                              />
                                            </span>
                                            <div className="storyErr">
                                              {uploadErrorStory
                                                ? `${uploadErrorStory}`
                                                : null}
                                            </div>
                                          </div>
                                        </Form>
                                      )}
                                    </Popup>
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    type="button"
                                    onClick={() => {
                                      handleDeleteStory(background.id);
                                    }}
                                  >
                                    <i className="las la-trash"></i>
                                    <span>Delete</span>
                                  </Dropdown.Item>
                                </DropdownButton>
                              </div>
                            </span>

                            <div style={{ marginTop: "500px" }}>
                              <span>{background.caption}</span>
                            </div>
                            <Popup
                              style={{ padding: "0px" }}
                              trigger={
                                <a
                                  onClick={window.clearTimeout(
                                    timeoutRef.current
                                  )}
                                  className={"far fa-eye"}
                                  style={{ color: "GrayText" }}
                                >
                                  {" Seen:" + background.views}
                                </a>
                              }
                              modal
                            >
                              {(close) => (
                                <>
                                  <div>
                                    <div className="row">
                                      <div style={{ width: "5%" }}>
                                        <a onClick={close}>
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
                                    </div>
                                  </div>
                                  <ViewersListComponent
                                    key={background.id}
                                    storyID={background.id}
                                  />
                                </>
                              )}
                            </Popup>
                          </div>                          

                          {getFileExtension(background.image) !== "mp4" ? (
                            <img
                              onClick={() =>
                                window.clearTimeout(timeoutRef.current)
                              }
                              className="stryDsplyImg"
                              src={
                                fileStorage.baseUrl +
                                background.storiesImagePath
                              }
                            />
                          ) : (
                            <>
                              <video
                                preload="none"
                                controls
                                loop
                                autoPlay
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "fill",
                                }}
                                src={`${fileStorage.baseUrl}${background.storiesImagePath}`}
                                type="video/mp4"
                                alt={`${fileStorage.baseUrl}${background.storiesImagePath}`}
                              />
                            </>
                          )}
                        </div>
                      ) : null}
                    </>
                  ))}
                </div>

                <div className="slideshowDots">
                  {storiesForUser.map((_, idx) => (
                    <div
                      key={idx}
                      className={`slideshowDot${
                        index === idx ? " active" : ""
                      }`}
                      onClick={() => {
                        setIndex(idx);
                      }}
                    >
                      <span className="risewidth"></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="slide-buttons">
              {index + 1 < storiesForUser.length ? (
                <span
                  id="getnext"
                  onClick={() => {
                    setIndex(index + 1);
                  }}
                >
                  <i className="fas fa-arrow-right"></i>
                </span>
              ) : (
                ""
              )}

              {index > 0 ? (
                <span
                  id="getprev"
                  onClick={() => {
                    setIndex(index - 1);
                  }}
                >
                  <i className="fas fa-arrow-left"></i>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DisplayComponent;
