import React, { useState, useEffect, useContext, cloneElement } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import AuthService from "../../services/auth.services";
import StoriesService from "../../services/StoriesService";
import Layout from "../LayoutComponent";
import GuideComponent from "../user/GuideComponent";
import Popup from "reactjs-popup";
import StoriesComponentFriends from "./StoriesComponentFriends";
import DisplayFriendsStoryComponent from "./DisplayFriendsStoryComponent";

function StoriesFeedComponent() {
  const [isLoading, setIsLoading] = useState(true);
  let history = useHistory();
  const { user } = useContext(UserContext);
  const [refresh, setRefresh] = useState(null);
  const [storiesForUserFriends, setStoriesForUserFriends] = useState([]);
  const [userR, setUserR] = useState([]);
  const getStoriesForFriendsUser = () => {
    StoriesService.getStoriesForUserFriendsNew(user?.id).then((res) => {
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
      setStoriesForUserFriends(uniqueStories);
    });
  };

  useEffect(() => {
    getStoriesForFriendsUser();
  }, []);

  useEffect(() => {
    getUser().then(() => {
      setIsLoading(false);
    });
  }, []);

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

  if (isLoading) {
    return <div>Loading... Please Wait</div>;
  }

  if (user.newUser) {
    return <GuideComponent />;
  }

  return (
    <Layout user={user}>
      <div className="col-lg-6">
        <div className="central-meta swap-pg-cont">
          <div className="frnds">
            <div>
              <p className="Friends-Title common-title">Stories</p>
              <i
                style={{ float: "right", fontSize: 20 }}
                className="fas fa-ellipsis-v"
              ></i>
            </div>
            <div className="navContent">
              <div className="loadMore" style={{ paddingTop:"7.5%"}} >
                {storiesForUserFriends && storiesForUserFriends.length > 0 ? (
                  <ul className="slidesreel">
                    {storiesForUserFriends.map((story, index) => (
                      <Popup
                        style={{ padding: "0px" }}
                        className="story-popup"
                        trigger={
                          <li
                            className="slideitemreelcom"
                            key={story.id}
                            id={index}
                          >
                            <StoriesComponentFriends
                              story={
                                storiesForUserFriends[index].stories_List[
                                  storiesForUserFriends[index].stories_List
                                    .length - 1
                                ]
                              }
                              setRefresh={setRefresh}
                            />
                          </li>
                        }
                        modal
                      >
                        {(close) => (
                          <Form className="stryp">
                            <div className="row">
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
                            </div>

                            <DisplayFriendsStoryComponent
                              key={story.id}
                              id={index}
                              story={storiesForUserFriends[index].stories_List}
                              setRefresh={setRefresh}
                            />
                          </Form>
                        )}
                      </Popup>
                    ))}
                  </ul>
                ) : (
                  <div className="center" style={{ padding: "20px" }}>
                    No Stories to show
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default StoriesFeedComponent;
