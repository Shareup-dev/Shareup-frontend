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

function ViewersListComponent({ handleCloseModal,storyID }) {
  let history = useHistory();

  const { user } = useContext(UserContext);

  const [AllViewersList, setAllViewersList] = useState([]);

  const getAllViewersList = () => {
    StoriesService.getAllViewersList(storyID).then((res) => {
      setAllViewersList(res.data);
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

  useEffect(() => {
    getAllViewersList();
  }, []);

  return (
    <>
      <div className="viewersList-cont" >
        {Array.isArray(AllViewersList) && AllViewersList.length > 0 ? (
          <>
            {AllViewersList && AllViewersList.length > 0
              ? <>
                <div className ="headpop">
                  <span>
                    <a
                      href="#!"
                     
                      onClick={()=>handleCloseModal()}
                    >
                      <i className="las la-times"></i>
                    </a>
                  </span>
                  <span className="poptitle">
                   Viewers List
                  </span>

                  <span style={{ float: "right" }}>
                    {" "}
                   
                    
                  </span>
              </div>
              <div style={{maxHeight:'300px' ,overflowY: "auto"}}>
                  {AllViewersList.map((post) => (
                    <div style={{ padding: "5px 30px" }}>
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
                    <a
                      href="#!"
                      style={{
                       position:'absolute',
                       top:'20px',
                       left: '20px'
                      }}
                      onClick={()=>handleCloseModal()}
                    >
                      <i className="las la-times"></i>
                    </a>
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

export default ViewersListComponent;
