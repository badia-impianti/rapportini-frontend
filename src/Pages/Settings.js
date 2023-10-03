import NavBar from "../components/NavBar";
import { IoLogOutOutline } from "react-icons/io5";
import {useNavigate} from "react-router-dom";

const Settings = () => {

    const navigate = useNavigate();

    const logout = () => {
        fetch("https://backend.rapportini.badiasilvano.it/logout", {
            method: "GET",
            credentials: "include",
        }).then((res) => {
            if (res.status === 200) {
                navigate("/")
            }
            else {
                window.alert("Errore durante il logout")
            }
        })
    }

    return (
        <div className="mainContainer" style={{ width: "100%" }}>
            <NavBar />
            <h1>Settings</h1>
            <button className="deleteButton" style={{marginTop: "100px"}}  onClick={logout}>
                <div style={{display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <IoLogOutOutline size={24} />
                    Logout
                </div>
            </button>
        </div>
    );
}

export default Settings;