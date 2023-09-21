import React from "react";
import { useState } from "react";
import { IoPerson, IoCalendar, IoClipboard, IoBulb, IoPeople } from "react-icons/io5";


const Home = () => {
 console.log("Home");
    const reports = [
        {
            date: "01/01/2021",
            customer: "Mario Rossi",
            description: "La luce non funziona",
            material: ["Lampadina", "Cavo"],
            workers: ["Mario Bianchi", "Luigi Verdi"],
            vehicles: ["Ducato", "Camioncino"],
        },
        {
            date: "02/01/2021",
            customer: "Mario Rossi",
            description: "La luce non funziona",
            material: ["Lampadina", "Cavo"],
            workers: ["Mario Bianchi", "Luigi Verdi"],
            vehicles: ["Ducato", "Camioncino"],
        },
        {
            date: "03/01/2021",
            customer: "Mario Rossi",
            description: "La luce non funziona, quindi bisogna cambiare la lampadina e il cavo",
            material: ["Lampadina", "Cavo"],
            workers: ["Mario Bianchi", "Luigi Verdi"],
            vehicles: ["Ducato", "Camioncino"],
        },
        {
            date: "04/01/2021",
            customer: "Mario Rossi",
            description: "La luce non funziona",
            material: ["Lampadina", "Cavo"],
            workers: ["Mario Bianchi", "Luigi Verdi"],
            vehicles: ["Ducato", "Camioncino"],
        },
        {
            date: "05/01/2021",
            customer: "Mario Rossi",
            description: "La luce non funziona",
            material: ["Lampadina", "Cavo"],
            workers: ["Mario Bianchi", "Luigi Verdi"],
            vehicles: ["Ducato", "Camioncino"],
        },
        {
            date: "06/01/2021",
            customer: "Mario Rossi",
            description: "La luce non funziona",
            material: ["Lampadina", "Cavo"],
            workers: ["Mario Bianchi", "Luigi Verdi"],
            vehicles: ["Ducato", "Camioncino"],
        },
        {
            date: "07/01/2021",
            customer: "Mario Rossi",
            description: "La luce non funziona",
            material: ["Lampadina", "Cavo"],
            workers: ["Mario Bianchi", "Luigi Verdi"],
            vehicles: ["Ducato", "Camioncino"],
        },
        {
            date: "08/01/2021",
            customer: "Mario Rossi",
            description: "La luce non funziona",
            material: ["Lampadina", "Cavo"],
            workers: ["Mario Bianchi", "Luigi Verdi"],
            vehicles: ["Ducato", "Camioncino"],
        },
        {
            date: "09/01/2021",
            customer: "Mario Rossi",
            description: "La luce non funziona",
            material: ["Lampadina", "Cavo"],
            workers: ["Mario Bianchi", "Luigi Verdi"],
            vehicles: ["Ducato", "Camioncino"],
        }
    ]

    const [selectedReport, setSelectedReport] = useState(reports[0]);

    return (
        <div>
        <h1>Home</h1>
        <table>
        <thead>
                <tr>
                    <th><IoCalendar size={20} style={{verticalAlign: "bottom", marginRight: "4px"}}/> Data</th>
                    <th><IoPerson size={20} style={{verticalAlign: "bottom", marginRight: "4px"}}/> Cliente</th>
                    <th><IoClipboard size={20} style={{verticalAlign: "bottom", marginRight: "4px"}}/> Descrizione</th>
                    <th><IoPeople size={20} style={{verticalAlign: "bottom", marginRight: "4px"}}/> Operatori</th>
                    <th><IoBulb size={20} style={{verticalAlign: "bottom", marginRight: "4px"}}/> Materiali</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {reports.map((report) => (
                    <tr>
                        <td><p className="date">{report.date}</p></td>
                        <td>{report.customer}</td>
                        <td>{report.description}</td>
                        <td>{report.workers.map
                            ((worker) => (
                                <p className="table_elements">{worker}</p>
                            ))}
                        </td>
                        <td>{report.material.map
                            ((material) => (
                                <p className="table_elements">{material}</p>
                            ))}
                        </td>
                        <td>
                            <button className="button">Espandi</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
    }

export default Home;