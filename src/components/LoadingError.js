import {IoWarning} from "react-icons/io5";
import "./LoadingError.css"
import {useState} from "react";

export default function LoadingError(props) {

    return (
        <div className="errorMessageContainer">
            <IoWarning size={50}/>
            <p> Si è verificato un errore. Provare a ricaricare la pagina.</p>
            {(props.errorDescription) && <p>{props.errorDescription}</p>}
        </div>
    );
}