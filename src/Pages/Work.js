import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingError from "../components/LoadingError";

import "./Work.css"

const Work = () => {

    const { id } = useParams();

    //Page state
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false)

    //Page data
    const [work, setWork] = useState({});


    //Retrive work details
    useEffect(() => {
        fetch("https://backend.rapportini.rainierihomecollection.it/work/" + id, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setWork(data);
                        setIsLoading(false);
                    });
                }
                else if (res.status === 404) {
                    setLoadingError(true)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        loadingError ? <LoadingError errorDescription={"Il rapporto è stato cancellato o non è stato trovato"} /> :
        isLoading ? <LoadingSpinner /> :
            <div className="mainContainer">
                <h1>Riepilogo per il lavoro n°{work.id}</h1>
                <h2>Ecco di seguito alcune informazioni generali</h2>
                <ul>
                    <li>
                        description: {work.description}
                    </li>

                </ul>
            </div>
    );
}

export default Work;