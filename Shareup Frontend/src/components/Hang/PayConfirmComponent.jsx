import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserService from '../../services/UserService';
import UserContext from '../../contexts/UserContext';
import PostService from '../../services/PostService';
import AuthService from '../../services/auth.services';
import SimpleReactLightbox from 'simple-react-lightbox'
import { testScript } from '../../js/script';


import ShareupInsideHeaderComponent from '../dashboard/ShareupInsideHeaderComponent';
import Layout from '../LayoutComponent';

export default function PayConfirmComponent() {
  let history = useHistory();

    const { user } = useContext(UserContext)
   
    const [refresh, setRefresh] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [showComp, setShowComp] = useState("members");
    const [gift, setGift] = useState([""]);
    
    

    return (
      <>
    <Layout user={user}>
      <div className="col-lg-6">
     <div className="central-meta hanggift"> 
     
     <div className="containerHang">
          <div className="center">
     <div><img width='170' src="assets/images/success.png"/></div>
  <h1 style={{fontWeight:'bold',marginTop:'20px'}}>Congratulations</h1>
<p style={{fontSize:'14px',margin:'20px 0 40px 0',lineHeight:'2'}}>Payment is the transfer of money <br/>
services in exchange product or Payments </p>
<div style={{margin:'0 0 40px 0'}}><a className="Hangin-btn" href="/share" onclick={() => setGift("Gift")}>Keep Hang</a></div>
   </div></div>
  
  
   
   </div>
          </div>
          
         
          
      </Layout>
      </>     
    )
}