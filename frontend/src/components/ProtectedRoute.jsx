// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function ProtectedRoute({ allowedRoles = [] }) {
    const { token, user } = useStateContext();

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles.length === 0) {
        return <Outlet />;
    }

    const roleId = String(user?.role_id ?? "");
    if (!allowedRoles.map(String).includes(roleId)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}