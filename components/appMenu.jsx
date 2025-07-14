"use client";
import { useState } from "react";
import {
  LogIn,
  SignUp,
  getUserLot,
  reserveLot,
} from "./servers/actions/serverActions";
import Form from "./ui/form";
import MyAccount from "./myaccount";
import UserNotes from "./notifications";
import Modal from "./ui/modals/Modal";
import ParkingManager from "./parkingNav";
// import {form} from 'formlink'

function Menu() {
  const [myLotsPanel, setMyLotsPanel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reservStatus, setReservStatus] = useState("Immediate Booking");
  const [bookStat, setBookStat] = useState(true);
  const [hours, setHours] = useState(1);
  const [showNav, setShowNav] = useState(false)
  const [hrate, setHRate] = useState("")

  // console.clear()
  const visible = JSON.parse(localStorage.getItem("casestudyuser"));
  //   console.log(typeof(visible?.havelot));

  const bookingStats = (e) => {
    e.preventDefault();
    if (reservStatus === "Immediate Booking") {
      setReservStatus("Reservation");
      setBookStat(false);
      console.log(reservStatus, bookStat);
    } else {
      setReservStatus("Immediate Booking");
      setBookStat(true);
      console.log(reservStatus, bookStat);
    }
  };

  const handleSignInClick = () => {
    setMyLotsPanel(false);
    console.log(myLotsPanel);
  };

  const handleNav = () =>{
    setShowNav(!showNav)
  }

  const handleSignUpClick = () => {
    setMyLotsPanel(true);
    console.log(myLotsPanel);
  };

  const modalState = (e) => {
    e.preventDefault();
    setShowModal(!showModal);
    console.log(showModal);
  };

  const submitLotDetails = (e) => {
    // event.preventDefault()
    getUserLot(hours, bookStat);
  };

  const hourlyRate = () => {
    setHRate(`${hours} hour(s) will cost you $${hours * 2}`)
  }

  const userData = JSON.parse(localStorage.getItem("casestudyuser"));
  //   console.log(userData);

  return (
    <>
      <div className="flex flex-row justify-between w-[770px] rounded-2xl shadow-lg mb-2 px-3 py-4" hidden={showNav}>
        <span className="animate-ping text-sm font-extrabold w-auto ml-9 mt-2">
          Welcome {userData?.name}
        </span>
        <MyAccount />
      </div>
      <div className={myLotsPanel ? "right-panel-active" : ""} id="container">
        <div className="Form-container sign-up-container !flex !flex-col !absolute">
          <form>
            <div className="!flex !flex-col !justify-center !items-center !place-self-center !absolute">
              {/* <span>Book or Reserve A Lot</span> */}
              <button
                className="w-min text-nowrap"
                onClick={modalState}
                hidden={visible?.havelot}
              >
                Get A ParkingLot
              </button>
              <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
                <div className="!bg-white !w-auto">
                  <h1>Make Your Parking Lot Reservation Or Booking Here</h1>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    name="hours"
                    placeholder="Enter The Number Of Hours..."
                    className="text-wrap whitespace-pre-wrap"
                  />
                  <p
                    name="bookingtype"
                    className={bookStat ? "bg-[#76ABAE]" : "bg-teal-400"}
                    onClick={bookingStats}
                    value={bookStat}
                  >
                    {reservStatus}
                  </p>
                  <p className="!text-teal-500">{`${hours} hour(s) will cost you $${hours * 2}`}</p>
                  <button
                    type="button"
                    className="bg-[#76ABAE] mt-2 mb-10"
                    onClick={(e) => {
                      e.preventDefault();
                      reserveLot(hours, bookStat);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </Modal>
            </div>
            <div hidden={!visible?.havelot} className="!mt-[-300px] flex flex-col justify-between">
              <span className="!mb-4 font-extrabold text-lg">ParkingLots</span>
              <button className="!mt-[100px] bg-[#76ABAE]" type='button' hidden={!visible?.havelot} onClick={() => setShowNav(true) }>Navigate</button>
            </div>
          </form>
        </div>
        <div className="flex flex-col form-container sign-in-container justify-center items-center">
          {/* ENTER NOTIFICATIONS RIGHT HERE */}
          <h1 className="font-bold text-green-900  mt-3 shadow-sm shadow-slate-500 w-min text-nowrap">
            MY NOTIFICATIONS
          </h1>
          <div className="note-container mt-9 h-[440px]">
            <UserNotes userid={userData?.id} />
          </div>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                You Can Go Back 
                To See Your Notification
              </p>
              <button className="ghost" id="signIn" onClick={handleSignInClick}>
                Notifications
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Good-Day!</h1>
              <p>
                You Can Reverse/Book or Navigate to Your ParkingLot
              </p>
              <button className="ghost" id="signUp" onClick={handleSignUpClick}>
                ParkingLots
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <ErrorMessage message={errorMessage} /> */}
      <div hidden={!showNav} className='z-10 '>
        <ParkingManager onClose={() => setShowNav(false) } />
      </div>
    </>
  );
}

export default Menu;
