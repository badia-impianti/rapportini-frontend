import React from "react";
import "./NavBar.css";
import {IoAddOutline, IoHomeOutline, IoSearchOutline, IoSettingsOutline} from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom"

export default function NavBar() {

    const navigate = useNavigate();
    const isMobile = window.innerWidth < 500;

    return (
        <div className="navbarContainer">
            <div className="navbarLogo">
            <h1 style={{fontSize: "2rem", margin: "0", padding: "0", cursor: "pointer"}}
                onClick={() => navigate("/home")
            }>Rapportini</h1>
            </div>
            <div className="navbarLinks" style={isMobile ? {marginRight: 30, width: "40%"} : null}>
                <Link to="/home" className="links"><IoHomeOutline size={24} color="#257cff" /></Link>
                <Link to="/search" className="links"><IoSearchOutline size={24} color="#257cff" /></Link>
                <Link to="/settings" className="links"><IoSettingsOutline size={24} color="#257cff" /></Link>
                <Link to="/add" className="button links" style={{ minWidth: 0, margin: "unset", padding: "10px 15px"}}><IoAddOutline size={24} color="#ffff" /></Link>
            </div>
        </div>
    );
}