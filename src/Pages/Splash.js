import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingError from "../components/LoadingError";

const Splash = () => {

    const [loadingError, setLoadingError] = useState(false);
    const navigate = useNavigate();

    fetch('https://backend.rapportini.rainierihomecollection.it/whoami', {
        method: 'GET',
        credentials: 'include',
    })
        .then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    navigate("/home");
                });}
            else if (res.status === 401) {
                navigate("/login");
            }
        })
        .catch((err) => {
            setLoadingError(true);
        });

    return (
        loadingError ? <LoadingError /> : <LoadingSpinner />
    );
    }

export default Splash;