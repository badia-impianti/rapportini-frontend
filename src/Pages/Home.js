import React, { useEffect } from "react";

import { useState } from "react";
import {IoPerson, IoClipboard, IoPeople, IoCheckmark, IoResize, IoTime, IoMoon} from "react-icons/io5";
import { FaHashtag } from "react-icons/fa";
import { MdEdit, MdOutlineDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import "./Home.css";

import LoadingSpinner from "../components/LoadingSpinner";
import LoadingError from "../components/LoadingError";
import NavBar from "../components/NavBar";
import DailyHours from "../components/Home/DailyHours";
import {FaMoneyBillTransfer} from "react-icons/fa6";


const Home = () => {

    // Set navigatation bar title
    const navigate = useNavigate();

    const isMobile = window.innerWidth < 768;

    //Page state
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [errorType, setErrorType] = useState("")
    const [reports, setReports] = useState([]);
    const [dailyHours, setDailyHours] = useState([]);
    //Tutta sta vandalata per ottenere la data nel formato che vuole l'input col fuso italiano
    const [date, setDate] = useState(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().split('T')[0]);


    const dailyHoursRetriever = () => {
        fetch("https://backend.rapportini.badiasilvano.it/users/daily-hours/" + date, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setDailyHours(data.time);
                    });
                }
            })
            .catch((err) => {
                setErrorType("Network error");
                setLoadingError(true);
            });
    }

    const loadReports = () => {
        fetch("https://backend.rapportini.badiasilvano.it/works/" + date, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setReports(data);
                        setIsLoading(false);
                    });
                }
            })
            .catch((err) => {
                setErrorType("Network error");
                setLoadingError(true);
            }
            );
    }

    useEffect(() => {
        loadReports()
        dailyHoursRetriever()
    }, [date]);

    //Keep the prev date even if the user refreshes the page
    useEffect(() => {
        if (localStorage.getItem("date")) {
            setDate(localStorage.getItem("date"))
        }
    },[])


    const deleteReport = (report) => {
        if (window.confirm("Sei sicuro di voler eliminare il rapportino?")) {
            fetch("https://backend.rapportini.badiasilvano.it/works/" + report.id, {
                method: "DELETE",
                credentials: "include",
            })
                .then((res) => {
                    if (res.status === 200) {
                        res.json().then((data) => {
                            loadReports();
                        });
                    }
                    else if (res.status === 401) {
                        window.alert("Non sei autorizzato ad eliminare questo rapportino; Sono necessari i privilegi di amministratore")
                    }
                })
                .catch((err) => {
                    setLoadingError(true);
                });
        }
    }

    return (
        (loadingError) ? <LoadingError errorDescription={errorType}/> :
        (isLoading) ? <LoadingSpinner /> :
        <div className="mainContainer">
            <NavBar />

            <div className="datePickerContainer">
                <p>Seleziona la giornata</p>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value)
                        localStorage.setItem("date", e.target.value)
                    }}
                />
            </div>

            <DailyHours dailyHours={dailyHours} />
            <table hidden={isMobile}>
                <thead>
                    <tr>
                        <th><FaHashtag size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> ID</th>
                        <th><IoPerson size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Cliente</th>
                        <th><IoClipboard size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Descrizione</th>
                        <th><IoPeople size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Operatori</th>
                        <th><IoTime size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Ore</th>
                        <th><IoMoon size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Rep</th>
                        <th><IoCheckmark size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Condizione</th>
                        <th><FaMoneyBillTransfer size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} />Stato</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.id}>

                            <td><p className="table_elements">{report.id}</p></td>

                            <td>{report.customer}</td>
                            <td >{
                                //if description is too long, show only the first 150 characters and then a "..."
                                report.description.length > 150 ? <p>{report.description.substring(0, 150)}...</p> : <p>{report.description}</p>
                            }</td>
                            <td>
                                {report.labour.map((labour) => {
                                        let labourDate = new Date(labour.date)
                                        const offset = labourDate.getTimezoneOffset()
                                        labourDate = new Date(labourDate.getTime() - (offset*60*1000))
                                        if (labourDate.toISOString().split('T')[0] === date) {
                                            return labour.users.map((user) => {
                                                return <p key={user.id} className="table_elements">{user.name} {user.surname}</p>
                                            })
                                        }
                                    })
                                }
                            </td>
                            <td>
                                {report.labour.map((labour) => {

                                    //Tutta sta sbrodolata per rendere compatibili i due valori delle date
                                    let labourDate = new Date(labour.date)
                                    const offset = labourDate.getTimezoneOffset()
                                    labourDate = new Date(labourDate.getTime() - (offset*60*1000))
                                    if (labourDate.toISOString().split('T')[0] === date) {
                                        return labour.users.map((user) => {
                                            return <p key={user.id} className="table_elements">{user.hours}:{user.minutes}{user.minutes < 10 ? 0 : null}</p>
                                        })
                                    }
                                })}
                            </td>

                            <td>
                                <p className="table_elements">{report.oncall ? "Si" : "No"}</p>
                            </td>

                            <td>
                                {report.completed ? <div className="date" style={{ backgroundColor: "#d4f4cd", color: "#133213" }}>Completato</div>
                                    :
                                    <div className="date" style={{ backgroundColor: "#f4d4d4", color: "#331313" }}>In lavorazione</div>}
                            </td>

                            <td>
                                {report.processed ? <div className="date" style={{ backgroundColor: "#d4f4cd", color: "#133213" }}>Contabilizzato</div>
                                    :
                                <div className="date" style={{ backgroundColor: "#f4d4d4", color: "#331313" }}>Da contabilizzare</div>}
                            </td>

                            <td>
                                <IoResize color="grey" size={24} style={{ marginLeft: 10, cursor: "pointer" }} onClick={() => { navigate("/work/" + report.id) }} />
                                <MdEdit color="grey" size={24} style={{ marginLeft: 10, cursor: "pointer" }} onClick={() => { navigate("/edit/" + report.id) }} />
                                <MdOutlineDeleteForever color="grey" size={24} style={{ marginLeft: 10, cursor: "pointer" }} onClick={() => { deleteReport(report) }} />

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table hidden={!isMobile} style={{ paddingInline: 5}}>
                <thead>
                    <tr>
                        <th><FaHashtag size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> ID</th>
                        <th><IoPerson size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Cliente</th>
                        <th><IoCheckmark size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Condizione</th>
                        <th />
                    </tr>
                </thead>

                {isLoading && <LoadingSpinner />}
                {loadingError && <LoadingError />}
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.id}>
                            <td><p className="table_elements">{report.id}</p></td>
                            <td style={{ paddingInline: 3}}>{report.customer}</td>
                            <td style={{ paddingInline: 0}}>
                                {report.completed ? <div className="date" style={{ backgroundColor: "#d4f4cd", color: "#133213" }}>Completato</div>
                                    :
                                    <div className="date" style={{ backgroundColor: "#f4d4d4", color: "#331313" }}>In lavorazione</div>}
                            </td>
                            <td style={{ paddingInline: 0, paddingRight: 5}}>
                                <IoResize color="grey" size={24} style={{ marginLeft: 10, cursor: "pointer", margin: 5 }} onClick={() => { navigate("/work/" + report.id) }} />
                                <MdEdit color="grey" size={24} style={{ marginLeft: 10, cursor: "pointer", margin: 5 }} onClick={() => { navigate("/edit/" + report.id) }} />
                                <MdOutlineDeleteForever color="grey" size={24} style={{ marginLeft: 10, cursor: "pointer", margin: 5 }} onClick={() => { deleteReport(report) }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Home;