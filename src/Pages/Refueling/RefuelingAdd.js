import NavBar from "../../components/NavBar";
import React, {useEffect, useState} from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import LoadingError from "../../components/LoadingError";

import "./RefuelingAdd.css"
import {useNavigate} from "react-router-dom";

const RefuelingAdd = (props) => {

    const navigate = useNavigate()

    //Error declaration
    const [loadingError, setLoadingError] = useState(false)
    const [errorType, setErrorType] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [loadingMessage, setLoadingMessage] = useState("")

    let refueling = {}

    const [vehicles, setVehicles] = useState()


    const saveRefueling = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("https://backend.rapportini.badiasilvano.it/refueling/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(refueling)
            })

            console.log(response)

            if (response.status !== 200) {
                setErrorType("Impossibile salvare il rifornimento")
                setLoadingError(true)
            }

            navigate("/home")

        } catch (e) {
            setErrorType("Impossibile salvare il rifornimento")
            setLoadingError(true)
        }
    }

    const getVehicles = async () => {
        try {
            const response = await fetch("https://backend.rapportini.badiasilvano.it/vehicles", {
                method: "GET",
                credentials: "include",
            })

            if (response.status !== 200) {
                setErrorType("Impossibile scaricare la lista dei veicoli")
                setLoadingError(true)
            }

            const data = await response.json()
            setVehicles(data.vehicles)
            setIsLoading(false)
        } catch (e) {
            setErrorType("Impossibile scaricare la lista dei veicoli")
            setLoadingError(true)
        }
    }

    useEffect(() => {
        getVehicles()
    }, [])

    return (
        loadingError ? <LoadingError errorDescription={errorType} /> :
        isLoading ? <LoadingSpinner message={loadingMessage}/> :
        <div className="mainContainer refuelingAdd">
            <NavBar />
            <h1>Aggiungi Rifornimento</h1>
            <form>
                <select name="id"  className="form__field" placeholder="Veicolo" required
                        defaultValue={""}
                        value={refueling.vehicleId}
                        onChange={(e) => {
                            refueling.vehicleId = e.target.value
                        }}
                >
                    {vehicles.map((vehicle) => {
                        return <option value={vehicle.id}>{vehicle.name}</option>
                    })}
                </select>
                <div className="form__group" >
                    <input type="number" className="form__field" placeholder="Kilometri" id="kmInput" required
                           onChange={e => refueling.km = e.target.value}
                           value={refueling.km}
                    />
                    <label htmlFor="kmInput" className="form__label">Kilometri</label>
                </div>
                <div className="form__group" >
                    <input type="number" inputMode="decimal" className="form__field" placeholder="Litri" id="lInput" required
                           onChange={e => refueling.l = e.target.value}
                           value={refueling.l}
                    />
                    <label htmlFor="lInput" className="form__label">Litri immessi</label>
                </div>
                <button className="button" style={{ margin: "30px" }} onClick={saveRefueling}>
                    Salva
                </button>
            </form>
        </div>
    )
}

export default RefuelingAdd