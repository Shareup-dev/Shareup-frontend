import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory,useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import AuthService from '../../services/auth.services';
import GroupService from '../../services/GroupService';
import { testScript } from '../../js/script';
import MenuWidgetComponent from '../widgets/MenuWidgetComponent';
import settings from '../../services/Settings';
import fileStorage from '../../config/fileStorage';
import Grpicon from '../../images/grpicon.png'

function GroupViewComponent(props) {
    let history = useHistory();

	const { user } = useContext(UserContext)

	const [refresh, setRefresh] = useState([]);

	const [group, setGroup] = useState(props);
	const [members, setMembers] = useState(props);

	const [requestFlag, setRequestFlag] = useState(false);

    useEffect(() => {
        setGroup(props.group)
		if(props.joinRequests&&props.joinRequests.length>0&&group){
            if(props.joinRequests.some(req=>req.group_id===group.id)){
    			setRequestFlag(true)

                // didJoinRequestSent(group.id)
            }
        }else{
            setRequestFlag(false)
        }
		
	}, [props,requestFlag])
    const didJoinRequestSent = (gid) => {
		// console.log(gid)
        GroupService.joinRequestSent(user.id,gid).then(res => {
			// setRefresh(res.data);
			console.log('yes',res.data)
			setRequestFlag(res.data)
		})
    }
    return(
        group&&
        <li key={group.id} className="friends-card groupalign" 
        // style={((index+1)/3==0)?{marginRight:'0px'}:{marginRight:'10px'}}
        >
            <a href={`/groups/${group.id}`}>
                <div className="group-li-item">
                    {/* <figure> */}
                    <div class="item12" style={{backgroundImage:`url(${group.groupImagePath})`,backgroundSize:'cover'}}>
                        <a href={`/groups/${group.id}`} title="#"> </a>
                        {/* </figure> */}
                        {/* <button className="preview-btn" onClick={() => handleJoinGroup(group.id)}>Preview</button>	 */}
                    </div>
                    {/* <div className="  "> */}
                    <div className="item23">
                        <p className="grpnametag" style={{ height: '20px', fontWeight: '600'}}><a href={`/groups/${group.id}`} title="#">{`${group.name}`}</a></p>
                        <p className="grp-mem-text">{group.members&&group.members.length} Members</p>
                        <div style={{width: '100%' , display: 'flex' , alignItems: 'center' , justifyContent: 'center'}}>
                            {
                                    group.members&&props.checkIfInGroup(group.members) ?
                                        <a href className="button grp-btn leave-grp-btn" onClick={(e) => props.handleLeaveGroup(e,group.id)}>Leave Group</a>
                                        : requestFlag
                                          ?  <a href className="button grp-btn join-grp-btn"  onClick={(e) => props.cancelRequestGroup(e,group.id)}>Cancel Request</a>

                                    :  <a href className="button grp-btn join-grp-btn"  onClick={(e) => props.handleJoinGroup(e,group)}>Join Group</a>
                                          
                                }
                            {/* <div className="button" style={{ color: "#000000",background:'#EAEAEA', fontSize:'12px', width: '45%' , padding: '5px' , fontWeight: '600' }}>Preview</div>	 */}
                        </div>

                        
                    </div>
                    
                    {/* <div class="item6">
                        {/* <span>Engr</span> */}
                        {/* <i style={{ float: "right", fontSize: 25 }} class="las la-ellipsis-v"></i> */}
                    {/* </div> */}
                    


                    {/* </div> */}

                </div>
            </a>
        </li>
    )
}
export default GroupViewComponent;