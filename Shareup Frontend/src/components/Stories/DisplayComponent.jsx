import React, { useState, useEffect, useContext,useRef } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import { testScript } from '../../js/script';
import StoriesService from '../../services/StoriesService';
import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';


function DisplayComponent() {
    let history = useHistory();
  
    const { user } = useContext(UserContext)
  
    // const []
  
    // const inputRef = createRef();
  
    
   
   
    const [storiesForUser, setStoriesForUser] = useState([]);
    const [stories, setStories] = useState([]);
    const [storiesS, setStoriesS] = useState([]);
    const [userR, setUserR] = useState([]);
    
const delay = 2500;


  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
 
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  

    
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
        testScript()
    },[])
    useEffect(() => {
      getUser()
      getStoriesForUser()
      testScript()
    }, [stories])
    useEffect(() => {
      resetTimeout();
      timeoutRef.current = setTimeout(
        () =>
          setIndex((prevIndex) =>
            prevIndex === 5 ? 0 : prevIndex + 1
          ),
        delay
      );
  
      return () => {
        resetTimeout();
      };
    }, [index]);  
    
  
    return (<>

        {/* <div className="strydivcontnr">
                <div className="strydiv"> */}
        {/* <ul className="slider">
        {storiesForUser.map(
  story =><>
 <li key={story.id}>
   <img src={story.storiesImagePath} />
 </li>
 </>)}
</ul> */}
<div className="stryDsply">
<div className="container">
     
        
<div className="strydivcontnr">
                <div className="strydiv">
                <div className="slideshow">
      <div
        className="slideshowSlider"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
 {storiesForUser.map((background, index) => (
   <>
   {background.storiesImagePath ?
          <div
            className="slide"
            key={index}
            
          >
             <div className="strydisplay-Profimg"><img src={background.user.profilePicturePath} alt="" /><span>{background.user.firstName}</span></div>
           <img className="stryDsplyImg" src={background.storiesImagePath} /> 
          </div>:null}</>
        ))}
      </div>

      <div className="slideshowDots">
        {storiesForUser.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}

</div>
    </div>
    </div>
</div>
</div></div>

        {/* {storiesForUser.map(
  storys =><>
          <div
            className="slide blckSlide"
            key={storys.id}
            
          >
            <div className="strydisplay-Profimg"><img src={storys.user.profilePicturePath} alt="" /></div>
            <img className="stryDsplyImg" src={storys.storiesImagePath} />
           
          </div>
        </>)}
      </div>

      <div className="slideshowDots">
      {storiesForUser.map((_, idx)(
          <div
            key={idx}
            className={`slideshowDot${index === idx? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
      ))} */}
      
{/* <OwlCarousel className='owl-theme' loop margin={1} items={1}  nav active>
{storiesForUser.map(
  story =><>
    <div class='item' key={story.id}>
    <img className="stryDsplyImg" src={story.storiesImagePath} />
    </div>
    </>)}
</OwlCarousel> */}

  </>

        /* <Carousel>
        {storiesForUser.map(
  story =><>
  <Carousel.Item key={story.id}>
    <img
      className="d-block w-100"
      src={story.storiesImagePath}
      alt="First slide"
    />
    <Carousel.Caption>
      <h3>First slide label</h3>
      <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
    </Carousel.Caption>
  </Carousel.Item> </>)}
  
  {/* <Carousel.Item>
    <img
      className="d-block w-100"
      src="assets/img/wall-two-colors-decorative-facade-plaster-texture-plastered-facade-two-colors-blue-yellow-113891371.jpg"
      alt="Second slide"
    />

    <Carousel.Caption>
      <h3>Second slide label</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="holder.js/800x400?text=Third slide&bg=20232a"
      alt="Third slide"
    />

    <Carousel.Caption>
      <h3>Third slide label</h3>
      <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
    </Carousel.Caption>
  </Carousel.Item> 
</Carousel> */

      
     
     
        );
    }

export default DisplayComponent;