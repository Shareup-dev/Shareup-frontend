import { useForm } from "react-hook-form";
import './signup.css';

import React, { useState, useEffect } from 'react';

function SignupComponent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value)
  }
  if (password != confirmPassword) {
    console.log("Make sure your password match")
    setPasswordError("Make sure your password match")
    // alert("Make sure your password match")
  }


  const check = function() {
    console.log('confirm ');
    if (document.getElementById('password').value ==
      document.getElementById('confirm_password').value) {
      document.getElementById('message').style.color = 'green';
      document.getElementById('message').innerHTML = 'matching';
    } else {
      document.getElementById('message').style.color = 'red';
      document.getElementById('message').innerHTML = 'not matching';
    }
  }

  // console.log(watch());

  // console.log(errors.name)

  return (
    
          <div className='row' >
            <div className="col-md-6 py-3">
              <label className="form-label  pb-1"  for="validationCustom01" >First Name:</label>
              <input
                type="text" id="validationCustom01"
                className={`form-control m-0 ${errors.name1 && "invalid"}`}
                {...register("name1", { required: "First Name is Required" })}
                onKeyUp={() => {
                  trigger("name1");
                }}
              />
              {errors.name1 && (
                <small class=" text-danger">
                {errors.name1.message}
              </small>
              )}
            </div>
            <div className="col-md-6 py-3">
              <label className="form-label pb-1">Last Name:</label>
              <input
                type="text"
                className={`form-control m-0 ${errors.name2 && "invalid"}`}
                {...register("name2", { required: "Last name is Required" })}
                onKeyUp={() => {
                  trigger("name2");
                }}
              />
              {errors.name2 && (
                <small className="text-danger">{errors.name2.message}</small>
              )}
            </div>
           
            <div className="col-md-6 pb-3">
              <label className="form-label pb-1">Email:</label>
              <input
                type="text"
                className={`form-control m-0 ${errors.email && "invalid"}`}
                {...register("email", { required: "Email is Required" ,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                }})}
                onKeyUp={() => {
                  trigger("email");
                }}
              />
              {errors.email && (
                <small className="text-danger">{errors.email.message}</small>
              )}
            </div>

            <div className="col-md-6 pb-3">
              <label className="form-label pb-1">Password:</label>
              <input
                type="password"  id='password'
                placeholder='Enter password'
                className={`form-control m-0 ${errors.name2 && "invalid"}`}
                {...register("password", { required: "Password is Required" })}
                onKeyUp={() => {
                  trigger("password");
                }}
              />
              {errors.password && (
                <small className="text-danger">{errors.password.message}</small>
              )}
            </div>
            <div className="col-md-12 pb-3">
              <label className="form-label pb-1">Confirm Password:</label>
              <input
                type="password" 
                placeholder='Enter password' id='confirm_password'
                className={`form-control m-0 ${errors.conformpassword && "invalid"}`}
                 {...register("conformpassword", { required: " Confirm password is Required" })}
                 onKeyUp={() => {
                    trigger("conformpassword");
                
                 }}
              />
              {errors.conformpassword && (
                <small className="text-danger">{errors.confirmPassword.message}</small>
              )} 
                {/* <small className="text-danger" id='message'></small> */}

             
            </div>

            <div className="col-md-6 pb-3">
              <button class="btn btn-primary" type="submit">Submit form</button>

            </div>

         
           
          </div>
       
  );
}

export default SignupComponent;
