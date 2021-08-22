import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import AuthService from '../../services/auth.services';
import SimpleReactLightbox from 'simple-react-lightbox'
import { testScript } from '../../js/script';

import EditPostComponent from './EditPostComponent'

import Layout from '../LayoutComponent';
import GuideComponent from './GuideComponent';



function NotificationChatComponent() {
    const { user } = useContext(UserContext)

    const onSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <Layout user={user}>
                <div className="col-lg-6">
                    <div className="central-meta">
                        <div className="messages">
                            <h5 className="f-title"><i className="ti-bell" />All Messages <span className="more-options"><i className="fa fa-ellipsis-h" /></span></h5>
                            <div className="message-box">
                                <ul className="peoples">
                                    
                                    <li>
                                        <figure>
                                            <img src="../assets/images/resources/friend-avatar2.jpg" alt="" />
                                            <span className="status f-online" />
                                        </figure>
                                        <div className="people-name">
                                            <span>Molly cyrus</span>
                                        </div>
                                    </li>
                                    <li>
                                        <figure><img src="../assets/images/resources/friend-avatar3.jpg" alt="" />
                                            <span className="status f-away" />
                                        </figure>
                                        <div className="people-name">
                                            <span>Andrew</span>
                                        </div>
                                    </li>
                                    <li>
                                        <figure>
                                            <img src="../assets/images/resources/friend-avatar.jpg" alt="" />
                                            <span className="status f-online" />
                                        </figure>
                                        <div className="people-name">
                                            <span>jason bourne</span>
                                        </div>
                                    </li>
                                    <li>
                                        <figure><img src="../assets/images/resources/friend-avatar4.jpg" alt="" />
                                            <span className="status off-online" />
                                        </figure>
                                        <div className="people-name">
                                            <span>Sarah Grey</span>
                                        </div>
                                    </li>
                                    <li>
                                        <figure><img src="../assets/images/resources/friend-avatar5.jpg" alt="" />
                                            <span className="status f-online" />
                                        </figure>
                                        <div className="people-name">
                                            <span>bill doe</span>
                                        </div>
                                    </li>
                                    <li>
                                        <figure><img src="../assets/images/resources/friend-avatar6.jpg" alt="" />
                                            <span className="status f-away" />
                                        </figure>
                                        <div className="people-name">
                                            <span>shen cornery</span>
                                        </div>
                                    </li>
                                    <li>
                                        <figure><img src="../assets/images/resources/friend-avatar7.jpg" alt="" />
                                            <span className="status off-online" />
                                        </figure>
                                        <div className="people-name">
                                            <span>kill bill</span>
                                        </div>
                                    </li>
                                    <li>
                                        <figure><img src="../assets/images/resources/friend-avatar8.jpg" alt="" />
                                            <span className="status f-online" />
                                        </figure>
                                        <div className="people-name">
                                            <span>jasmin walia</span>
                                        </div>
                                    </li>
                                    <li>
                                        <figure><img src="../assets/images/resources/friend-avatar6.jpg" alt="" />
                                            <span className="status f-online" />
                                        </figure>
                                        <div className="people-name">
                                            <span>neclos cage</span>
                                        </div>
                                    </li>
                                </ul>
                                <div className="peoples-mesg-box">
                                    <div className="conversation-head">
                                        <figure><img src="../assets/images/resources/friend-avatar.jpg" alt="" /></figure>
                                        <span>jason bourne <i>online</i></span>
                                    </div>
                                    <ul className="chatting-area">
                                        <li className="you">
                                            <figure><img src="../assets/images/resources/userlist-2.jpg" alt="" /></figure>
                                            <p>what's liz short for? :)</p>
                                        </li>
                                        <li className="me">
                                            <figure><img src="../assets/images/resources/userlist-1.jpg" alt="" /></figure>
                                            <p>Elizabeth lol</p>
                                        </li>
                                        <li className="me">
                                            <figure><img src="../assets/images/resources/userlist-1.jpg" alt="" /></figure>
                                            <p>wanna know whats my second guess was?</p>
                                        </li>
                                        <li className="you">
                                            <figure><img src="../assets/images/resources/userlist-2.jpg" alt="" /></figure>
                                            <p>yes</p>
                                        </li>
                                        <li className="me">
                                            <figure><img src="../assets/images/resources/userlist-1.jpg" alt="" /></figure>
                                            <p>Disney's the lizard king</p>
                                        </li>
                                        <li className="me">
                                            <figure><img src="../assets/images/resources/userlist-1.jpg" alt="" /></figure>
                                            <p>i know him 5 years ago</p>
                                        </li>
                                        <li className="you">
                                            <figure><img src="../assets/images/resources/userlist-2.jpg" alt="" /></figure>
                                            <p>coooooooooool dude ;)</p>
                                        </li>
                                    </ul>
                                    <div className="message-text-container">
                                        <form onSubmit={onSubmit}>
                                            <textarea defaultValue={""} />
                                            <button title="send"><i className="fa fa-paper-plane" /></button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </Layout>
    )
}
export default NotificationChatComponent;