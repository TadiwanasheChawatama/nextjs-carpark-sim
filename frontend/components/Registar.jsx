//Registar.jsx
import React, { useContext, useState } from "react";
import { UserContext } from "./servers/context/userContext";
import backend from "./servers/backend";
import ErrorMessage from "./ErrorMessage";

const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setToken } = useContext(UserContext);

  const submitRegistration = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({name: name, surname: surname, email: email, hashed_password: password}),
    }
    const response = await fetch(`${backend}/api/users`, requestOptions);
    const responseData = await response.json(); // Read the response body once
  
    if (!response.ok) {
      setErrorMessage(JSON.stringify(responseData.detail));
    } else {
      setToken(responseData.access_token);
    }
      
  };

    const handleSubmit = (e) => {
      e.preventDefault()
      if (password === confirmationPassword && password.length >5) {
        submitRegistration()
      } else {
        setErrorMessage(
          "Ensure that passwords match, and that it has more than 5 characters"
        )
      }
    }

  return (
    <div className="flex flex-col">
      <form className="p-4 border" onSubmit={handleSubmit}>
        <h1 className="text-center text-2xl">Registar</h1>
        <div className="bg-transparent border  text-sm">
          <div className="bg-transparent border  text-sm">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <div className="flex items-center border-teal-500 py-2 mb-3 px-2">
              <input
                type="text"
                placeholder="Enter Your Name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="bg-transparent border  text-sm">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Surname
            </label>
            <div className="flex items-center border-teal-500 py-2 mb-3 px-2">
              <input
                type="text"
                placeholder="Enter Your Surname..."
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
          </div>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <div className="flex items-center border-teal-500 py-2 mb-3 px-2">
            <input
              type="email"
              placeholder="Enter Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div className="bg-transparent border  text-sm">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <div className="flex items-center border-teal-500 py-2 mb-3 px-2">
            <input
              type="password"
              placeholder="Enter Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div className="bg-transparent border  text-sm">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password
          </label>
          <div className="flex items-center border-teal-500 py-2">
            <input
              type="password"
              placeholder="Confirm Password..."
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-700 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
        </div>
        <br />
          <ErrorMessage message={errorMessage} />
        <br />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
