import NavBar from "../components/NavBar";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

const NewEdit = () => {

    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [errorType, setErrorType] = useState("");

    const [work, setWork] = useState()

    const workRetrieved = async () => {

        try {
            const response = await fetch("https://backend.rapportini.badiasilvano.it/work/" + id, {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 200) {
                setWork(await response.json());
            }
        } catch (err) {
            setErrorType("Network error - Nel dettaglio: " + err);
            setLoadingError(true);
        }
    }

    useEffect(() => {
        workRetrieved().then();
    }, []);


    return (
        <div className="mainContainer">
            <NavBar />
            <h1>Modifica Rapportino n°{id}</h1>
            <div className="generalInfoContainer">
                <label>Cliente</label>
                <input  />
            </div>

        </div>
    )
}

export default NewEdit