import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import UserService from "../../services/UserService";
import AuthService from "../../services/auth.services";
import { useJwt } from "react-jwt";
// import { Modal } from '../dashboard/Modal';
import Modal from "react-modal";
import { GlobalStyle } from "../../styles/modalStyles";
import styled from "styled-components";
import "../../modal.css";
import RegisterSuccessfulComponent from "./RegisterSuccessfulComponent";
import { useForm } from "react-hook-form";
import Telephone from "./PhoneComponent";
import authServices from "../../services/auth.services";
import Toast from "react-bootstrap/Toast";
import { BarLoader,DoubleOrbit, HalfMalf,Spinner,TripleMaze } 
from 'react-spinner-animated';
import 'react-spinner-animated/dist/index.css'

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

function Index({ set, setUser }) {
  let history = useHistory();

  const [showComponent, setShowComponent] = useState("login");
  const [show, setShow] = useState();

  const [showModal, setShowModal] = useState(false);

  var subtitle;
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
  const [otp, setOTP] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [p_no, setPhone] = useState("");
  const [allFieldFillError, setAllFieldFillError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordNotMatchError, setPasswordNotMatchError] = useState("");

  const [loginError, setLoginError] = useState("");

  const [registerSuccessful, setRegisterSuccessful] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [otpError, setOTPError] = useState("");

  const handlePhone = (a) => {
    setPhone(a);
    document.querySelector(".yahoobaba").style.display = "none";
  };

  const myid = 12;
  const addP = () => {
    localStorage.setItem("phone", JSON.stringify([{ myid, p_no }]));
    setPhone(p_no);
  };

  function formValidation() {
    const val = document.querySelector(".PhoneInputInput").value;
    if (val == "") {
      document.querySelector(".yahoobaba").style.display = "block";
    }
  }

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleOTP = (event) => {
    setOTP(event.target.value);
  };

  // const handleConfirmPassword = (event) => {
  //   setConfirmPassword(event.target.value)
  // }

  // const handleFirstName = (event) => {
  //   setFirstName(event.target.value)
  // }

  // const handleLastName = (event) => {
  //   setLastName(event.target.value)
  // }

  const validateRegister = (event) => {
    event.preventDefault();
    setAllFieldFillError("");
    setEmailError("");
    setPasswordError("");
    let validated = true;

    if (
      email == "" ||
      password == "" ||
      confirmPassword == "" ||
      firstName == "" ||
      lastName == "" ||
      p_no == ""
    ) {
      setAllFieldFillError("Please Fill Out Every Field");
      validated = false;
    }
    if (!email.includes("@")) {
      setEmailError("Please ensure your email contains @");

      validated = false;
    }
    if (password != confirmPassword) {
      setPasswordError("Make sure your password match");
      // alert("Make sure your password match")
      validated = false;
    }
    if (validated) {
      handleRegister();
    }
  };

  const validateOtp = (event) => {
    event.preventDefault();
    setOTPError("");
    let validated = true;

    if (otp == "") {
      setShow(true);
      setOTPError("Please enter OTP");
      validated = false;
    }

    if (validated) {
      handleOtp();
    }
  };
  const validateForgotOtp = (event) => {
    event.preventDefault();
    setOTPError("");
    let validated = true;

    if (otp == "") {
      setShow(true);
      setOTPError("Please enter OTP");
      validated = false;
    }

    if (validated) {
      handleOtpForgot();
    }
  };
  const validatedResentOTP = (event) => {
    event.preventDefault();
    setOTPError("");
    let validated = false;

    if (otp == "" || otp != "") {
      validated = true;
    }

    if (validated) {
      setShow(true);
      setOTPError("OTP has been sent");
      resendOtp();
    }
  };

  const resendOtp = () => {
    setShowComponent("sendingOTploading");
    authServices.verifyEmailOTP(email)
    .then((res) => {
      setShowComponent("otpPage");
    }).catch((e) => {
      setShowComponent("otpPage");
      setShow(true);
      if (e.message === "Request failed with status code 500") {
        setEmailError("Server Problem ");
      } else {
        setEmailError(e.message);
      }
    });
  };
  const validateForgetEmail = (event) => {
    event.preventDefault();
    setEmailError("");
    let validated = true;

    if (email == "") {
      document.getElementById("email-empty").innerHTML = "Please enter email";
      document.querySelector(".input-error-icon").style.visibility = "visible";
      validated = false;
      setTimeout(() => {
        if (document.getElementById("email-empty")) {
          document.getElementById("email-empty").innerHTML = "";
        }

        if (document.querySelector(".input-error-icon")) {
          document.querySelector(".input-error-icon").style.visibility =
            "hidden";
        }
      }, 5000);
    }
    if (email) {
      if (!email.includes("@")) {
        document.getElementById("email-empty").innerHTML =
          "Invalid email address";
        validated = false;
        setTimeout(() => {
          if (document.getElementById("email-empty")) {
            document.getElementById("email-empty").innerHTML = "";
          }
        }, 5000);
      }
    }
    if (validated) {
      sendForgotOtp();
    }
  };
  const ResendForgetEmail = (event) => {
    event.preventDefault();
    setOTPError("");
    let validated = false;

    if (otp == "" || otp != "") {
      validated = true;
    }

    if (validated) {
      setShow(true);
      setOTPError("OTP has been sent");
      sendForgotOtp();
    }
  };

  const sendForgotOtp = () => {
    setShowComponent("sendingOTploading");
    authServices
      .passwordResetOTP(email)
      .then((res) => {
        setShowComponent("otpForg");
      })
      .catch((e) => {
        setShowComponent("email");
        setShow(true);
        if (e.message === "Request failed with status code 400") {
          setEmailError("User does not exist");
        } else if (e.message === "Request failed with status code 500") {
          setEmailError("Server Problem ");
        } else {
          setEmailError(e.message);
        }
      });
  };

  //najam form register / login start
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm();

  const onSubmit = (data) => {
    if (data.password == data.confirmPassword) {
      handleRegister();
      // setShowComponent("regProg");
    } else {
      document.getElementById("message").innerHTML = "Password didn't match";
      setTimeout(() => {
        if (document.getElementById("message")) {
          document.getElementById("message").innerHTML = "";
        }
      }, 5000);
    }
  };

  const onChange = (data) => {
    if (data.password == data.confirmPassword) {
      changePassword();
    } else {
      document.getElementById("message").innerHTML = "password didnt match";
      setTimeout(() => {
        if (document.getElementById("message")) {
          document.getElementById("message").innerHTML = "";
        }
      }, 5000);
    }
  };
  //najam form register / login end

  const handleRegister = async () => {
    setShowComponent("regProg");
    let user = { email, password, confirmPassword, firstName, lastName, p_no };
    await UserService.createUser(user)
      .then((res) => {
        reset();
        addP(); 
        setShowComponent("otpPage");
      })
      .catch((e) => {
        setShowComponent("register");
        setShow(true);
        if (e.message === "Request failed with status code 400") {
          setRegisterError("User Already Registered");
        } else if (e.message === "Request failed with status code 500") {
          setRegisterError("Server Problem ");
        } else {
          setRegisterError(e.message);
        }
      });
  };

  const getUser = async (email) => {
    await UserService.getUserByEmail(email).then((res) => {
      setUser(res.data);
    });
  };

  const validateLogin = (event) => {
    event.preventDefault();
    setAllFieldFillError("");
    setEmailError("");
    setPasswordError("");
    setLoginError("");
    let validated = true;

    if (email == "") {
      document.getElementById("email-empty").innerHTML = "Please enter email";
      document.querySelector(".input-error-icon").style.visibility = "visible";
      validated = false;
      setTimeout(() => {
        if (document.getElementById("email-empty")) {
          document.getElementById("email-empty").innerHTML = "";
        }
        if (document.querySelector(".input-error-icon")) {
          document.querySelector(".input-error-icon").style.visibility =
            "hidden";
        }
      }, 5000);
    }
    if (password == "") {
      document.getElementById("password-empty").innerHTML =
        "Please enter password";
      document.querySelector(".input-error-icon2").style.visibility = "visible";
      setTimeout(() => {
        if (document.getElementById("password-empty")) {
          document.getElementById("password-empty").innerHTML = "";
        }
        if (document.querySelector(".input-error-icon2")) {
          document.querySelector(".input-error-icon2").style.visibility =
            "hidden";
        }
      }, 5000);
      validated = false;
    }

    if (email) {
      if (!email.includes("@")) {
        document.getElementById("email-empty").innerHTML =
          "Invalid email address";
        setTimeout(() => {
          if (document.getElementById("email-empty")) {
            document.getElementById("email-empty").innerHTML = "";
          }
        }, 5000);
        validated = false;
      }
    }
    // if (validated == false) {
    //   setTimeout(() => {
    //     document.getElementById("email-empty").innerHTML = "";
    //     document.getElementById("password-empty").innerHTML = "";
    //     document.querySelector(".input-error-icon").style.visibility = "hidden";
    //     document.querySelector(".input-error-icon2").style.visibility = "hidden";
    //   }, 5000);
    // }

    if (validated) {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    await AuthService.login(email, password)
      .then((res) => {
        if (res.status === 200) {
          set(res.data);
          getUser(res.data.username);
          history.push("/newsfeed");
        }
      })
      .catch((e) => {
        setShow(true);
        if (e.message === "Request failed with status code 401") {
          setShowComponent("otpPage");
        } else if (e.message === "Request failed with status code 500") {
          setLoginError("Incorrect Email or Password");
        } else {
          setLoginError("Unexpected error :" + e.message);
        }
      });
  };

  const handleOtp = async () => {
    authServices
      .verifyEmailConfirmOTP(email, otp)
      .then((res) => {
        if (res.status === 200) {
          {
            handleLogin();
          }
        }
      })
      .catch((e) => {
        setShow(true);
        if (e.message === "Request failed with status code 400") {
          setOTPError("Incorrect code");
        } else if (e.message === "Request failed with status code 408") {
          setOTPError("Code expired");
        } else {
          setOTPError("Unexpected error." + e.message);
        }
      });
  };

  const changePassword = async () => {
    authServices
      .resetPassword(email, password)
      .then((res) => {
        if (res.status === 200) {
          setShowComponent("login");
        }
      })
      .catch((e) => {
        setShow(true);
        setPasswordError(e.message);
      });
  };

  const handleOtpForgot = async () => {
    authServices
      .verifyPasswordResetOTP(email, otp)
      .then((res) => {
        if (res.status === 200) {
          setShowComponent("Password");
        }
      })
      .catch((e) => {
        setShow(true);
        if (e.message === "Request failed with status code 400") {
          setOTPError("Incorrect code");
        } else if (e.message === "Request failed with status code 408") {
          setOTPError("Code expired");
        } else {
          setOTPError("Unexpected error." + e.message);
        }
      });
  };
  const handleLoginAutomatically = async () => {
    await AuthService.login(email, password).then(
      (res) => {
        set(res.data);
        getUser(res.data.username);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoginError("Incorrect Email and or Password");
      }
    );
  };

  const handleShow = () => {
    if (showComponent === "register") {
      return (
        <div className="log-reg-area reg">
          <h2 className="log-title">Register new Account</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ color: "white", padding: "1rem 0" }}
          >
            <div className="d-flex justify-content-center align-items-center ">
              {registerError && (
                <Toast
                  className={"bg-transparent text-danger rounded"}
                  onClose={() => setShow(false)}
                  show={show}
                  
                >
                  <Toast.Body
                  className={"bg-transparent text-danger rounded"}
                    style={{ fontSize: 20, textAlign: "center" }}
                  >
                    {registerError}
                  </Toast.Body>
                </Toast>
              )}
            </div>

            <div className="row">
              <div className="col-md-6 py-3 pl-1 form-icon txt_field">
                {/* <label className="form-label  pb-1"  for="validationCustom01" >First Name:</label> */}
                <input
                  type="text"
                  id="validationCustom01"
                  placeholder="Enter first name"
                  className={`form-control m-0 ${
                    errors.firstName && "invalid"
                  } border-radius`}
                  {...register("firstName", {
                    required: "First Name is Required",
                    pattern: {
                      value: /^[A-Za-z]{2,}$/i,
                      message: "Invalid First name",
                    },
                  })}
                  onKeyUp={(e) => {
                    trigger("firstName");
                    setFirstName(e.target.value);
                  }}
                />
                {errors.firstName && (
                  <small id="rfirstname" className="">
                    {errors.firstName.message}
                    <i className="fas fa-exclamation-circle input-error-icon"></i>
                  </small>
                )}
              </div>
              <div className="col-md-6 py-3 pl-1 form-icon">
                {/* <label className="form-label pb-1">Last Name:</label> */}
                <input
                  type="text"
                  placeholder="Enter last name"
                  className={`form-control m-0 ${
                    errors.lastName && "invalid"
                  } border-radius`}
                  {...register("lastName", {
                    required: "Last name is Required",
                    pattern: {
                      value: /^[A-Za-z]{2,}$/i,
                      message: "Invalid Last name",
                    },
                  })}
                  onKeyUp={(e) => {
                    trigger("lastName");
                    setLastName(e.target.value);
                  }}
                />
                {errors.lastName && (
                  <small id="rlastName" className="">
                    {errors.lastName.message}
                    <i className="fas fa-exclamation-circle input-error-icon"></i>
                  </small>
                )}
              </div>

              <div className="col-md-6 py-3 pl-1 form-icon">
                {/* <label className="form-label pb-1">Email:</label> */}
                <input
                  type="text"
                  placeholder="Enter email"
                  className={`form-control m-0 ${
                    errors.email && "invalid"
                  } border-radius`}
                  {...register("email", {
                    required: "Email is Required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  onKeyUp={(e) => {
                    trigger("email");
                    setEmail(e.target.value);
                  }}
                />
                {errors.email && (
                  <small id="remail" className="">
                    {errors.email.message}
                    <i className="fas fa-exclamation-circle input-error-icon"></i>
                  </small>
                )}
              </div>
              {/* phone field */}
              <div className="col-md-6 py-2 pl-1 form-icon">
                <Telephone p_no={p_no} setPhone={setPhone} trigger={trigger} />

                <div className=" yahoobaba">
                  {/* <i className="fas fa-exclamation-circle"></i>
                  <small>Phone number required</small> */}
                </div>
              </div>

              <div className="col-md-6 py-3 pl-1 form-icon">
                {/* <label className="form-label pb-1">Password:</label> */}
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  className={`form-control m-0 ${
                    errors.password && "invalid"
                  } border-radius`}
                  {...register("password", {
                    required: "Password is Required",
                  })}
                  onKeyUp={(e) => {
                    trigger("password");
                    setPassword(e.target.value);
                  }}
                />
                {errors.password && (
                  <small id="rpassword" className="">
                    {errors.password.message}
                    <i className="fas fa-exclamation-circle input-error-icon"></i>
                  </small>
                )}
              </div>
              <div className="col-md-6 py-3 pl-1 form-icon">
                {/* <label className="form-label pb-1">Confirm Password:</label> */}
                <input
                  type="password"
                  placeholder="Confirm password"
                  id="confirm_password"
                  className={`form-control m-0 ${
                    errors.confirmPassword && "invalid"
                  } border-radius`}
                  {...register("confirmPassword", {
                    required: " Confirm password is Required",
                  })}
                  onKeyUp={(e) => {
                    trigger("confirmPassword");
                    setConfirmPassword(e.target.value);
                  }}
                />
                {errors.confirmPassword && (
                  <small id="rconfirmPassword" className="">
                    {errors.confirmPassword.message}
                    <i className="fas fa-exclamation-circle input-error-icon"></i>
                  </small>
                )}
                <small className="" id="message">
                <i className=""></i>

                </small>
              </div>
            </div>

            <div className="checkbox">
              <label>
                {" "}
                <input type="checkbox" defaultChecked="checked" />
                <i className="check-box" />
                Accept Terms &amp; Conditions ?
              </label>
            </div>
            <div className="checkbox">
              <label>
                {" "}
                <input type="checkbox" defaultChecked="checked" />
                <i className="check-box" />I am 18 years old or above
              </label>
            </div>
            <div style={{ textAlign: "center" }}>
              <a
                onClick={() => setShowComponent("login")}
                className="already-have"
                style={{ textAlign: "center" }}
              >
                Already have an account?
              </a>
            </div>

            <div className="submit-btns" onClick={formValidation}>
              <button className="mtr-btn signup" type="submit">
                <span>Share In</span>
              </button>
            </div>
          </form>
        </div>
      );
    }
    if (showComponent === "login") {
      return (
        <div className="log-reg-area" style={{ textAlign: "center" }}>
          <h2 className="log-title">Login</h2>
          <div className="d-flex justify-content-center align-items-center ">
            {loginError && (
              <Toast
                className={"bg-transparent text-danger rounded"}
                onClose={() => setShow(false)}
                show={show}
              >
                <Toast.Body
                  className={"bg-transparent text-danger rounded"}
                  style={{ fontSize: 20 }}
                >
                  {loginError}
                </Toast.Body>
              </Toast>
            )}
            {emailError && (
              <Toast
                className={"bg-transparent text-danger rounded"}
                onClose={() => setShow(false)}
                show={show}
                
              >
                <Toast.Body
                className={"bg-transparent text-danger rounded"}
                  style={{ fontSize: 20 }}
                >{emailError}</Toast.Body>
              </Toast>
            )}
          </div>
          <form style={{ color: "white", padding: "2rem 0" }}>
            <div className="row">
              <div className="col-md-6 py-3 pl-1 login-form-icon">
                {/* <label className="form-label pb-1">Email:</label> */}
                <input
                  placeholder="Enter email"
                  id="loginemail"
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleEmail}
                  required="required"
                  className="form-control m-0 border-radius"
                />
                <i className="fas fa-exclamation-circle input-error-icon"></i>
                <small id="email-empty"></small>
              </div>

              <div className="col-md-6 py-3 pl-1 login-form-icon">
                {/* <label className="form-label pb-1">Password:</label> */}
                <input
                  id="loginpassword"
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePassword}
                  required="required"
                  placeholder="Enter password"
                  className="form-control m-0 border-radius"
                />
                <i className="fas fa-exclamation-circle  input-error-icon2"></i>

                <small id="password-empty"></small>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <a
                onClick={() => setShowComponent("email")}
                className="forgot-pwd"
              >
                Forgot Password?
              </a>
              <a
                onClick={() => setShowComponent("register")}
                className="already-have"
              >
                Don't have an account?
              </a>
            </div>
            <div className="submit-btns-log">
              <button className="mtr-btn signup" onClick={validateLogin}>
                <span>Share In</span>
              </button>
            </div>
          </form>
        </div>
      );
    }
    if (showComponent === "otpPage") {
      return (
        <div className="log-reg-area">
          <h2 className="log-title">Account Verification</h2>
          <div className="d-flex justify-content-center align-items-center">
            <div className="py-3 ">
              {otpError && (
                <Toast
                  className={"bg-transparent text-danger rounded"}
                  onClose={() => setShow(false)}
                  show={show}
                
                >
                  <Toast.Body
                  className={"bg-transparent text-danger rounded"}
                    style={{ fontSize: 20, textAlign: "center" }}
                  >
                    {otpError}
                  </Toast.Body>
                </Toast>
              )}
            </div>
          </div>
          <p style={{ fontSize: 14, color: "white", textAlign: "center" }}>
            Shareup has sent you a verification code to your Email
          </p>
          <form style={{ color: "white", textAlign: "center" }}>
            <div className="inputs d-flex flex-row justify-content-center py-3 ">
              <input
                className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-center form-control rounded"
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleOTP}
                required="required"
                placeholder="Enter OTP"
                maxLength="6"
              />
              {/* <input className="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center form-control rounded" type="text" id="second" maxLength="1" /> 
                <input className="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center form-control rounded" type="text" id="third" maxLength="1" /> 
                <input className="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center form-control rounded" type="text" id="fourth" maxLength="1" /> 
                <input className="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center form-control rounded" type="text" id="fifth" maxLength="1" /> 
                <input className="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center form-control rounded" type="text" id="sixth" maxLength="1" />  */}
            </div>

            <div>
              <p>Verification code expires in 5 minutes</p>
            </div>
            <div>
              <p>Didn't get the code</p>
              <div className="py-1" >

              <a style={{ color: "green"  }} onClick={validatedResentOTP}>
                <span>Re-send</span>
              </a>
            </div>
            </div>

            <div className="submit-btns-log">
              <button id="subOtp" className="mtr-btn signup"  onClick={validateOtp}>
                <span>Verify</span>
              </button>
            </div>
          </form>
        </div>
      );
    }
    if (showComponent === "regProg") {
      return (
        <div className="log-reg-area reg" style={{ fontSize: "24px", color: "green", textAlign: "center" }}>
          <HalfMalf className="log-title"  text={"Welcome to ShareUp Registration Under Process ..."} 
            center={false} width={"400px"} height={"400px"}/>
          </div>
      );
    }
    if (showComponent === "sendingOTploading") {
      return (
        <div className="log-reg-area reg" style={{ fontSize: "24px", color: "green", textAlign: "center" }}>
          <HalfMalf className="log-title"  text={"Sending OTP to your email"} 
            center={false} width={"400px"} height={"400px"}/>
          </div>
      );
    }
    if (showComponent === "validReg") {
      return (
        <div className="log-reg-area">
          <h1
            className="successfull-msg"
            style={{ fontSize: "30px", color: "green", textAlign: "center" }}
          >
            Your Account Is Successfully Registered,Please Verify your Email
          </h1>
        </div>
      );
    }
    if (showComponent === "otpForg") {
      return (
        <div className="log-reg-area">
          <h2 className="log-title">Changing Account password</h2>
          <div className="d-flex justify-content-center align-items-center">
            <div className="py-3 ">
              {otpError && (
                <Toast
                  className={"bg-transparent text-danger rounded"}
                  onClose={() => setShow(false)}
                  show={show}
                  
                >
                  <Toast.Body
                  className={"bg-transparent text-danger rounded"}
                    style={{ fontSize: 20, textAlign: "center" }}
                  >
                    {otpError}
                  </Toast.Body>
                </Toast>
              )}
            </div>
          </div>
          <p style={{ fontSize: 14, color: "white", textAlign: "center" }}>
            Shareup has sent you a verification code to your Email
          </p>
          <form style={{ color: "white", textAlign: "center" }}>
            <div className="inputs d-flex flex-row justify-content-center py-3 pl-2 ">
              <input
                className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-center form-control rounded"
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleOTP}
                required="required"
                placeholder="Enter OTP"
                maxLength="6"
              />
              {/* <input className="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center form-control rounded" type="text" id="second" maxLength="1" /> 
              <input className="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center form-control rounded" type="text" id="third" maxLength="1" /> 
              <input className="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center form-control rounded" type="text" id="fourth" maxLength="1" /> 
              <input className="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center form-control rounded" type="text" id="fifth" maxLength="1" /> 
              <input className="col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center form-control rounded" type="text" id="sixth" maxLength="1" />  */}
            </div>

            <div>
              <p>Verification code expires in 5 minutes</p>
            </div>
            <div>
              <p>Didn't get the code</p>
              <div className="py-1" >
                <a style={{ color: "green"  }} onClick={ResendForgetEmail}>
                  <span>Re-send</span>
                </a>
                </div>
            </div>
            <div className="submit-btns-log">
              <button className="mtr-btn signup" onClick={validateForgotOtp}>
                <span>Verify</span>
              </button>
            </div>
          </form>
        </div>
      );
    }
    if (showComponent === "Password") {
      return (
        <div className="log-reg-area reg">
          <h2 className="log-title">Changing Password</h2>
          <div className="d-flex justify-content-center align-items-center">
            {passwordError && (
              <Toast
                  className={"bg-transparent text-danger rounded"}
                onClose={() => setShow(false)}
                show={show}
                
              >
                <Toast.Body
                  className={"bg-transparent text-danger rounded"}
                  style={{ fontSize: 20, textAlign: "center" }}
                >
                  {passwordError}
                </Toast.Body>
              </Toast>
            )}
          </div>
          <form
            onSubmit={handleSubmit(onChange)}
            style={{ color: "white", padding: "1rem 0" }}
          >
            <div className="row">
              <div className="col-md-6 py-3 pl-1 form-icon">
                {/* <label className="form-label pb-1">Password:</label> */}
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  className={`form-control m-0 ${
                    errors.password && "invalid"
                  } border-radius`}
                  {...register("password", {
                    required: "Password is Required",
                  })}
                  onKeyUp={(e) => {
                    trigger("password");
                    setPassword(e.target.value);
                  }}
                />
                {errors.password && (
                  <small className="">
                    {errors.password.message}
                    <i className="fas fa-exclamation-circle input-error-icon"></i>
                  </small>
                )}
              </div>
              <div className="col-md-6 py-3 pl-1 form-icon">
                {/* <label className="form-label pb-1">Confirm Password:</label> */}
                <input
                  type="password"
                  placeholder="Confirm password"
                  id="confirm_password"
                  className={`form-control m-0 ${
                    errors.confirmPassword && "invalid"
                  } border-radius`}
                  {...register("confirmPassword", {
                    required: " Confirm password is Required",
                  })}
                  onKeyUp={(e) => {
                    trigger("confirmPassword");
                    setConfirmPassword(e.target.value);
                  }}
                />
                {errors.confirmPassword && (
                  <small className="">
                    {errors.confirmPassword.message}
                    <i className="fas fa-exclamation-circle input-error-icon"></i>
                  </small>
                )}
                <small className="" id="message"></small>
              </div>
            </div>
            <div className="submit-btns">
              <button className="mtr-btn signup" type="submit">
                <span>Confirm</span>
              </button>
            </div>
          </form>
        </div>
      );
    }
    if (showComponent === "email") {
      return (
        <div className="log-reg-area">
          <h2
            className="log-title py-5"
            style={{ fontSize: 32, textAlign: "center" }}
          ></h2>
          <div>
            <h2
              className="log-title"
              style={{ fontSize: 32, textAlign: "center" }}
            >
              Forgot Your Password ?
            </h2>
            <div className="d-flex justify-content-center align-items-center py-3">
              {emailError && (
                <Toast
                  className={"bg-transparent text-danger rounded"}
                  onClose={() => setShow(false)}
                  show={show}
                  
                >
                  <Toast.Body
                  className={"bg-transparent text-danger rounded"}
                    style={{ fontSize: 20, textAlign: "center" }}
                  >
                    {emailError}
                  </Toast.Body>
                </Toast>
              )}
            </div>
            <p className="py-2">
              Please enter your email and get your account right back
            </p>
          </div>

          <form style={{ color: "white" }}>
            <div className="row" style={{ textAlign: "center" }}>
              <div className="col-md-12 py-3 login-form-icon">
                <input
                  placeholder="Enter your email"
                  id="loginemail"
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleEmail}
                  required="required"
                  className="form-control m-0 border-radius"
                />
                <i className="fas fa-exclamation-circle input-error-icon"></i>
                <small id="email-empty"></small>
                <a
                  onClick={() => setShowComponent("login")}
                  className="already-have py-3"
                  style={{ fontSize: 12, textAlign: "center" }}
                >
                  Remembered your password?
                </a>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button className="mtr-btn signup" onClick={validateForgetEmail}>
                <span>Share</span>
              </button>
            </div>
          </form>
        </div>
      );
    }
  };
  const renderAuthButton = () => {
    if (showComponent === "login") {
      return (
        <button
          className="mtr-btn"
          type="button"
          onClick={() => setShowComponent("register")}
        >
          <span>Register</span>
        </button>
      );
    } else {
      return (
        <button
          className="mtr-btn"
          type="button"
          onClick={() => setShowComponent("login")}
        >
          <span>Members Login</span>
        </button>
      );
    }
  };
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <RegisterSuccessfulComponent closeModal={closeModal} />
      </Modal>
      <div className="theme-layout">
        <div className="container-land pdng0">
          <div className="topbarLand transparent">
            <div className="logo">
              <a href="/">
                <img src="/assets/images/New_Shareup_White.png" alt="" />
              </a>
            </div>
            <div className="top-area-land">
              <ul className="setting-area">
                <li>
                  <a href="/about" title="About" data-ripple>
                    About
                  </a>
                </li>
                <li>
                  <a href="/privacyPolicy" title="Home" data-ripple>
                    Privacy Bill of Rights
                  </a>
                </li>
                <li>
                  <a href="#" title="Languages" data-ripple>
                    <i className="fa fa-globe" />
                  </a>
                  <div className="dropdowns languages">
                    <a href="#">
                      <i className="ti-check" />
                      English
                    </a>{" "}
                    <a href="#">Arabic</a> <a href="#">Dutch</a>{" "}
                    <a href="#">French</a>
                  </div>
                </li>
                <li>{renderAuthButton()}</li>
              </ul>
            </div>
          </div>
          <div className="mainContnr">
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="login-reg-bg">
                <div>
                  {registerSuccessful && (
                    <p
                      style={{
                        fontSize: 30,
                        color: "green",
                        textAlign: "center",
                      }}
                    >
                      {registerSuccessful}
                    </p>
                  )}
                </div>
                {handleShow()}
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="land-featurearea">
                <div className="land-meta">
                  <img
                    style={{ width: "40%", marginRight: "35%" }}
                    src="/assets/images/cropped_flipped.png"
                    alt="img"
                  />
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
              <div
                style={{
                  height: "200px",
                  textAlign: "center",
                  paddingTop: "50px",
                }}
              >
                <img
                  width="100px"
                  src="/assets/images/shield_only3.png"
                  alt="img"
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3
                  className="featureAbt"
                  style={{ color: "#00587a", textAlign: "center" }}
                >
                  Secure
                </h3>
                {/* <p className="feature">ShareUp never spam you.Provide secure
                platform for sharing.</p> */}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div
                style={{
                  height: "200px",
                  textAlign: "center",
                  paddingTop: "50px",
                }}
              >
                <img
                  width="150px"
                  src="/assets/images/chat_icon_digital3.png"
                  alt="img"
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 className="featureAbt" style={{ color: "#db6400" }}>
                  Chat
                </h3>
                {/* <p className="feature">No more Prying eyes! SHAREUP will cover
                you.</p> */}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div
                style={{
                  height: "200px",
                  textAlign: "center",
                  paddingTop: "50px",
                }}
              >
                <img
                  width="150px"
                  src="/assets/images/21964583.png"
                  alt="img"
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 className="featureAbt" style={{ color: "#008891" }}>
                  Share
                </h3>
                {/* <p className="feature">Find new ways to Share anything from
                anywhere</p> */}
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div
                style={{
                  height: "200px",
                  textAlign: "center",
                  paddingTop: "50px",
                }}
              >
                <img
                  width="150px"
                  src="/assets/images/social_globe@2x-dark.png"
                  alt="img"
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 className="featureAbt" style={{ color: "#cd134b" }}>
                  Socialize
                </h3>
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
              <li>
                <a href="#" title="About">
                  About
                </a>
              </li>
              <li>
                <a href="#" title="FAQ">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" title="Privacy">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" title="English">
                  English
                </a>
              </li>
              <li>
                <a href="#" title="Help Centre">
                  Help Centre
                </a>
              </li>
            </ul>
            <ul className="list-style">
              <li>
                <a href="#">Afrikaans</a>
              </li>
              <li>
                <a href="#">Shqip</a>
              </li>
              <li>
                <a href="#">العربية</a>
              </li>
              <li>
                <a href="#">Հայերեն</a>
              </li>
              <li>
                <a href="#">Azərbaycan</a>
              </li>
              <li>
                <a href="#">dili</a>
              </li>
              <li>
                <a href="#">Euskara</a>
              </li>
              <li>
                <a href="#">Беларуская</a>
              </li>
              <li>
                <a href="#">мова</a>
              </li>
              <li>
                <a href="#">বাংলা</a>
              </li>
              <li>
                <a href="#">简体中文</a>
              </li>
              <li>
                <a href="#">繁體中文</a>
              </li>
              <li>
                <a href="#">Corsu</a>
              </li>
              <li>
                <a href="#">Dansk</a>
              </li>
              <li>
                <a href="#">Netherlands</a>
              </li>
              <li>
                <a href="#">English</a>
              </li>
              <li>
                <a href="#">Filipino</a>
              </li>
              <li>
                <a href="#">Suomi</a>
              </li>
              <li>
                <a href="#">Français</a>
              </li>
              <li>
                <a href="#">ქართული</a>
              </li>
              <li>
                <a href="#">Deutsch</a>
              </li>
              <li>
                <a href="#">Ελληνικά</a>
              </li>
              <li>
                <a href="#">ગુજરાતી</a>
              </li>
              <li>
                <a href="#">Kreyol</a>
              </li>
              <li>
                <a href="#">ayisyen</a>
              </li>
              <li>
                <a href="#">Harshen</a>
              </li>
              <li>
                <a href="#">Hausa</a>
              </li>
              <li>
                <a href="#">Ōlelo</a>
              </li>
              <li>
                <a href="#">Hawaiʻi</a>
              </li>
              <li>
                <a href="#">עִבְרִית</a>
              </li>
              <li>
                <a href="#">हिन्दी</a>
              </li>
              <li>
                <a href="#">Hmong</a>
              </li>
              <li>
                <a href="#">Magyar</a>
              </li>
              <li>
                <a href="#">Íslenska</a>
              </li>
              <li>
                <a href="#">Igbo</a>
              </li>
              <li>
                <a href="#">Bahasa Indonesia</a>
              </li>
              <li>
                <a href="#">Gaelige</a>
              </li>
              <li>
                <a href="#">Italiano</a>
              </li>
              <li>
                <a href="#">日本語</a>
              </li>
              <li>
                <a href="#">Basa Jawa</a>
              </li>
              <li>
                <a href="#">ಕನ್ನಡ</a>
              </li>
              <li>
                <a href="#">Қазақ</a>
              </li>
              <li>
                <a href="#">тілі</a>
              </li>
              <li>
                <a href="#">Slovenščina</a>
              </li>
              <li>
                <a href="#">Afsoomaali</a>
              </li>
              <li>
                <a href="#">Español</a>
              </li>
              <li>
                <a href="#">Basa Sunda</a>
              </li>
              <li>
                <a href="#">Kiswahili</a>
              </li>
              <li>
                <a href="#">Svenska</a>
              </li>
              <li>
                <a href="#">Тоҷикӣ</a>
              </li>
              <li>
                <a href="#">Српски </a>
              </li>
              <li>
                <a href="#">Malagasy</a>
              </li>
              <li>
                <a href="#">Samoan</a>
              </li>
              <li>
                <a href="#">Türkçe</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default Index;
