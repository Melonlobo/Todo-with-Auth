import React, { useState, useRef } from "react";
import "./register.scss";
import { useNavigate, Link } from "react-router-dom";
import { useGlobalContext } from "./contexts/AuthContext";

const Register = () => {
  const [password, setPassword] = useState("");
  const reTypePassword = useRef();
  const navigateTo = useNavigate();
  const {
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    setSuccess,
    // gender,
    // setGender,
  } = useGlobalContext();
  const handlePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length >= 8 && e.target.value.length <= 15) {
      console.log("valid password");
    } else {
      console.log(
        "password must be atleast 8 characters and less than 16 characters"
      );
    }
  };
  const comparePassword = (e) => {
    console.log(reTypePassword.current.value);
    if (password === reTypePassword.current.value) {
      console.log("password matches");
      setRegisterPassword(password);
    } else {
      console.log("Password doesn't match!");
    }
  };
  const register = (e) => {
    e.preventDefault();
    console.log(registerEmail, registerPassword, firstName, lastName);
    fetch("http://localhost:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        email: registerEmail,
        password: registerPassword,
        // gender,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSuccess(data?.success);
        if (data.success) {
          window.localStorage.setItem("token", data?.token);
          navigateTo("/");
        }
      })
      .catch((err) => console.error(err.message));
  };
  return (
    <div className="form_wrapper">
      <div className="form_container">
        <div className="title_container">
          <h2>Sign Up</h2>
        </div>
        <div className="row clearfix">
          <div className="">
            <form onSubmit={register}>
              <div className="row clearfix">
                <div className="col_half">
                  <div className="input_field">
                    {" "}
                    <span>
                      <i aria-hidden="true" className="fa fa-user"></i>
                    </span>
                    <input
                      type="text"
                      name="name"
                      placeholder="First Name"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col_half">
                  <div className="input_field">
                    {" "}
                    <span>
                      <i aria-hidden="true" className="fa fa-user"></i>
                    </span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Last Name"
                      required
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="input_field">
                {" "}
                <span>
                  <i aria-hidden="true" className="fa fa-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div className="input_field">
                {" "}
                <span>
                  <i aria-hidden="true" className="fa fa-lock"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handlePassword}
                />
              </div>
              <div className="input_field">
                {" "}
                <span>
                  <i aria-hidden="true" className="fa fa-lock"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Re-type Password"
                  required
                  ref={reTypePassword}
                  onChange={comparePassword}
                />
              </div>

              {/* <div className="input_field radio_option">
                <input
                  type="radio"
                  name="radiogroup1"
                  id="rd1"
                  value={"male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="rd1">Male</label>
                <input
                  type="radio"
                  name="radiogroup1"
                  id="rd2"
                  value={"female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="rd2">Female</label>
                <input
                  type="radio"
                  name="radiogroup1"
                  id="rd3"
                  value={"other"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="rd3">Other</label>
              </div> */}
              {/* <div className="input_field checkbox_option">
                <input type="checkbox" id="cb1" />
                <label htmlFor="cb1">I agree with terms and conditions</label>
              </div> */}
              <input className="button" type="submit" value="Register" />
            </form>
          </div>
        </div>
        <div className="striped">
          <span className="striped-line"></span>
          <span className="striped-text">Or</span>
          <span className="striped-line"></span>
        </div>
        <div className="method">
          <div className="method-control">
            <a href="#" className="method-action">
              <i className="ion ion-logo-google"></i>
              <span>Sign in with Google</span>
            </a>
          </div>
        </div>
        <div className="text">
          Already have an account?{" "}
          <Link to="/login" className="text-links">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
