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
import settings from '../services/Settings';
import fileStorage from '../config/fileStorage';
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
 const curdate=()=>{
  let date = new Date()
  let dd=date.getDate()
  let mm=date.getMonth()
  let yy=date.getFullYear()
  return `${dd}/ ${mm}/ ${yy}`
}
console.log("User: ", user); 
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
                       <div className="user"><img src={fileStorage.baseUrl+user.profilePicturePath}/>
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
                      <div className="ads"><a href="https://technology-signals.com/wp-content/uploads/2019/05/images.martechadvisor.comvoice_technology_5cecf0b8-3f280e5abac0da913f8aa0868cf970c6a429a128.jpg" data-lightbox="image-1" data-title="My caption"><img src="https://technology-signals.com/wp-content/uploads/2019/05/images.martechadvisor.comvoice_technology_5cecf0b8-3f280e5abac0da913f8aa0868cf970c6a429a128.jpg"></img></a>
                      </div>
                        </div>

                      <div className="widget friend-list stick-widget">
                      <div className="row" ><img src="../assets/images/Trends1.jpg"/><p className="widget-title">News</p></div>
                      <div className="news"><a href="#" data-lightbox="image-1" data-title="My caption">
                        <img src="../assets/images/Trends1.jpg"></img></a></div>
                      </div>
                        <div class="media-date">
                          <marquee direction="right" >What's trending</marquee></div>
                          <div style={{background:'white' , padding: '15px',borderRadius:'10px',marginBottom:'30px'}}>

                          <ul>
                              <li>
                                  <i><a href=" https://www.aljazeera.com/where/qatar/" target="_blank" style={{textDecoration:"underline",color:"#258eae" ,fontstyle:"italic"}}>Aljazeera Qatar News</a></i><br/>
                                  <p style={{fontFamily:"Times New Roman",fontWeight:"normal",fontSize:"16px",paddingTop:'10px'}} class="text-justify"> Al Jazeera for truth and transparency ....
                                </p><br/>
                              </li>
                                  
                              <li>
                                  <i><a href="https://www.theverge.com/tech" target="_blank" style={{textDecoration:"underline",color:"#258eae" ,fontstyle:"italic"}}>Technology</a></i><br/>
                                  <p style={{fontFamily:"Times New Roman",fontWeight:"normal",fontSize:"16px",paddingTop:'10px'}} class="text-justify">Technology Trends report examines the ever-evolving </p><br/>
                              
                              </li>
                                <li>
                                  <i><a href="https://thepeninsulaqatar.com/category/Qatar-Business" target="_blank" style={{textDecoration:"underline",color:"#258eae" ,fontstyle:"italic"}}>Business</a></i><br/>
                                  <p style={{fontFamily:"Times New Roman",fontWeight:"normal",fontSize:"16px",paddingTop:'10px'}} class="text-justify">Comprehensive Guide to Qatar Business ....</p>
                              <br/>
                              </li>
                              <li> <a href="https://www.dohanews.co/category/sports/" target="_blank" style={{textDecoration:"underline",color:"#258eae"}}>Sports</a><br/></li>
                              <p style={{fontFamily:"Times New Roman",fontWeight:"normal",fontSize:"16px",paddingTop:'10px'}} class="text-justify">View the latest in Qatar, SOCCER team news here.Sports..</p>
                          </ul>
                          <br/>
                        </div>
                          <FriendsWidgetComponent />
                          <FollowingWidgetComponent /> 
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