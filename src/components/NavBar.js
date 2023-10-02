import React from "react";
import "./NavBar.css";
import { IoAdd, IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom"

export default function NavBar() {

    const navigate = useNavigate();

    return (
        <div className="navbarContainer">
            <div className="navbarLogo">
               <p>Rapportini</p>
            </div>
            <div className="navbarLinks">
                <Link to={"/home"} className="links"><IoHomeOutline size={24} /></Link>
                <Link to={"/add"} className="links"><IoAdd size={24} /></Link>
                <Link to={"/settings"} className="links"><IoSettingsOutline size={24} /></Link>
            </div>
        </div>
    );
}