import backend from "../backend";

export async function SignUp(formData) {
  const name = formData.get("name");
  const surname = formData.get("surname");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmationPassword = formData.get("confirmationPassword");

  const submitRegistration = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        surname: surname,
        email: email,
        hashed_password: password,
      }),
    };
    const response = await fetch(`${backend}/api/users`, requestOptions);
    const responseData = await response.json(); // Read the response body once

    if (!response.ok) {
      console.log(responseData);
      alert(JSON.stringify(responseData.detail));
    } else {
      // alert(responseData.name);
      localStorage.setItem("casestudyuser", JSON.stringify(responseData));
      // global.Set("userData", JSON.parse(responseData));
    }
  };

  if (password === confirmationPassword && password.length > 5) {
    submitRegistration();
    // handleSignInClick()
  } else {
  }
}

export async function LogIn(formData) {
  const name = formData.get("name");
  const surname = formData.get("surname");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmationPassword = formData.get("confirmationPassword");
  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    };

    const response = await fetch(`${backend}/api/login`, requestOptions);
    const responseData = await response.json(); // Read the response body once

    if (!response.ok) {
      alert(JSON.stringify(responseData.detail));
    } else {
      console.log(responseData);
      localStorage.setItem("casestudyuser", JSON.stringify(responseData));
      getUserAccount();
      getNotifications();

      // alert(responseData.name);
      window.location.href = "/main";
      // history.push("/main")
      // revalidatePath("/main") // Not sure where this is defined
    }
  };

  // e.preventDefault();
  if (password.length > 5) {
    submitLogin();
  } else {
  }
}

export async function getUser() {
  const user = JSON.parse(localStorage.getItem("casestudyuser"));
  const requestOps = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user?.email,
    }),
  };
  const uResp = await fetch(`${backend}/api/curr_user`, requestOps);
  const uRespData = await uResp.json();

  if (!uResp.ok) {
    alert("Error On The Server");
  } else {
    localStorage.setItem("casestudyuser", JSON.stringify(uRespData));
    getUserAccount();
    getNotifications();
    getUserLot(uRespData)
  }
}

export async function getUserAccount() {
  let user = JSON.parse(localStorage.getItem("casestudyuser"));
  // console.log(user?.id);
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(
    `${backend}/api/my_account/?user_id=${user?.id}`,
    requestOptions
  );
  const responseData = await response.json();

  if (!response.ok) {
    setErrorMessage(JSON.stringify(responseData.detail));
  } else {
    //   console.log(responseData);
    //   alert(responseData.name);
    localStorage.setItem("useraccount", JSON.stringify(responseData));
  }
}

export async function getNotifications() {
  const user = JSON.parse(localStorage.getItem("casestudyuser"));

  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(`${backend}/api/notifications/${user?.id}`, requestOptions);
  const responseData = await response.json();
  localStorage.setItem("usernotifications", JSON.stringify(responseData));
}

// export async function reserveLot(hours, bookStat) {
//   event.preventDefault();

  
//   const user = JSON.parse(localStorage.getItem("casestudyuser"));

//   const requestOptions = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       userid: user?.id,
//       hours,
//       immediate_booking: bookStat,
//     }),
//   };

//   const response = await fetch(`${backend}/api/book_parking`, requestOptions);

  

//   if (!response.ok) {
//     alert("Error Occured On The Server!");
//   } else {
//     getUser();
//     // getUserAccount();
//     // getNotifications();
//     window.location.href = "/main";
//   }
// }


export async function reserveLot(hours, bookStat) {
  // Ensure you are not calling preventDefault if no event is passed
  // event.preventDefault(); -- remove this line if no event is passed to the function

  const user = JSON.parse(localStorage.getItem("casestudyuser"));

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userid: user?.id,
      hours,
      immediate_booking: bookStat,
    }),
  };


  try {
    const response = await fetch(`${backend}/api/book_parking`, requestOptions);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData); // Log the error details for debugging
      alert("Error occurred on the server!");
    } else {
      getUser(); // Refresh the user data
      window.location.href = "/main"; // Navigate to the main page
    }
  } catch (error) {
    console.error("Network error:", error); // Handle network errors
    alert("Network error occurred! Please try again later.");
  }
}



export async function getUserLot(user) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    
  };

  const response = await fetch(`${backend}/api/my_parkinglot?userid=${user?.id}`, requestOptions);
  const responseData = await response.json();
  localStorage.setItem("userLot", JSON.stringify(responseData));
}