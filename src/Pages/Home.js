import React, { useEffect } from "react";

import { useState } from "react";
import { IoPerson, IoCalendar, IoClipboard, IoBulb, IoPeople, IoCheckmark, IoResize } from "react-icons/io5";
import { MdEdit, MdOutlineDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import "./Home.css";

import LoadingSpinner from "../components/LoadingSpinner";
import LoadingError from "../components/LoadingError";
import NavBar from "../components/NavBar";


const Home = () => {

    // Set navigatation bar title
    const navigate = useNavigate();

    const isMobile = window.innerWidth < 768;

    //Page state
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [errorType, setErrorType] = useState("")

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reports, setReports] = useState([]);
    const [dailyHours, setDailyHours] = useState([]);

    const dailyHoursRetriever = () => {
        fetch("https://backend.rapportini.badiasilvano.it/users/daily-hours", {
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

    const userRetriver = (labour) => {
        let users = []

        labour.forEach((labour) => {
            labour.users.forEach((user) => {
                if (!users.some(e => e.name === user.name && e.surname === user.surname)) {
                    users.push({name: user.name, surname: user.surname})
                }
            })
        })
        if (users.length > 3) {
            const returnUsers = users.splice(0, 3)
            returnUsers.push({name: "...", surname: ""})
            return returnUsers
        }
        return users
    }

    const loadReports = () => {
        setIsLoading(true);
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

    const percentuageCalculator = (hours, minutes) => {
        const percentuage = Math.round((hours + minutes / 60) / 8 * 100)
        console.log("Il vezzo ha lavorato per " + hours + " ore e " + minutes +  " totalizzando una percentuale di " + percentuage + "%" )
        if (percentuage > 100) {
            return 100
        }
        return percentuage
    }

    return (
        (loadingError) ? <LoadingError errorDescription={errorType}/> :
        (isLoading) ? <LoadingSpinner /> :
        <div className="mainContainer">
            <NavBar />
            <div className="dailyHoursContainer">
                <h3>Riepilogo Giornaliero</h3>
                {dailyHours.length === 0 && <p >Nella giornata odierna non sono ancora stati effettuati lavori</p>}
                {dailyHours.map((dailyHour) => (
                    <div className="usersHoursContainer">
                        <p>{dailyHour.name} {dailyHour.surname}</p>
                        <div className="loadingContainer">
                            <div className="loadingBar" style={{ width: `${percentuageCalculator(dailyHour.hours, dailyHour.minutes)}%`}}></div>
                        </div>
                        <p>{dailyHour.hours}h e {dailyHour.minutes} min</p>
                    </div>
                ))}
            </div>

            <div className="datePickerContainer">
                <p>Seleziona la giornata</p>
                <input
                    type="date"
                    className="form__field"
                    style={{color: "white"}}
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value)
                        localStorage.setItem("date", e.target.value)
                    }}
                />
            </div>

            <table hidden={isMobile}>
                <thead>
                    <tr>
                        <th><IoCalendar size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Data</th>
                        <th><IoPerson size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Cliente</th>
                        <th><IoClipboard size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Descrizione</th>
                        <th><IoPeople size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Operatori</th>
                        <th><IoBulb size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Materiali</th>
                        <th><IoCheckmark size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Stato</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr>
                            <td><p className="date">{
                                // turn sql date into dd/mm/yyyy
                                report.labour[0] && new Date(report.labour[0].date).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            }</p></td>
                            <td>{report.customer}</td>
                            <td >{
                                
                                //if description is too long, show only the first 150 characters and then a "..."
                                report.description.length > 150 ? <p>{report.description.substring(0, 150)}...</p> : <p>{report.description}</p>
                            }</td>
                            <td>{
                                // if there are more than 3 users, show only the first 3 and then a "..."
                                userRetriver(report.labour).map((user) => {
                                    return <p className="table_elements">{user.name} {user.surname}</p>
                                })
                            }
                            </td>
                            <td>{report.materials.map
                                ((material) => {
                                    // if there are more than 3 materials, show only the first 3 and then a "..."
                                    if (report.materials.indexOf(material) < 3) {
                                        return <p className="table_elements">{material.quantity} {material.unit === "n" ? "x" : material.unit} {material.name}</p>
                                    } else if (report.materials.indexOf(material) === 3) {
                                        return <p className="table_elements">...</p>
                                    }
                                })}
                            </td>
                            <td>
                                {report.completed ? <div className="date" style={{ backgroundColor: "#d4f4cd", color: "#133213" }}>Completato</div>
                                    :
                                    <div className="date" style={{ backgroundColor: "#f4d4d4", color: "#331313" }}>In lavorazione</div>}
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
                        <th><IoCalendar size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Data</th>
                        <th><IoPerson size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Cliente</th>
                        <th><IoCheckmark size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Stato</th>
                        <th />
                    </tr>
                </thead>

                {isLoading && <LoadingSpinner />}
                {loadingError && <LoadingError />}
                <tbody>
                    {reports.map((report) => (
                        <tr>
                            <td style={{ paddingInline: 0}}><p className="date">{
                                // turn sql date into dd/mm/yyyy
                                report.labour[0] && new Date(report.labour[0].date).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            }</p></td>
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