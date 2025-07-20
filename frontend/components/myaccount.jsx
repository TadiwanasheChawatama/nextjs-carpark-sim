import { useEffect, useState } from "react";
import backend from "./servers/backend";
import { revalidatePath } from "next/cache";
import { getUserAccount } from "./servers/actions/serverActions";

const MyAccount = () => {
//   const [userAccount, setUserAccount] = useState(null);

//   const usersAccount = async () => {
//     const requestOptions = {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     };

//     const response = await fetch(
//       `${backend}/api/my_account/?user_id=${id}`,
//       requestOptions
//     );
//     const responseData = await response.json();

//     if (!response.ok) {
//       setErrorMessage(JSON.stringify(responseData.detail));
//     } else {
//       console.log(responseData);
//       //   alert(responseData.name);
//       localStorage.setItem("useraccount", JSON.stringify(responseData));
//     }
//   };
//   usersAccount();

//   useEffect(() => {
//     const storedUserData = localStorage.getItem("useraccount");
//     if (storedUserData) {
//       const parsedUserData = JSON.parse(storedUserData);
//       setUserAccount(parsedUserData);
//     } else {
//       fetchUserAccount();
//     }
//   }, []);

    getUserAccount()
    const userAccount = JSON.parse(localStorage.getItem("useraccount"))
  const account = userAccount?.[0];

  return (
      <h1 className='w-auto'>Account Balance: ${account?.balance} </h1>
  );
};

export default MyAccount;
