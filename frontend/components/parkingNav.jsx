"use client";
import React, { useEffect, useState } from "react";
import backend from "./servers/backend";
import { getUserLot } from "./servers/actions/serverActions";

  // Fetch user lot from backend
  

function ParkingManager(props) {
  // usestate variables for manipulating the DOM
  let user = JSON.parse(localStorage.getItem("userLot"))


  const [isParked, carPark] = useState();
  const [slot, setSlot] = useState(0);
  const [bayNumber, setBay] = useState("");
  const [redActive, setLightRed] = useState(".narmal-border");

  // functions to change the brightness of green and red robbots
  function handleRed() {
    if (redActive == true) {
      setLightRed(false);
    } else {
      setLightRed(true);
    }
  }

  // function to change the name of the parking bay, depending on the slot number
  const handleBay = (slotNumber) => {
    if (slotNumber > 0 && slotNumber <= 10) {
      setBay("ONE ( 0--10 )");
    } else if (slotNumber > 10 && slotNumber <= 20) {
      setBay("TWO ( 10--20 )");
    } else if (slotNumber > 20 && slotNumber <= 30) {
      setBay("THREE ( 20--30 )");
    } else if (slotNumber > 30 && slotNumber <= 40) {
      setBay("FOUR ( 30--40 )");
    } else if (slotNumber > 40 && slotNumber <= 50) {
      setBay("FIVE ( 40--50 )");
    } else {
      return "other";
    }
  };
  // function to trigger animation when the show animation button is clicked
  const handleClick = (slotNumber) => {
    handleBay(slotNumber);
    handleRed();
    if (slotNumber < 10) {
      carPark((prevIsParked) => !prevIsParked);
      setSlot(slotNumber);
    } else if (slotNumber > 10 && slotNumber <= 50) {
      if (
        slotNumber == 11 ||
        slotNumber == 21 ||
        slotNumber == 31 ||
        slotNumber == 41
      ) {
        carPark((prevIsParked) => !prevIsParked);
        setSlot(1);
      } else if (
        slotNumber == 12 ||
        slotNumber == 22 ||
        slotNumber == 32 ||
        slotNumber == 42
      ) {
        carPark((prevIsParked) => !prevIsParked);
        setSlot(2);
      } else if (
        slotNumber == 13 ||
        slotNumber == 23 ||
        slotNumber == 33 ||
        slotNumber == 43
      ) {
        carPark((prevIsParked) => !prevIsParked);
        setSlot(3);
      } else if (
        slotNumber == 14 ||
        slotNumber == 24 ||
        slotNumber == 34 ||
        slotNumber == 44
      ) {
        carPark((prevIsParked) => !prevIsParked);
        setSlot(4);
      } else if (
        slotNumber == 15 ||
        slotNumber == 25 ||
        slotNumber == 35 ||
        slotNumber == 45
      ) {
        carPark((prevIsParked) => !prevIsParked);
        setSlot(5);
      } else if (
        slotNumber == 16 ||
        slotNumber == 26 ||
        slotNumber == 36 ||
        slotNumber == 46
      ) {
        carPark((prevIsParked) => !prevIsParked);
        setSlot(6);
      } else if (
        slotNumber == 17 ||
        slotNumber == 27 ||
        slotNumber == 37 ||
        slotNumber == 47
      ) {
        carPark((prevIsParked) => !prevIsParked);
        setSlot(7);
      } else if (
        slotNumber == 18 ||
        slotNumber == 28 ||
        slotNumber == 38 ||
        slotNumber == 48
      ) {
        carPark((prevIsParked) => !prevIsParked);
        setSlot(8);
      } else if (
        slotNumber == 19 ||
        slotNumber == 29 ||
        slotNumber == 39 ||
        slotNumber == 49
      ) {
        carPark((prevIsParked) => !prevIsParked);
        setSlot(9);
      } else if (
        slotNumber == 20 ||
        slotNumber == 30 ||
        slotNumber == 40 ||
        slotNumber == 50
      ) {
        carPark((prevIsParked) => !prevIsParked);
        setSlot(10);
      }
    }
  };
  const handleClose = (e) => {
    onClose(); // Call the onClose function
  };

  return (
    <>
    <div>
        
    </div>
      <main className="lot-manager" >
        <div className="navbar" >
          {/* change the argument of the handle click function below */}
          <button className="btn btn-way" onClick={() => handleClick(user?.lot_id)}>
            Show lot
          </button>
          <div className="brand">PARKING BAY {bayNumber}</div>
    
          <button onClick={() => { props.onClose(); window.location.href = "/main"; }}>Close</button>
          <div className="lights">
            <div
              id="light-red"
              className={redActive ? "red-active" : "green-active"}
            ></div>
            <div
              id="light-green"
              className={redActive ? "green-active" : "red-active"}
            ></div>
          </div>
        </div>
        <div className="dashboard">
          <div className="parking-container" id="parkingspace">
            <div className="parking-slots-holder">
              <div className="parking-slot" id="slot-1">
                <h1 className="slot-header">slot-1</h1>
              </div>
              <div className="parking-slot" id="slot-2">
                <h1 className="slot-header">slot-2</h1>
              </div>
              <div className="parking-slot" id="slot-3">
                <h1 className="slot-header">slot-3</h1>
              </div>
              <div className="parking-slot" id="slot-4">
                <h1 className="slot-header">slot-4</h1>
              </div>
              <div className="parking-slot" id="slot-5">
                <h1 className="slot-header">slot-5</h1>
              </div>
            </div>
            <div className="parking-way" id="entry-way">
              <img
                src="car.png"
                className={isParked ? `car-park-${slot}` : `car-exit-${slot}`}
                alt=""
                id="car-img"
              />
              <div className="way-line"></div>
            </div>
            <div className="parking-slots-holder">
              <div className="parking-slot parking-slot-btm" id="slot-6">
                <h1 className="slot-header-btm">slot-6</h1>
              </div>
              <div className="parking-slot parking-slot-btm" id="slot-7">
                <h1 className="slot-header-btm">slot-7</h1>
              </div>
              <div className="parking-slot parking-slot-btm" id="slot-8">
                <h1 className="slot-header-btm">slot-8</h1>
              </div>
              <div className="parking-slot parking-slot-btm" id="slot-9">
                <h1 className="slot-header-btm">slot-9</h1>
              </div>
              <div className="parking-slot parking-slot-btm" id="slot-10">
                <h1 className="slot-header-btm">slot-10</h1>
              </div>
            </div>
          </div>
          <div className="entry-exit">
            <div
              id="entry-exit-inner"
              className={redActive ? "green-border" : "red-border"}
            >
              <div className="entrance">exit</div>
              <div className="entrance">entry</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export default ParkingManager;
