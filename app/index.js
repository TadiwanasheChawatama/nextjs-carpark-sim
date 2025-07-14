import React from "react";
import { ReactDOM } from "react";
import Home from "./page";

import { UserProvider } from "@/components/servers/context/userContext";

const HomePage = () => (
    <UserProvider>
        <Home />
    </UserProvider>
)

export default Home;