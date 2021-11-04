import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import UserService from "../services/UserService";
import AuthService from "../services/auth.services";
import Modal from "react-modal";
import "../css/modal.css";
import RegisterSuccessfulComponent from "../components/user/RegisterSuccessfulComponent";
import FormUser from "../components/FormUser/FormUser.jsx";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    overflow: "inherit",
    background: "transparent",
    border: "none",
  },
};

function LandingPage({ set, setUser }) {
  let history = useHistory();

  const [showComponent, setShowComponent] = useState("login");
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  //For Validation
  const [allFieldFillError, setAllFieldFillError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loginError, setLoginError] = useState("");

  const [registerSuccessful, setRegisterSuccessful] = useState("");
  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    const hasUser = AuthService.getCurrentUser() != null;
    if (hasUser) history.push("/newsfeed");
  }, []);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastName = (event) => {
    setLastName(event.target.value);
  };

  const validateRegister = (event) => {
    event.preventDefault();
    setAllFieldFillError("");
    setEmailError("");
    setPasswordError("");
    let validated = true;

    const hasEmail = email.length > 0;
    const hasPassword = password.length > 0;
    const hasConfirmPassword = confirmPassword.length > 0;
    const hasFirstname = firstName.length > 0;
    const hasLastname = lastName.length > 0;

    const isEmailFormatCorrect = email.includes("@");
    const isPasswordEqualToPasswordConfirm = password === confirmPassword;

    if (!hasEmail || !hasPassword || !hasConfirmPassword || !hasFirstname || !hasLastname) {
      setAllFieldFillError("Please Fill Out Every Field");
      validated = false;
    }
    if (!isEmailFormatCorrect) {
      setEmailError("Please ensure your email contains @");
      validated = false;
    }
    if (!isPasswordEqualToPasswordConfirm) {
      setPasswordError("Make sure your password match");
      validated = false;
    }

    if (validated) {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    let user = { email, password, firstName, lastName };

    try {
      await UserService.createUser(user);
      history.push("/");
      setRegisterSuccessful("Your Account Is Successfully Registered");
      setShowComponent("login");
      handleLoginAutomatically();
      openModal();
    } catch (registerError) {
      setRegisterError(`Registration error ${registerError.message}`);
    }
  };

  const getUser = async (email) => {
    let userResponse = await UserService.getUserByEmail(email);
    setUser(userResponse);
  };

  const validateLogin = (event) => {
    event.preventDefault();
    setAllFieldFillError("");
    setEmailError("");
    setPasswordError("");
    setLoginError("");
    let validated = true;

    const hasEmail = email.length > 0;
    const hasPassword = password.length > 0;

    const isEmailFormatCorrect = email.includes("@");

    if (!hasEmail || !hasPassword) {
      setAllFieldFillError("Please Fill Out Every Field");
      validated = false;
    }
    if (!isEmailFormatCorrect) {
      setEmailError("Please ensure your email contains @");
      validated = false;
    }

    if (validated) {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    console.log("working");

    await AuthService.login(email, password).then(
      (res) => {
        console.log(res.data + " THIS IS THE DATA");
        set(res.data);
        getUser(res.data.username);
        history.push("/newsfeed");
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        setLoginError("Incorrect Email and or Password");
      }
    );
  };

  const handleLoginAutomatically = async () => {
    console.log("working auto");

    await AuthService.login(email, password).then(
      (res) => {
        console.log(res.data + " THIS IS THE DATA");
        set(res.data);
        getUser(res.data.username);
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        setLoginError("Incorrect Email and or Password");
      }
    );
  };

  const handleShow = () => {
    if (showComponent === "register") {
      return <div className='log-reg-area reg'></div>;
    }
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Example Modal'
      >
        <RegisterSuccessfulComponent closeModal={closeModal} />
      </Modal>
      <div className='theme-layout'>
        <div className='container-land pdng0'>
          <div className='topbarLand transparent'>
            <div className='logo'>
              <a href='/'>
                <img src='/assets/images/New_Shareup_White.png' alt='' />
              </a>
            </div>
            <div className='top-area-land'>
              <ul className='setting-area'>
                <li>
                  <a href='/about' title='About' data-ripple>
                    About
                  </a>
                </li>
                <li>
                  <a href='/privacyPolicy' title='Home' data-ripple>
                    Privacy Bill of Rights
                  </a>
                </li>
                <li>
                  <a href='#' title='Languages' data-ripple>
                    <i className='fa fa-globe' />
                  </a>
                  <div className='dropdowns languages'>
                    <a href='#'>
                      <i className='ti-check' />
                      English
                    </a>{" "}
                    <a href='#'>Arabic</a> <a href='#'>Dutch</a> <a href='#'>French</a>
                  </div>
                </li>
                <li>
                  <button
                    className='mtr-btn'
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      setShowComponent("login");
                    }}
                  >
                    <span>Members Login</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className='container__landing-hero-grid'>
            {registerSuccessful && (
              <p style={{ fontSize: 30, color: "green", textAlign: "center" }}>{registerSuccessful}</p>
            )}
            <FormUser formType={showComponent} />
            <div className='hero__image'>
              <img src='/assets/images/cropped_flipped.png' alt='hero__image' />
              <p>Lets share without fear</p>
            </div>
          </div>
        </div>

        <div className='privacy' id='portfolio'>
          <div className='container'>
            <div className='row'>
              <div>
                <p className='privacy-text'>We respect your privacy</p>
              </div>
            </div>
          </div>
        </div>
        <div className='tabs-content' id='our-story'>
          <div className='row'>
            <div className='col-lg-3 col-md-6'>
              <div style={{ height: "200px", textAlign: "center", paddingTop: "50px" }}>
                <img width='100px' src='/assets/images/shield_only3.png' alt='img' />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 className='featureAbt' style={{ color: "#00587a", textAlign: "center" }}>
                  Secure
                </h3>
                {/* <p className="feature">ShareUp never spam you.Provide secure
                platform for sharing.</p> */}
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div style={{ height: "200px", textAlign: "center", paddingTop: "50px" }}>
                <img width='150px' src='/assets/images/chat_icon_digital3.png' alt='img' />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 className='featureAbt' style={{ color: "#db6400" }}>
                  Chat
                </h3>
                {/* <p className="feature">No more Prying eyes! SHAREUP will cover
                you.</p> */}
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div style={{ height: "200px", textAlign: "center", paddingTop: "50px" }}>
                <img width='150px' src='/assets/images/21964583.png' alt='img' />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 className='featureAbt' style={{ color: "#008891" }}>
                  Share
                </h3>
                {/* <p className="feature">Find new ways to Share anything from
                anywhere</p> */}
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div style={{ height: "200px", textAlign: "center", paddingTop: "50px" }}>
                <img width='150px' src='/assets/images/social_globe@2x-dark.png' alt='img' />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 className='featureAbt' style={{ color: "#cd134b" }}>
                  Socialize
                </h3>
                {/* <p className="feature">Start Socializing, you are not alone!</p> */}
              </div>
            </div>
          </div>
        </div>
        <div className='mobile'>
          <img src='/assets/images/plann.png' width={600} />
        </div>
        <div className='challenge' id='portfolio'>
          <div className='container'>
            <div className='row'>
              <div>
                <p className='privacy-text'>What you give is yours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className='row'>
          <div className='widget'>
            <ul className='list-style'>
              <li>
                <a href='#' title='About'>
                  About
                </a>
              </li>
              <li>
                <a href='#' title='FAQ'>
                  FAQ
                </a>
              </li>
              <li>
                <a href='#' title='Privacy'>
                  Privacy
                </a>
              </li>
              <li>
                <a href='#' title='English'>
                  English
                </a>
              </li>
              <li>
                <a href='#' title='Help Centre'>
                  Help Centre
                </a>
              </li>
            </ul>
            <ul className='list-style'>
              <li>
                <a href='#'>Afrikaans</a>
              </li>
              <li>
                <a href='#'>Shqip</a>
              </li>
              <li>
                <a href='#'>العربية</a>
              </li>
              <li>
                <a href='#'>Հայերեն</a>
              </li>
              <li>
                <a href='#'>Azərbaycan</a>
              </li>
              <li>
                <a href='#'>dili</a>
              </li>
              <li>
                <a href='#'>Euskara</a>
              </li>
              <li>
                <a href='#'>Беларуская</a>
              </li>
              <li>
                <a href='#'>мова</a>
              </li>
              <li>
                <a href='#'>বাংলা</a>
              </li>
              <li>
                <a href='#'>简体中文</a>
              </li>
              <li>
                <a href='#'>繁體中文</a>
              </li>
              <li>
                <a href='#'>Corsu</a>
              </li>
              <li>
                <a href='#'>Dansk</a>
              </li>
              <li>
                <a href='#'>Netherlands</a>
              </li>
              <li>
                <a href='#'>English</a>
              </li>
              <li>
                <a href='#'>Filipino</a>
              </li>
              <li>
                <a href='#'>Suomi</a>
              </li>
              <li>
                <a href='#'>Français</a>
              </li>
              <li>
                <a href='#'>ქართული</a>
              </li>
              <li>
                <a href='#'>Deutsch</a>
              </li>
              <li>
                <a href='#'>Ελληνικά</a>
              </li>
              <li>
                <a href='#'>ગુજરાતી</a>
              </li>
              <li>
                <a href='#'>Kreyol</a>
              </li>
              <li>
                <a href='#'>ayisyen</a>
              </li>
              <li>
                <a href='#'>Harshen</a>
              </li>
              <li>
                <a href='#'>Hausa</a>
              </li>
              <li>
                <a href='#'>Ōlelo</a>
              </li>
              <li>
                <a href='#'>Hawaiʻi</a>
              </li>
              <li>
                <a href='#'>עִבְרִית</a>
              </li>
              <li>
                <a href='#'>हिन्दी</a>
              </li>
              <li>
                <a href='#'>Hmong</a>
              </li>
              <li>
                <a href='#'>Magyar</a>
              </li>
              <li>
                <a href='#'>Íslenska</a>
              </li>
              <li>
                <a href='#'>Igbo</a>
              </li>
              <li>
                <a href='#'>Bahasa Indonesia</a>
              </li>
              <li>
                <a href='#'>Gaelige</a>
              </li>
              <li>
                <a href='#'>Italiano</a>
              </li>
              <li>
                <a href='#'>日本語</a>
              </li>
              <li>
                <a href='#'>Basa Jawa</a>
              </li>
              <li>
                <a href='#'>ಕನ್ನಡ</a>
              </li>
              <li>
                <a href='#'>Қазақ</a>
              </li>
              <li>
                <a href='#'>тілі</a>
              </li>
              <li>
                <a href='#'>Slovenščina</a>
              </li>
              <li>
                <a href='#'>Afsoomaali</a>
              </li>
              <li>
                <a href='#'>Español</a>
              </li>
              <li>
                <a href='#'>Basa Sunda</a>
              </li>
              <li>
                <a href='#'>Kiswahili</a>
              </li>
              <li>
                <a href='#'>Svenska</a>
              </li>
              <li>
                <a href='#'>Тоҷикӣ</a>
              </li>
              <li>
                <a href='#'>Српски </a>
              </li>
              <li>
                <a href='#'>Malagasy</a>
              </li>
              <li>
                <a href='#'>Samoan</a>
              </li>
              <li>
                <a href='#'>Türkçe</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default LandingPage;
