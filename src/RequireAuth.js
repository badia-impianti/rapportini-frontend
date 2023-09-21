import React from "react";
import { useAuth } from "./useAuth"


const RequireAuth = ({ allowedRole, children }) => {
    const { auth } = useAuth();

    if (auth.isAdmin == 1) {
        return children;
    } else {
        return <div>Not Authorized</div>
    }
}

export default RequireAuth;