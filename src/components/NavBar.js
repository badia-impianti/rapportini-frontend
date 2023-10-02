import React from "react";
import "./NavBar.css";
import { IoAdd, IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom"

export default function NavBar() {

    const navigate = useNavigate();

    return (
        <div className="navbarContainer">
            <div className="navbarLogo">
               <p>Rapportini</p>
            </div>
            <div className="navbarLinks">
                <a className="links" href="/home"><IoHomeOutline size={24} /></a>
                <a className="links" href="/add"><IoAdd size={24} /></a>
                <a className="links" href="/home"><IoSettingsOutline size={24} /></a>
            </div>
        </div>
    );
}