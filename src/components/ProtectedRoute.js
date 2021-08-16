import React from "react";
import { Redirect, Route } from "react-router";

const ProtectedRoute = (props) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        if (props.path === "/login") {
            return <Redirect to="/" />;
        }
        return <Route {...props} />;
    } else {
        return <Redirect to={'/login?continue=' + props.path} />;
    }
};

export default ProtectedRoute;