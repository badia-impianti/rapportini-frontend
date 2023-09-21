import React from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {

    const navigate = useNavigate();

    fetch('https://backend.rapportini.rainierihomecollection.it/whoami', {
        method: 'GET',
        credentials: 'include',
    })
        .then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    navigate("/home");
                });}
            else if (res.status === 401) {
                navigate("/login");
            }
        })
        .catch((err) => {
            console.log("Error: ", err);
        });
    return (
        <div>
        <h1>Splash</h1>
        </div>
    );
    }

export default Splash;