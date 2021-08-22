import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import SimpleReactLightbox from 'simple-react-lightbox'
import { testScript } from '../../js/script';
import GroupService from '../../services/GroupService';
import StoriesService from '../../services/StoriesService';
import Carousel from 'react-bootstrap/Carousel'



import Modal from 'react-modal';
import Popup from 'reactjs-popup';
function StoriesComponent({ story, setRefresh }) {
    

    let history = useHistory();
  
    const { user } = useContext(UserContext)
  
    // const []
  
    // const inputRef = createRef();
  
    
   
    const [index, setIndex] = useState(0);
    const [storiesForUser, setStoriesForUser] = useState([]);
    const [stories, setStories] = useState([]);
    const [userR, setUserR] = useState([]);

    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
   
    const getStoriesForUser = async () => {
      await StoriesService.getStoriesForUser(AuthService.getCurrentUser().username).then(res => {
        const sorting = res.data.sort(function(a, b) {
          let dateA = new Date(a.date), dateB = new Date(b.date);
          return dateB - dateA;
      });
        const uniqueStories = Array.from(new Set(sorting.map(a => a.id)))
          .map(id => {
            return res.data.find(a => a.id === id)
          })
        setStoriesForUser(uniqueStories)
      })
    }
    const getUser = async () => {
      if (user === null) {
        console.log("RUNNING")
        await UserService.getUserByEmail(AuthService.getCurrentUser().username).then(res => {
          setUserR(res.data);
        })
      } else {
        console.log("WALKING" + JSON.stringify(user))
        setUserR(user)
      }
    }
      
    useEffect(() => {
      getUser()
      getStoriesForUser()
      testScript()
    }, [stories])
      
      
    
return(
  
  <div className="strysggstion-card">
  <div className="strysggstion-Profimg"><img src={story.user.profilePicturePath} alt="" /></div>
  <a href="#">
   {/* {story.storiesImagePath} data-lightbox={`image-user-${story.user.id}`} */}
  <div className="strysggstion-imgStry"><a href="#!"><img src={story.storiesImagePath} alt="" /></a></div>
  </a>
  
</div>

        
       

	
)


}
export default StoriesComponent;