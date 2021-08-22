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

export default function HangGiftComponent() {
  let history = useHistory();

    const { user } = useContext(UserContext)
    const [showHang, setShowHang] = useState("");
    const [showBrands, setShowBrands] = useState("");
    const [refresh, setRefresh] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [showComp, setShowComp] = useState("members");
    const [Privacy, setPrivacy] = useState("");
    const [count, setCount] = useState(1);
    const [amount, setAmount] = useState(50);
    
    
    const handlePrivacy=(event)=>{
      console.log(event.target.value)
        setPrivacy(event.target.value)
    }
   
    useEffect(() => {
      const parsedCount = Number(localStorage.getItem("count") || 0)
      setCount(parsedCount)
      setAmount(parsedCount*50)
    }, [])
    
    useEffect(() => {
      localStorage.setItem("count", count)
    }, [count])

    const handleshowGift = () => {
     if (showBrands==='Gifts'){
             return (
<div className="brands"><div className="prdct"><div className="row">
  <div style={{display:'inline',width:'33%'}}><img style={{objectFit:'cover',height:'72px',borderRadius:'11px',verticalAlign: 'middle',padding:'5px'}} src="assets/images/virtual-baby-showers-722x406.jpg"/> </div>
  <div style={{display:'inline',width:'33%',padding:'10px',textAlign:'left'}}>
    <div style={{padding:'0px 0 5px 5px',fontSize:'12px'}}>Flowers</div> 
    <div> <span style={{display: 'block', fontSize: '12px'}}><div className="dropdown">
                    <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                      <option value="Friends">Friends</option>
                      <option value="Public">Public</option>
                      <option value="Only Me">Only Me</option>
                    </select></div> </span></div> 
    <div style={{padding:'5px 0 0 5px',fontSize:'12px'}}>QR {amount}</div> 
    </div>
  <div style={{display:'inline',width:'33%',float:'right',padding:'0 10px'}}>  <div style={{float:'right',marginTop:'30px',padding:'5px 10px',background:'rgb(3, 51, 71)', color:'#fff',borderRadius:'5px'}}>
      
      <a style={{ color:'#fff',padding:'5px',fontSize:'12px'}} href="/checkout">+</a>
      
    </div></div>
</div></div></div>
        )}
      }
const handleshowMeals = () => { 
  if (showBrands==='Meals'){
          return (
            <div className="brands"><div className="prdct"><div className="row">
            <div style={{display:'inline',width:'33%'}}><img style={{objectFit:'cover',height:'72px',borderRadius:'11px',verticalAlign: 'middle',padding:'5px'}} src="assets/images/pencil.png"/> </div>
            <div style={{display:'inline',width:'33%',padding:'10px',textAlign:'left'}}>
              <div style={{padding:'0px 0 5px 5px',fontSize:'12px'}}>Flowers</div> 
              <div> <span style={{display: 'block', fontSize: '12px'}}><div className="dropdown">
                              <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                                <option value="Friends">Friends</option>
                                <option value="Public">Public</option>
                                <option value="Only Me">Only Me</option>
                              </select></div> </span></div> 
              <div style={{padding:'5px 0 0 5px',fontSize:'12px'}}>QR {amount}</div> 
              </div>
            <div style={{display:'inline',width:'33%',float:'right',padding:'0 10px'}}>  <div style={{float:'right',marginTop:'30px',padding:'5px 10px',background:'rgb(3, 51, 71)', color:'#fff',borderRadius:'5px'}}>
                
            <a style={{ color:'#fff',padding:'5px',fontSize:'12px'}} href="/checkout">+</a>
              </div></div>
          </div></div></div>
          )}
}

          const handleshowOutfits = () => {
            if (showBrands==='Outfits'){
            return (
              <div className="brands"><div className="prdct"><div className="row">
              <div style={{display:'inline',width:'33%'}}><img style={{objectFit:'cover',height:'72px',borderRadius:'11px',verticalAlign: 'middle',padding:'5px'}} src="assets/images/virtual-baby-showers-722x406.jpg"/> </div>
              <div style={{display:'inline',width:'33%',padding:'10px',textAlign:'left'}}>
                <div style={{padding:'0px 0 5px 5px',fontSize:'12px'}}>Flowers</div> 
                <div> <span style={{display: 'block', fontSize: '12px'}}><div className="dropdown">
                                <select name="privacy" id="privacy" value={Privacy} onChange={handlePrivacy} >
                                  <option value="Friends">Friends</option>
                                  <option value="Public">Public</option>
                                  <option value="Only Me">Only Me</option>
                                </select></div> </span></div> 
                <div style={{padding:'5px 0 0 5px',fontSize:'12px'}}>QR {amount}</div> 
                </div>
              <div style={{display:'inline',width:'33%',float:'right',padding:'0 10px'}}>  <div style={{float:'right',marginTop:'30px',padding:'5px 10px',background:'rgb(3, 51, 71)', color:'#fff',borderRadius:'5px'}}>
                  
              <a style={{ color:'#fff',padding:'5px',fontSize:'12px'}} href="/checkout">+</a>
                </div></div>
            </div></div></div>
            )}
            }
    const handleshowH = () => {
      if (showHang === "hangGifts") {
        return (
          <div className="loadMore">
         <div className="containerBrand"> <div className="row">
 <div className="brandlogo"><img src="assets/images/bestbuy.jpg"/> </div>
 <div className="branddesrptn" >
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px',fontWeight:'bold'}}>Best Buy</div> 
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px'}}>All popular items</div> 
   <div style={{padding:'5px 0 0 5px',fontSize:'12px'}}>100+items</div> 
   </div>
 <div className="arrow">  
 
     
     <a href="#" onClick={() => setShowBrands("Gifts")} ><i class="las la-angle-down"></i></a>
     
  </div>
  
</div></div>
<div style={{borderBottom:'1px solid #e2e2e2',marginTop:'11px'}}></div>
{handleshowGift()}
         </div>
        )
      }
      if (showHang === "hangMeals") {
        return (
          <div className="loadMore">
          <div className="containerBrand"><div className="row">
 <div className="brandlogo"><img src="assets/images/Talabatlogo.png"/> </div>
 <div className="branddesrptn">
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px',fontWeight:'bold'}}>Best Buy</div> 
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px'}}>All popular items</div> 
   <div style={{padding:'5px 0 0 5px',fontSize:'12px'}}>100+items</div> 
   </div>
   <div className="arrow">  
 
     
     <a href="#" onClick={() => setShowBrands("Meals")}  ><i class="las la-angle-down"></i></a>
     
   </div>
</div></div>
<div style={{borderBottom:'1px solid #e2e2e2',marginTop:'11px'}}></div>
{handleshowMeals()}
         </div>
        )
      }
      if (showHang === "hangOutfits") {
        return (
          <div className="loadMore">
          <div className="containerBrand"><div className="row">
 <div className="brandlogo"><img  src="assets/images/bestbuy.jpg"/> </div>
 <div className="branddesrptn" >
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px',fontWeight:'bold'}}>Best Buy</div> 
   <div style={{padding:'0px 0 5px 5px',fontSize:'14px'}}>All popular items</div> 
   <div style={{padding:'5px 0 0 5px',fontSize:'12px'}}>100+items</div> 
   </div>
   <div className="arrow">  
 
     <a href="#" onClick={() => setShowBrands("Outfits")}><i class="las la-angle-down"></i></a>
     
   </div>
</div></div>
<div style={{borderBottom:'1px solid #e2e2e2',marginTop:'11px'}}></div>
{handleshowOutfits()}
         </div>
        )
      }
    
      else {
        return (null)
      }
    }
//     const handleshowH = () => {
//       if (showHang === "hangGifts") {
//         return (
//           <div className="loadMore">
//            <div className="brands"><div className="row">
//   <div style={{display:'inline',width:'20%'}}><img style={{objectFit:'fill',width:'100%',height:'100px',borderRadius:'11px',verticalAlign: 'middle',padding:'5px'}} src="assets/images/bestbuy.jpg"/> </div>
//   <div style={{display:'inline',width:'60%',padding:'10px',textAlign:'left'}}>
//     <div style={{padding:'0px 0 5px 5px',fontSize:'14px',fontWeight:'bold'}}>Best Buy</div> 
//     <div style={{padding:'0px 0 5px 5px',fontSize:'14px'}}>All popular items</div> 
//     <div style={{padding:'5px 0 0 5px',fontSize:'12px'}}>100+items</div> 
//     </div>
//   <div style={{display:'inline',width:'20%',float:'right'}}>  
//   <div style={{float:'right',marginTop:'30px',padding:'5px 10px',borderRadius:'5px'}}>
      
//       <a style={{ color:'#000000',padding:'5px',fontSize:'18px'}} href="#"  ><i class="las la-angle-down"></i></a>
      
//     </div></div>
// </div></div>
  
//           </div>
//         )
//       } 
//       if (show === "friends") {
//         return (
//           <FriendProfileComponent />
//         )
//       }
      
//       else {
//         return (
//           <div className="loadMore">
//             <div>Meals</div>
  
//           </div>
//         )
//       }
//     }
    


    return (
      <>
    <Layout user={user}>
      <div className="col-lg-6">
     <div className="central-meta hanggift"> 
     <h1 style={{textAlign:'center',padding:'10px', fontSize:'18px',fontWeight:'bold'}}>Today to me, tomorrow to you</h1>
     <div className="containerHang"> <div className="row rowalin">
    
   <div className="col-lg-3 padg"><div className="flow"> <a className={(showHang === "hangGifts" ? "active" : "")}  title="" data-ripple="" onClick={() => setShowHang("hangGifts")} ><i class="las la-gift"style={{fontSize:'32px'}}></i><div >Hang Gifts</div></a></div></div>
   <div className="col-lg-3 padg"> <div className="flow"><a className={(showHang === "hangMeals" ? "active" : "")}  title="" data-ripple="" onClick={() => setShowHang("hangMeals")} ><i class="las la-utensils" style={{fontSize:'32px'}}></i><div >Hang Meals</div></a></div></div>
   <div className="col-lg-3 padg"> <div className="flow"><a className={(showHang === "hangOutfits" ? "active" : "")}  title="" data-ripple="" onClick={() => setShowHang("hangOutfits")} ><i class="las la-gift"style={{fontSize:'32px'}}></i><div >Hang Outfits</div></a></div></div>
   <div className="col-lg-3 padg"> <div className="flow"><a className={(showHang === "hangAccessories" ? "active" : "")}  title="" data-ripple="" onClick={() => setShowHang("hangAccessories")} ><i class="las la-gift"style={{fontSize:'32px'}}></i><div >Hang Accessories</div></a></div></div>
   </div></div>
  <div style={{borderBottom:'1px solid #e2e2e2'}}></div>
  <div className="contentArea">
    {
      handleshowH()
    }
</div>
   
   </div>
          </div>
          
         
          
      </Layout>
      </>     
    )
}