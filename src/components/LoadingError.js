import {IoWarning} from "react-icons/io5";
import "./LoadingError.css"

export default function LoadingError() {


    return (
        <div className="errorMessageContainer">
            <IoWarning size={50}/>
            <p>Si è verificato un errore nel caricamento dei dati. Provare a ricaricare la pagina</p>
        </div>
    );
}