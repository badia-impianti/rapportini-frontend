import React from "react";
import "./NavBar.css";
import { IoAdd, IoHome, IoSettings } from "react-icons/io5";
import { useNavigate } from "react-router-dom"

export default function NavBar() {

    const navigate = useNavigate();

    return (
        <div className="navbarContainer">
            <div className="navbarLogo">
            <h1 style={window.innerWidth < 500 ? 
                {fontSize: "1.5rem", margin: "0", padding: "0", cursor: "pointer"} : 
                {fontSize: "2rem", margin: "0", padding: "0", cursor: "pointer"}}
                onClick={() => navigate("/home")
            }>Rapportini</h1>
            </div>
            <div className="navbarLinks">
                <a className="links" href="/home"><IoHome size={24} color="#257cff" /></a>
                <a className="links" href="/add"><IoAdd size={24} color="#257cff" /></a>
                <a className="links" href="/settings"><IoSettings size={24} color="#257cff" /></a>
            </div>
        </div>
    );
}