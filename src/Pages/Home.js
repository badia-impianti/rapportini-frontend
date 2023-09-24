import React, { useEffect } from "react";
import { useState } from "react";
import { IoPerson, IoCalendar, IoClipboard, IoBulb, IoPeople, IoCheckmark, IoChevronForward, IoChevronBack, IoChevronDown, IoTrashBin, IoPencil, } from "react-icons/io5";
import { MdEdit, MdOutlineDeleteForever } from "react-icons/md";

const Home = () => {

    const [pageNumber, setPageNumber] = useState(0);
    const [pageCount, setPageCount] = useState(1);

    const [reports, setReports] = useState([]);

    const [selectedReport, setSelectedReport] = useState({});


    useEffect(() => {
        fetch("https://backend.rapportini.rainierihomecollection.it/works/count", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        console.log(data);
                        setPageCount(Math.ceil(data.works / 10));
                    });
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    }, []);

    useEffect(() => {
        fetch("https://backend.rapportini.rainierihomecollection.it/works/" + pageNumber, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        console.log(data);
                        setReports(data);
                    });
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    }, [pageNumber]);

    return (
        <div>
            <h1>Home</h1>
            <table>
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
                        <tr style={selectedReport === report ? { height: 500, transition: "height 0.5s ease-in-out" } : { height: 50, transition: "height 0.5s ease-in-out" }}>
                            <td><p className="date">{
                                // turn sql date into dd/mm/yyyy
                                new Date(report.completionTime).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            }</p></td>
                            <td hidden={selectedReport === report}>{report.customer}</td>
                            <td colSpan={selectedReport == report ? 5 : 1} >{selectedReport === report ? <div>
                                <div style={{ position: "relative" }}>
                                    {report.completed ? <div className="date" style={{ backgroundColor: "#d4f4cd", color: "#133213", position: "absolute", right: 50 }}>Completato</div>
                                        :
                                        <div className="date" style={{ backgroundColor: "#f4d4d4", color: "#331313", position: "absolute", right: 50 }}>In lavorazione</div>
                                    }
                                    <h2 style={{ marginTop: 10, marginBottom: 20 }}>{report.customer}</h2>
                                </div>
                                <p>{report.description}</p>
                                <table style={{ width: "100%" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ borderBottom: "0px", fontWeight: "bold" }}>Materiali</td>
                                            {report.materials.map((material) => (
                                                <td style={{ borderBottom: "0px" }}><p className="table_elements">{material.quantity} {material.unit === "n" ? "x" : material.unit} {material.name}</p></td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ borderBottom: "0px", fontWeight: "bold" }}>Operatori</td>
                                            {report.labour.map((worker) => (
                                                <td style={{ borderBottom: "0px" }}><p className="table_elements">{worker.name} {worker.surname}</p></td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td style={{ borderBottom: "0px", fontWeight: "bold" }}>Mezzi</td>
                                            {report.vehicle.map((vehicle) => (
                                                <td style={{ borderBottom: "0px" }}><p className="table_elements">{vehicle.name}-{vehicle.plate}</p></td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                                <p>{report.note}</p>
                            </div>
                                : report.description}</td>
                            <td hidden={selectedReport === report}>{report.labour.map
                                ((worker) => (
                                    <p className="table_elements">{worker.name} {worker.surname}</p>
                                ))}
                            </td>
                            <td hidden={selectedReport === report}>{report.materials.map
                                ((material) => (
                                    <p className="table_elements">{material.name}</p>
                                ))}
                            </td>
                            <td hidden={selectedReport === report}>
                                {report.completed ? <div className="date" style={{ backgroundColor: "#d4f4cd", color: "#133213" }}>Completato</div>
                                    :
                                    <div className="date" style={{ backgroundColor: "#f4d4d4", color: "#331313" }}>In lavorazione</div>}
                            </td>
                            <td>
                                <IoChevronDown color={"grey"} size={24} style={selectedReport === report ? {
                                    transform: "rotate(180deg)",
                                    transition: "transform 0.5s ease-in-out",
                                    cursor: "pointer"
                                } : {
                                    transform: "rotate(0deg)",
                                    transition: "transform 0.5s ease-in-out",
                                    cursor: "pointer"
                                }} 
                                onClick={() => {
                                    if (selectedReport === report) {
                                        setSelectedReport({});
                                    } else {
                                        setSelectedReport(report);
                                    }
                                }
                                } />

                                <MdEdit color="grey" size={24} style={{ marginLeft: 10, cursor: "pointer" }} onClick={() => { console.log("edit") }} />
                                <MdOutlineDeleteForever color="grey" size={24} style={{ marginLeft: 10, cursor: "pointer" }} onClick={() => { console.log("delete") }} />

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