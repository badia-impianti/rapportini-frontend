import "./Avgs.css"
import React from "react";


const Avgs = ({ avgs }) => {

    const percentuageCalculator = (kml) => {

        if (isNaN(kml)) {
            return 0
        }

        const percentuage = Math.round(kml / 20 * 100)
        if (percentuage > 100) {
            return 100
        }
        return percentuage
    }

        return (
            <div className="avgsComponentContainer">
                {Object.keys(avgs).map((vehicle) => (
                    <div key={vehicle} className="usersHoursContainer">
                        <p>{vehicle}</p>
                        <div className="loadingContainer">
                            <div className="loadingBar"
                                 style={{width: `${percentuageCalculator(avgs[vehicle].totalKm / avgs[vehicle].totalL).toFixed(1)}%`,
                                        backgroundColor: (percentuageCalculator(avgs[vehicle].totalKm / avgs[vehicle].totalL).toFixed(1) > 60) ? "#62C370" : "#CC3363"}}></div>
                            </div>
                        <p>{(avgs[vehicle].totalKm / avgs[vehicle].totalL) ? (avgs[vehicle].totalKm / avgs[vehicle].totalL).toFixed(1) + " km/l" : "Dati insufficienti"}</p>
                    </div>
                ))}
            </div>
        )
}

export default Avgs