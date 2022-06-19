import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import fileStorage from "../../config/fileStorage";
import storage from "../../config/fileStorage";
import PostService from "../../services/PostService";
import SwapService from "../../services/SwapService";
import AuthService from "../../services/auth.services";
import SimpleReactLightbox from "simple-react-lightbox";
import { testScript } from "../../js/script";
import GroupService from "../../services/GroupService";
import StoriesService from "../../services/StoriesService";
import settings from "../../services/Settings";
import PostComponent from "../post/PostComponent";
import EditPostComponent from "./EditPostComponent";
import Modal from "react-modal";
import Layout from "../LayoutComponent";
import GuideComponent from "./GuideComponent";
import SharePostComponent from "../post/SharePostComponent";
import Popup from "reactjs-popup";
import HangShareService from "../../services/HangShareService";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext } from "@mui/lab";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import NewsfeedComponent, { hangsharePopUp } from "./NewsfeedComponent";

function ShareFeedComponent() {
  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();
  const my_url = `${storage.baseUrl}`;

  const { user } = useContext(UserContext);
  const [showComp, setShowComp] = useState("AllHangShare");
  const [refresh, setRefresh] = useState(null);
  const [stories, setStories] = useState([]);
  const [group, setGroup] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [allUser, setAllUser] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [allHangShare, setAllHangShare] = useState([]);
  const [myHangShare, SetMyHangShare] = useState([]);
  const [hangMeals, SetHangMeals] = useState([]);
  const [hangGifts, SetHangGifts] = useState([]);
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function openModal() {
    setIsOpen(true);
  }
  const Img = styled("img")({
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  });
  const getAllHangShare = async () => {
    await HangShareService.getAllHangShare(
      AuthService.getCurrentUser().username
    ).then((res) => {
      setAllHangShare(res.data);
      SetMyHangShare(res.data);
    });
  };

  const getHangShareMeals = async () => {
    await HangShareService.getHangShareMeals(
      AuthService.getCurrentUser().username
    ).then((res) => {
      SetHangMeals(res.data);
    });
  };

  const getHangShareGifts = async () => {
    await HangShareService.getHangShareGifts(
      AuthService.getCurrentUser().username
    ).then((res) => {
      SetHangGifts(res.data);
    });
  };

  const testFanc = (post) => {
    return <PostComponent post={post} setRefresh={setRefresh} />;
  };

  const getAllUser = async () => {
    await UserService.getUsers().then((res) => {
      setAllUser(res.data);
    });
  };

  useEffect(() => {
    getAllUser();
    getAllHangShare();
    getHangShareMeals();
    getHangShareGifts();
    testScript();
  }, []);

  useEffect(() => {
    testScript();
  }, [editPostId, refresh]);

  const AllHangShareShow = () => {
    return (
      <div className="loadMore">
        {allHangShare && allHangShare.length > 0 ? (
          allHangShare.map((post) => (
            <div style={{ paddingBottom: "10px" }} key={post.id}>
              {post.group
                ? post.group.members.some(
                    (member) =>
                      member.email === AuthService.getCurrentUser().username
                  )
                  ? testFanc(post)
                  : null
                : post.userdata.id !== user?.id
                ? testFanc(post)
                : null}
            </div>
          ))
        ) : (
          <div className="center" style={{ padding: "20px" }}>
            No HangShares
          </div>
        )}
      </div>
    );
  };

  const MealsHangShareShow = () => {
    return (
      <div className="loadMore">
        {hangMeals && hangMeals.length > 0 ? (
          hangMeals.map((post) => (
            <div style={{ paddingBottom: "10px" }} key={post.id}>
              {post.group
                ? post.group.members.some(
                    (member) =>
                      member.email === AuthService.getCurrentUser().username
                  )
                  ? testFanc(post)
                  : null
                : post.userdata.id !== user?.id
                ? testFanc(post)
                : null}
            </div>
          ))
        ) : (
          <div className="center" style={{ padding: "20px" }}>
            No Meals HangShares
          </div>
        )}
      </div>
    );
  };
  const GiftsHangShareShow = () => {
    return (
      <div className="loadMore">
        {hangGifts && hangGifts.length > 0 ? (
          hangGifts.map((post) => (
            <div style={{ paddingBottom: "10px" }} key={post.id}>
              {post.group
                ? post.group.members.some(
                    (member) =>
                      member.email === AuthService.getCurrentUser().username
                  )
                  ? testFanc(post)
                  : null
                : post.userdata.id !== user?.id
                ? testFanc(post)
                : null}
            </div>
          ))
        ) : (
          <div className="center" style={{ padding: "20px" }}>
            No Gifts HangShares
          </div>
        )}
      </div>
    );
  };

  const AllHangShareFunction = () => {
    return (
      <div className="pb-5">
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  style={{ textTransform: "capitalize" }}
                  label="All"
                  value="1"
                />
                <Tab
                  style={{ textTransform: "capitalize" }}
                  label="Meals"
                  value="2"
                />
                <Tab
                  style={{ textTransform: "capitalize" }}
                  label="Gifts"
                  value="3"
                />
              </TabList>
            </Box>
            <TabPanel value="1" style={{padding:'0'}}>{AllHangShareShow()}</TabPanel>
            <TabPanel value="2" style={{padding:'0'}}>{MealsHangShareShow()}</TabPanel>
            <TabPanel value="3" style={{padding:'0'}}>{GiftsHangShareShow()}</TabPanel>
          </TabContext>
        </Box>
      </div>
    );
  };

  const MyHangShareFunction = () => {
    return (
      <div className="pb-5">
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  style={{ textTransform: "capitalize" }}
                  label="All"
                  value="1"
                />
                <Tab
                  style={{ textTransform: "capitalize" }}
                  label="Accepted"
                  value="2"
                />
              </TabList>
            </Box>
            <TabPanel value="1" style={{padding:'0'}}>{MyHangShareShow()}</TabPanel>
            <TabPanel value="2" style={{padding:'0'}}>{MyAcceptedHSShow()}</TabPanel>
          </TabContext>
        </Box>
      </div>
    );
  };

  const MyHangShareShow = () => {
    return (
      <div className="loadMore">
        {myHangShare && myHangShare.length > 0 ? (
          myHangShare.map((post) => (
            <div  key={post.id}>
              {post.group
                ? post.group.members.some(
                    (member) =>
                      member.email === AuthService.getCurrentUser().username
                  )
                  ? testFanc(post)
                  : null
                : post.userdata.id === user?.id
                ? testFanc(post)
                : null}
            </div>
          ))
        ) : (
          <div className="center" style={{ padding: "20px" }}>
            You don't have any HangShre
          </div>
        )}
      </div>
    );
  };

  const MyAcceptedHSShow = () => {
    return (
      <div className="loadMore">
        {myHangShare && myHangShare.length > 0 ? (
          myHangShare.map((post) => (
            <div style={{ paddingBottom: "10px" }} key={post.id}>
              {post.group ? (
                post.group.members.some(
                  (member) =>
                    member.email === AuthService.getCurrentUser().username
                ) ? (
                  testFanc(post)
                ) : null
              ) : post.userdata.id === user?.id && post.accepted === true ? (
                <>
                  <Paper
                    sx={{
                      p: 2,
                      margin: "auto",
                      maxWidth: 500,
                      flexGrow: 1,
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "#1A2027" : "#fff",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item>
                        <ButtonBase sx={{ width: 128, height: 128 }}>
                          <Img
                            sx={{ width: 128, height: 128 }}
                            alt=""
                            src={`${fileStorage.baseUrl}${post.media[0].mediaPath}`}
                          />
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                          <Grid item xs>
                            <Typography
                              gutterBottom
                              variant="subtitle1"
                              component="div"
                            >
                              {post.content ? post.content : ""}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              Accepted by
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {"User : " +
                                post.accepted_user.firstName +
                                " " +
                                post.accepted_user.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {"Phone Number : " + post.phoneNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {"Location : " +
                                post.latitude +
                                "," +
                                post.longitude}
                            </Typography>
                          </Grid>
                                          {/* <Grid item>
                              <Typography className="button" sx={{ cursor: 'pointer' }} variant="body2">
                                Send Massege
                              </Typography>
                            </Grid> */}
                        </Grid>
                        <Grid item>
                          <Typography
                            className="button"
                            sx={{ cursor: "pointer" }}
                            variant="subtitle1"
                            component="div"
                          >
                            Massege
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </>
              ) : null}
            </div>
          ))
        ) : (
          <div className="center" style={{ padding: "20px" }}>
            No Accepted HangShare
          </div>
        )}
      </div>
    );
  };

  const handleShowComp = () => {
    if (showComp === "AllHangShare") {
      return AllHangShareFunction();
    } else if (showComp === "MyHangShare") {
      return MyHangShareFunction();
    }
  };

  if (user?.newUser) {
    return <GuideComponent />;
  }

  return (
    <Layout user={user}>
      <div className="col-lg-6">
        <div className="central-meta swap-pg-cont">
          <div className="frnds">
            <div>
              <p className="Friends-Title common-title">HangShare</p>
              <i
                style={{ float: "right", fontSize: 20 }}
                className="fas fa-ellipsis-v"
              ></i>
            </div>
            <div className="navContent">
              <ul className="nav nav-pills swap-page-nav" role="tablist">
                <li
                  className="nav-item"
                  style={{ justifyContent: "flex-start" }}
                >
                  <div
                    className="all"
                    onClick={() => setShowComp("AllHangShare")}
                  >
                    <span style={{ cursor: "pointer" }}>
                      <span style={{ marginRight: "5px", padding: "5px" }}>
                        <i
                          className="fas fa-retweet"
                          style={{ fontSize: "20px" }}
                        ></i>
                      </span>
                      All Hang Share
                    </span>
                  </div>
                </li>
                <li className="nav-item" style={{ justifyContent: "center" }}>
                  <div
                    className="my"
                    onClick={() => setShowComp("MyHangShare")}
                  >
                    <span style={{ cursor: "pointer" }}>
                      <span style={{ marginRight: "5px", padding: "5px" }}>
                        <i
                          className="ti-control-shuffle"
                          style={{ fontSize: "20px" }}
                        ></i>
                      </span>
                      My Hang Share
                    </span>
                  </div>
                </li>
                <li className="nav-item" style={{ justifyContent: "center" }}>
                  <div className="my">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={NewsfeedComponent.hangsharePopUp}
                    >
                      <span style={{ marginRight: "5px", padding: "5px" }}>
                        <img
                          style={{ verticalAlign: "middle", width: "15px" }}
                          src="/assets/images/hangshare3.png"
                          alt="img"
                        />{" "}
                      </span>
                      Hang Share
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {handleShowComp()}
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default ShareFeedComponent;
