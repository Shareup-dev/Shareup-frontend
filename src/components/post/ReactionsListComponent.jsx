import React, { useState, useEffect, useContext, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import StoriesService from "../../services/StoriesService";
import fileStorage from "../../config/fileStorage";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import PostService from "../../services/PostService";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext } from "@mui/lab";
import { TabList } from "@mui/lab";
import { TabPanel } from "@mui/lab";
function ReactionsListComponent({ handleCloseModal,postID }) {
  let history = useHistory();
  const [value, setValue] = React.useState("1");
  const { user } = useContext(UserContext);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [AllReactionList, setAllReactionList] = useState([]);

  const getAllReactionList = () => {
    PostService.getAllReactionList(postID).then((res) => {
      setAllReactionList(res.data);
    });
  };
  const Img = styled("img")({
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  });

  const Popup = (props) => {
    return (
      <div className="popup-box" >
        <div className="box">
          <span className="close-icon" onClick={props.handleClose}>
            x
          </span>
          {props.content}
        </div>
      </div>
    );
  };

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const ShowEmoji = (reaction) => {
    return (
      <>
              {reaction.map((post) => (
                    <div style={{ padding: "5px 10px" }}>
                      <>
                        <Paper
                          className="hover-shadow"
                          sx={{
                            p: 2,
                            margin: "auto",
                            border:"1px solid #e7e7e7",
                            maxWidth: 500,
                            flexGrow: 1,
                            borderRadius: 3,
                            boxShadow: "none",
                            backgroundColor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#1A2027"
                                : "#fff",
                          }}
                        >
                          <Grid
                            container
                            spacing={1}
                            sx={{ cursor: "pointer" }}
                          >
                            <Grid item>
                              <ButtonBase
                                sx={{
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                <Img
                                  className="rounded-circle"
                                  sx={{
                                    width: 40,
                                    height: 40,
                                  }}
                                  alt=""
                                  src={`${fileStorage.baseUrl}${post.profilePicture}`}
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
                                    {post.firstName + " " + post.lastName}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Paper>
                      </>
                    </div>

                  ))}
      </>
    );
  };



  useEffect(() => {
    getAllReactionList();
  }, []);

  return (
    <>
      <div className="viewersList-cont" >
        {Array.isArray(AllReactionList.all) && AllReactionList.all.length > 0 ? (
          <>
            {AllReactionList.all && AllReactionList.all.length > 0
              ? <>
                <div className ="p-2 headpop">
                  <span className="poptitle">
                   Reactions
                  </span>
              </div>
              <div style={{maxHeight:'300px' ,overflowY: "auto", overflowY: "auto"}}>
              <div className="pb-5">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                {AllReactionList.all.length > 0 ? (
                  <Tab
                    style={{ textTransform: "capitalize" }}
                    label="ALL"
                    value="1"
                  />
                  ) : (
                    <></>
                  )}
                  {AllReactionList.star.length > 0 ? (
                    <Tab
                      style={{ textTransform: "capitalize" }}
                      label="⭐"
                      value="2"
                    />
                  ) : (
                    <></>
                  )}
                  {AllReactionList.smiley.length > 0 ? (
                    <Tab
                      style={{ textTransform: "capitalize" }}
                      label="😊"
                      value="3"
                    />
                  ) : (
                    <></>
                  )}
                  {AllReactionList.wow.length > 0 ? (
                    <Tab
                      style={{ textTransform: "capitalize" }}
                      label="😮"
                      value="4"
                    />
                  ) : (
                    <></>
                  )}
                  {AllReactionList.laugh.length > 0 ? (
                    <Tab
                      style={{ textTransform: "capitalize" }}
                      label="😂"
                      value="5"
                    />
                  ) : (
                    <></>
                  )}
                  {AllReactionList.cry.length > 0 ? (
                    <Tab
                      style={{ textTransform: "capitalize" }}
                      label="😭"
                      value="6"
                    />
                  ) : (
                    <></>
                  )}
                  {AllReactionList.love.length > 0 ? (
                    <Tab
                      style={{ textTransform: "capitalize" }}
                      label="😍"
                      value="7"
                    />
                  ) : (
                    <></>
                  )}
                  {AllReactionList.celebrate.length > 0 ? (
                    <Tab
                      style={{ textTransform: "capitalize" }}
                      label="🥳"
                      value="8"
                    />
                  ) : (
                    <></>
                  )}
                  {AllReactionList.angry.length > 0 ? (
                    <Tab
                      style={{ textTransform: "capitalize" }}
                      label="😡"
                      value="9"
                    />
                  ) : (
                    <></>
                  )}

                </TabList>
              </Box>
              <TabPanel value="1">
              {ShowEmoji(AllReactionList.all)}
              </TabPanel>
              <TabPanel value="2">
              {ShowEmoji(AllReactionList.star)}
              </TabPanel>
              <TabPanel value="3">    
              {ShowEmoji(AllReactionList.smiley)}           
              </TabPanel>
              <TabPanel value="4">
              {ShowEmoji(AllReactionList.wow)}
              </TabPanel>
              <TabPanel value="5">
              {ShowEmoji(AllReactionList.laugh)}
              </TabPanel>
              <TabPanel value="6">
              {ShowEmoji(AllReactionList.cry)}               
              </TabPanel>
              <TabPanel value="7">
              {ShowEmoji(AllReactionList.love)}
              </TabPanel>
              <TabPanel value="8">
              {ShowEmoji(AllReactionList.celebrate)}
              </TabPanel>
              <TabPanel value="9">   
              {ShowEmoji(AllReactionList.angry)}            
              </TabPanel>
            </TabContext>
          </Box>
        </div>
              </div>
                </>
              : null}
          </>
        ) : (
          <>
            {/* <Paper
              className="hover-shadow"
              sx={{
                p: 2,
                margin: "auto",
                maxWidth: 500,
                flexGrow: 1,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#1A2027" : "#fff",
              }}
            > */}
              <Grid container  sx={{ cursor: "pointer",minHeight:'100px',alignItems:'center' }} >
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                      <Typography variant="body2" sx={{textAlign:'center'}}>
                        No views yet
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            {/* </Paper> */}
          </>
        )}
      </div>
    </>
  );
}

export default ReactionsListComponent;
