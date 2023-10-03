import React from "react";
import "./NavBar.css";
import { IoAddOutline, IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom"

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
                <Link to="/home" className="links"><IoHomeOutline size={24} color="#257cff" /></Link>
                <Link to="/add" className="links"><IoAddOutline size={24} color="#257cff" /></Link>
                <Link to="/settings" className="links"><IoSettingsOutline size={24} color="#257cff" /></Link>
            </div>
        </div>
    );
}