import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import fileStorage from "../../config/fileStorage";
import storage from "../../config/fileStorage";
import AuthService from "../../services/auth.services";
import { testScript } from "../../js/script";
import moment from "moment";
import GroupService from "../../services/GroupService";
import StoriesService from "../../services/StoriesService";
import settings from "../../services/Settings";
import PostComponent from "../post/PostComponent";
import EditPostComponent from "../post/EditPostComponent";
import Modal from "react-modal";
import Layout from "../LayoutComponent";
import GuideComponent from "../user/GuideComponent";
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
import NewsfeedComponent, { hangsharePopUp } from "../user/NewsfeedComponent";
import PostService from "../../services/PostService";

function NotificationFeedComponent() {
  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();
  const my_url = `${storage.baseUrl}`;

  const { user } = useContext(UserContext);
  const [showComp, setShowComp] = useState("Notification");
  const [refresh, setRefresh] = useState(null);
  const [stories, setStories] = useState([]);
  const [group, setGroup] = useState([]);
  const [editPostId, setEditPostId] = useState(null);
  const [allUser, setAllUser] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [Notification, setNotification] = useState([]);
  const [notification, Setnotification] = useState([]);
  const [hangMeals, SetHangMeals] = useState([]);
  const [hangGifts, SetHangGifts] = useState([]);
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const testFanc = (post) => {
    return <PostComponent post={post} setRefresh={setRefresh} />;
  };

  const Img = styled("img")({
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  });

  
  const getNotification = async () => {
    await PostService.getPost(
      AuthService.getCurrentUser().username
    ).then((res) => {
      setNotification(res.data);
      Setnotification(res.data);
    });
  };

  const getAllUser = async () => {
    await UserService.getUsers().then((res) => {
      setAllUser(res.data);
    });
  };

  useEffect(() => {
    getAllUser();
    getNotification();
    testScript();
  }, []);

  useEffect(() => {
    testScript();
  }, [editPostId, refresh]);

  if (user?.newUser) {
    return <GuideComponent />;
  }

  return (
    <Layout user={user}>
      <div className="col-lg-6">
        <div className="central-meta swap-pg-cont">
          <div className="frnds">
            <div>
              <p className="Friends-Title common-title" style={{textTransform:"capitalize"}}>Notifications</p>
              <i
                style={{ float: "right", fontSize: 20 }}
                className="fas fa-ellipsis-v"
              ></i>
            </div>
            <div className="navContent"></div>
            <div className="loadMore p-5">
              {notification && notification.length > 0 ? (
                notification.map((post) => (
                  <div style={{ paddingBottom: "10px" }} key={post.id}>
                      <>
                        <Paper
                          className="hover-shadow"
                          sx={{
                            p: 2,
                            margin: "auto",
                            maxWidth: 500,
                            flexGrow: 1,
                            backgroundColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#1A2027"
                                : "#fff",
                          }}
                        >
                          <Grid  container spacing={1} sx={{cursor: "pointer"}}>
                            <Grid item>
                              <ButtonBase sx={{ width: 40, height: 40 }}>
                                <Img
                                  className="rounded-circle"
                                  sx={{ width: 40, height: 40 }}
                                  alt=""
                                  src={`${fileStorage.baseUrl}${post.userdata.profilePicturePath}`}
                                />
                              </ButtonBase>
                            </Grid>
                            <Grid item xs={12} sm container>
                              <Grid
                                item
                                xs
                                container
                                direction="column"
                                spacing={2}
                              >
                                <Grid item xs>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {post.userdata.firstName +" " +post.userdata.lastName +" "+ "comment on your post"}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="navy"
                                  >
                                    {moment(
                              post.published,
                              "DD MMMM YYYY hh:mm:ss"
                            ).fromNow()}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Paper>
                      </>
                  </div>
                ))
              ) : (
                <div className="center" style={{ padding: "20px" }}>
                  You Don't have any notifications
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default NotificationFeedComponent;
