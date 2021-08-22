import React, {useContext } from 'react';
import UserContext from '../contexts/UserContext';
import GroupsWidgetComponent from './widgets/GroupsWidgetComponent';
// import FollowingWidgetComponent from './widgets/FollowingWidgetComponent';

function Layout(props){
    const { user } = useContext(UserContext)
    return(
        <section>
            <div className="gap gray-bg">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row" id="page-contents">
                      <div className="col-lg-3">
                        <aside className="sidebar static">
                        <div className="widget">
                            <h4 className="widget-title">User</h4>
                            <img src={user.profilePicturePath} style={{width: 80, float:"left"}}></img>
                            <a href={`/profile`}><p style={{fontWeight: "bold"}}>{`${user.firstName} ${user.lastName}`}</p></a>
    
                          </div>
                          <div className="widget">
                            <h4 className="widget-title">Menu</h4>
                            <ul className="naves">
                              <li>
                                <i className="ti-clipboard" />
                                <a href="/newsfeed" title="#">ShareFeed</a>
                              </li>
                              <li>
                                <i className="ti-mouse-alt" />
                                <a href="#" title="#">ShareTime</a>
                              </li>
                              <li>
                                <i className="ti-mouse-alt" />
                                <a href="#" title="#">Messages</a>
                              </li>
                              <li>
                                <i className="ti-files" />
                                <a href="/friends" title="#">ShareFriends</a>
                              </li>
                              <li>
                                <i className="ti-user" />
                                <a href="/friends" title="#">Add Friends</a>
                              </li>
                              <li>
                                <i className="ti-user" />
                                <a href="/groups" title="#">ShareGroups</a>
                              </li>
                            </ul>
                          </div>{/* Shortcuts */}
                          <GroupsWidgetComponent/>
                        </aside>
                      </div>{/* sidebar */}
                      {/* ------------------------------------------------------------------------- */}
                      {props.children}
                      {/* --------------------------------------------------------------------------------- */}
                      {/* centerl meta */}
                      <div className="col-lg-3">
                                            <aside className="sidebar static">
                        <div className="widget friend-list stick-widget">
                            <span style={{ float: 'right'}}>ads</span>
                            <img src="https://technology-signals.com/wp-content/uploads/2019/05/images.martechadvisor.comvoice_technology_5cecf0b8-3f280e5abac0da913f8aa0868cf970c6a429a128.jpg"></img>
                                                </div>
    
    
                                                {/* <FollowingWidgetComponent/> */}
    
                                                
                          
    
                                            </aside>
                                        </div>
                      {/* sidebar */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
    )
}
export default Layout;