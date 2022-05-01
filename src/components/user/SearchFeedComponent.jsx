import React, { useState, useEffect, useContext, cloneElement } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import SwapService from '../../services/SwapService';
import SearchService from '../../services/SearchService';

import AuthService from '../../services/auth.services';
import SimpleReactLightbox from 'simple-react-lightbox'
import { testScript } from '../../js/script';
import GroupService from '../../services/GroupService';
import StoriesService from '../../services/StoriesService';
import settings from '../../services/Settings';
import EditPostComponent from './EditPostComponent'
import Modal from 'react-modal';
import Grpicon from '../../images/grpicon.png'


import Layout from '../LayoutComponent';
import GuideComponent from './GuideComponent';
import SwapPostComponent from '../post/SwapPostComponent';
import StoriesComponent from '../Stories/StoriesComponent';
import Popup from 'reactjs-popup';
import FriendsService from '../../services/FriendService';
import PostComponent from '../post/PostComponent';
import fileStorage from '../../config/fileStorage';

import LocSearchComponent from '../AccountSettings/LocSearchComponent';


import { useSelector } from "react-redux"

import { store } from "../../app/store";

import { setSearchTerm } from "../../app/searchSlice";



function SearchFeedComponent() {
    const [isLoading, setIsLoading] = useState(true);


    let history = useHistory();

    const { user } = useContext(UserContext)

    const [refresh, setRefresh] = useState(null)
    const [stories, setStories] = useState([]);
    const [storiesImage, setStoriesImage] = useState([]);
    const [filesStry, setFilesStry] = useState({});
    const [showstoriesImage, setShowstoriesImage] = useState(false);
    const [showComp, setShowComp] = useState("newsfeed");
    const [showCompont, setShowCompont] = useState();
    const [posts, setPosts] = useState([]);
    const [swapsForUser, setSwapsForUser] = useState([]);


    const [storiesForUser, setStoriesForUser] = useState([]);
    const [savedPost, setSavedPost] = useState([]);
    const [userR, setUserR] = useState([]);
    const [group, setGroup] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [searchedGroups, setSearchedGroups] = useState([]);

    const [count, setCount] = useState(1);

    const [swapContent, setSwapContent] = useState("");
    const [swapImage, setSwapImage] = useState({});
    const [showSwapImage, setShowSwapImage] = useState(false);

    const [postContent, setPostContent] = useState("");
    const [commentContent, setCommentContent] = useState("");
    const [files, setFiles] = useState({});
    const [swapfiles, setSwapfiles] = useState({});
    const [postImage, setPostImage] = useState({});
    const [showPostImage, setShowPostImage] = useState(false);

    const [uploadError, setUploadError] = useState("");

    const [editPostId, setEditPostId] = useState(null)

    const [img, setImage] = useState("");
    const [Privacy, setPrivacy] = useState("");

    const [friendsList, setFriendsList] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [userF, setUserF] = useState(null);
    const [searchedUser, setSearchedUser] = useState([]);

    const [privacy, setprivacy] = useState('privacy');




    const [Sortsearch, setSortsearch] = useState("AllSearch");

    const [Searchbyuser, setSearchbyuser] = useState([]);
    const [Searchbypost, setSearchbypost] = useState([]);
    const [Searchbygroup, setSearchbygroup] = useState([]);


    const searchTerm = useSelector((state) => state.search)







    const KeyPressHandler = (event) => {

        if (event.key === 'Enter' && event.target.value !== '' && Sortsearch === "AllSearch") {

            allSearch()


        } else if (event.key === 'Enter' && event.target.value !== '' && Sortsearch === "SearchByPeople") {

            console.log("SearchByPosts")
            SearchByPeople()


        } else if (event.key === 'Enter' && event.target.value !== '' && Sortsearch === "SearchByPosts") {


            SearchByPosts()
            console.log("SearchByPeople")
        }

    }



    useEffect(() => {
        console.log("searchhhhh ", searchTerm)
    }, [searchTerm]);


    useEffect(() => {
        getAllUser()
        allSearch()

        getFriendsList()
        testScript()
    }, [])


    useEffect(() => {
        getAllGroups()
        allSearch()


    }, [showComp, group])

    useEffect(() => {
        testScript()
    }, [])


    useEffect(() => {
        getUser()
        getPost().then(() => {
            setIsLoading(false)
        })
        // getSwapsForUser()
        getSavedPost()
        testScript()
    }, [editPostId, refresh])

    useEffect(() => {
        // getSwapsForUser()
        getSavedPost()
        testScript()
    }, [user])
    useEffect(() => {
        // getStoriesForUser()
        testScript()
    }, [stories])

    const uploadStories = (event) => {
        event.preventDefault();
        setUploadError("")
        console.log("uploading stories working")


        const formData = new FormData();
        console.log(" this is the files" + filesStry)
        formData.append(`stryfiles`, filesStry)
        StoriesService.createStories(user.id, formData).then(res => {
            console.log(JSON.stringify(res))
            handleRemoveImageStry()
            setStories(res.data)
            setRefresh(res.data)

        })
    }




    const getSearchbyuser = async (searchTerm) => {

        await SearchService.getSearchbyuser(searchTerm).then(res => {
            setSearchbyuser(res.data)
        })
    }

    const getSearchbyPost = async (searchTerm) => {
        await SearchService.getSearchbyPost(searchTerm).then(res => {
            setSearchbypost(res.data)
        })

    }

    const getSearchbyGroup = async (searchTerm) => {
        await SearchService.getSearchbyGroup(searchTerm).then(res => {
            setSearchbygroup(res.data)
        })

    }

    const allSearch = async () => {

        setSortsearch("AllSearch")
        getSearchbyuser(searchTerm)
        getSearchbyPost(searchTerm)
        getSearchbyGroup(searchTerm)


    }

    const SearchByPeople = async () => {


        setSortsearch("SearchByPeople")
        getSearchbyuser(searchTerm)


    }


    const SearchByPosts = async () => {
        setSortsearch("SearchByPosts")
        getSearchbyPost(searchTerm)

    }

    const SearchByGroups = async () => {
        setSortsearch("SearchByGroups")
        getSearchbyPost(searchTerm)

    }



    const handleFileStry = (event) => {
        console.log(event.target.files[0])
        setFilesStry(event.target.files[0])
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setStoriesImage(reader.result)
            }
        }
        console.log(event.target.files[0])
        // if(event.target.files[0].type === blob){
        reader.readAsDataURL(event.target.files[0])
        // }
        setShowstoriesImage(true)
    }
    const handleRemoveImageStry = () => {
        setFilesStry({})
        setShowstoriesImage(false)
    }
    const handleLeaveGroup = (group_id) => {
        console.log(group_id)
        GroupService.leaveGroup(user.id, group_id).then(res => {
            setRefresh(res.data)
            setGroup(res.data)
        })
    }
    const handleChange = e => {
        const target = e.target;
        if (target.checked) {
            setprivacy(target.value);
        }
    };


    const handleJoinGroup = (group_id) => {
        console.log(group_id)
        GroupService.joinGroup(user.id, group_id).then(res => {
            setRefresh(res.data)
            setGroup(res.data)
        })
    }

    const checkIfInGroup = (members) => {
        const found = members.some(el => el.id === user.id);
        return found
    }
    const getAllGroups = async () => {
        await GroupService.getAllGroups().then(res => {
            setAllGroups(res.data)
            setSearchedGroups(res.data)
        })
    }


    const getPost = async () => {
        await PostService.getPost().then(res => {
            setPosts(res.data)
        })
    }




    const getSavedPost = async () => {
        await PostService.getSavedPostForUser(AuthService.getCurrentUser().username).then(res => {
            setSavedPost(res.data)
        })
    }

    const handlePostContent = (event) => {
        console.log(event.target.value)
        setPostContent(event.target.value)
    }

    const handleDeletePost = (postid) => {
        PostService.deletePost(postid).then(res => {
            console.log(res.status)
            setRefresh(res.data)
            // window.location.reload();
        })
    }

    const handleCommentContent = (event) => {
        console.log(event.target.value)
        setCommentContent(event.target.value)
    }

    const handlePostingComment = (postid) => {
        if (commentContent === "") {
            return null;
        }
        const comment = { content: commentContent }
        PostService.addComment(user.id, postid, comment).then(res => {
            console.log(res.status)
            setRefresh(res.data)
            setCommentContent("")
        })
    }
    const handleCount = (opertator) => {
        if (opertator === "+") {
            let counting = count + 1
            console.log(counting + "hi count")
            setCount(counting)

        }
    }
    const handleEditPost = (id) => {
        setEditPostId(id)
    }

    const handleFile = (event) => {
        console.log(event.target.files[0])
        setFiles(event.target.files[0])
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setPostImage(reader.result)
            }
        }
        console.log(event.target.files[0])
        // if(event.target.files[0].type === blob){
        reader.readAsDataURL(event.target.files[0])
        // }
        setShowPostImage(true)
    }


    const handleRemoveImage = () => {
        setFiles({})
        setShowPostImage(false)
    }

    const handleEditingSave = (value) => {
        setEditPostId(value)
        // console.log(res.status)
        // window.location.reload();
    }

    const checkIfLiked = (post) => {
        // maybe this is more effecient
        // post.reactions.map(r => {
        //   console.log(JSON.stringify(r.user))
        //   if(r.user.id === user.id){
        //     return true
        //   }else{
        //     return false
        //   }
        // })

        const result = post.reactions.filter(reaction => reaction.user.id == userR.id)
        if (result.length > 0) {
            return true
        }
        return false
    }

    const checkIfSaved = (post) => {
        console.log(post.savedByUsers)
        // maybe this is more effecient
        // post.savedByUsers.map(r => {
        //   console.log("runninggg")
        //   console.log(JSON.stringify(r.user) + " i p pp p p")
        // if(r.user.id === user.id){
        //   return true
        // }else{
        //   return false
        // }
        // })
        console.log(post.savedByUsers.length + " yaa")
        const result = post.savedByUsers.filter(userz => userz.id == user.id)
        if (result.length > 0) {
            console.log(" FOUND")
            return true
        }
        console.log(" Not found")
        return false
    }

    const handleDeleteComment = (commentid) => {
        PostService.deleteComment(commentid).then(res => {
            console.log(res.status)
            setRefresh(res.data)
        })
    }

    const getCommentCounter = (comments) => {
        let counter = 0
        comments.map(comment => {
            counter += comment.replies.length + 1
        })
        return counter
    }
    const handlePrivacy = (event) => {
        console.log(event.target.value)
        setPrivacy(event.target.value)
    }
    const uploadPost = (event) => {
        event.preventDefault();
        setUploadError("")
        console.log("uploading post working")
        if (postContent === "" && (Object.keys(files).length === 0 && files.constructor === Object)) {
            console.log("cant be null")
            setUploadError("Please Insert A Text or an Image")
            return
        }

        const formData = new FormData();
        formData.append('content', postContent)
        console.log(" this is the files" + files)
        console.log(" this is the swapfiles" + swapfiles)
        formData.append(`files`, files)
        formData.append(`swapfiles`, swapfiles)
        formData.append(`privacy`, Privacy)
        if (userF === null) {
            PostService.createPost(user.id, formData, null).then(res => {
                console.log(JSON.stringify(res))
                setPostContent("")
                handleRemoveImage()
                setRefresh(res.data)
            })
        } else
            PostService.createPost(user.id, formData, userF.id).then(res => {
                console.log(JSON.stringify(res))
                setPostContent("")
                handleRemoveImage()
                setRefresh(res.data)
            })
    }

    const handleLikePost = async (post_id) => {
        UserService.likePost(user.id, post_id).then(res => {
            setRefresh(res.data)
        })
    }

    const handleSavePost = async (post_id) => {
        UserService.savePost(user.id, post_id).then(res => {
            setRefresh(res.data)
        })
    }
    const [modalIsOpen, setIsOpen] = React.useState(false);
    function openModal() {
        setIsOpen(true);
    }
    //swapcomponents
    const handleSwapContent = (event) => {
        console.log(event.target.value)
        setSwapContent(event.target.value)
    }
    const handleFileSwap = (event) => {
        setSwapfiles(event.target.files);
        console.log(swapfiles);
        let filesAmount = event.target.files.length;
        if (filesAmount < 6) {
            let tempImage = [];
            for (let i = 0; i < filesAmount; i++) {
                //tempImage=[...tempImage,URL.createObjectURL(event.target.files[i])]
                tempImage.push(URL.createObjectURL(event.target.files[i]));
            }

            setSwapImage(tempImage);
            console.log('url ' + swapImage[1]);

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
    const handleTag = (userM) => {
        setUserF(userM)
        console.log(userM)
    }
    const imageshowSwap = () => {
        return (
            <div style={{ margin: '0 11px', padding: '15px', boxShadow: '0 0 3px rgb(0 0 0 / 16%)', borderRadius: '5px' }}>
                <div style={{ display: 'inline' }}>What has to be swapped?</div>

                <div className='add-smilespopup'>
                    <label className='fileContainer'>
                        <input type='file' name='swap_image' accept='image/*' onChange={handleFileSwap}></input>
                        <i class='lar la-file-image'></i>
                    </label>
                </div>
                <div className='gifpopup' style={{ fontSize: '28px', paddingBottom: '14px' }}>
                    <Popup
                        trigger={
                            <a href='#!'>
                                <i class='las la-user-tag' ></i>
                            </a>
                        }
                        modal
                        nested
                    >
                        {(close) => (
                            <Form style={{ margin: '5px' }} className='popwidth'>
                                <div class='search-container'>
                                    <i class='las la-search'></i>
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
                                                                    <div class='item1'>
                                                                        <a href={`/profile/${userM.email}`} title={`${userM.email}`}>
                                                                            <img style={{ objectFit: 'cover' }} src={userM.profilePicture} alt='' />
                                                                        </a>
                                                                        {/* </figure> */}
                                                                    </div>
                                                                    <div class='item2'>
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
                                <i class='las la-map-marker-alt'></i>
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
      <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
    </label></li></ul>*/}
            </div>
        );
    };


    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
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
    const imageshow = () => {

        return (
            <div style={{ margin: '0 11px', padding: '15px', boxShadow: '0 0 3px rgb(0 0 0 / 16%)', borderRadius: '5px' }}>
                <div style={{ display: 'inline' }}>What's in hang?</div>

                <div className="add-smilespopup"><label className="fileContainer"><i class="lar la-file-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                </label></div>
                <div className="gifpopup"><Popup trigger={<a href="#!"><i class="las la-user-tag"></i></a>} nested modal>
                    {close => (<Form style={{ margin: '5px' }} className="popwidth">
                        <div class="search-container">
                            <i class="las la-search"></i><input className="friend-search" type="text" id="header-search"
                                placeholder="Search Friends" name="s" onChange={handleSearchedUser} /><span onClick={close}>Done</span>
                        </div>
                        {(userF) ? <><div className="Tag">Tagged:{`${userF.firstName} ${userF.lastName}`}</div></> : null}
                        <div>
                            <ul>
                                {(friendsList.length > 0) ? <>
                                    {friendsList.map(
                                        userM =>
                                            (user.id !== userM.id) ?
                                                <li key={userM.id} className="friends-card">
                                                    <a href="#!" onClick={() => handleTag(userM)}> <div className="grid-container">
                                                        {/* <figure> */}
                                                        <div class="item1">
                                                            <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{ objectFit: 'cover' }} src={fileStorage.baseUrl + userM.profilePicture} alt="" /></a>
                                                            {/* </figure> */}

                                                        </div>
                                                        <div class="item2"><p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                                                        </div>
                                                        {/* <div className="  "> */}
                                                    </div></a>
                                                </li>
                                                : null
                                    )}</> : <div style={{ padding: '10% 0', textAlign: 'center' }}>You have no friends to tag</div>}
                            </ul></div>
                    </Form>
                    )}
                </Popup></div>
                <div className="campopup"><label className="fileContainer"><i class="las la-map-marker-alt"></i><input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                </label></div>


                {/* <ul style={{marginLeft:'10px'}}>
      <li style={{fontSize:'12px'}}>What's in hang?</li>
      <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
    </label></li></ul>*/}</div>
        )


    }
    const imageshowPost = () => {

        return (
            <div style={{ margin: '0 11px', padding: '15px', boxShadow: '0 0 3px rgb(0 0 0 / 16%)', borderRadius: '5px' }}>
                <div style={{ display: 'inline' }}>Add More</div>

                <div className="add-smilespopup"><label className="fileContainer"><i class="lar la-file-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                </label></div>
                <div className="gifpopup"><Popup trigger={<a href="#!"><i class="las la-user-tag"></i></a>} nested modal>
                    {close => (<Form style={{ margin: '5px' }} className="popwidth">
                        <div class="search-container">
                            <i class="las la-search"></i><input className="friend-search" type="text" id="header-search" placeholder="Search Friends" name="s" onChange={handleSearchedUser} /><span onClick={close}>Done</span>
                        </div>
                        {(userF) ? <><div className="Tag">Tagged:{`${userF.firstName} ${userF.lastName}`}</div></> : null}
                        <div>
                            <ul>
                                {(friendsList.length > 0) ? <>
                                    {friendsList.map(
                                        userM =>
                                            (user.id !== userM.id) ?
                                                <li key={userM.id} className="friends-card">
                                                    <a href="#!" onClick={() => handleTag(userM)}> <div className="grid-container">
                                                        {/* <figure> */}
                                                        <div class="item1">
                                                            <a href={`/profile/${userM.email}`} title={`${userM.email}`}><img style={{ objectFit: 'cover' }} src={fileStorage.baseUrl + userM.profilePicture} alt="" /></a>
                                                            {/* </figure> */}

                                                        </div>
                                                        <div class="item2"><p className="nameTagMsg">{`${userM.firstName} ${userM.lastName}`}</p>
                                                        </div>
                                                        {/* <div className="  "> */}
                                                    </div></a>
                                                </li>
                                                : null
                                    )}</> : <div style={{ padding: '10% 0', textAlign: 'center' }}>You have no friends to tag</div>}
                            </ul></div>
                    </Form>
                    )}
                </Popup></div>
                <div className="campopup"><label className="fileContainer"><i class="las la-map-marker-alt"></i><input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
                </label></div>


                {/* <ul style={{marginLeft:'10px'}}>
        <li style={{fontSize:'12px'}}>What's in hang?</li>
        <li><label className="fileContainer"><i class="lar la-image"></i> <input type="file" name="post_image" accept="image/*" onChange={handleFile}></input>
      </label></li></ul>*/}</div>
        )


    }



    const testFanc = (post) => {
        return (<PostComponent post={post} setRefresh={setRefresh} />)
    }


    const [friendRequestSent, setFriendRequestSent] = useState([]);
    const [friendRequestRecieved, setFriendRequestRecieved] = useState([]);
    const getAllFriendRequestSent = async () => {
        await UserService.getFriendRequestSent(AuthService.getCurrentUser().username).then(res => {
            setFriendRequestSent(res.data)
        })
    }

    const getAllFriendRequestRecieved = async () => {
        await UserService.getFriendRequestRecieved(AuthService.getCurrentUser().username).then(res => {
            setFriendRequestRecieved(res.data)
        })
    }


    const acceptFriendRequest = (uid, fid) => {
        FriendsService.acceptRequest(uid, fid).then(res => {
            setRefresh(res.data)
        })
    }

    const declineFriendRequest = (uid, fid) => {
        FriendsService.declineRequest(uid, fid).then(res => {
            setRefresh(res.data)
        })
    }

    const unsendFriendRequest = (uid, fid) => {
        FriendsService.unsendRequest(uid, fid).then(res => {
            setRefresh(res.data)
        })
    }

    const sendFriendRequest = (uid, fid) => {
        FriendsService.sendRequest(uid, fid).then(res => {
            setRefresh(res.data)
        })
    }

    const removeFriend = (uid, fid) => {
        console.log("uid: " + uid + " fid: " + fid)
        FriendsService.removeFriends(uid, fid).then(res => {
            setRefresh(res.data)
        })
    }

    const showUser = () => {
        return (
            <div className="loadMore" style={{ paddingTop: '11px' }}>

                <fieldset style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
                    <p className="Friends-Title" style={{ fontSize: '15px' }}>People</p>
                    <div className="form-card" style={{ paddingTop: '10px' }}>
                        <ul className="nearby-contct" style={{ paddingRight: '12%', paddingLeft: '12%'}}>
                            {Searchbyuser.length !== 0 ?
                                Searchbyuser.map(userF =>
                                    <li className="sendrqstli" style={{ background: 'white' }} key={userF.id}>
                                        <div className="grid-container" >
                                            <div class="item1" >
                                                <img src={fileStorage.baseUrl + userF.profilePicture} alt="" />
                                                {/* <span className="status f-online" /> */}
                                            </div>
                                            <div class="item2" style={{ paddingTop: '15px', paddingLeft: '0px' }}>
                                                <p className="nameTag">
                                                    <a href={`/profile/${userF.email}`}>{`${userF.firstName} ${userF.lastName}`}</a></p>
                                                <p2>
                                                    <p>Recommended</p>
                                                </p2>
                                            </div>
                                            <div style={{ display: 'inline-flex', paddingTop: '25px', paddingRight: '10px' }}>
                                                {
                                                    (user.id !== userF.id) ?
                                                        (!friendsList.some(el => el.id === userF.id)) ?
                                                            friendRequestRecieved.some(el => el.id === userF.id)
                                                                ?
                                                                <>
                                                                    <a href="#" className="button" style={{ background: '#033347', fontSize: '12px' }} onClick={() => acceptFriendRequest(user.id, userF.id)}>Accept Request</a>
                                                                    <a href="#" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} onClick={() => declineFriendRequest(user.id, userF.id)}>Decline Friend Request</a>
                                                                    {/* <br></br>
                                                        <br></br> */}
                                                                </>
                                                                :
                                                                friendRequestSent.some(el => el.id === userF.id)
                                                                    ?
                                                                    <a href="#" className="button" style={{ color: "#fff", background: '#033347', fontSize: '12px' }} onClick={() => unsendFriendRequest(user.id, userF.id)}>Unsend  Request</a>
                                                                    :
                                                                    <a href="#" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} onClick={() => sendFriendRequest(user.id, userF.id)}>Send  Request</a>
                                                            :
                                                            <>
                                                                <a href="#" className="button" style={{ background: '#033347', fontSize: '12px' }} onClick={() => removeFriend(user.id, userF.id)}>Unfriend</a>



                                                            </>
                                                        :
                                                        <div class="item5">
                                                            <p style={{ float: "right" }}>Your own profile</p>

                                                        </div>


                                                }

                                                <i class="las la-times" style={{ fontSize: '13px', padding: '6px', color: 'black' }}>

                                                </i>

                                            </div>

                                            {/* <button onClick={() => sendFriendRequest(userF.id)}>Hi</button> */}
                                        </div>
                                    </li>
                                )
                                : "No User found"}
                        </ul>


                    </div>
                </fieldset>
            </div>

        )
    }


    const showPost = () => {
        return (
            <div className="loadMore" style={{ paddingTop: '11px' }}>

                <div className='loadMore' style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
                    <p className="Friends-Title" style={{ position: 'relative', fontSize: '15px' }}>Posts</p>


                    {Searchbypost.length !== 0 ?
                        Searchbypost.slice(0, 30).map((post) => (
                            <div key={post.id} style={{ paddingTop: '10px', paddingBottom: '0px' }}>

                                {
                                    post.group ?
                                        post.group.members.some((member) => member.email === AuthService.getCurrentUser().username) ?
                                            <PostComponent post={post} setRefresh={setRefresh} user={user} userF={userF} />
                                            : null
                                        : <PostComponent post={post} setRefresh={setRefresh} />
                                }
                            </div>
                        )) : <div style={{ marginTop: '20px' }}>No Posts found</div>}
                </div>

            </div>

        )
    }

    const showAll = () => {
        return (
            <div className="loadMore" style={{ paddingTop: '11px' }}>




                <div className='loadMore'
                    style={{ marginTop: ' 10px', background: 'white', padding: '20px', paddingBottom: '30px', borderRadius: '10px' }}>



                    <fieldset >
                        <p className="Friends-Title" style={{ fontSize: '15px' }}>People</p>
                        <div className="form-card" style={{ paddingTop: '10px' }}>
                            <ul className="nearby-contct" style={{ paddingRight: '12%', paddingLeft: '12%'}}>

                                {Searchbyuser.length !== 0 ?
                                    Searchbyuser.slice(0, 4).map(userF =>
                                        <li className="sendrqstli" style={{ background: 'white' }} key={userF.id}>
                                            <div className="grid-container" >
                                                <div class="item1" >
                                                    <img src={fileStorage.baseUrl + userF.profilePicture} alt="" />
                                                    {/* <span className="status f-online" /> */}
                                                </div>
                                                <div class="item2" style={{ paddingTop: '15px', paddingLeft: '0px' }}>
                                                    <p className="nameTag">
                                                        <a href={`/profile/${userF.email}`}>{`${userF.firstName} ${userF.lastName}`}</a></p>
                                                    <p2>
                                                        <p>Recommended</p>
                                                    </p2>
                                                </div>
                                                <div style={{ display: 'inline-flex', paddingTop: '25px', paddingRight: '10px' }}>
                                                    {
                                                        (user.id !== userF.id) ?
                                                            (!friendsList.some(el => el.id === userF.id)) ?
                                                                friendRequestRecieved.some(el => el.id === userF.id)
                                                                    ?
                                                                    <>
                                                                        <a href="#" className="button" style={{ background: '#033347', fontSize: '12px' }} onClick={() => acceptFriendRequest(user.id, userF.id)}>Accept Request</a>
                                                                        <a href="#" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} onClick={() => declineFriendRequest(user.id, userF.id)}>Decline Friend Request</a>
                                                                        {/* <br></br>
                                                        <br></br> */}
                                                                    </>
                                                                    :
                                                                    friendRequestSent.some(el => el.id === userF.id)
                                                                        ?
                                                                        <a href="#" className="button" style={{ color: "#fff", background: '#033347', fontSize: '12px' }} onClick={() => unsendFriendRequest(user.id, userF.id)}>Unsend  Request</a>
                                                                        :
                                                                        <a href="#" className="button" style={{ color: "#000000", background: '#EAEAEA', fontSize: '12px' }} onClick={() => sendFriendRequest(user.id, userF.id)}>Send  Request</a>
                                                                :
                                                                <>
                                                                    <a href="#" className="button" style={{ background: '#033347', fontSize: '12px' }} onClick={() => removeFriend(user.id, userF.id)}>Unfriend</a>



                                                                </>
                                                            :
                                                            <div class="item5">
                                                                <p style={{ float: "right" }}>Your own profile</p>

                                                            </div>


                                                    }

                                                    <i class="las la-times" style={{ fontSize: '13px', padding: '6px', color: 'black' }}>

                                                    </i>

                                                </div>

                                                {/* <button onClick={() => sendFriendRequest(userF.id)}>Hi</button> */}
                                            </div>
                                        </li>
                                    ) : "No User found"}
                            </ul>
                        </div>



                    </fieldset>
                    <span style={{  paddingTop: '5px', cursor: 'pointer', float: "right", textDecorationLine: 'underline' }} onClick={() => SearchByPeople()}>

                        Explore More
                    </span>



                </div>




                <div className='loadMore'
                    style={{ marginTop: ' 10px', background: 'white', padding: '20px', paddingBottom: '30px', borderRadius: '10px' }}>
                    <p className="Friends-Title" style={{ position: 'relative', fontSize: '15px' }}>Posts</p>
                    <div style={{ marginTop: '20px' }}></div>

                    {Searchbypost.length !== 0 ?
                        Searchbypost.slice(0, 4).map((post) => (
                            <div key={post.id} style={{ paddingTop: '10px', paddingBottom: '0px' }}>

                                {
                                    post.group ?
                                        post.group.members.some((member) => member.email === AuthService.getCurrentUser().username) ?
                                            <PostComponent post={post} setRefresh={setRefresh} user={user} userF={userF} />
                                            : null
                                        : <PostComponent post={post} setRefresh={setRefresh} />
                                }







                            </div>

                        )
                        ) : <div style={{ }}>No Posts found
                        </div>

                    }
                    <span style={{ paddingTop: '5px', cursor: 'pointer', float: "right", textDecorationLine: 'underline' }} onClick={() => SearchByPosts()}>

                        Explore More

                    </span>
                </div>



                <div className='loadMore'
                    style={{ marginTop: ' 10px', background: 'white', padding: '20px', paddingBottom: '30px', borderRadius: '10px' }}>



                    <div className="tab-content">
                        <p className="Friends-Title" style={{ position: 'relative', fontSize: '15px' }}>Groups</p>
                        <div style={{ marginTop: '20px' }}></div>
                        <ul className="nearby-contct" style={{ marginTop: '0px' }}>

                            {Searchbygroup.length !== 0 ?
                                Searchbygroup.slice(0, 9).map((group) =>
                                    <li key={group.id} className="friends-card groupalign" >
                                        <a href={`/groups/${group.id}`}>

                                            <div className="group-li-item">
                                                {/* <figure> */}
                                                <div class="item12">
                                                    <a href={`/groups/${group.id}`} title="#"> <img src={group.groupImagePath ? fileStorage.baseUrl + group.groupImagePath : Grpicon} alt="" className={group.groupImagePath ? "img" : "no-img"} /></a>
                                                    {/* </figure> */}
                                                    {/* <button className="preview-btn" onClick={() => handleJoinGroup(group.id)}>Preview</button>	 */}
                                                </div>
                                                {/* <div className="  "> */}
                                                <div className="item23">
                                                    <p className="grpnametag" style={{ height: '20px', fontWeight: '600' }}><a href={`/groups/${group.id}`} title="#">{`${group.name}`}</a></p>
                                                    <p className="grp-mem-text">2.7K Members</p>
                                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {
                                                            checkIfInGroup(group.members) ?
                                                                <a href className="button grp-btn leave-grp-btn" onClick={(e) => handleLeaveGroup(e, group.id)}>Leave Group</a>
                                                                :
                                                                <a href className="button grp-btn join-grp-btn" onClick={(e) => handleJoinGroup(e, group.id)}>Join Group</a>
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                        </a>
                                    </li>
                                ) : <div >No Groups found
                                </div>
                            }



                        </ul>
                    

                    </div>

                </div>

            </div>

        )
    }









    const handleSearchedUser = (event) => {
        if (event.target.value === "") {
            setSearchedUser(allUser)
        } else {
            let temp = []
            allUser.map(u => {
                const email = u.email.toLowerCase()
                const firstname = u.firstName.toLowerCase()
                const lastname = u.lastName.toLowerCase()
                const searchedvalue = event.target.value.toLowerCase()
                if (email.includes(searchedvalue) || firstname.includes(searchedvalue) || lastname.includes(searchedvalue)) {
                    temp.push(u)
                }
            })
            setSearchedUser(temp)
            console.log(temp)
        }
    }
    const getAllUser = async () => {
        await UserService.getUsers().then(res => {
            setAllUser(res.data)
            setSearchedUser(res.data)
        })
        console.log(user.email + " This is the users")
    }
    const getFriendsList = async () => {
        await FriendsService.getFriends(AuthService.getCurrentUser().username).then(res => {
            setFriendsList(res.data)
        })
    }



    if (isLoading) {
        return <div>Loading... Please Wait</div>
    }

    if (user.newUser) {
        return <GuideComponent />
    }



    return (
        <Layout user={user}>
            <div className="col-lg-6">
                <div className="central-meta swap-pg-cont">
                    <div className="frnds">
                        <div>
                            <p className="Friends-Title">Search</p>
                            <i style={{ float: "right", fontSize: 20 }} class="fas fa-ellipsis-v"></i>
                        </div>
                        <div class="navContent">

                            <ul class="nav nav-pills swap-page-nav" role="tablist">
                                <li class="nav-item" style={{ justifyContent: 'flex-start' }}>
                                    <div className="all">
                                        <span style={{ cursor: 'pointer' }}

                                            onClick={() => allSearch()}>
                                            <span style={{ marginRight: '5px', padding: '5px' }}>
                                                <i class="fas fa-retweet" style={{ fontSize: '20px' }}></i>
                                                {/* <span>{`${following.length}`}</span> */}
                                            </span>
                                            Search All
                                        </span>
                                    </div>
                                </li>
                                <li class="nav-item" style={{ justifyContent: 'center' }}>
                                    <div className="my">
                                        <span style={{ cursor: 'pointer' }} onClick={() => SearchByPeople()}>
                                            <span style={{ marginRight: '5px', padding: '5px' }}>
                                                <i class="ti-control-shuffle" style={{ fontSize: '20px' }}></i>
                                                {/* <span>{`${following.length}`}</span> */}
                                            </span>
                                            By people
                                        </span>
                                    </div>
                                </li>
                                <li class="nav-item" style={{ justifyContent: 'flex-end' }}>
                                    <div className="new">
                                        <span style={{ cursor: 'pointer' }} onClick={() => SearchByPosts()}>
                                            <span style={{ marginRight: '5px', padding: '5px' }}>
                                                <i class="ti-control-shuffle" style={{ fontSize: '20px' }}></i>
                                                {/* <span>{`${following.length}`}</span> */}
                                            </span>
                                            By posts

                                        </span>
                                        {/* {postSwap()} */}
                                    </div>
                                </li>
                                {/* <li class="nav-item">
                  <span style={{ cursor: 'pointer' }}>
                    <span style={{ marginRight: '5px', padding: '5px' }}>
                      <i class="fas fa-bell" style={{fontSize:'25px'}}></i>
                    </span>
                    Notifications
                  </span>
								</li> */}

                            </ul>

                        </div>
                        <div class="friends-search-container"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <input className="friend-search" type="text" placeholder="Search" name="search"

                                value={searchTerm}
                                onChange={
                                    (event) => store.dispatch(setSearchTerm(event.target.value))
                            }
                        
                        
                        onKeyUp={KeyPressHandler}
                                style={{ width: "100%" }} />






                        </div>

                    </div>

                </div>

                {/* const [Searchbyuser, setSearchbyuser] = useState([]);
    const [Searchbypost, setSearchbypost] = useState([]); */}


                {

                    Sortsearch === "AllSearch" ?
                        showAll()
                     : Sortsearch === "SearchByPeople" ?
                            showUser()
                            : Sortsearch === "SearchByPosts" ?
                                showPost()
                                : null
                }




            </div>
        </Layout>

    );
}
export default SearchFeedComponent;