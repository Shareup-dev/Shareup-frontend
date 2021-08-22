import React, { Component } from 'react';
import EmployeeService from '../../services/EmployeeService';

class ListEmployeeComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
                employees: []
        }
        this.addEmployee = this.addEmployee.bind(this);
        this.editEmployee = this.editEmployee.bind(this);
        this.deleteEmployee = this.deleteEmployee.bind(this);
    }

    deleteEmployee(id){
        EmployeeService.deleteEmployee(id).then( res => {
            this.setState({employees: this.state.employees.filter(employee => employee.id !== id)});
        });
    }
    viewEmployee(id){
        this.props.history.push(`/view-employee/${id}`);
    }
    editEmployee(id){
        this.props.history.push(`/add-employee/${id}`);
    }

    componentDidMount(){
        EmployeeService.getEmployees().then((res) => {
            this.setState({ employees: res.data});
        });
    }

    addEmployee(){
        this.props.history.push('/add-employee/_add');
    }

    render() {
        return (
            <div>
            <div className="topbar stick">
            <div className="logo">
              <a title href="newsfeed.html"><img src="images/shareup-1.png" alt="" /></a>
            </div>
            <div className="top-area">
              <ul className="main-menu">
                <li><a href="/newsfeed" title="Home"> <i className="ti-home" aria-hidden="true" /></a></li>
                <li><a href="/friendsTest" title="Friends"><i className="fa fa-user-plus" aria-hidden="true" /></a></li>
                <li><a href="loginSuccess.jsp" title="GROUPS"><i className="fa fa-users" aria-hidden="true" /></a></li>
              </ul>
              <ul className="setting-area">
                <li>
                  <a href="#" title="Home" data-ripple><i className="ti-search" /></a>
                  <div className="searched">
                    <form method="post" className="form-search">
                      <input type="text" placeholder="Search Friend" />
                      <button data-ripple><i className="ti-search" /></button>
                    </form>
                  </div>
                </li>
                <li>
                  <a href="#" title="Notification" data-ripple>
                    <i className="ti-bell" /><span>20</span>
                  </a>
                  <div className="dropdowns">
                    <span>4 New Notifications</span>
                    <ul className="drops-menu">
                      <li>
                        <a href="notifications.html" title>
                          <img src="images/resources/thumb-1.jpg" alt="" />
                          <div className="mesg-meta">
                            <h6>sarah Loren</h6>
                            <span>Hi, how r u dear ...?</span>
                            <i>2 min ago</i>
                          </div>
                        </a>
                        <span className="tag green">New</span>
                      </li>
                      <li>
                        <a href="notifications.html" title>
                          <img src="images/resources/thumb-2.jpg" alt="" />
                          <div className="mesg-meta">
                            <h6>Jhon doe</h6>
                            <span>Hi, how r u dear ...?</span>
                            <i>2 min ago</i>
                          </div>
                        </a>
                        <span className="tag red">Reply</span>
                      </li>
                      <li>
                        <a href="notifications.html" title>
                          <img src="images/resources/thumb-3.jpg" alt="" />
                          <div className="mesg-meta">
                            <h6>Andrew</h6>
                            <span>Hi, how r u dear ...?</span>
                            <i>2 min ago</i>
                          </div>
                        </a>
                        <span className="tag blue">Unseen</span>
                      </li>
                      <li>
                        <a href="notifications.html" title>
                          <img src="images/resources/thumb-4.jpg" alt="" />
                          <div className="mesg-meta">
                            <h6>Tom cruse</h6>
                            <span>Hi, how r u dear ...?</span>
                            <i>2 min ago</i>
                          </div>
                        </a>
                        <span className="tag">New</span>
                      </li>
                      <li>
                        <a href="notifications.html" title>
                          <img src="images/resources/thumb-5.jpg" alt="" />
                          <div className="mesg-meta">
                            <h6>Amy</h6>
                            <span>Hi, how r u dear ...?</span>
                            <i>2 min ago</i>
                          </div>
                        </a>
                        <span className="tag">New</span>
                      </li>
                    </ul>
                    <a href="notifications.html" title className="more-mesg">view more</a>
                  </div>
                </li>
                <li>
                  <a href="#" title="Messages" data-ripple><i className="ti-comment" /><span>12</span></a>
                  <div className="dropdowns">
                    <span>5 New Messages</span>
                    <ul className="drops-menu">
                      <li>
                        <a href="notifications.html" title>
                          <img src="images/resources/thumb-1.jpg" alt="" />
                          <div className="mesg-meta">
                            <h6>sarah Loren</h6>
                            <span>Hi, how r u dear ...?</span>
                            <i>2 min ago</i>
                          </div>
                        </a>
                        <span className="tag green">New</span>
                      </li>
                      <li>
                        <a href="notifications.html" title>
                          <img src="images/resources/thumb-2.jpg" alt="" />
                          <div className="mesg-meta">
                            <h6>Jhon doe</h6>
                            <span>Hi, how r u dear ...?</span>
                            <i>2 min ago</i>
                          </div>
                        </a>
                        <span className="tag red">Reply</span>
                      </li>
                      <li>
                        <a href="notifications.html" title>
                          <img src="images/resources/thumb-3.jpg" alt="" />
                          <div className="mesg-meta">
                            <h6>Andrew</h6>
                            <span>Hi, how r u dear ...?</span>
                            <i>2 min ago</i>
                          </div>
                        </a>
                        <span className="tag blue">Unseen</span>
                      </li>
                      <li>
                        <a href="notifications.html" title>
                          <img src="images/resources/thumb-4.jpg" alt="" />
                          <div className="mesg-meta">
                            <h6>Tom cruse</h6>
                            <span>Hi, how r u dear ...?</span>
                            <i>2 min ago</i>
                          </div>
                        </a>
                        <span className="tag">New</span>
                      </li>
                      <li>
                        <a href="notifications.html" title>
                          <img src="images/resources/thumb-5.jpg" alt="" />
                          <div className="mesg-meta">
                            <h6>Amy</h6>
                            <span>Hi, how r u dear ...?</span>
                            <i>2 min ago</i>
                          </div>
                        </a>
                        <span className="tag">New</span>
                      </li>
                    </ul>
                    <a href="messages.html" title className="more-mesg">view more</a>
                  </div>
                </li>
                <li><a href="#" title="Languages" data-ripple><i className="fa fa-globe" /></a>
                  <div className="dropdowns languages">
                    <a href="#" title><i className="ti-check" />English</a>
                    <a href="#" title>Arabic</a>
                    <a href="#" title>Dutch</a>
                    <a href="#" title>French</a>
                  </div>
                </li>
              </ul>
              <div className="user-img">
                <img src="images/resources/admin.jpg" alt="" />
                <span className="status f-online" />
                <div className="user-setting">
                  <a href="#" title><span className="status f-online" />online</a>
                  <a href="#" title><span className="status f-away" />away</a>
                  <a href="#" title><span className="status f-off" />offline</a>
                  <a href="about.jsp"><i className="ti-user" aria-hidden="true" /> view profile</a>
                  <a href="#" title><i className="ti-pencil-alt" />edit profile</a>
                  <a href="#" title><i className="ti-target" />activity log</a>
                  <a href="#" title><i className="ti-settings" />account setting</a>
                  <a href="#" title><i className="ti-power-off" />log out</a>
                </div>
              </div>
              <span className="ti-menu main-menu" data-ripple />
            </div>
          </div>{/* topbar */}
          <section>
            <div className="gap gray-bg">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row" id="page-contents">
                      <div className="col-lg-3">
                        <aside className="sidebar static">
                          <div className="widget">
                            <h4 className="widget-title">Shortcuts</h4>
                            <ul className="naves">
                              <li>
                                <i className="ti-clipboard" />
                                <a href="newsfeed.html" title>News feed</a>
                              </li>
                              <li>
                                <i className="ti-mouse-alt" />
                                <a href="inbox.html" title>Inbox</a>
                              </li>
                              <li>
                                <i className="ti-files" />
                                <a href="fav-page.html" title>My pages</a>
                              </li>
                              <li>
                                <i className="ti-user" />
                                <a href="timeline-friends.jsp" title>timeline</a>
                              </li>
                            </ul>
                          </div>{/* Shortcuts */}
                          <div className="widget">
                            <h4 className="widget-title">Recent Activity</h4>
                            <ul className="activitiez">
                              <li>
                                <div className="activity-meta">
                                  <i>10 hours Ago</i>
                                  <span><a href="#" title>Commented on Video posted </a></span>
                                  <h6>by <a href="time-line.html">black demon.</a></h6>
                                </div>
                              </li>
                              <li>
                                <div className="activity-meta">
                                  <i>30 Days Ago</i>
                                  <span><a href="#" title>Posted your status. “Hello guys, how are you?”</a></span>
                                </div>
                              </li>
                              <li>
                                <div className="activity-meta">
                                  <i>2 Years Ago</i>
                                  <span><a href="#" title>Share a video on her timeline.</a></span>
                                  <h6>"<a href="#">you are so funny mr.been.</a>"</h6>
                                </div>
                              </li>
                            </ul>
                          </div>{/* recent activites */}
                        </aside>
                      </div>{/* sidebar */}
                      <div className="col-lg-6">
                        <div className="central-meta">
                          <div className="new-postbox">
                            <figure>
                              <img src="images/resources/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png" alt="" />
                            </figure>
                            <div className="newpst-input">
                              <form method="post" action="uploadPost" encType="multipart/form-data">
                                <textarea rows={2} placeholder="write something" name="post_content" defaultValue={""} />
                                <img id="preview" />
                                <div className="attachments">
                                  <ul>
                                    <li><i className="fa fa-music" /> <label className="fileContainer"> <input type="file" name="post_music" />
                                      </label></li>
                                    <li><i className="fa fa-image" /> <label className="fileContainer"> <input type="file" name="post_image" id="post_image" accept="image/*" onchange="previewImage()" />
                                      </label></li>
                                    <li><i className="fa fa-video-camera" /> <label className="fileContainer"> <input type="file" name="post_video" />
                                      </label></li>
                                    <li><i className="fa fa-camera" /> <label className="fileContainer"> <input type="file" />
                                      </label></li>
                                    <li>
                                      <button type="submit">Post</button>
                                    </li>
                                  </ul>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        {/* add post new box */}
                        <div className="loadMore">
                          
                              <div className="central-meta item">
                                <div className="user-post">
                                  
                                  <div className="friend-info">
                                    <figure>
                                      <img src="images/resources/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png" width={50} alt="" />
                                    </figure>
                                    <div className="friend-name">
                                      
                                        <ins>
                                          <a href="time-line.html" title style={{textTransform: 'capitalize'}}></a>
                                        </ins>
                                        <span>published: </span>
                                   </div>
                                    <div className="post-meta">
                                      <p>
                                        
                                        <img src="<s:property value=" image/>"</p>
                                      
                                      
                                      <div className="we-video-info">
                                        <ul>
                                          <li><span className="views" data-toggle="tooltip" title="views"> <i className="fa fa-eye" /> 
                                               
                                            </span></li>
                                          <li><span className="comment" data-toggle="tooltip" title="Comments"> <i className="fa fa-comments-o" />
                                              
                                                
                                            </span></li>
                                          <li><span className="like" data-toggle="tooltip" title="like"> <i className="fa fa-trophy" aria-hidden="true" /> 
                                                
                                            </span></li>
                                          <li className="social-media">
                                            <div className="menu">
                                              <div className="btn trigger">
                                                <i className="fa fa-share-alt" />
                                              </div>
                                              <div className="rotater">
                                                <div className="btn btn-icon">
                                                  <a href="#" title><i className="fa fa-html5" /></a>
                                                </div>
                                              </div>
                                              <div className="rotater">
                                                <div className="btn btn-icon">
                                                  <a href="#" title><i className="fa fa-facebook" /></a>
                                                </div>
                                              </div>
                                              <div className="rotater">
                                                <div className="btn btn-icon">
                                                  <a href="#" title><i className="fa fa-google-plus" /></a>
                                                </div>
                                              </div>
                                              <div className="rotater">
                                                <div className="btn btn-icon">
                                                  <a href="#" title><i className="fa fa-twitter" /></a>
                                                </div>
                                              </div>
                                              <div className="rotater">
                                                <div className="btn btn-icon">
                                                  <a href="#" title><i className="fa fa-css3" /></a>
                                                </div>
                                              </div>
                                              <div className="rotater">
                                                <div className="btn btn-icon">
                                                  <a href="#" title><i className="fa fa-instagram" /></a>
                                                </div>
                                              </div>
                                              <div className="rotater">
                                                <div className="btn btn-icon">
                                                  <a href="#" title><i className="fa fa-dribbble" /></a>
                                                </div>
                                              </div>
                                              <div className="rotater">
                                                <div className="btn btn-icon">
                                                  <a href="#" title><i className="fa fa-pinterest" /></a>
                                                </div>
                                              </div>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="coment-area">
                                    <ul className="we-comet"> 
                                            
                                              <div className="comet-avatar">
                                                <img src="images/resources/comet-1.jpg" alt="" />
                                              </div>
                                              <div className="we-comment">
                                                <div className="coment-head">
                                                  
                                                    
                                                  <h5>
                                                    <a href="time-line.html" title></a>
                                                  </h5>
                                                  <span></span>
                                                  <a className="we-reply" href="#" title="Reply"><i className="fa fa-reply" /></a>
                                                </div>
                                                <p></p>
                                              </div>
                                         
                                        
                                        <li className="post-comment">
                                          <div className="comet-avatar">
                                            <img src="images/resources/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png" alt="" />
                                          </div>
                                          <div className="post-comt-box">
                                            <form method="post" action="uploadComment" encType="multipart/form-data">
                                              
                                                <textarea rows={2} placeholder="write something" name="comment" defaultValue={""} />
                                                
                                                <div className="add-smiles">
                                                  <button type="submit" style={{color: 'blue', padding: '5px'}}>Comment</button>
                                                </div>
                                              </form></div>
                                        </li>
                                      </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                      </div>
                      {/* centerl meta */}
                      {/* sidebar */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="side-panel">
            <h4 className="panel-title">General Setting</h4>
            <form method="post">
              <div className="setting-row">
                <span>use night mode</span> <input type="checkbox" id="nightmode1" />
                <label htmlFor="nightmode1" data-on-label="ON" data-off-label="OFF" />
              </div>
              <div className="setting-row">
                <span>Notifications</span> <input type="checkbox" id="switch22" />
                <label htmlFor="switch22" data-on-label="ON" data-off-label="OFF" />
              </div>
              <div className="setting-row">
                <span>Notification sound</span> <input type="checkbox" id="switch33" />
                <label htmlFor="switch33" data-on-label="ON" data-off-label="OFF" />
              </div>
              <div className="setting-row">
                <span>My profile</span> <input type="checkbox" id="switch44" /> <label htmlFor="switch44" data-on-label="ON" data-off-label="OFF" />
              </div>
              <div className="setting-row">
                <span>Show profile</span> <input type="checkbox" id="switch55" /> <label htmlFor="switch55" data-on-label="ON" data-off-label="OFF" />
              </div>
            </form>
            <h4 className="panel-title">Account Setting</h4>
            <form method="post">
              <div className="setting-row">
                <span>Sub users</span> <input type="checkbox" id="switch66" /> <label htmlFor="switch66" data-on-label="ON" data-off-label="OFF" />
              </div>
              <div className="setting-row">
                <span>personal account</span> <input type="checkbox" id="switch77" />
                <label htmlFor="switch77" data-on-label="ON" data-off-label="OFF" />
              </div>
              <div className="setting-row">
                <span>Business account</span> <input type="checkbox" id="switch88" />
                <label htmlFor="switch88" data-on-label="ON" data-off-label="OFF" />
              </div>
              <div className="setting-row">
                <span>Show me online</span> <input type="checkbox" id="switch99" />
                <label htmlFor="switch99" data-on-label="ON" data-off-label="OFF" />
              </div>
              <div className="setting-row">
                <span>Delete history</span> <input type="checkbox" id="switch101" />
                <label htmlFor="switch101" data-on-label="ON" data-off-label="OFF" />
              </div>
              <div className="setting-row">
                <span>Expose author name</span> <input type="checkbox" id="switch111" /> <label htmlFor="switch111" data-on-label="ON" data-off-label="OFF" />
              </div>
            </form>
          </div></div> 
            
        )
    }
}

export default ListEmployeeComponent;