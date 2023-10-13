import NavBar from "../components/NavBar";
import { IoLogOutOutline } from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import preval from 'preval.macro'
import LoadingError from "../components/LoadingError";
import {useState} from "react";

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

    const buildDateTime = preval`module.exports = new Date().toISOString();`
    const actualYear = new Date().getFullYear();

    return (
        loadingError ? <LoadingError errorDescription={errorDescription} /> :
        <div className="mainContainer" style={{ width: "100%" }}>
            <NavBar />
            <h1>Settings</h1>
            <button className="deleteButton" style={{ marginTop: "100px" }}  onClick={logout}>
                    <IoLogOutOutline size={24} />
                    &nbsp;
                    Logout
            </button>

            <footer>
                <p>© {actualYear} Badia Silvano</p>
                {(window.innerWidth > 767) && "\xa0\xa0|\xa0\xa0"}
                <p>Actual build: {buildDateTime}</p>
            </footer>
        </div>
    )
}

export default Settings