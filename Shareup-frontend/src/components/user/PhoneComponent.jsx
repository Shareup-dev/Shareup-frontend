import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import "./NaajApp.css";




function Telephone({setPhone, p_no, handlePhone,trigger}) {

    const [value, setValue] = useState()
     function setPhonenumber(val){
         setValue(val);
         trigger("p_no");



        console.log('printing p', p_no)

     }


    return (

        <>
        <PhoneInput
        placeholder="Phone number"
        value={value}
       
     
        onChange={(val) => setPhonenumber(val)
        
        } 

         onKeyUp={(e)=>{
             handlePhone(e.target.value);

         }}
       
        />
        {/* {value} */}
        </>
  
    )
}

export default Telephone;
