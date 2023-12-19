import NavBar from "../../components/NavBar";

import "./Refueling.css"
import {useEffect, useState} from "react";
import LoadingError from "../../components/LoadingError";
import LoadingSpinner from "../../components/LoadingSpinner";
import {IoResize, IoTrash} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {BsFuelPump} from "react-icons/bs";
import toHtmlInputDate from "../../components/functions/toHtmlInputDate";
import Avgs from "../../components/Refueling/Avgs";

const Refueling = (props) => {

    const navigate = useNavigate()
    const [isMobile] = useState(window.innerWidth < 768)

    const [loadingError, setLoadingError] = useState(false)
    const [errorType, setErrorType] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [loadingMessage, setLoadingMessage] = useState()
    const [refueling, setRefueling] = useState({})

    const [endDate, setEndDate] = useState(new Date())
    const [startDate, setStartDate] = useState(new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1))
    const [avgs, setAvgs] = useState({})
    const [showDetail, setShowDetail] = useState([])

    const refuelingRetriever = async () => {

        try {
            //Convert to ISO String
            const response = await fetch("https://backend.rapportini.badiasilvano.it/refueling?start=" + startDate.toISOString() + "&end=" + endDate.toISOString(), {
                method: "GET",
                credentials: "include",
            })

            const data = await response.json()

            if (response.status !== 200) {
                setErrorType(data.message)
                setLoadingError(true)
                return
            }

            data.refueling.forEach((refueling, index) => {
                const updatedShowDetail = showDetail
                updatedShowDetail[index] = false
                setShowDetail(updatedShowDetail)
            })

            setRefueling(data.refueling)
            setIsLoading(false)

        } catch (e) {
            setErrorType(e.message)
            setLoadingError(true)
        }
    }

    const deleteRefueling = (id) => async () => {

        //Confirm the delete
        if (!window.confirm("Sei sicuro di voler eliminare il rifornimento?")) {
            return
        }

        try {
            const response = await fetch("https://backend.rapportini.badiasilvano.it/refueling/" + id, {
                method: "DELETE",
                credentials: "include",
            })

            if (response.status !== 200) {

                const data = await response.json()

                setErrorType(data.message)
                setLoadingError(true)
                return
            }

            //delete from the array
            setRefueling(refueling.filter((refueling) => refueling.id !== id))

        } catch (e) {
            setErrorType(e.message)
            setLoadingError(true)
        }

    }

    const vehicleAvgCalculator = () => {

        let avgPerVehicles = {}

        /*
            If the first refuel, add with 0 km and save the totalL
            Else, if the vehicle is already in the array, add the totalL and calculate the totalKm with the difference between the current and the last refuel
         */
        for (let i = 0; i < refueling.length; i++) {
            if (avgPerVehicles[refueling[i].vehicleName] === undefined) {
                avgPerVehicles[refueling[i].vehicleName] = {
                    totalL: 0,
                    totalKm: 0
                }
            }
            else {
                avgPerVehicles[refueling[i].vehicleName].totalL += refueling.findLast((refuel) => refuel.vehicleName === refueling[i].vehicleName && refueling.indexOf(refuel) < i).l
                avgPerVehicles[refueling[i].vehicleName].totalKm += refueling[i].km - refueling.findLast((refuel) => refuel.vehicleName === refueling[i].vehicleName && refueling.indexOf(refuel) < i).km
            }
        }

        setAvgs(avgPerVehicles)
    }

    useEffect(() => {
        refuelingRetriever()
    }, [startDate, endDate]);

    useEffect(() => {
        vehicleAvgCalculator()
    }, [refueling])

    return(
      loadingError ? <LoadingError errorDescription={errorType} /> :
      isLoading ? <LoadingSpinner message={loadingMessage}/> :
          <div  className="mainContainer refueling">

              <h1>Funzionalità Rimossa</h1>
              <p>Si prega di evadere il rifornimento mediante i metodi tradizionali</p>
              <div hidden={true}>
              {/*div to hide all temporarily*/}
              <NavBar/>

              <h1>Rifornimenti</h1>
              <button className="button" onClick={() => navigate("/refueling/add")}><BsFuelPump/>&nbsp;&nbsp;Rifornisci
              </button>
              <div className="dashboardContainer">
                  <div className="datePickerContainer">
                      <p>Periodo</p>
                      <input type="date"
                             value={toHtmlInputDate(startDate)}
                             onChange={(e) => setStartDate(new Date(e.target.value))}
                      />
                      <input type="date"
                             value={toHtmlInputDate(endDate)}
                             onChange={(e) => setEndDate(new Date(e.target.value))}
                      />
                  </div>
                  <div className="totalContainer">
                      <h2>Totale</h2>
                      <h3>{refueling.reduce((total, refueling) => total + refueling.l, 0).toFixed(1)}L</h3>
                  </div>
              </div>

              <Avgs avgs={avgs}/>

              <div hidden={isMobile}>
                  <table className="table">
                      <thead>
                      <tr>
                          <th>Veicolo</th>
                          <th>Km</th>
                          <th>Litri</th>
                          <th>Timestamp</th>
                          <th></th>
                          {/*Empty th for the delete and edit button*/}
                      </tr>
                      </thead>
                      <tbody>
                      {refueling.map((refueling) => (
                          <tr key={refueling.id}>
                              <td><p className="table_elements">{refueling.vehicleName}</p></td>
                              <td><p className="table_elements">{refueling.km}</p></td>
                              <td><p className="table_elements">{refueling.l}</p></td>
                              <td><p className="table_elements">{new Date(refueling.timestamp).toLocaleString('IT-it', {
                                  timeZone: "Europe/Rome",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                              })}</p></td>
                              <td>
                                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                      <IoTrash color="grey" size={24} style={{marginLeft: 10, cursor: "pointer"}}
                                               onClick={
                                                   deleteRefueling(refueling.id)
                                               }/>
                                  </div>
                              </td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
              </div>

              <div hidden={!isMobile}>
                  <table className="table">
                        <thead>
                        <tr>
                            <th>Veicolo</th>
                            <th>Timestamp</th>
                            <th></th>
                            {/*Empty th for the delete and edit button*/}
                        </tr>
                        </thead>
                        {refueling.map((refueling, index) => (
                            <tbody key={refueling.id}>
                                <tr>
                                    <td style={{ borderBottom: showDetail[index] ? "none": "1px solid #ddd" }}><p className="table_elements">{refueling.vehicleName}</p></td>
                                    <td style={{ borderBottom: showDetail[index] ? "none": "1px solid #ddd" }}><p className="table_elements">{new Date(refueling.timestamp).toLocaleString('IT-it', {
                                        timeZone: "Europe/Rome",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}</p></td>
                                    <td style={{ paddingInline: 0, paddingRight: 5, borderBottom: showDetail[index] ? "none": "1px solid #ddd"}}>
                                        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                            <IoResize color="grey" size={24} style={{marginLeft: 10, cursor: "pointer"}}
                                                      onClick={() => {
                                                          setShowDetail(showDetail.map((show, i) => i === index ? !show : show))
                                                      }}/>
                                            <IoTrash color="grey" size={24} style={{marginLeft: 10, cursor: "pointer"}}
                                                     onClick={
                                                         deleteRefueling(refueling.id)
                                                     }/>
                                        </div>
                                    </td>
                                </tr>
                                <tr hidden={!showDetail[index]}>
                                    <td colSpan={3}>
                                        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                            <p className="table_elements">Km: {refueling.km}</p>
                                            <p className="table_elements">Litri: {refueling.l}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                </table>
              </div>
              </div>

          </div>
    )
}

export default Refueling;