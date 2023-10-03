import React, { useEffect } from "react";
import { useState } from "react";
import { IoPerson, IoCalendar, IoClipboard, IoBulb, IoPeople, IoCheckmark, IoChevronForward, IoChevronBack, IoResize } from "react-icons/io5";
import { MdEdit, MdOutlineDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
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

    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1);

    const [reports, setReports] = useState([]);


    useEffect(() => {
        fetch("https://backend.rapportini.badiasilvano.it/works/count", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setPageCount(Math.ceil(data.works / 10));
                    });
                }
            })
            .catch((err) => {
                setLoadingError(true);
            });
    }, []);

    useEffect(() => {
        loadReports();
    }, [pageNumber]);

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
        fetch("https://backend.rapportini.badiasilvano.it/works/" + pageNumber, {
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
                setLoadingError(true);
            }
            );
    }

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
                        window.alert("Non sei atorizzato ad eliminare questo rapportino; Sono necessari i privilegi di amministratore")
                    }
                })
                .catch((err) => {
                    setLoadingError(true);
                });
        }
    }

    return (
        (loadingError) ? <LoadingError /> :
        (isLoading) ? <LoadingSpinner /> :
        <div className="mainContainer">
            <NavBar />
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
            <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="button" style={pageNumber <= 0 ?
                    { marginInline: 15, marginTop: 5, marginBottom: 10, width: 100, minWidth: 0, opacity: 0.5 }
                    :
                    { marginInline: 15, marginTop: 5, marginBottom: 10, width: 100, minWidth: 0 }}
                    onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 0 ? true : false}><IoChevronBack size={24} /></button>
                <p style={{ fontWeight: "bold" }}>{pageNumber + 1}/{pageCount}</p>
                <button className="button" style={pageNumber >= pageCount - 1 ?
                    { marginInline: 15, marginTop: 5, marginBottom: 10, width: 100, minWidth: 0, opacity: 0.5 }
                    :
                    { marginInline: 15, marginTop: 5, marginBottom: 10, width: 100, minWidth: 0 }}
                    onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= pageCount - 1 ? true : false} ><IoChevronForward size={24} /></button>
            </div>
        </div>
    );
}

export default Home;