import NavBar from "../../components/NavBar";

import "./Refueling.css"
import {useEffect, useState} from "react";
import LoadingError from "../../components/LoadingError";
import LoadingSpinner from "../../components/LoadingSpinner";
import {MdEdit, MdOutlineDeleteForever} from "react-icons/md";

const Refueling = (props) => {

    const [loadingError, setLoadingError] = useState(false)
    const [errorType, setErrorType] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [loadingMessage, setLoadingMessage] = useState("")
    const [refueling, setRefueling] = useState()

    const refuelingRetriever = async () => {

        try {

            const response = await fetch("https://backend.rapportini.badiasilvano.it/refueling?start=01/01/2023&end=01/01/2024", {
                method: "GET",
                credentials: "include",
            })

            const data = await response.json()

            if (response.status !== 200) {
                setErrorType(data.message)
                setLoadingError(true)
                return
            }

            setRefueling(data.refueling)
            setIsLoading(false)


        } catch (e) {
            setErrorType(e.message)
            setLoadingError(true)
        }
    }

    useEffect(() => {
        refuelingRetriever()
    }, []);

    return(
      loadingError ? <LoadingError errorDescription={errorType} /> :
      isLoading ? <LoadingSpinner message={loadingMessage}/> :
      <div className="mainContainer refueling">
        <NavBar />
        <h1>Rifornimenti</h1>
          <div className="tableAndTankContainer">
            <table className="table">
                <thead>
                    <tr>
                    <th>Veicolo</th>
                    <th>Km</th>
                    <th>Litri</th>
                    <th>Timestamp</th>
                    <th></th> {/*Empty th for the delete and edit button*/}
                    </tr>
                </thead>
                <tbody>
                    {refueling.map((refueling) => (
                        <tr key={refueling.id}>
                            <td><p className="table_elements">{refueling.vehicleName}</p></td>
                            <td><p className="table_elements">{refueling.km}</p></td>
                            <td><p className="table_elements">{refueling.l}</p></td>
                            <td><p className="table_elements">{new Date(refueling.timestamp).toLocaleString('IT-it', {timeZone: "Europe/Rome", day: "numeric", month: "long", year: "numeric"})}</p></td>
                            <td>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <MdEdit color="grey" size={24} style={{ marginLeft: 10, cursor: "pointer" }} onClick={}  />
                                    <MdOutlineDeleteForever color="grey" size={24} style={{ marginLeft: 10, cursor: "pointer" }} onClick={} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>
    )
}

export default Refueling;