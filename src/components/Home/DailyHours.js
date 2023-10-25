import React from "react";
import "./DailyHours.css"

export default function DailyHours(props) {

    const dailyHours = props.dailyHours;

    const percentuageCalculator = (hours, minutes) => {
        const percentuage = Math.round((hours + minutes / 60) / 8 * 100)
        if (percentuage > 100) {
            return 100
        }
        return percentuage
    }


    return (
        <div className="dailyHoursContainer">
            <h3>Riepilogo Giornaliero</h3>
            {dailyHours.length === 0 && <p >Nella giornata odierna non sono ancora stati effettuati lavori</p>}
            {dailyHours.map((dailyHour, index) => (
                <div key={index} className="usersHoursContainer">
                    <p>{dailyHour.name} {dailyHour.surname}</p>
                    <div className="loadingContainer">
                        <div className="loadingBar" style={{ width: `${percentuageCalculator(dailyHour.hours, dailyHour.minutes)}%`}}></div>
                    </div>
                    <p>{dailyHour.hours}h e {dailyHour.minutes} min</p>
                </div>
            ))}
        </div>
    )

}