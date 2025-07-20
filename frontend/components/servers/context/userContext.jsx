"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import backend from '../backend'; // Adjust the path

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('casestudyuser')));

 

  return (
    <UserContext.Provider value={{user, setUser}}>
      {props.children} {/* Correct the spelling */}
    </UserContext.Provider>
  );
};