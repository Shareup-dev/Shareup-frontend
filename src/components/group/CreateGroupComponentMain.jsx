import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import GroupService from '../../services/GroupService';
import Layout from '../LayoutComponent';
import settings from '../../services/Settings';
import { DropdownButton , Dropdown} from 'react-bootstrap'
import $ from 'jquery'
import Addimage from '../../images/addimage1.jpg'

function CreateGroupComponentMain() {
    let history = useHistory();

    const { user } = useContext(UserContext)

    const [groupName, setGroupName] = useState("");
    const handleGroupName = (e) => { setGroupNameError(null);setGroupName(e.target.value) }

    const [groupDesc, setGroupDesc] = useState("");
    const handleGroupDesc = (e) => { setGroupDescError(null) ;setGroupDesc(e.target.value) }

    //For Validation
    const [allFieldFillError, setAllFieldFillError] = useState('');
    const [groupNameError, setGroupNameError] = useState('');
    const [groupDescError, setGroupDescError] = useState('');
    const [groupPrivacySetting, setGroupPrivacySetting] = useState('Public');
    const [groupInvitationSetting, setGroupInvitationSetting] = useState('members');

    const [groupPicture, setGroupPicture] = useState(null)
    const [profileRender, setProfileRender] = useState(null)
    const [showprofilePicturePath, setShowprofilePicturePath] = useState(false)

    const [groupCover, setGroupCover] = useState(null)
    const [btnValue, setBtnValue] = useState('sssss')

    const [coverRender, setCoverRender] = useState(null)
    const [showCoverPicture, setShowCoverPicture] = useState(false)


    const [step, setStep] = useState(0);

    const activeOrNot = (num) => {
        return num <= step ? "active" : "";
    }

    const validateStep = (num) => {
        let validated = true
        if (!groupName) {
            setGroupNameError("Please Ensure You Write The Group Name")
            validated = false
        }
        if (!groupDesc) {
            setGroupDescError("Please Ensure You Write The Group Description")
            validated = false
        }
        // if()
        if (validated) {
            setStep(num)
        }
    }

    const handleGroupImage = (event) => {
        let validated = false
        setGroupPicture(event.target.files[0])
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setProfileRender(reader.result)
            }
        }
        reader.readAsDataURL(event.target.files[0])
        setShowprofilePicturePath(true)
    }

    const handleGroupCover = (event) => {
        let validated = false
        setGroupCover(event.target.files[0])
        console.log(groupCover,'groupcover')

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setCoverRender(reader.result)
            }
        }
        reader.readAsDataURL(event.target.files[0])
        console.log(groupCover,'groupcover')
        setShowCoverPicture(true)
    }

    const handlePrivacySetting = (event) => {
        setGroupPrivacySetting(event.target.value)
        console.log(event.target.value)
    }

    const handleInviteSetting = (event) => {
        setGroupInvitationSetting(event.target.value)
        console.log(event.target.value)
    }

    const handleCreateGroup = async () => {
        console.log(groupCover,'createeeeee')
        let groupPrivacySettingValue = 1
        if ( groupPrivacySetting === 'Private' || groupPrivacySetting === 'Hidden'){
            groupPrivacySettingValue = 0
        }
        let group = {
            name: groupName,
            description: groupDesc,
            privacySetting: groupPrivacySettingValue,
            groupInvitationSetting: groupInvitationSetting,
        }
        const formData1 = new FormData();
        const formData2 = new FormData();

        // formData.append('group', JSON.stringify(group))
        formData1.append('group_image', groupPicture)
        formData2.append('group_cover_image', groupCover)
        let groupId 
        await GroupService.createGroup(user.id, group).then(async (res) => {
            console.log(res.data)
            groupId = res.data.id
            if(groupCover){
                await GroupService.uploadGroupCoverImage(groupId,formData2).then(res => {
                    // console.log(res.data)
                })
            }
            if(groupPicture){
                await GroupService.uploadGroupImage(groupId,formData1).then(res => {
                    // console.log(res.data)    
                })
            }
            await GroupService.joinGroup(user.id, groupId).then(res =>{
                
            })
            
            await setStep(4)

        })
        
        setTimeout(function () { history.push(`/groups`) }, 2000);
    }
    const BtnValue = (e,value) =>{
        e.preventDefault();
        // set
        setBtnValue(value)
    }

    const show = () => {
        if (step === 0) {
            return (
                <fieldset>
                    <div className="form-card">
                        <h2 className="fs-title">Group Details</h2>
                       
                        <label htmlFor="group-desc">Group Name *</label>
                        <input type="group_name" name="group_name" value={groupName} onChange={handleGroupName} className="group-name-textbox"/>
                        {groupNameError && groupName!==''|| groupName!==null &&
                            <p style={{ fontSize: 15, color: 'red' }}>{groupNameError}</p>
                        }
                       
                        <label htmlFor="group-desc" className="group-desc-label">Group Description *</label>
                        <textarea name="group-desc" id="group-desc" aria-required="true" value={groupDesc} onChange={handleGroupDesc} className="group-desc-textbox"/>
                        {groupDescError && groupDesc!==''|| groupDesc!==null&&
                            <p style={{ fontSize: 15, color: 'red' }}>{groupDescError}</p>
                        }
                    </div>
                    <input type="button" name="" className="action-button" defaultValue="Continue" onClick={() => validateStep(1)} />
                </fieldset>
            )
        }

        if (step === 1) {
            return (
                <fieldset>
                    <div className="form-card">
                        <div className="">
                            <h2 className="fs-title">Select Group Settings</h2>
                            <span id="description"></span>
                            <label htmlFor="public">Choose privacy</label>
                            {/* <select class="form-control privacy-dropdown"  
                                value={groupPrivacySetting} 
                                onChange={handlePrivacySetting}>
                                <option  value="public" data-icon="glyphicon glyphicon-eye-open" data-subtext="petrification"> Publica </option>
                                <option value="private">Private</option>
                                <option value="hidden">Hidden</option>

                            </select> */}
                            <div class="dropdown privacy-drop-cont">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                   {groupPrivacySetting==='Public'?
                                    <span><i className="fa fa-globe pr-5p" aria-hidden="true"></i>Public</span>
                                    : groupPrivacySetting==='Private'? <span><i className="fa fa-lock pr-5p" aria-hidden="true"></i>Private</span>
                                    :<span><i className="fa fa-eye-slash pr-5p" aria-hidden="true"></i>Hidden</span>}
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a class="dropdown-item" href="#" onClick={(e)=>{e.preventDefault();setGroupPrivacySetting('Public')}}>
                                        <div className='d-flex'>
                                            <div>
                                                <i className="fa fa-globe pr-15" aria-hidden="true"></i>
                                                

                                            </div>
                                            <div>
                                                <div className='mb-5p'>Public</div>
                                                <div style={{fontSize:'13px'}}>Anyone can see who's in the group and what they post.</div>
                                            </div>
                                        </div>
                                    </a>
                                    <a class="dropdown-item" href="#" onClick={(e)=>{e.preventDefault();setGroupPrivacySetting('Private')}}>
                                        <div className='d-flex'>
                                            <div>
                                                <i className="fa fa-lock pr-15" aria-hidden="true"></i>
                                            </div>
                                            <div>
                                                <div className='mb-5p'>Private</div>
                                                <div style={{fontSize:'13px'}}>Only members can see who's in the group and what they post.</div>
                                            </div>
                                        </div>
                                    </a>
                                    <a class="dropdown-item" href="#" onClick={(e)=>{e.preventDefault();setGroupPrivacySetting('Hidden')}}>
                                        <div className='d-flex'>
                                            <div>
                                                <i className="fa fa-eye-slash pr-15" aria-hidden="true"></i>
                                            </div>
                                            <div>
                                                <div className='mb-5p'>Hidden</div>
                                                <div style={{fontSize:'13px'}}>The group will be hidden for others.</div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            
                            {/* <input type="radio" id="public" name="privacy" value="public" defaultChecked="checked" onChange={handlePrivacySetting} />
                            <label htmlFor="public">This is a public group</label>
                            <ul id="public-group-description">
                                <li>Any site member can join this group.</li>
                                <li>This group will be listed in the groups directory and in search results.</li>
                                <li>Group content and activity will be visible to any site member.</li>
                            </ul><br></br>
                            <input type="radio" id="private" name="privacy" value="private" onChange={handlePrivacySetting} />
                            <label htmlFor="female">This is a private group</label>
                            <ul id="private-group-description">
                                <li>Only people who request membership and are accepted can join the group.</li>
                                <li>This group will be listed in the groups directory and in search results.</li>
                                <li>Group content and activity will only be visible to members of the group.</li>
                            </ul><br></br>
                            <input type="radio" id="hidden" name="privacy" value="hidden" onChange={handlePrivacySetting} />
                            <label htmlFor="other">This is a hidden group</label>
                            <ul id="hidden-group-description">
                                <li>Only people who are invited can join the group.</li>
                                <li>This group will not be listed in the groups directory or search results.</li>
                                <li>Group content and activity will only be visible to members of the group.</li>
                            </ul> */}
                            <br></br>
                        </div>
                        <div className="">
                            {/* <legend>Group Invitations</legend> */}
                            <p tabIndex={0}>Which members of this group are allowed to invite others?</p>
                            <select class="form-control privacy-dropdown"  
                                value={groupPrivacySetting} 
                                onChange={handleInviteSetting}>
                                <option  value="members"> All Group Members </option>
                                <option value="mods">Group admins and mods only</option>
                                <option value="admins">Group admins only</option>

                            </select>
                            {/* <input type="radio" name="group-invite-status" id="group-invite-status-members" defaultValue="members" defaultChecked="checked" onChange={handleInviteSetting} />
                            <label htmlFor="other">All Group Members</label><br></br>
                            <input type="radio" name="group-invite-status" id="group-invite-status-mods" defaultValue="mods" onChange={handleInviteSetting} />
                            <label htmlFor="other">Group admins and mods only</label><br></br>
                            <input type="radio" name="group-invite-status" id="group-invite-status-admins" defaultValue="admins" onChange={handleInviteSetting} />
                            <label htmlFor="other">Group admins only</label><br></br> */}
                        </div>

                    </div>
                    <input type="button" name="previous" className="previous action-button-previous" defaultValue="Previous" onClick={() => setStep(0)} />
                    <input type="button" name="" className="action-button" defaultValue="Next Step" onClick={() => setStep(2)} />
                </fieldset>
            )
        }
        if (step === 2) {
            return (
                <fieldset>
                    <div className="form-card">
                        <h2 className="fs-title">{`Upload Image and Cover Image`}</h2>

                        <div className="" style={{ textAlign: "center" }}>
                            <label className='mb-10'>Group Image</label>
                            <div class="image-upload  pos-rel ">
                                <label for="file-input">
                                    {
                                        showprofilePicturePath ?
                                            <img id="preview" src={profileRender} /> :
                                            <img src={Addimage} className="no-image-up"/>
                                    }
                                </label>

                                <input id="file-input" type="file" name="profile_image" accept="image/*" onChange={handleGroupImage}></input>
                            </div>
                        </div>
                        <br/>
                        <br/>
                        <div className="" style={{ textAlign: "center" }}>
                            <legend className='mb-10'>Group Cover Image</legend>
                            <div class="image-upload pos-rel">
                                <label for="file-input-cover">
                                
                                    {
                                        showCoverPicture ?
                                            <img id="preview" src={coverRender} /> :
                                            <img src={Addimage} className="no-image-up"/>
                                    }
                                </label>

                                <input id="file-input-cover" type="file" name="cover_image" accept="image/*" onChange={handleGroupCover}></input>
                            </div>
                        </div>
                    </div>
                    <input type="button" name="previous" className="previous action-button-previous" defaultValue="Previous" onClick={() => setStep(1)} />
                    <input type="button" name="" className="action-button" defaultValue="Next Step" onClick={() => {
                        handleCreateGroup()
                    }} />
                </fieldset>
            )
        }
        if (step === 3) {
            return (
                <fieldset>
                    <div className="form-card">
                        <h2 className="fs-title">{`Upload Image and Cover Image`}</h2>

                        <div className="" style={{ textAlign: "center" }}>
                            <label className='mb-10'>Group Image</label>
                            <div class="image-upload  pos-rel ">
                                <label for="file-input">
                                    {
                                        showprofilePicturePath ?
                                            <img id="preview" src={profileRender} /> :
                                            <img src={Addimage} className="no-image-up"/>
                                    }
                                </label>

                                <input id="file-input" type="file" name="profile_image" accept="image/*" onChange={handleGroupImage}></input>
                            </div>
                        </div>
                        <br/>
                        <br/>
                        <div className="" style={{ textAlign: "center" }}>
                            <legend className='mb-10'>Group Cover Image</legend>
                            <div class="image-upload pos-rel">
                                <label for="file-input-cover">
                                
                                    {
                                        showCoverPicture ?
                                            <img id="preview" src={coverRender} /> :
                                            <img src={Addimage} className="no-image-up"/>
                                    }
                                </label>

                                <input id="file-input-cover" type="file" name="cover_image" accept="image/*" onChange={handleGroupCover}></input>
                            </div>
                        </div>
                    </div>
                    <input type="button" name="previous" className="previous action-button-previous" defaultValue="Previous" onClick={() => setStep(1)} />
                    <input type="button" name="" className="action-button" defaultValue="Next Step" onClick={() => {
                        // setStep(4)
                        handleCreateGroup()
                    }} />
                </fieldset>
            )
        }
        if (step === 4) {
            return (
                <fieldset>
                    <div className="form-card">
                        <h2 className="fs-title text-center">Success !</h2> <br /><br />
                        <div className="row justify-content-center">
                            <div className="col-3"> <img src="https://img.icons8.com/color/96/000000/ok--v2.png" className="fit-image" /> </div>
                        </div> <br /><br />
                        <div className="row justify-content-center">
                            <div className="col-7 text-center">
                                <h5>You Have Successfully Created Group</h5>
                                <p style={{ color: "blue" }}>You will be redirected shortly...</p>
                            </div>
                        </div>
                    </div>
                </fieldset>
            )
        }
    }

    useEffect(() => {

    }, [])

    // return (
    //     <div className="container-fluid" id="grad1">
    //         <div className="row justify-content-center mt-0">
    //             <div className="col-11 col-sm-9 col-md-7 col-lg-6 text-center p-0 mt-3 mb-2">
    //                 <div className="card px-0 pt-4 pb-0 mt-3 mb-3">
    //                     <h2><strong>Create Your Group</strong></h2>
    //                     <p>Fill all form field to go to next step</p>
    //                     <div className="row">
    //                         <div className="col-md-12 mx-0">
    //                             <form id="msform">
    //                                 {/* progressbar */}
    //                                 <ul id="progressbar">
    //                                     <li id="account" className={activeOrNot(0)}><strong>{`Details`}</strong></li>
    //                                     <li id="personal" className={activeOrNot(1)}><strong>Settings</strong></li>
    //                                     <li id="payment" className={activeOrNot(2)}><strong>Photo</strong></li>
    //                                     <li id="confirm" className={activeOrNot(3)}><strong>Media</strong></li>
    //                                 </ul> {/* fieldsets */}
    //                                 {
    //                                     show()
    //                                 }
    //                             </form>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>

    // );


    return (
        <Layout user={user}>
            <div className="col-lg-6">
                <div className="central-meta create-group">
                    <div className="card px-0 pt-4 pb-0 mb-3">
                        <div style={{contentAlign: 'center', textAlign: 'center'}}>
                        <h2 style={{fontSize:'20px' , fontWeight:'800'}} className="media-date">Create Your Group</h2>
                        {/* <p>Fill all form field to go to next step</p> */}
                        </div>
                        <div className="row">
                            <div className="col-md-12 mx-0">
                                <form id="msform">
                                    {/* <ul id="progressbar">
                                        <li id="account" className={activeOrNot(0)}><strong>{`Details`}</strong></li>
                                        <li id="personal" className={activeOrNot(1)}><strong>Settings</strong></li>
                                        <li id="payment" className={activeOrNot(2)}><strong>Photo</strong></li>
                                        <li id="confirm" className={activeOrNot(3)}><strong>Add Members</strong></li>
                                    </ul> */}
                                    {
                                        show()
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export default CreateGroupComponentMain;