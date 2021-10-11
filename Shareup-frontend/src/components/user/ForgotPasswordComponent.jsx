import React, { useState, useEffect, useContext }from 'react'
import axios from 'axios';


// this function returns UUID
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function ForgotPasswordComponent(props){
   
  const [mailSent, setMailSent] = useState(0)
  const [newPass, setNewPass] = useState()
  const [verCode, setVerCode] = useState()
  const [email, setEmail] = useState()
  const [verifiyCodeInput, setVerifiyCodeInput] = useState()
  const [verifiyCode, setVerifiyCode] = useState()
  
      

    // email input listener
    const emailInputListener = (event) => {
        setEmail(event.target.value)
    }

    // new password input listener
    const newPassInputListener = (event) => {
        setNewPass(event.target.value)
    }

    // this function sends reset password mail to the given mail with a bundle which includes email and
    // verification code which come from uuid
    const sendResetPasswordMailFunc = () => {
        if(email){
            verCode = uuidv4()
            let bundle = {
                mail: email,
                verifiyCode:verCode,
            }
            axios.post("http://localhost:8080/auth/forgot-password", bundle).then((res)=> {
                alert("Password reset mail sent to your email adress.")
            }).catch((err) => {
                alert("An error has occurred")
            })
           setMailSent(1)
        }
    }

    // verification code input listener
    const verifiyCodeInputListener = (event) => {
        setVerifiyCodeInput(event.target.value)
    }

    // this function sends a bundle which includes new password and mail to the api for reseting password
    const resetPasswordFunction = () => {
        if(verifiyCode = verifiyCodeInput){
            let bundle = {
                newPass: newPass,
                mail: email
            }
            //axios api connection
        }
    }

   
        if(mailSent===0){
            return (
                <div className="frgtPwd">
                    <h2>Forgot Your Password?</h2>
                    <div className="optionText">Please enter your email and get your account right back</div>
                    <div class="form-group">
                       
                        <input className="form-input" type="text" placeholder="Enter your email" onChange= {emailInputListener}/>
                    </div>
                    <div className="optionText" onClick={props.stateChanger}>Remembered your password?</div>
                    <div class="submit-btns-log"><button class="mtr-btn" onClick={sendResetPasswordMailFunc}><span>Send mail</span></button></div>
                   
                </div>
            )
        }else{
            return(
                <div>
                    <h2>Please enter the code to reset your password.</h2>
                    <div className="inputWrapperDiv">
                        <i class="fas fa-lock" style={{color:"#4fb5ff", marginTop:"6px", marginLeft:"8px"}}></i>
                        <input className="inputClass" type="text" placeholder="Enter your new password" onChange= {newPassInputListener}/>
                    </div>
                    <div className="inputWrapperDiv">
                        <i class="fas fa-lock" style={{color:"#4fb5ff", marginTop:"6px", marginLeft:"8px"}}></i>
                        <input className="inputClass" type="text" placeholder="Enter the code" onChange= {verifiyCodeInputListener}/>
                    </div>
                    <button className="loginButton" onClick={null} style={{width:"160px"}} >Send password reset mail</button>
                </div>
            )
        }
    }

export default ForgotPasswordComponent;
