import {useState} from "react";
import "./NavBar.css";

import 'react-modern-drawer/dist/index.css'
import Drawer from 'react-modern-drawer'

import {
    IoAddCircle,
    IoHomeOutline,
    IoMenu,
    IoSearchOutline,
    IoSettingsOutline
} from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom"

export default function NavBar() {

    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false)
    const toggleIsOpen = () => {
        setIsOpen((prevState) => !prevState)
    }

    return (
        <div className="navbarContainer">

            <button className="mobileLinks" onClick={toggleIsOpen}><IoMenu size={24} color="#257cff"/></button>

            <div className="logo">
                <h1 style={{fontSize: "2rem"}}
                    onClick={() => navigate("/home")
                }>Rapportini</h1>
            </div>

            <div className="navbarLinks">
                <Link to="/home" ><IoHomeOutline size={24} color="#257cff" /></Link>
                <Link to="/search"><IoSearchOutline size={24} color="#257cff" /></Link>
                <Link to="/settings"><IoSettingsOutline size={24} color="#257cff" /></Link>
                <Link to="/add"><IoAddCircle size={30} color="#257cff" /></Link>
            </div>

            <Link to="/add" className="mobileLinks"><IoAddCircle size={30} color="#257cff" /></Link>

            <Drawer
                open={isOpen}
                onClose={toggleIsOpen}
                direction='left'
                size={300}
                enableOverlay={true}
            >
                <div className="drawerContainer">
                    <h1>Rapportini</h1>
                    <Link to="/home" className="drawerButton"><IoHomeOutline size={24} color="#257cff" />&nbsp;&nbsp;&nbsp;Home</Link>
                    <Link to="/search" className="drawerButton"><IoSearchOutline size={24} color="#257cff" />&nbsp;&nbsp;&nbsp;Cerca</Link>
                    <Link to="/settings" className="drawerButton"><IoSettingsOutline size={24} color="#257cff" />&nbsp;&nbsp;&nbsp;Impostazioni</Link>
                    <Link to="/add" className="drawerButton"><IoAddCircle size={24} color="#257cff" />&nbsp;&nbsp;&nbsp;Aggiungi</Link>
                </div>

            </Drawer>
        </div>
    );
}