import React, { Component } from 'react';
import { useHistory } from "react-router-dom";
import AuthService from '../../services/auth.services';

function HeaderComponent() {
  let history = useHistory();

  const handleLogout = () => {
    AuthService.logout()
    history.push("/")
  }

    return (
      <div className="responsive-header">
          <div className="mh-head first Sticky">
            <span className="mh-btns-left"> <a className="menu" href="#menu"><i className="fa fa-align-justify" /></a>
            </span> <span className="mh-text"> <a href="newsfeed.html" title="#"><img src='./assets/images/shareup.png' width={300} alt="" /></a>
            </span>
          </div>
          <div className="mh-head second">
            <form className="mh-form">
              <input placeholder="search" /> <a href="#/" className="fa fa-search" />
            </form>
          </div>
          <nav id="menu" className="res-menu">
            <ul>
              <li><span>About</span></li>
              <li><span>Privacy Bills of Rights</span></li>
              <li><span>Account Setting</span></li>
              <li><span>English</span>
                <ul>
                  <li><a href="forum.html" title="#">Turkish</a></li>
                  <li><a href="forums-category.html" title="#">Arabic</a></li>
                  <li><a href="forum-open-topic.html" title="#">Dutch</a></li>
                </ul></li>
            </ul>
          </nav>
        </div>
    );
}

export default HeaderComponent;