import React, { useState, useEffect, useContext } from "react";
import UserService from "../../services/UserService";
import UserContext from "../../contexts/UserContext";
import "./Modal.css";

function OptionalEmailModal({ setOpenModal, handleOptionalEmail, Fvalue }) {
  const { user } = useContext(UserContext);
  const [OTP, setOtp] = useState("");
  const [Error, setError] = useState("");

  const SetoptinalEmail = () => {
    if (Fvalue == "") {
      setError("Please enter secendery Email");
    } else {
      const formData = new FormData();
      formData.append("email", Fvalue);
      UserService.SetoptinalEmail(user?.id, formData)
        .then((res) => {
          setOpenModal(false);
        })
        .catch((e) => {
          if (e.message === "Request failed with status code 400") {
            setError("Email Already Registered");
          } else if (e.message === "Request failed with status code 500") {
            setError("Server Problem ");
          } else {
            setError(e.message);
          }
        });
    }
  };
  const verifyOtpOptionalEmail = () => {
    if (OTP == "") {
      setError("Please enter OTP");
    } else {
      UserService.verifyOtpOptionalEmail(user?.id, OTP)
        .then((res) => {
          const formData = new FormData();
          formData.append("email", Fvalue);
          UserService.SetoptinalEmail(user?.id, formData)
            .then((res) => {
              setOpenModal(false);
            })
            .catch((e) => {
              if (e.message === "Request failed with status code 400") {
                setError("Email Already Registered");
              } else if (e.message === "Request failed with status code 500") {
                setError("Server Problem ");
              } else {
                setError(e.message);
              }
            });
        })
        .catch((e) => {
          if (e.message === "Request failed with status code 400") {
            setError("Incorrect code");
          } else if (e.message === "Request failed with status code 408") {
            setError("Code expired");
          } else {
            setError("Unexpected error." + e.message);
          }
        });
    }
  };

  const SendOptinalEmailOtp = () => {
    if (Fvalue == "") {
      setError("Please enter Email");
    } else {
      const formData = new FormData();
      formData.append("email", Fvalue);
      UserService.SetoptinalEmail(user?.id, formData)
        .then((res) => {
          UserService.SendOptinalEmailOtp(user?.id)
            .then((res) => {
              setError("OTP hase been sent to");
            })
            .catch((e) => {
              if (e.message === "Request failed with status code 500") {
                setError("Server Problem ");
              } else {
                setError(e.message);
              }
            });
        })
        .catch((e) => {
          if (e.message === "Request failed with status code 400") {
            setError("Email Already Registered");
          } else if (e.message === "Request failed with status code 500") {
            setError("Server Problem ");
          } else {
            setError(e.message);
          }
        });
    }
  };
  const handleOTP = (event) => {
    setOtp(event.target.value);
  };
  return (
    <div className="modalContainer">
      <div className="titleCloseBtn">
        <button
          onClick={() => {
            setOpenModal(false);
          }}
        >
          X
        </button>
      </div>
      <div className="title">
        <h1>Adding Optional Email</h1>
      </div>
      <div className="body d-flex flex-column align-items-start">
        <p>Add Your Email</p>
        <div>
          <input
            className="d-inline p-2 m-1"
            placeholder="Secendery Email"
            name="textf"
            style={{
              border: "1px solid #033347",
              borderRadius: "2%",
              height: "30px",
              width: "250px",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
            onChange={handleOptionalEmail}
            value={Fvalue}
          ></input>
          <button className="d-inline p-1 m-1" onClick={SendOptinalEmailOtp}>
            Send OTP
          </button>
        </div>
        <p>Enter OTP </p>

        <div>
          <input
            className="d-inline p-2 m-1"
            placeholder="OTP"
            name="textf"
            style={{
              border: "1px solid #033347",
              borderRadius: "2%",
              height: "30px",
              width: "100px",
              fontSize: "1.2rem",
              fontWeight: "600",
              textAlign: "center",
            }}
            onChange={handleOTP}
            value={OTP}
          ></input>
          <button
            className="d-inline p-1 m-1"
            onChange={handleOTP}
            value={OTP}
            onClick={verifyOtpOptionalEmail}
          >
            Verify
          </button>
        </div>
      </div>
      <small
        style={{ color: "red", fontSize: "1.2rem", fontWeight: "600" }}
        id="error"
      >
        {Error}
      </small>

      <div className="footer">
        <button
          onClick={() => {
            setOpenModal(false);
          }}
          id="cancelBtn"
        >
          Cancel
        </button>
        <button onClick={SetoptinalEmail}>Continue</button>
      </div>
    </div>
  );
}

export default OptionalEmailModal;
