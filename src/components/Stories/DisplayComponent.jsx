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
import moment from "moment";
import $ from "jquery";
import { Modal } from "react-bootstrap";

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
  const [editStory, setEditStory] = useState();
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(null);
  const [showViewersModal, setShowViewersModal] = useState(false);
  const [storyView, setStoryView] = useState();


  const handleCloseModal = () => { setShowModal(false) };
  const handleShowModal = () => { setShowModal(true) };

  const handleCloseViewersModal = () => { setShowViewersModal(false) };
  const handleShowViewersModal = () => { setShowViewersModal(true) };

  const delay = 5000;

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const updateStories = (event, story) => {
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
    // handleFileStry();
    // handleStoryContent();
    formData.append("caption", storyContent);
    formData.append(`stryfiles`, filesStry);
    StoriesService.updateStories(story.id, formData).then((res) => {
      handleRemoveImageStry();
      handleCloseModal();
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
    // e.preventDefault()
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

  const handleEditStory = (id) => { };

  const handleDeleteStory = (storyId) => {
    StoriesService.deleteStories(storyId).then((res) => {
      console.log("Story deleted");
      window.location.reload();
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

  function getFileExtension(filename) {
    const extension = filename.split(".").pop();
    return extension;
  }

  useEffect(() => {
    getUser();
    getStoriesForUser();
    testScript();
  }, []);

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
  const nextSlide = (a) => {
    // a.preventDefault();
    // setIndex(a);
  };

  const editStoryModal = () => {
    // console.log(editStory)
    let background = editStory;
    return (
      <Form className="popwidth">
        <div className="headpop">
          <span>
            <a
              href="#!"
              style={{
                padding: "10px 150px 10px 0",
              }}
              onClick={handleCloseModal}
            >
              <i className="las la-times"></i>
            </a>
          </span>
          <span className="poptitle">Update Story</span>

          <span style={{ float: "right" }}>
            {" "}
            <button
              style={{
                float: "right",
                borderRadius: "20px",
                padding: "5px 20px",
              }}
              type="submit"
              onClick={(e) => updateStories(e, editStory)}
            >
              Update
            </button>
          </span>
        </div>

        <div
          style={{
            margin: "0 11px 10px 11px",
          }}
        >
          <span className="textPop">
            {showstoriesImage ? (
              <div style={{ position: "relative" }}>
                <img
                  id="preview"
                  src={fileStorage.baseUrl + background.storiesImagePath}
                  style={{ width: "100%", borderRadius: "10px" }}
                />


              </div>
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
              value={storyContent ? storyContent : background.caption}
              onChange={(e) => handleStoryContent(e, background.caption)}
            />
          </span>

          {uploadErrorStory
            ? <div className="storyErr">`${uploadErrorStory}`</div>
            : null}

        </div>
        <button class="popsbmt-btn" type="submit"
          onClick={(e) => updateStories(e, editStory)}>UPDATE</button>
      </Form>
    )
  }
  const editClicked = async (e, story) => {
    e.preventDefault();
    console.log(story);
    await setEditStory(story);
    await setShowModal(true);
  }
  const handleViewClick = (story) => {
    setStoryView(story)
    window.clearTimeout(timeoutRef.current);
    handleShowViewersModal()
  }
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
                            <div className="d-flex justify-content-between">
                              <div>
                                <img
                                  src={
                                    fileStorage.baseUrl +
                                    background.user.profilePicturePath
                                  }
                                  alt=""
                                />
                                <span style={{ color: "white" }}>
                                  My story
                                </span>
                                <span className="story-date">
                                  {moment(
                                    background.date,
                                    "DD MMMM YYYY hh:mm:ss"
                                  ).fromNow(true)}
                                </span>
                              </div>

                              <div>
                                <DropdownButton
                                  // style={{marginLeft: "400px" }}
                                  className={`bi bi-three-dots-vertical`}
                                  title={<i className="las la-ellipsis-v"></i>}
                                  onClick={() =>
                                    window.clearTimeout(timeoutRef.current)
                                  }
                                >
                                  <Dropdown.Item
                                    type="button"
                                    onClick={(e) => editClicked(e, background)}
                                  >
                                    <i className="las la-pencil-alt"></i>
                                    <span>Edit Story</span>
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
                            </div>
                          </div>
                          <div className="story-caption-cont">
                            <span style={{ padding: '10px', color: 'white' }}>{background.caption}</span>

                            <a
                              onClick={() =>
                                // window.clearTimeout(timeoutRef.current);
                                handleViewClick(background)
                              }
                              className={"far fa-eye"}
                              style={{
                                color: "GrayText",
                                paddingBottom: "10px",
                                color: "white",
                              }}
                            >
                              &nbsp;&nbsp;{background.views}
                            </a>
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
                      className={`slideshowDot${index === idx ? " active" : ""
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
            <div class="slide-buttons">
              {index + 1 < storiesForUser.length ? (
                <span
                  id="getnext"
                  onClick={() => {
                    setIndex(index + 1);
                  }}
                >
                  <i class="fas fa-arrow-right"></i>
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
                  <i class="fas fa-arrow-left"></i>
                </span>
              ) : null}
            </div>
            {
              // editStory.id===background.id?
              showModal === true ?
                <div className="editStry-cont">
                  <div className="editStry-popup">
                    {editStoryModal()}
                  </div>
                </div>

                : null
            }
            {
              showViewersModal ?
                <div className="editStry-cont">
                  <div className="editStry-popup">

                    <ViewersListComponent
                      handleCloseModal={handleCloseViewersModal}
                      // key={background.id}
                      storyID={
                        storyView.id}
                    />
                  </div>
                </div>
                : null
            }

          </div>
        </div>
      </div>
    </>
  )
}

export default DisplayComponent;
