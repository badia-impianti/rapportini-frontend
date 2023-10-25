import React from "react";
import "./SearchBox.css";
import {
    IoCloseCircleOutline,
} from "react-icons/io5";

export default function SearchBox({values, setValues}) {

    return (
        <div className="searchBoxContainer">

            <div className="elementFilter">
                <p>Cliente</p>
                <input
                    type="text"
                    value={values.client}
                    onChange={(e) => {
                        setValues.setClient(e.target.value)
                        localStorage.setItem("client", e.target.value)
                    }}
                />
            </div>

            <div className="elementFilter">
                <p>Da</p>
                <input
                    type="date"
                    value={values.start}
                    onChange={(e) => {
                        setValues.setStart(e.target.value)
                        localStorage.setItem("start", e.target.value)
                    }}
                />
            </div>

            <div className="elementFilter" >
                <p>A</p>
                <input
                    type="date"
                    value={values.end}
                    onChange={(e) => {
                        setValues.setEnd(e.target.value)
                        localStorage.setItem("end", e.target.value)
                    }}
                />
            </div>

            <div className="elementFilter">
                <p>Contabilizzato</p>
                <input
                    type="checkbox"
                    style={{width: "20px", height: "20px", outline: "none"}}
                    checked={values.processed}
                    onChange={(e) => {
                        setValues.setProcessed(!values.processed)
                        console.log("checkbox value: " + values.processed)
                        localStorage.setItem("processed", (values.processed) ? "1" : "0")
                        console.log("checkbox value: " + localStorage.getItem("processed"))
                    }}
                />
            </div>

            <div className="elementFilter">
                <p></p>
                <button className="clearSearchButton" onClick={() => {
                    setValues.setClient("")
                    setValues.setStart(new Date().toISOString("2023-10-01").split('T')[0])
                    setValues.setEnd(new Date().toISOString().split('T')[0])
                    setValues.setProcessed("0")

                    localStorage.removeItem("client")
                    localStorage.removeItem("start")
                    localStorage.removeItem("end")
                    localStorage.removeItem("processed")

                }}><IoCloseCircleOutline color="#ffffff"/> </button>
            </div>

        </div>
    )
}