import "../index.css";
import React from "react";

const Notification = ({ message }) => {
    if (!message) return null;

    return (
        <div className="notification">
            <p>{message}</p>
        </div>
    );
};

export default Notification;
