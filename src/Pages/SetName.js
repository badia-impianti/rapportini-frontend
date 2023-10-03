import "./SetName.css";
import LoadingError from "../components/LoadingError";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const SetName = (name) => {

    const [userName, setUserName] = useState("");
    const [userSurname, setUserSurname] = useState("");

    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const sendName = (e) => {
        e.preventDefault();
        fetch("https://backend.rapportini.badiasilvano.it/users/name", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                name: userName,
                surname: userSurname
            })
            }).then((res) => {
                //Set Sutname
                if (res.status === 200) {
                    navigate("/home")
                }
                else {
                    setError(true)
                }
        })

    }

    return (
        error ? <LoadingError /> :
        <div className="mainContainer">
            <h1>Inserisci il tuo nome</h1>
            <form className="insertNameForm" onSubmit={sendName}>
                <input id="name" type="text" placeholder="Nome" onChange={e => setUserName(e.target.value)} />
                <input id="surname" type="text" placeholder="Cognome" onChange={e=> setUserSurname(e.target.value)} />
                <input type="submit" value="Invia" />
            </form>
        </div>
    )
}

export default SetName;