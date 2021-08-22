import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from "react-router-dom";
import UserService from '../../services/UserService';
import AuthService from '../../services/auth.services';
import { useJwt } from "react-jwt";
// import { Modal } from '../dashboard/Modal';
import Modal from 'react-modal';
import { GlobalStyle } from '../../styles/modalStyles';
import styled from 'styled-components';
import '../../modal.css';
import RegisterSuccessfulComponent from './RegisterSuccessfulComponent';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const button = styled.button`
  min-width: 100px;
  padding: 16px 32px;
  border-radius: 4px;
  border: none;
  background: #141414;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
`;

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    overflow              : 'inherit',
    background            : 'transparent',
    border                : 'none'
  }
};

function Index({ set, setUser }) {
  let history = useHistory();

  const [showComponent, setShowComponent] = useState('register');

  const [showModal, setShowModal] = useState(false)

  var subtitle;
  const [modalIsOpen,setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal(){
    setIsOpen(false);
  }


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  //For Validation
  const [allFieldFillError, setAllFieldFillError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordNotMatchError, setPasswordNotMatchError] = useState('');


  const [loginError, setLoginError] = useState('');

  const [registerSuccessful, setRegisterSuccessful] = useState('');
  const [registerError, setRegisterError] = useState('');



  useEffect(() => {
  }, [])

  const handleEmail = (event) => {
    setEmail(event.target.value)
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value)
  }

  const handleFirstName = (event) => {
    setFirstName(event.target.value)
  }

  const handleLastName = (event) => {
    setLastName(event.target.value)
  }

  const validateRegister = (event) => {
    event.preventDefault()
    setAllFieldFillError("")
    setEmailError("")
    setPasswordError("")
    let validated = true

    if (email == '' || password == '' || confirmPassword == '' || firstName == '' || lastName == '') {
      console.log("Please Fill Out Every Field")
      setAllFieldFillError("Please Fill Out Every Field")
      validated = false;
    }
    if (!email.includes('@')) {
      console.log("Please ensure your email contains @")
      setEmailError("Please ensure your email contains @")
      // alert("Please ensure your email contains @")
      validated = false;
    }
    if (password != confirmPassword) {
      console.log("Make sure your password match")
      setPasswordError("Make sure your password match")
      // alert("Make sure your password match")
      validated = false;
    }
    if (validated) {
      handleRegister();
    }
  }

  const handleRegister = async() => {
    let user = { email, password, firstName, lastName }
    console.log("register " + user.email + " " + user.password + " " + user.confirmPassword + " " + user.firstName + " " + user.lastName)

    console.log(JSON.stringify(user))
    await UserService.createUser(user).then(res => {
      history.push('/');
      setRegisterSuccessful("Your Account Is Successfully Registered")
      setShowComponent("login")
      handleLoginAutomatically()
      openModal()
    }).catch(
        error => {
          setRegisterError("User Already Registered");
        }
      )    
  }

  const getUser = async (email) => {
    await UserService.getUserByEmail(email).then(res => {
      setUser(res.data)
    })
  }

  const validateLogin = (event) => {
    event.preventDefault()
    setAllFieldFillError("")
    setEmailError("")
    setPasswordError("")
    setLoginError("")
    let validated = true

    if (email == '' || password == '') {
      console.log("Please Fill Out Every Field")
      setAllFieldFillError("Please Fill Out Every Field")
      validated = false;
    }
    if (!email.includes('@')) {
      console.log("Please ensure your email contains @")
      setEmailError("Please ensure your email contains @")
      validated = false;
    }
    if (validated) {
      handleLogin();
    }
  }


  const handleLogin = async () => {
    console.log("working")

    await AuthService.login(email, password).then(res => {
      console.log(res.data + " THIS IS THE DATA")
      set(res.data)
      getUser(res.data.username)
      history.push("/newsfeed")
    },
      error => {
        const resMessage = (error.response && error.response.data && error.response.data.message)
          || error.message || error.toString();
        setLoginError("Incorrect Email and or Password")
      });
  }

  const handleLoginAutomatically = async () => {
    console.log("working auto")

    await AuthService.login(email, password).then(res => {
      console.log(res.data + " THIS IS THE DATA")
      set(res.data)
      getUser(res.data.username)
    },
      error => {
        const resMessage = (error.response && error.response.data && error.response.data.message)
          || error.message || error.toString();
        setLoginError("Incorrect Email and or Password")
      });
  }
  
  const handleShow = () => {
    if (showComponent === "register") {
      return (
        <div className="log-reg-area reg">
          <h2 className="log-title">Register</h2>

          <form>
            {allFieldFillError &&
              <p style={{ fontSize: 15, color: 'red', textAlign: 'center' }}>{allFieldFillError}</p>
            }
            {console.log(registerError + " ha")}
            {registerError &&
              <p style={{ fontSize: 15, color: 'red', textAlign: 'center' }}>{registerError}</p>
            }
            <div className="row">

              <div className="form-group">

                <input type="text" name="firstName" value={firstName} onChange={handleFirstName} required="required" /> <label className="control-label" htmlFor="input">First Name</label>
              </div>
              <div className="form-group">
                <input type="text" name="lastName" value={lastName} onChange={handleLastName} required="required" />
                <label className="control-label" htmlFor="input">Last Name</label>
              </div>
            </div>
            {emailError &&
              <p style={{ fontSize: 15, color: 'red', textAlign: 'center' }}>{emailError}</p>
            }
            <div className="row">
              <div className="form-group">
                <input className="form-input" type="text" name="email" value={email} onChange={handleEmail} id="input" required="required" /> <label className="control-label" htmlFor="input"><a style={{ color: 'rgb(136, 127, 127)' }} href="https://wpkixx.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="6c29010d05002c">Email</a></label>
              </div>
              <div className="form-group">
                <input className="form-input" type="password" name="password" value={password} onChange={handlePassword} required="required" /> <label className="control-label" htmlFor="input">Password</label>
              </div>
            </div>
            <div className="row">
              <div className="form-group full">
                <input className="form-input" type="password" name="confirm password" value={confirmPassword} onChange={handleConfirmPassword} required="required" /> <label className="control-label" htmlFor="input">Re-enter Password</label>
              </div>
            </div>
            
            <div className="checkbox">
              <label> <input type="checkbox" defaultChecked="checked" /><i className="check-box" />Accept Terms &amp; Conditions ?
                    </label>
            </div>
            <div className="checkbox">
              <label> <input type="checkbox" defaultChecked="checked" /><i className="check-box" />I am 18 years old or above
                    </label>
            </div>
            <a href="#" onClick={() => setShowComponent("login")} className="already-have">Already have an account?</a>
            <div className="submit-btns">
              <button className="mtr-btn signup" onClick={validateRegister}>
                <span>Share In</span>
              </button>
             
             
            </div>
          </form> </div>
      )
    } 
    if (showComponent === "login"){
      return (
        <div className="log-reg-area">
          <h2 className="log-title">Login</h2>
          <p>
            
            {loginError &&
              <div style={{ fontSize: 20, color: 'red', textAlign: 'center' }}>
                {loginError}
              </div>
            }
            {allFieldFillError &&
              <p style={{ fontSize: 15, color: 'red', textAlign: 'center' }}>{allFieldFillError}</p>
            }
          </p>
          {emailError &&
              <p style={{ fontSize: 15, color: 'red', textAlign: 'center' }}>{emailError}</p>
            }

          <form>
            <div className="row">
              <div className="form-group">

                <input className="form-input" type="text" name="email" value={email} onChange={handleEmail} required="required" />
                <label className="control-label" htmlFor="input">Email</label>
              </div>
              <div className="form-group">
                <input className="form-input" type="password" name="password" value={password} onChange={handlePassword} required="required" /> <label className="control-label" htmlFor="input">Password</label>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <a href="#" className="forgot-pwd">Forgot Password?</a>
              <a href="#" onClick={() => setShowComponent("register")} className="already-have">Dont have an account?</a>
            </div>
            <div className="submit-btns-log">
              <button className="mtr-btn signup" onClick={validateLogin} >
                <span>Share In</span>
              </button>
            </div>

          </form></div>
      )
    }
  }

  return (
    <div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <RegisterSuccessfulComponent closeModal={closeModal}/>
        </Modal>
      <div className="theme-layout">
        <div className="container-land pdng0">
          <div className="topbarLand transparent">
            <div className="logo">
              <a href="/"><img src="/assets/images/New_Shareup_White.png" alt="" /></a>
            </div>
            <div className="top-area-land">
              <ul className="setting-area">
                <li><a href="/about" title="About" data-ripple>About</a></li>
                <li><a href="/privacyPolicy" title="Home" data-ripple>Privacy
                        Bill of Rights</a></li>
                <li><a href="#" title="Languages" data-ripple><i className="fa fa-globe" /></a>
                  <div className="dropdowns languages">
                    <a href="#" ><i className="ti-check" />English</a> <a href="#" >Arabic</a> <a href="#" >Dutch</a> <a href="#" >French</a>
                  </div></li>
                <li>
                  <button className="mtr-btn" type="button" onClick={() => setShowComponent("login")}>
                    <span>Members Login</span>
                  </button></li>
              </ul>
            </div>
          </div>
          <div className="mainContnr">
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="login-reg-bg">
                <div>
                  {registerSuccessful &&
                <p style={{ fontSize: 30, color: 'green', textAlign: 'center' }}>{registerSuccessful}</p>
                }
                </div>     
                {
                  handleShow()
                }
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="land-featurearea">
                <div className="land-meta">
                  <img style={{width:'40%',marginRight:'35%'}} src="/assets/images/cropped_flipped.png" alt="img" />
                  <p>Lets share without fear</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="privacy" id="portfolio">
          <div className="container">
            <div className="row">
              <div>
                <p className="privacy-text">We respect your privacy</p>
              </div>
            </div>
          </div>
        </div>
        <div className="tabs-content" id="our-story">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div style={{ height: '200px', textAlign: 'center', paddingTop: '50px' }}>
                <img width="100px" src="/assets/images/shield_only3.png" alt="img" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 className="featureAbt" style={{ color: '#00587a', textAlign: 'center' }}>Secure</h3>
                {/* <p className="feature">ShareUp never spam you.Provide secure
                platform for sharing.</p> */}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div style={{ height: '200px', textAlign: 'center', paddingTop: '50px' }}>
                <img width="150px" src="/assets/images/chat_icon_digital3.png" alt="img" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 className="featureAbt" style={{ color: '#db6400' }}>Chat</h3>
                {/* <p className="feature">No more Prying eyes! SHAREUP will cover
                you.</p> */}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div style={{ height: '200px', textAlign: 'center', paddingTop: '50px' }}>
                <img width="150px" src='/assets/images/21964583.png' alt="img" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3  className="featureAbt" style={{ color: '#008891' }}>Share</h3>
                {/* <p className="feature">Find new ways to Share anything from
                anywhere</p> */}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div style={{ height: '200px', textAlign: 'center', paddingTop: '50px' }}>
                <img width="150px" src="/assets/images/social_globe@2x-dark.png" alt="img" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 className="featureAbt" style={{ color: '#cd134b'}}>Socialize</h3>
                {/* <p className="feature">Start Socializing, you are not alone!</p> */}
              </div>
            </div>
          </div>
        </div>
        <div className="mobile">
          <img src="/assets/images/plann.png" width={600} />
        </div>
        <div className="challenge" id="portfolio">
          <div className="container">
            <div className="row">
              <div>
                <p className="privacy-text">What you give is yours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        
          <div className="row">
            <div className="widget">
              <ul className="list-style">
                <li><a href="#" title="About">About</a></li>
                <li><a href="#" title="FAQ">FAQ</a></li>
                <li><a href="#" title="Privacy">Privacy</a></li>
                <li><a href="#" title="English">English</a></li>
                <li><a href="#" title="Help Centre">Help Centre</a></li>
              </ul>
              <ul className="list-style">
                <li><a href="#">Afrikaans</a></li>
                <li><a href="#">Shqip</a></li>
                <li><a href="#">العربية</a></li>
                <li><a href="#">Հայերեն</a></li>
                <li><a href="#">Azərbaycan</a></li>
                <li><a href="#">dili</a></li>
                <li><a href="#">Euskara</a></li>
                <li><a href="#">Беларуская</a></li>
                <li><a href="#">мова</a></li>
                <li><a href="#">বাংলা</a></li>
                <li><a href="#">简体中文</a></li>
                <li><a href="#">繁體中文</a></li>
                <li><a href="#">Corsu</a></li>
                <li><a href="#">Dansk</a></li>
                <li><a href="#">Netherlands</a></li>
                <li><a href="#">English</a></li>
                <li><a href="#">Filipino</a></li>
                <li><a href="#">Suomi</a></li>
                <li><a href="#">Français</a></li>
                <li><a href="#">ქართული</a></li>
                <li><a href="#">Deutsch</a></li>
                <li><a href="#">Ελληνικά</a></li>
                <li><a href="#">ગુજરાતી</a></li>
                <li><a href="#">Kreyol</a></li>
                <li><a href="#">ayisyen</a></li>
                <li><a href="#">Harshen</a></li>
                <li><a href="#">Hausa</a></li>
                <li><a href="#">Ōlelo</a></li>
                <li><a href="#">Hawaiʻi</a></li>
                <li><a href="#">עִבְרִית</a></li>
                <li><a href="#">हिन्दी</a></li>
                <li><a href="#">Hmong</a></li>
                <li><a href="#">Magyar</a></li>
                <li><a href="#">Íslenska</a></li>
                <li><a href="#">Igbo</a></li>
                <li><a href="#">Bahasa Indonesia</a></li>
                <li><a href="#">Gaelige</a></li>
                <li><a href="#">Italiano</a></li>
                <li><a href="#">日本語</a></li>
                <li><a href="#">Basa Jawa</a></li>
                <li><a href="#">ಕನ್ನಡ</a></li>
                <li><a href="#">Қазақ</a></li>
                <li><a href="#">тілі</a></li>
                <li><a href="#">Slovenščina</a></li>
                <li><a href="#">Afsoomaali</a></li>
                <li><a href="#">Español</a></li>
                <li><a href="#">Basa Sunda</a></li>
                <li><a href="#">Kiswahili</a></li>
                <li><a href="#">Svenska</a></li>
                <li><a href="#">Тоҷикӣ</a></li>
                <li><a href="#">Српски </a></li>
                <li><a href="#">Malagasy</a></li>
                <li><a href="#">Samoan</a></li>
                <li><a href="#">Türkçe</a></li>



              </ul>
            </div>
          </div>
        
      </footer>
    </div>
  );
}
export default Index;