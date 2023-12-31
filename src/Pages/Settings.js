import NavBar from "../components/NavBar";
import { IoLogOutOutline, IoRefresh } from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import preval from 'preval.macro'
import LoadingError from "../components/LoadingError";
import {useState} from "react";

import "./Settings.css";

const Settings = () => {

    const navigate = useNavigate();
    const [loadingError, setLoadingError] = useState(false);
    const [errorDescription, setErrorDescription] = useState("");


    const logout = () => {
        fetch("https://backend.rapportini.badiasilvano.it/logout", {
            method: "GET",
            credentials: "include",
        }).then((res) => {
            if (res.status === 200) {
                navigate("/")
            }
            else {
                setLoadingError(true);
                res.json().then((data) => {
                    setErrorDescription(data.message);
                })
            }
        })
            .catch((err) => {
                setErrorDescription("Network error");
                setLoadingError(true);
            })
    }

    //convert to ISO string to italy build time
    const buildDateTime = preval`module.exports = new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });`;
    const actualYear = new Date().getFullYear();

    return (
        loadingError ? <LoadingError errorDescription={errorDescription} /> :
        <div className="mainContainer" style={{ width: "100%" }}>
            <NavBar />
            <h1>Settings</h1>

            <div className="listContainer">
                <button className="button" onClick={() => window.location.reload()}>
                    <IoRefresh size={24} />
                    &nbsp;
                    Aggiorna
                </button>
                <button className="delete button" onClick={logout}>
                        <IoLogOutOutline size={24} />
                        &nbsp;
                        Logout
                </button>
            </div>

            <footer>
                <p>© {actualYear} Badia Silvano</p>
                {(window.innerWidth > 767) && "\xa0\xa0|\xa0\xa0"}
                <p>Actual build: {buildDateTime}</p>
            </footer>
        </div>
    )
}

export default Settings