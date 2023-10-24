import {FaHashtag} from "react-icons/fa";
import {IoCalendar, IoCheckmark, IoClipboard, IoPerson, IoResize} from "react-icons/io5";
import {FaMoneyBillTransfer} from "react-icons/fa6";
import {MdEdit, MdOutlineDeleteForever} from "react-icons/md";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function WorksTable({reports}) {

    const deleteReport = (report) => {
        if (window.confirm("Sei sicuro di voler eliminare il rapportino?")) {
            fetch("https://backend.rapportini.badiasilvano.it/works/" + report.id, {
                method: "DELETE",
                credentials: "include",
            })
                .then((res) => {
                    if (res.status === 200) {
                        window.alert("Rapportino eliminato con successo")
                    }
                    else if (res.status === 401) {
                        window.alert("Non sei autorizzato ad eliminare questo rapportino; Sono necessari i privilegi di amministratore")
                    }
                })
        }
    }

    const [isMobile ] = React.useState(window.innerWidth < 768);

    const navigate = useNavigate();

    return (
        <div>

            <table hidden={isMobile}>
                <thead>
                <tr>
                    <th><FaHashtag size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> ID</th>
                    <th><IoCalendar size={20} style={{verticalAlign: "bottom", marginRight: "4px"}} /> Data Iniziale</th>
                    <th><IoPerson size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Cliente</th>
                    <th><IoClipboard size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Descrizione</th>
                    <th><IoCheckmark size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} /> Condizione</th>
                    <th><FaMoneyBillTransfer size={20} style={{ verticalAlign: "bottom", marginRight: "4px" }} />Stato</th>
                    <th />
                </tr>
                </thead>
                <tbody>
                {reports.map((report) => (
                    <tr>

                        <td><p className="table_elements">{report.id}</p></td>

                        <td><p className="table_elements">{new Date(report.date).toLocaleDateString('it-IT')}</p></td>

                        <td>{report.customer}</td>
                        <td >{
                            //if description is too long, show only the first 150 characters and then a "..."
                            report.description.length > 150 ? <p>{report.description.substring(0, 150)}...</p> : <p>{report.description}</p>
                        }</td>

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

                <tbody>
                {reports.map((report) => (
                    <tr style={ report.processed ? { backgroundColor: "#ffffff" } : null}>
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
    )
}