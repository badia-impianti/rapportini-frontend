import React from "react";
import { useAuth } from "./useAuth"
import { Navigate, Outlet, useLocation } from "react-router-dom";


const RequireAuth = ({ allowedRole, children }) => {
    const { auth } = useAuth();
    const location = useLocation();

    if (!auth) {
        return <Navigate to="/login" />;
    }

    /*if (allowedRole === "admin" && auth.isAdmin !== 1) {
        return <div>Accesso negato</div>;
    }*/

    return <Outlet />;
}

export default RequireAuth;