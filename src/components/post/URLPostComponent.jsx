import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import storage from "../../config/fileStorage";
import PostComponent from "./PostComponent";
import PostService from "../../services/PostService";
import Layout from "../LayoutComponent";
import UserContext from "../../contexts/UserContext";

function URLPostComponent() {
  const { postID: postID } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [postData, setPostData] = useState([]);
  const [refresh, setRefresh] = useState(null);
  const { user } = useContext(UserContext);
  let history = useHistory();
  const my_url = `${storage.baseUrl}`;

  const getPost = async () => {
    await PostService.getPostById(postID).then((res) => {
      setPostData(res.data);
    });
  };

  useEffect(() => {
    getPost().then(() => {
      setIsLoading(false);
    });
  }, []);

  const testFanc = (postData) => {
    return <PostComponent post={postData} setRefresh={setRefresh} />;
  };

  if (isLoading) {
    return <div>Loading... Please Wait</div>;
  }
  return (
    <Layout user={user}>
      <div className="col-lg-6">
        <div className="central-meta swap-pg-cont">
          <div className="frnds">
            <div className="pb-4">{testFanc(postData)}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default URLPostComponent;
