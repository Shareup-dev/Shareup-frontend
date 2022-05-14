import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import SwapService from '../../services/SwapService';
import AuthService from '../../services/auth.services';
import SimpleReactLightbox from 'simple-react-lightbox'
import { testScript } from '../../js/script';
import GroupService from '../../services/GroupService';
import StoriesService from '../../services/StoriesService';
import settings from '../../services/Settings';

import EditPostComponent from './EditPostComponent'
import Modal from 'react-modal';

import Layout from '../LayoutComponent';
import GuideComponent from './GuideComponent';
import SharePostComponent from '../post/SharePostComponent';
import StoriesComponent from '../Stories/StoriesComponent';
import Popup from 'reactjs-popup';
import FriendsService from '../../services/FriendService';
import fileStorage from '../../config/fileStorage';



function ShareFeedComponent() {
  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  const { user } = useContext(UserContext)

  // const []

  // const inputRef = createRef();

  const [refresh, setRefresh] = useState(null)
  const [stories, setStories] = useState([]);
  const [group, setGroup] = useState([]);
  const [editPostId, setEditPostId] = useState(null)
  const [allUser, setAllUser] = useState([]);


  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const testFanc = (post) => {
    return (<SharePostComponent post={post} setRefresh={setRefresh} />)
  }

  const show = () => {

    return (
      <div className="loadMore">
        {
          // postsForUser.map(
          //   post =>
          //     <div key={post.id}>
          //       {
          //         post.group ?
          //           post.group.members.some(member => member.email === AuthService.getCurrentUser().username) ?
          //             testFanc(post) : null
          //           :
          //           testFanc(post)
          //       }
          //     </div>
          // )
        }
      </div>
    )
  }
  //   if (showComp === "newsfeed") {
  //   else {
  //     return (
  //       <div className="loadMore">
  //         {
  //           savedPost.map(
  //             post =>
  //               <div key={post.id}>
  //                 {
  //                   post.group ?
  //                     post.group.members.some(member => member.email === AuthService.getCurrentUser().username) ?
  //                       testFanc(post) : null
  //                     :
  //                     testFanc(post)
  //                 }
  //               </div>
  //           )
  //         }

  //       </div>
  //     )
  //   }
  // }

  const getAllUser = async () => {
    await UserService.getUsers().then(res => {
      setAllUser(res.data)
    })
  }

  useEffect(() => {
    getAllUser()
    testScript()
  }, [])

  useEffect(() => {
    testScript()
  }, [editPostId, refresh])


  return (
    <Layout user={user}>
      <div className="col-lg-6">
        <div className="central-meta swap-pg-cont">
          <div className="frnds">
            <div>
              <p className="Friends-Title common-title">Shares</p>
              <i style={{ float: "right", fontSize: 20 }} className="fas fa-ellipsis-v"></i>
            </div>
            <div className="navContent">

              <ul className="nav nav-pills swap-page-nav" role="tablist">
                <li className="nav-item" style={{ justifyContent: 'flex-start' }}>
                  <div className="all">
                    <span style={{ cursor: 'pointer' }} >
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                        <i className="fas fa-share" style={{ fontSize: '16px' }}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      All Shares
                    </span>
                  </div>
                </li>
                <li className="nav-item" style={{ justifyContent: 'center' }}>
                  <div className="my">
                    <span style={{ cursor: 'pointer' }} >
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                        <i className="lar la-handshake" style={{ fontSize: '20px' }}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      My Shares
                    </span>
                  </div>
                </li>
                <li className="nav-item" style={{ justifyContent: 'flex-end' }}>
                  <div className="new">
                    <span style={{ cursor: 'pointer' }} >
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                        <i className="far fa-share-square" style={{ fontSize: '16px' }}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      Share
                    </span>

                  </div>
                </li>
                {/* <li className="nav-item">
              
                  <span style={{ cursor: 'pointer' }}>
                    <span style={{ marginRight: '5px', padding: '5px' }}>
                      <i className="fas fa-bell" style={{fontSize:'25px'}}></i>
                    </span>
                    Notifications
                  </span>
								</li> */}

              </ul>

            </div>
            <div className="friends-search-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input className="friend-search" type="text" placeholder="Search Swap" name="s" style={{ width: "100%" }} />
            </div>

          </div>
          <div style={{ minHeight: '200px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No Shares</div>

        </div>
        {show()}

      </div>
    </Layout>

  );
}
export default ShareFeedComponent;