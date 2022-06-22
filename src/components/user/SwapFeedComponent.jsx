import React, { useState, useEffect, useContext, cloneElement } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import SwapService from '../../services/SwapService';
import AuthService from '../../services/auth.services';
import { testScript } from '../../js/script';
import Layout from '../LayoutComponent';
import GuideComponent from './GuideComponent';
import Popup from 'reactjs-popup';
import FriendsService from '../../services/FriendService';
import PostComponent from '../post/PostComponent';
import fileStorage from '../../config/fileStorage';
import LocSearchComponent from '../AccountSettings/LocSearchComponent';
import  { handleSendNotification } from "../dashboard/ShareupInsideHeaderComponent";
function SwapFeedComponent() {
  let history = useHistory();
  const { user } = useContext(UserContext)
  const [refresh, setRefresh] = useState(null)
  const [showComp, setShowComp] = useState("AllSwaps");
  const [userR, setUserR] = useState([]);
  const [swapContent, setSwapContent] = useState("");
  const [swapImage, setSwapImage] = useState({});
  const [showSwapImage, setShowSwapImage] = useState(false);
  const [swapfiles, setSwapfiles] = useState({});
  const [uploadError, setUploadError] = useState("");
  const [Privacy, setPrivacy] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [userF, setUserF] = useState(null);
  const [swapsForUser, setSwapsForUser] = useState([]);
  const [swapsForUserFriends, setSwapsForUserFriends] = useState([]);
  const [searchedSwap, setSearchedSwap] = useState([]);
  const [searchedSwapFriend, setSearchedSwapFriend] = useState([]);
  const [searchedUser, setSearchedUser] = useState([]);
  const [privacy, setprivacy] = useState('privacy');

  useEffect(() => {
    getAllUser()
    getFriendsList()
    testScript()
  }, [])

  useEffect(() => {
    getUser()
    getSwapsForUser()
    getSwapForUserFriends()
  }, [ refresh])

  useEffect(() => {
    getSwapsForUser()
    getSwapForUserFriends()
  }, [user])

  const getSwapsForUser = async () => {

    await SwapService.getSwapForUser(AuthService.getCurrentUser().username).then(res => {
      const sorting = res.data.sort(function (a, b) {
        let dateA = new Date(a.published), dateB = new Date(b.published);
        return dateB - dateA;
      });
      const uniquePost = Array.from(new Set(sorting.map(a => a.id)))
        .map(id => {
          return res.data.find(a => a.id === id)
        })
      // setSwapsForUser(uniquePost)
      // setSearchedSwap(uniquePost)
    })
  }

  const getSwapForUserFriends = async () => {
if (user){
    await SwapService.getSwap(user?.id).then(res => {
      setSwapsForUser(res.data)
      setSearchedSwap(res.data)
      setSwapsForUserFriends(res.data)
      setSearchedSwapFriend(res.data)
    })}
  }

  const handleChange = e => {
    const target = e.target;
    if (target.checked) {
      setprivacy(target.value);
    }
  };


  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  //swapcomponents
  const handleSwapContent = (event) => {
    setSwapContent(event.target.value)
  }
  const handleFileSwap = (event) => {
    setSwapfiles(event.target.files);
    let filesAmount = event.target.files.length;
    if (filesAmount < 6) {
      let tempImage = [];
      for (let i = 0; i < filesAmount; i++) {
        //tempImage=[...tempImage,URL.createObjectURL(event.target.files[i])]
        tempImage.push(URL.createObjectURL(event.target.files[i]));
      }

      setSwapImage(tempImage);
      setShowSwapImage(true);
    } else {
      alert('5 files are allowed');
      event.preventDefault();
    }
  };
  const handleRemoveImageSwap = () => {
    setSwapfiles({})
    setShowSwapImage(false)
  }

  const imageshowSwap = () => {
    return (
      <div style={{ margin: '0 11px', padding: '15px', boxShadow: '0 0 3px rgb(0 0 0 / 16%)', borderRadius: '5px' }}>
        <div style={{ display: 'inline' }}>What has to be swapped?</div>

        <div className='add-smilespopup'>
          <label className='fileContainer'>
            <input type='file' name='swap_image' accept='image/*' onChange={handleFileSwap}></input>
            <i className='lar la-file-image'></i>
          </label>
        </div>
        <div className='gifpopup' style={{ fontSize: '28px', paddingBottom: '14px' }}>
          <Popup
            trigger={
              <a href='#!'>
                <i className='las la-user-tag' ></i>
              </a>
            }
            modal
            nested
          >
            {(close) => (
              <Form style={{ margin: '5px' }} className='popwidth'>
                <div className='search-container'>
                  <i className='las la-search'></i>
                  <input
                    className='friend-search'
                    type='text'
                    id='header-search'
                    placeholder='Search Friends'
                    name='s'
                    onChange={handleSearchedUser}
                  />
                  <span onClick={close}>Done</span>
                </div>
                {userF ? (
                  <>
                    <div className='Tag'>Tagged:{`${userF.firstName} ${userF.lastName}`}</div>
                  </>
                ) : null}
                <div>
                  <ul>
                    {friendsList.length > 0 ? (
                      <>
                        {friendsList.map((userM) =>
                          user.id !== userM.id ? (
                            <li key={userM.id} className='friends-card'>
                              <a href='#!' onClick={() => handleTag(userM)}>
                                {' '}
                                <div className='grid-container'>
                                  {/* <figure> */}
                                  <div className='item1'>
                                    <a href={`/profile/${userM.email}`} title={`${userM.email}`}>
                                      <img style={{ objectFit: 'cover' }} src={userM.profilePicturePath} alt='' />
                                    </a>
                                    {/* </figure> */}
                                  </div>
                                  <div className='item2'>
                                    <p className='nameTagMsg'>{`${userM.firstName} ${userM.lastName}`}</p>
                                  </div>
                                  {/* <div className="  "> */}
                                </div>
                              </a>
                            </li>
                          ) : null
                        )}
                      </>
                    ) : (
                      <div style={{ padding: '10% 0', textAlign: 'center' }}>You have no friends to tag</div>
                    )}
                  </ul>
                </div>
              </Form>
            )}
          </Popup>
        </div>
        <div className='campopup'>
          <Popup
            trigger={
              <a href='#!'>
                <i className='las la-map-marker-alt'></i>
              </a>
            }
            nested
            modal
          >
            {(close) => (
              <Form style={{ margin: '5px' }} className='popwidth'>
                <LocSearchComponent />
              </Form>
            )}
          </Popup>{' '}
        </div>

        {/* <ul style={{marginLeft:'10px'}}>
      <li style={{fontSize:'12px'}}>What's in hang?</li>
      <li><label className="fileContainer"><i className="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
    </label></li></ul>*/}
      </div>
    );
  };
  const uploadSwap = (event) => {
    event.preventDefault();
    setUploadError('');
    if (swapContent === '' && Object.keys(swapfiles).length === 0 && swapfiles.constructor === Object) {
      setUploadError('Please Insert A Text or an Image');
      return;
    }

    const formData = new FormData();

    formData.append('content', swapContent);
    for (let i = 0; i < swapfiles.length; i++) {
      formData.append(`files`, swapfiles[i]);
    }


    formData.append(`swapfiles`, swapfiles);
    formData.append(`privacy`, Privacy);
    if (userF === null) {
      SwapService.createSwap(user.id, formData, null).then((res) => {

        setSwapContent('');
        handleRemoveImageSwap();
        setRefresh(res.data);

      });
    } else
      SwapService.createSwap(user.id, formData, userF.id).then((res) => {
        setSwapContent('');
        handleRemoveImageSwap();
        setRefresh(res.data);
      });
  };

  const getUser = async () => {
    if (user === null) {
      await UserService.getUserByEmail(AuthService.getCurrentUser().username).then(res => {
        setUserR(res.data);
      })
    } else {
      setUserR(user)
    }
  }

  const popAudience = () => {
    return (

      <Popup
        trigger={
          <span style={{ fontSize: '11px', padding: '4px', cursor: 'pointer', backgroundColor: '#0333471a', borderRadius: '5px' }}>
            {privacy}

            <img src="assets/images/Vector.svg"
              style={{ paddingLeft: '4px', verticalAlign: 'middle' }} />
          </span>
        }
        modal
        nested
      >
        {(close) => (
          <Form style={{ paddingRight: '11px', paddinLeft: '11px', paddingBottom: '0px' }}
            className='popwidth' onSubmit={close}>
            <div className='headpop' style={{ padding: "0px" , flexDirection:'column' }}>
              <div className='row' style={{ paddingBottom: '10px', paddingtop: '10px' }}>
                <div style={{ width: '5%', paddingBottom: '10px' }}>
                  <a href='#!' style={{ padding: '10px 80px 10px 0' }} onClick={close}>
                    <i className='las la-times' style={{ fontSize: '20px', background: '#C4C4C4', borderRadius: '50%' }}></i>
                  </a>
                </div>

                <div
                  style={{ color: '#000000', fontSize: '21px', fontWeight: 'bold', width: '95%', textAlign: 'center' }}

                >
                  {' '}
                  <span>Select Audience</span>
                </div>

              </div>

              <div className="headaudience"

              >
                {' '}
                <span style={{ fontWeight: 'bold' }}
                >Who can see your post?</span>
                <p style={{ fontSize: '13px', paddingTop: '2px' }}>
                  <p style={{ color: '#525050', fontweight: '400 !important' }}>
                    your post will apear in newsfeed, on your profile and search results</p>
                </p>
              </div>
              <div>

                <fieldset>
                  <div className="form-card">
                    <ul className="nearby-contct">

                      <yi >
                        <div className="grid-containeraudience">
                          <div className="item11">

                            <img src="assets/images/publicicon.svg" style={{ width: '49%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div className="item22">

                            <p style={{ fontSize: '17px', fontWeight: 'bold', color: 'black' }}>
                              Public
                            </p>
                            <p style={{ fontSize: '11px', paddingTop: '1px' }}>
                              <p style={{ color: '#525050' }}>
                                anyone on or off facebook</p>
                            </p>


                          </div>

                          <input type="radio" Value="Public" name="privacy" onChange={handleChange} style={{ height: '60%', width: '100%' }} />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}

                        </div>
                      </yi>

                      <yi>
                        <div className="grid-containeraudience">
                          <div className="item11">

                            <img src="assets/images/friendsicon.svg" style={{ width: '46%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div className="item22">

                            <p style={{ fontSize: '17px', fontWeight: 'bold', color: 'black' }}>
                              Friends
                            </p>

                            <p style={{ fontSize: '11px', fontweight: '300', paddingTop: '1px', color: '#525050' }}>
                              your shareup friends
                            </p>


                          </div>

                          <input type="radio" Value="Friends" name="privacy" onChange={handleChange} style={{ height: '60%', width: '100%' }} />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}

                        </div>
                      </yi>

                      <yi >
                        <div className="grid-containeraudience">
                          <div className="item11">

                            <img src="assets/images/friendexcepticon.svg" style={{ width: '46%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div className="item22">

                            <p style={{ fontSize: '17px', fontWeight: 'bold', color: 'black' }}>
                              Friends except
                            </p>
                            <p style={{ fontSize: '11px', fontweight: '300', paddingTop: '1px', color: '#525050' }}>
                              don't show some friends
                            </p>

                          </div>

                          <input type="radio" Value="Friends except" name="privacy" onChange={handleChange} style={{ height: '60%', width: '100%' }} />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}

                        </div>
                      </yi>

                      <yi  >
                        <div className="grid-containeraudience">
                          <div className="item11">

                            <img src="assets/images/groupicon.svg" style={{ width: '46%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div className="item22">

                            <p style={{ fontSize: '17px', fontWeight: 'bold', color: 'black' }}>
                              Group
                            </p>
                            <p style={{ fontSize: '11px', fontweight: '300', paddingTop: '1px', color: '#525050' }}>
                              select to show for group
                            </p>
                          </div>

                          <input type="radio" Value="Group" name="privacy" onChange={handleChange} style={{ height: '60%', width: '100%' }} />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}

                        </div>
                      </yi>

                      <yi  >
                        <div className="grid-containeraudience">
                          <div className="item11">

                            <img src="assets/images/onlymeicon.svg" style={{ width: '39%' }} />
                            {/* <img src={fileStorage.baseUrl +profilePicturePath} alt="" /> */}
                            {/* <span className="status f-online" /> */}
                          </div>
                          <div className="item22">
                            <p style={{ fontSize: '17px', fontWeight: 'bold', color: 'black' }}>
                              Only Me
                            </p>
                            <p style={{ fontSize: '11px', fontweight: '300', paddingTop: '1px', color: '#525050' }}>
                              private to all shareup users
                            </p>
                          </div>

                          <input type="radio" Value="Only Me" name="privacy" style={{ height: '60%', width: '100%' }} />

                          {/* <a href="#!" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} href="#!" onClick={("")} ></a> */}

                        </div>
                      </yi>


                    </ul>
                  </div>
                </fieldset>



              </div>
            </div>

          </Form>
        )}
      </Popup>
    );
  };

  //Adding new swap
  const postSwap = () => {
    return (
      <Popup trigger={
        <span style={{ cursor: 'pointer' }}>
          <span style={{ padding: '5px' }}>
            <i className="las la-sync-alt" aria-hidden="true" style={{ fontSize: '18px' }}></i>
          </span>
          Swap
        </span>
        // <div className="textbox"><span style={{cursor: "pointer"}}>Do you want to swap anything?</span></div>
      }
        modal nested>
        {close => (
          <Form style={{ margin: '5px' }} className='popwidth' onSubmit={(e) => {
            uploadSwap(e); close();
          }}>

            <div className='headpop'>
              <div className='row'>
                <div style={{ width: '20%' }}>
                  <a href='#!' style={{ padding: '10px 80px 10px 0' }} onClick={close}>
                    <i className='las la-times'></i>
                  </a>
                </div>
                <div
                  style={{ color: '#000000', fontSize: '18px', fontWeight: 'bold', width: '60%', textAlign: 'center' }}
                >
                  {' '}
                  <span>Create Swap</span>
                </div>
                <div style={{ width: '20%', textAlign: 'right', padding: '0' }}>
                  {/* <a className='popup-btn' href='/HangGift'>
                    Keep Swap
                  </a> */}
                </div>
              </div>
            </div>
            <div style={{ padding: '0 11px 11px 11px' }}>
              <div className='popupimg'>
                <img
                  src={
                    user
                      ? fileStorage.baseUrl + user.profilePicturePath
                      : fileStorage.baseUrl + userR.profilePicturePath
                  }
                  alt=''
                />
              </div>
              <div className='popupuser-name'>
                <div style={{ display: 'inline' }}>
                  <span>
                    {`${user.firstName} ${user.lastName}`}
                    {userF ? <> with {`${userF.firstName} ${userF.lastName}`}</> : null}
                  </span>
                  <span style={{ marginTop: '4px ', display: 'block', fontSize: '10px' }}>
                    <li style={{ paddingLeft: '0%', paddingTop: '1%', listStyleType: 'none' }}>
                      {popAudience()}
                    </li>

                    {/* <div className='dropdownnewsfeed'>
                      <select name='privacy' id='privacy' value={Privacy} onChange={handlePrivacy}>
                        <option value='Friends'>Friends</option>
                        <option value='Public'>Public</option>
                        <option value='Only Me'>Only Me</option>
                      </select>
                    </div>{' '} */}
                  </span>
                </div>{' '}
              </div>{' '}
            </div>
            <div style={{ minHeight: '150px' }}>
              <span className='textPop'>
                <textarea
                  className='textpopup'
                  rows={2}
                  placeholder={uploadError ? `${uploadError}` : 'We share,do you?'}
                  name='swap_content'
                  value={swapContent}
                  onChange={handleSwapContent}
                />

                {showSwapImage ? (
                  <>
                    <div style={{ position: 'relative' }}>
                      {swapImage.map((item, key) => (
                        <img
                          src={item}
                          key={key}
                          style={{
                            padding: '10px',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                      ))}

                      {/* <img id="preview" src={postImage} style={{ width: "100%",objectFit:'cover' }} /> */}
                      <button
                        onClick={handleRemoveImageSwap}
                        style={{
                          right: '10px',
                          top: '10px',
                          position: 'absolute',
                          borderRadius: '100%',
                          background: '#b7b7b738',
                          padding: '10px 10px',
                        }}
                      >
                        <i className='las la-times'></i>
                      </button>
                    </div>

                  </>
                ) : null}
              </span>
              {/* <a href="#!" onClick={() => setShowCompont("image")}><span style={{float:'right',padding:'5px',margin:'5px',background:'#033347',padding: '2px 5px',color:'#fff',borderRadius:'5px'}}>+</span></a>*/}
            </div>

            {imageshowSwap()}
            <button
              type='submit'
              value='Submit'
              className="popsbmt-btn"
            // onClick={uploadSwap}
            >
              SWAP
            </button>
          </Form>
        )}
      </Popup>
    )
  }

  //ends swap here

  const testFanc = (post) => {
    return (<PostComponent post={post} setRefresh={setRefresh} />)
  }

  const handleTag = (userM) => {
    setUserF(userM)
  }
  const handleSearchedUser = (event) => {
    if (event.target.value === "") {
      setSearchedUser(allUser)
    } else {
      let temp = []
      allUser.map(u => {
        const email = u.email.toLowerCase()
        const searchedvalue = event.target.value.toLowerCase()
        if (email.includes(searchedvalue) ) {
          temp.push(u)
        }
      })
      setSearchedUser(temp)
    }
  }
  
  const handleSearchedSwap = (event) => {
    if (event.target.value === "") {
      setSearchedSwap(swapsForUser)
    } else {
      let temp = []
      swapsForUser.map(u => {
        const content = u.content.toLowerCase()
      
        const searchedvalue = event.target.value.toLowerCase()
        if (content.includes(searchedvalue) ) {
          temp.push(u)
        }
      })
      setSearchedSwap(temp)
    }
  }

  const handleSearchedSwapFriend = (event) => {
    if (event.target.value === "") {
      setSearchedSwap(swapsForUserFriends)
    } else {
      let temp = []
      swapsForUserFriends.map(u => {
        const content = u.content.toLowerCase()
      
        const searchedvalue = event.target.value.toLowerCase()
        if (content.includes(searchedvalue) ) {
          setSearchedSwapFriend(temp)

          temp.push(u)
        }
      })
      setSearchedSwapFriend(temp)
    }
  }

  const getAllUser = async () => {
    await UserService.getUsers().then(res => {
      setAllUser(res.data)
      setSearchedUser(res.data)
    })
  }
  const getFriendsList = async () => {
    await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
      setFriendsList(res.data)
    })
  }

const AllswapscomponentFunction = () => {
    return (
      <div className="loadMore">
         <div className="friends-search-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input className="friend-search" type="text" placeholder="Search Swap" name="s" onChange={handleSearchedSwapFriend} style={{ width: "100%" }} />
            </div>
        {searchedSwapFriend && searchedSwapFriend.length > 0
          ? searchedSwapFriend.map(
            post =>
              <div style={{paddingBottom:'10px'}} key={post.id}>
                {
                  post.group ?
                    post.group.members.some(member => member.email === AuthService.getCurrentUser().username) ?
                      testFanc(post) : null
                    :post.userdata.id !== user?.id? 
                    testFanc(post)
                    : null
                }
              </div>
          )
          : <div className="center" style={{padding: "20px"}}>No Swaps</div>
        }


      </div>
    )
  }

  const MySwapsComponentFunction = () => {
    return (
      <div className="loadMore">
         <div className="friends-search-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input className="friend-search" type="text" placeholder="Search Swap" name="s" onChange={handleSearchedSwap} style={{ width: "100%" }} />
            </div>
        {searchedSwap && searchedSwap.length > 0
          ? searchedSwap.map(
            post =>
              <div style={{paddingBottom:'10px'}} key={post.id}>
                {
                  post.group ?
                    post.group.members.some(member => member.email === AuthService.getCurrentUser().username) ?
                      testFanc(post) : null
                    :post.userdata.id === user?.id ?
                    testFanc(post)
                    : null
                }
              </div>
          )
          : <div className="center" style={{padding: "20px"}}>No Swaps</div>
        }

      </div>
    )
  }
  
	const handleShowComp = () => {
		if (showComp === "AllSwaps") {
			return AllswapscomponentFunction()
		} else if (showComp === "MySwaps") {
			return MySwapsComponentFunction()
		}
		}

  // if (user.newUser) {
  //   return <GuideComponent />
  // }

  return (
    <Layout user={user}>
      <div className="col-lg-6">
        <div className="central-meta swap-pg-cont">
          <div className="frnds">
            <div>
              <p className="Friends-Title common-title">Swaps</p>
              <i style={{ float: "right", fontSize: 20 }} className="fas fa-ellipsis-v"></i>
            </div>
            <div className="navContent">

              <ul className="nav nav-pills swap-page-nav" role="tablist">
                <li className="nav-item" style={{ justifyContent: 'flex-start' }}>
                  <div className="all" onClick={() => setShowComp("AllSwaps")}>
                    <span style={{ cursor: 'pointer' }}>
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                        <i className="fas fa-retweet" style={{ fontSize: '20px' }}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      All Swaps
                    </span>
                  </div>
                </li>
                <li className="nav-item" style={{ justifyContent: 'center' }}>
                  <div className="my" onClick={() => setShowComp("MySwaps")}>
                    <span style={{ cursor: 'pointer' }}>
                      <span style={{ marginRight: '5px', padding: '5px' }}>
                        <i className="ti-control-shuffle" style={{ fontSize: '20px' }}></i>
                        {/* <span>{`${following.length}`}</span> */}
                      </span>
                      My Swaps
                    </span>
                  </div>
                </li>
                <li className="nav-item" style={{ justifyContent: 'flex-end' }}>
                  <div className="new">
                   

                    {postSwap()}
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
           
            {handleShowComp()}
          </div>

        </div>
       

      </div>
    </Layout>

  );
}
export default SwapFeedComponent;