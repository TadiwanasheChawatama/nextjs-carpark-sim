"use client";
import backend from "./servers/backend";
import ErrorMessage from "./ErrorMessage";
import Link from "next/link";
import Form from "./ui/form";
import { SignUp, LogIn } from "./servers/actions/serverActions";
import { useEffect, useState } from "react";

function LogInModal() {
  const [rightPanelActive, setRightPanelActive] = useState(false);

  // ✅ Run this only on client
  useEffect(() => {
    localStorage.removeItem("casestudyuser");
    localStorage.removeItem("useraccount");
    localStorage.removeItem("usernotifications");
  }, []);

  const handleSignInClick = () => {
    setRightPanelActive(false);
    console.log(rightPanelActive);
  };

  const handleSignUpClick = () => {
    setRightPanelActive(true);
    console.log(rightPanelActive);
  };

  return (
    <>
      <div
        className={rightPanelActive ? "right-panel-active" : ""}
        id="container"
      >
        <div className="Form-container sign-up-container">
          <Form action={SignUp} onsubmit={handleSignInClick}>
            <span>WELCOME TO CAR-PARK BOOKING SYSTEM</span>
            <h1>Create Account</h1>
            <input type="text" placeholder="Name..." name="name" />
            <input type="text" placeholder="Surname..." name="surname" />
            <input type="email" placeholder="Email..." name="email" />
            <input type="password" placeholder="Password..." name="password" />
            <input
              type="password"
              placeholder="Confirm Password..."
              name="confirmationPassword"
            />
            <button className="bg-teal-600">Sign Up</button>
          </Form>
        </div>
        <div className="Form-container sign-in-container">
          <Form action={LogIn}>
            <span>WELCOME TO CAR-PARK BOOKING SYSTEM</span>
            <h1>Log In</h1>
            <input type="email" placeholder="Email" name="email" />
            <input
              type="password"
              placeholder="Enter Your Password..."
              name="password"
            />
            <a href="#">Forgot your password?</a>
            <button className="bg-teal-600" type="submit">
              Log In
            </button>
          </Form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To Proceed to the Car Park Booking System, please login with
                your personal info
              </p>
              <button className="ghost" id="signIn" onClick={handleSignInClick}>
                Log In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Good-Day!</h1>
              <p>
                Enter your personal details to proceed to the Car Booking System
              </p>
              <button className="ghost" id="signUp" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogInModal;
