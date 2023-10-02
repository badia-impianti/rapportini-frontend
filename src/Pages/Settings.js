import NavBar from "../components/NavBar";
import { IoLogOutOutline } from "react-icons/io5";

const Settings = () => {

    const logout = () => {
        fetch("https://backend.rapportini.rainierihomecollection.it/logout", {
            method: "GET",
            credentials: "include",
        }).then((res) => {
            if (res.status === 200) {
                window.location.href = "/login"
            }
            else {
                window.alert("Errore durante il logout")
            }
        })
    }

    return (
        <div className="mainContainer">
            <NavBar />
            <h1>Settings</h1>
            <button className="deleteButton" style={{marginTop: "100px"}} onClick={logout}>
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