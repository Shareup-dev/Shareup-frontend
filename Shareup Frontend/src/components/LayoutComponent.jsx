import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import UserContext from '../contexts/UserContext';
import PostService from '../services/PostService';
import ShareupInsideHeaderComponent from './dashboard/ShareupInsideHeaderComponent';
import EditPostComponent from './user/EditPostComponent'
import FollowingWidgetComponent from './widgets/FollowingWidgetComponent';
import FriendsWidgetComponent from './widgets/FriendsWidgetComponent';
import GroupsWidgetComponent from './widgets/GroupsWidgetComponent';

export default function Layout(props) {

  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  useEffect(() => {
    if (props.user) {
      setIsLoading(false)
    }
  }, [])

  const { user } = useContext(UserContext)

  if (isLoading) {
    return null
  }

  return (
    props.user &&
    <>
      <ShareupInsideHeaderComponent />
      {/* topbar */}
      <div className="container">
      <section>
        <div className="gap gray-bg">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="row" id="page-contents">
                  <div className="col-lg-3">
                    <aside className="sidebar static">
                    <div className="widget">
                        <div className="row"><img src="../assets/images/unnamed.png"/><p className="widget-title">User</p></div>  
                       <div className="user"><img src={props.user.profilePicturePath}/>
                        <a href="/profile"><p style={{fontWeight: "bold"}}>{`${props.user.firstName} ${props.user.lastName}`}</p></a>
                        </div>
                      </div>
                      <div className="widget navmenu">
                      {/* <div className="row"><img src="../assets/images/menu-1899421-1606840.png"/><p className="widget-title">Menu</p></div>  */}
                        <div><ul className="naves">
                          <li>
                            <div style={{marginRight:"12px", display:"inline"}}><i className="ti-clipboard" /></div>
                            <a href="/newsfeed" title="#">ShareFeed</a>
                          </li>
                          <li>
                          <div style={{marginRight:"12px", display:"inline"}}><i className="ti-write" /></div>
                            <a href="/savedShares" title="#">SavedShares</a>
                          </li>
                          <li>
                          <div style={{marginRight:"12px", display:"inline"}}><i className="ti-comments" /></div>
                            <a href="/messages" title="#">Messages</a>
                          </li>
                          <li>
                          <div style={{marginRight:"12px", display:"inline"}}><i className="ti-user" /></div>
                            <a href="/friends" title="#">ShareFriends</a>
                          </li>
                          <li>
                          <div style={{marginRight:"10px", display:"inline"}}><i className="ti-user" /><p  style={{fontSize:"18px",color:"blue", marginLeft:"-8px", display:"inline"}}>+</p></div>
                            
                          <a href="/Addfriends" title="#">Add Friends</a>
                          </li>
                          <li>
                          <div style={{marginRight:"2px", display:"inline"}}><i className="ti-user" /><i className="ti-user" style={{marginLeft:"-19px"}} /></div>
                          <a href="/groups" title="#">ShareGroups</a>
                          </li>
                          <li>  
                          <div style={{marginRight:"12px", display:"inline"}}><i className="ti-link" /></div>
                            
                          <a href="/shareFeed" title="#">SharePoint</a>
                          </li>
                          <li>
                          <div style={{marginRight:"12px", display:"inline"}}><i className="ti-control-shuffle" /></div>
                            
                          <a href="/swapFeed" title="#">SwapPoint</a>
                          </li>
                        </ul></div>
                      </div>{/* Shortcuts */}
                      
                    </aside>
                  </div>{/* sidebar */}
                  {/* ------------------------------------------------------------------------- */}
                  {props.children}
                  {/* --------------------------------------------------------------------------------- */}
                  {/* centerl meta */}
                  <div className="col-lg-3">
                    <aside className="sidebar static">
                    <div className="widget friend-list stick-widget">
                    <div className="row"><img src="../assets/images/1865023.png"/><p className="widget-title">Ads</p></div>
                    <div className="ads"><a href="https://technology-signals.com/wp-content/uploads/2019/05/images.martechadvisor.comvoice_technology_5cecf0b8-3f280e5abac0da913f8aa0868cf970c6a429a128.jpg" data-lightbox="image-1" data-title="My caption"><img src="https://technology-signals.com/wp-content/uploads/2019/05/images.martechadvisor.comvoice_technology_5cecf0b8-3f280e5abac0da913f8aa0868cf970c6a429a128.jpg"></img></a></div>
											</div>


                      <FollowingWidgetComponent />

                      <FriendsWidgetComponent />
<GroupsWidgetComponent/>


                    </aside>
                  </div>
                  {/* sidebar */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}