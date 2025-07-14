import { useState, useEffect } from "react";
import backend from "./backend";

export default function root () {
  const [message, setMessage] = useState("");
  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(`${backend}/api`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log("Something went wrong...");
    } else {
      setMessage(data.message)
    }
  };
  useEffect(() => {
    getWelcomeMessage();
  }, );
  return message;
}