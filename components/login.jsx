//page.tsx
"use client"
// page.tsx
import { useContext, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { revalidatePath } from "next/cache";
import backend from "./servers/backend";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  


  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({email: email, password: password}),
    }
    
    
    const response = await fetch(`${backend}/api/login`, requestOptions);
    const responseData = await response.json(); // Read the response body once

    if (!response.ok) {
      setErrorMessage(JSON.stringify(responseData.detail));
    } else {
        console.log(responseData);
        alert(responseData.name);
        localStorage.setItem('casestudyuser', JSON.stringify(responseData));
        revalidatePath("/main")
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (password.length >5) {
      submitLogin()
    } else {
      setErrorMessage(
        "Ensure that password has more than 5 characters"
      )
    }
  }

  return (
    <div className="flex bg-gray-500 w-full h-screen justify-center items-center flex-col">
      <div className='w-[750px] rounded-xl shadow-md h-[200px] mb-5 border'>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
            <labe>Email</labe>
            <input type="email" placeholder="Enter Your Email..." value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="flex flex-col">
            <label>Password</label>
            <input type="password" placeholder="Enter Your Password..." value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="bg-blue-500 mt-5 rounded-sm" >Submit</button>
        </form>
        <ErrorMessage message={errorMessage} />
        
      </div>
    </div>
  )
};

export default Login;