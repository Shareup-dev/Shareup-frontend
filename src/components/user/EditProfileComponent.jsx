import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import PostService from "../../services/PostService";
import AuthService from "../../services/auth.services";
import SimpleReactLightbox from "simple-react-lightbox";
import { testScript } from "../../js/script";
import settings from "../../services/Settings";

import ShareupInsideHeaderComponent from "../dashboard/ShareupInsideHeaderComponent";
import Layout from "../LayoutComponent";
import fileStorage from "../../config/fileStorage";
import AboutmeModal from "./AboutmeModal";
import DetailsModal from "./DetailsModal";
import HobiesModal from "./HobiesModal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Modal.css";
import "./NaajApp.css";
export default function EditProfileComponent() {
  let history = useHistory();
  const [DescribeYourself, setDescribeYourself] = useState("");
  const { user } = useContext(UserContext);
  const handleDescribeYourself = (event) => {
    setDescribeYourself(event.target.value);
  };
  const [temp, setTemp] = useState("");
  const [profilePicturePath, setprofilePicturePath] = useState(null);
  const [profileRender, setProfileRender] = useState(null);
  const [showprofilePicturePath, setShowprofilePicturePath] = useState(false);
  const [userProfile, setUserProfile] = useState([]);
  const [refresh, setRefresh] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [aboutme, setAboutme] = useState("");
  const [job, setJob] = useState("");
  const [birthday_date, setBirthdayDate] = useState("");
  const [optional_email, setOptionalEmail] = useState("");
  const [homeTown, setHomeTown] = useState("");
  const [gender, setGender] = useState("");
  const [currentTown, setCurrentTown] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [interests, setInterests] = useState("");
  //Najam start here
  const [id, setId] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [DetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [HobiesModalOpen, setHobiesModalOpen] = useState(false);
  const [country, setCountry] = useState("");

  //Najam end here

  const [show, setShow] = useState("overview");
  const handleProfileImage = (event) => {
    let validated = false;
    setprofilePicturePath(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileRender(reader.result);
      }
    };
    reader.readAsDataURL(event.target.files[0]);
    setShowprofilePicturePath(true);
  };
  const currentUserGet = async () => {
    await UserService.getUserByEmail(
      AuthService.getCurrentUser().username
    ).then((res) => {
      console.log(JSON.stringify(res.data));
      setUserProfile(res.data);
      setId(res.data.id);
      setFirstName(res.data.firstName);
      setLastName(res.data.lastName);
      setEmail(res.data.email);
      setRole(res.data.role);
      setAboutme(res.data.aboutme);
      setJob(res.data.job);
      setHomeTown(res.data.hometown);
      setGender(res.data.gender);
      setCurrentTown(res.data.currenttown);
      setRelationshipStatus(res.data.relationshipstatus);
      setInterests(res.data.interests);
      setBirthdayDate(res.data.birthday_date);
      setOptionalEmail(res.data.optional_email);
    });
  };
  const updateProfile = async () => {
    let updateduser = {
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      optional_email: optional_email,
      email: birthday_date,
      aboutme: aboutme,
      job: job,
      gender: gender,
      hometown: homeTown,
      currenttown: currentTown,
      relationshipstatus: relationshipStatus,
      interests: interests,
    };
    UserService.editProfile(user.email, updateduser).then((res) => {
      setUserProfile(res.data);
    });
    addP();
    setModalOpen(false);
    setDetailsModalOpen(false);
    setHobiesModalOpen(false);
  };
  const handleAboutme = (event) => {
    setAboutme(event.target.value);
  };
  const handleOptionalEmail = (event) => {
    setOptionalEmail(event.target.value);
  };
  const handleBirthdayDate = (event) => {
    setBirthdayDate(event.target.value);
  };
  const handleHomeTown = (event) => {
    setHomeTown(event.target.value);
  };
  const handleCurrentTown = (event) => {
    setCurrentTown(event.target.value);
  };
  const handleRelationshipStatus = (event) => {
    setRelationshipStatus(event.target.value);
  };
  const handleInterests = (event) => {
    setInterests(event.target.value);
  };
  const handleGender = (event) => {
    setGender(event.target.value);
  };

  // By najam start here
  const [p_no, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const myid = id;

  const handlePhone = (event) => {
    setPhone(event.target.value);
  };
  const handleDate = (event) => {
    setDob(event.target.value);
  };

  const addP = () => {
    localStorage.setItem("phone", JSON.stringify([{ myid, p_no }]));
    localStorage.setItem("Datebaba", JSON.stringify([{ myid, dob }]));
    setPhone(p_no);
    setDob(dob);
    callPhone();
  };
  const callPhone = () => {
    const getPhone1 = JSON.parse(localStorage.getItem("phone"));
    const getDate1 = JSON.parse(localStorage.getItem("Datebaba"));
    console.log("getatsk baba", getPhone1[0].p_no);
    setPhone(getPhone1[0].p_no);
    setDob(getDate1[0].dob);
  };

  const hideFunction = () => {
    show();
  };

  const clrAboutMe = () => {
    setAboutme("");
  };

  // By najam end here
  const uploadprofilePicturePath = async () => {
    if (profilePicturePath === "") {
      console.log("cant be null");
      return;
    }
    const formData = new FormData();
    formData.append("profilePicture", profilePicturePath);
    await UserService.uploadProfilePicture(user.email, formData).then((res) => {
      window.location.reload();
    });
  };
  const getPhone1 = JSON.parse(localStorage.getItem("phone"));
  useEffect(() => {
    currentUserGet();
    //najam start
    if (getPhone1 === null) {
      setPhone();
    } else {
      setPhone(getPhone1[0].p_no);
    }
    //najam end
  }, [refresh]);

  const getDate2 = JSON.parse(localStorage.getItem("Datebaba"));

  useEffect(() => {
    currentUserGet();
    //najam start
    if (getDate2 === null) {
      setDob();
    } else {
      setDob(getDate2[0].dob);
    }
    //najam start
  }, [refresh]);
  const changeView = () => {
    if (show === "overview") {
      return (
        <div className="right-edit-profile">
          <div className="right-edit-profile-content">
            <div className="right-edit-profile-image">
              <label className="fileContainer ">
                <div className="add-prof mrgnFileCntnrEdtProf">+</div>
                <input
                  id="file-input"
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  onChange={handleProfileImage}
                ></input>
              </label>

              {showprofilePicturePath ? (
                <>
                  <img id="preview profprvw" src={profileRender} />
                  <div>
                    <button
                      className="button"
                      id="submit"
                      name="submit"
                      onClick={uploadprofilePicturePath}
                    >
                      Upload
                    </button>
                  </div>{" "}
                </>
              ) : (
                <>
                  {" "}
                  <img
                    src={
                      userProfile.profilePicturePath
                        ? fileStorage.baseUrl + userProfile.profilePicturePath
                        : "	http://192.168.100.2:3000/data/user/default/profile_picture/default.png"
                    }
                  ></img>{" "}
                </>
              )}

              {/* <form className="edit-phto"> */}

              {/* <i className="fa fa-camera-retro"></i> */}

              {/* </form> */}
              <p className="font-weight-bold mt-4" style={{ color: "#033347" }}>
                {firstName} {lastName}
              </p>
            </div>
            <div className="right-edit-profile-bio">
              <div className="right-edit-profile-bio-top">
                <p>Bio</p>
                <p className="">
                  <a
                    href="#"
                    className="text-color"
                    onClick={() => {
                      setModalOpen(true);
                    }}
                  >
                    {aboutme ? "Edit" : "Add"}
                  </a>

                  {modalOpen && (
                    <AboutmeModal
                      setOpenModal={setModalOpen}
                      handleAboutme={handleAboutme}
                      updateProfile={updateProfile}
                      Fvalue={aboutme}
                      clrAboutMe={clrAboutMe}
                    />
                  )}
                </p>
                {/*modal ends */}
              </div>
              <div className="right-edit-profile-bio-after">
                {/*  <input type="text" className="inpt" id="DescribeYourself" placeholder="DescribeYourself" value={aboutme} onChange={handleAboutme}
    />*/}
                <p>{aboutme ? aboutme : "Describe yourself"}</p>
              </div>
            </div>
            <div className="right-edit-profile-bio">
              <div className="right-edit-profile-bio-top">
                <p>Details</p>
                {/*modal start */}

                <p className="">
                  <a
                    href="#"
                    className="text-color"
                    onClick={() => {
                      setDetailsModalOpen(true);
                    }}
                  >
                    {currentTown ? "Edit" : "Add"}
                  </a>

                  {DetailsModalOpen && (
                    <DetailsModal
                      setDetailsModalOpen={setDetailsModalOpen}
                      homeTown={homeTown}
                      currentTown={currentTown}
                      relationshipStatus={relationshipStatus}
                      updateProfile={updateProfile}
                      setRelationshipStatus={setRelationshipStatus}
                      setCurrentTown={setCurrentTown}
                      setHomeTown={setHomeTown}
                      clrAboutMe={clrAboutMe}
                    />
                  )}
                </p>
                {/*modal ends */}
              </div>
              <div className="right-edit-profile-details">
                <ul>
                  {/* <span className="text-color-2">Current town / city</span> */}
                  <li>
                    <p>
                      <i
                        className="las la-home"
                        aria-hidden="true"
                        style={{ fontSize: "1.1rem" }}
                      >
                        <span className="text-color-2">       Current Country : </span>
                        <span className="text-color-2">
                          {" "}
                          {currentTown ? currentTown : "Add current country"}
                        </span>
                      </i>
                    </p>
                  </li>

                  <li>
                    <p>
                      <i className="las la-map-marker" style={{ fontSize: "1.1rem" }}>
                        <span className="text-color-2">       Current Home town :
                        </span>

                        <span className="text-color-2">
                          {homeTown ? homeTown : "Add current city"}
                        </span>
                      </i>
                    </p>
                  </li>
                  <li>
                    <p>
                      <i className="lab la-gratipay" style={{ fontSize: "1.1rem" }}>
                        <span className="text-color-2">       Relationship status :
                        </span>
                        <span className="text-color-2">
                          {relationshipStatus
                            ? relationshipStatus
                            : "Add Relationship status"}
                        </span>{" "}
                      </i>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="right-edit-profile-bio">
              <div className="right-edit-profile-bio-top">
                <p>Hobbies</p>
                {/*modal start here */}
                <p className="">
                  <a
                    href="#"
                    className="text-color"
                    onClick={() => {
                      setHobiesModalOpen(true);
                    }}
                  >
                    {interests ? "Edit" : "Add"}
                  </a>

                  {HobiesModalOpen && (
                    <HobiesModal
                      setHobiesModalOpen={setHobiesModalOpen}
                      setInterest={setInterests}
                      updateProfile={updateProfile}
                      interests={interests}
                      clrAboutMe={clrAboutMe}
                    />
                  )}
                </p>
                {/*modal ends */}{" "}
              </div>
              <div className="right-edit-profile-details">
                <div className="right-edit-profile-bio-after">
                  {/* <input type="text" className="inpt" id="DescribeYourself" placeholder="Add Your Hobbies" value={interests} setInterests={setInterests} onChange={handleInterests}></input> */}
                  <p>{interests ? interests : "Add you hobby here"}</p>
                  {/* <p><span className="text-color-2">Add your hobbies...</span></p> */}
                </div>
              </div>
            </div>
            <div className="right-edit-more-details">
              <p>
                <span className="text-color">
                  Switch to Professional account
                </span>
              </p>
            </div>
            <div className="right-edit-more-details">
              <p>
                <span className="text-color">
                  Professional information settings
                </span>
              </p>
            </div>
          </div>
        </div>
      );
    }
    if (show === "personal information") {
      return (
        <div className="right-edit-profile">
          <div className="right-edit-profile-content">
            <div className="right-edit-personal-information-top">
              <h1>Personal information</h1>
            </div>
            <div className="right-edit-personal-information">
              <p>
                Provide your Personal information, even if the account is used
                for a bussiness , a pet or something else. This wont be part of
                your public profile
              </p>
              <div className="right-edit-profile-details padding">
                <ul>
                  <li className="border-bottom">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        textAlign: "left",
                      }}
                    >
                      <p>Email Address</p>
                    </div>
                    <div className="right-edit-details-input">
                      {userProfile.email}
                    </div>
                  </li>
                  <li className="border-bottom">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        textAlign: "left",
                      }}
                    >
                      <p>Phone Number</p>
                    </div>
                    <div className="right-edit-details-input d-flex">
                      <input type="tel" value={p_no} onChange={handlePhone} />
                    </div>
                    <div>
                      {/* <PhoneInput
          country={'qa'}
          value={this.state.phone}
          onChange={handlePhone}
        /> */}
                    </div>
                  </li>
                  <li className="border-bottom">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        textAlign: "left",
                      }}
                    >
                      <p>Gender</p>
                    </div>
                    {/* <div className="right-edit-details-input"><input type="text" value={gender} onChange={handleGender} /></div> */}

                    <select
                      className=""
                      aria-label="Default select example"
                      onChange={(e) => {
                        const selectedGender = e.target.value;
                        setGender(selectedGender);
                      }}
                      style={{ borderColor: "white" }}
                    >
                      <option selected>
                        {gender ? gender : "Select gender"}
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </li>

                  <li className="border-bottom">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        textAlign: "left",
                      }}
                    >
                      <p>Date of Birth</p>
                    </div>
                    <div className="right-edit-details-input">
                      <input type="date" value={dob} onChange={handleDate} />
                    </div>
                  </li>
                </ul>
              </div>
              <div style={{ textAlign: "center", padding: "5px" }}>
                <button onClick={updateProfile}>Save</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (show === "your details") {
      return (
        <div className="right-edit-profile">
          <div className="right-edit-profile-content">
            <div className="right-edit-personal-information-top">
              <h1>Your Details</h1>
            </div>
            <div className="right-edit-profile-details padding">
              <ul>
                <li className="d-flex align-items-center border-bottom">
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <p>
                      <i className="las la-home" aria-hidden="true" />
                      <span className="text-color-2">Current town / city</span>
                    </p>
                  </div>
                  <div className="right-edit-details-input">
                    <input
                      type="text"
                      value={currentTown}
                      onChange={handleCurrentTown}
                    />
                  </div>
                </li>
                <li className="d-flex align-items-center border-bottom">
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <p>
                      <i className="las la-map-marker"></i>
                      <span className="text-color-2">Home town</span>
                    </p>
                  </div>
                  <div className="right-edit-details-input">
                    <input
                      type="text"
                      value={homeTown}
                      onChange={handleHomeTown}
                    />
                  </div>
                </li>
                <li className="d-flex align-items-center border-bottom">
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <p>
                      <i className="lab la-gratipay"></i>
                      <span className="text-color-2">Relationship status</span>
                    </p>
                  </div>
                  <div className="right-edit-details-input">
                    <input
                      type="text"
                      value={relationshipStatus}
                      onChange={handleRelationshipStatus}
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
    if (show === "basic contact info") {
      return (
        <div className="right-edit-profile">
          <div className="right-edit-profile-content">
            <div className="right-edit-personal-information-top">
              <h1>Basic Contact Info</h1>
            </div>
            <div className="right-edit-profile-details padding">
              <ul>
                <li className="d-flex align-items-center border-bottom">
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <p>Email Address:</p>
                  </div>
                  <div className="right-edit-details-input">
                    {userProfile.email}
                  </div>
                </li>
                <li className="d-flex align-items-center border-bottom">
                  <div style={{ flex: 1, textAlign: "left", lineHeight: "2" }}>
                    <p>Phone Number:</p>
                  </div>
                  <div className="right-edit-details-input">
                    {p_no ? p_no : "Phone not added"}
                  </div>
                </li>
                <li className="d-flex align-items-center border-bottom">
                  <div style={{ flex: 1, textAlign: "left", lineHeight: "2" }}>
                    <p>Date of Birth:</p>
                  </div>
                  <div className="right-edit-details-input">
                    {dob ? dob : "Date of birth"}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
    return <div className="right-edit-profile"></div>;
  };
  return (
    <>
      <ShareupInsideHeaderComponent />
      <div className="central-edit-profile">
        <div className="left-edit-profile">
          <div>
            <h1>Edit Profile</h1>
            {show === "overview" ? (
              <div
                className="edit-profile-list active"
                onClick={() => setShow("overview")}
              >
                <p>Overview</p>
              </div>
            ) : (
              <div
                className="edit-profile-list"
                onClick={() => setShow("overview")}
              >
                <p>Overview</p>
              </div>
            )}
            {show === "personal information" ? (
              <div
                className="edit-profile-list active"
                onClick={() => setShow("personal information")}
              >
                <p>Personal Information</p>
              </div>
            ) : (
              <div
                className="edit-profile-list"
                onClick={() => setShow("personal information")}
              >
                <p>Personal Information</p>
              </div>
            )}
            {show === "your details" ? (
              <div
                className="edit-profile-list active"
                onClick={() => setShow("your details")}
              >
                <p>Your Details</p>
              </div>
            ) : (
              <div
                className="edit-profile-list"
                onClick={() => setShow("your details")}
              >
                <p>Your Details</p>
              </div>
            )}
            {show === "basic contact info" ? (
              <div
                className="edit-profile-list active"
                onClick={() => setShow("basic contact info")}
              >
                <p>Basic Contact Info</p>
              </div>
            ) : (
              <div
                className="edit-profile-list"
                onClick={() => setShow("basic contact info")}
              >
                <p>Basic Contact Info</p>
              </div>
            )}
          </div>
        </div>
        {changeView()}
      </div>
    </>
  );
}
