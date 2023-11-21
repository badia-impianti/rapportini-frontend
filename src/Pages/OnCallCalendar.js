import NavBar from "../components/NavBar";
import Calendar from "../components/OnCallCalendar/Calendar";

import "./OnCallCalendar.css";

const OnCallCalendar = () => {

    return (
        <div className="mainContainer">
            <NavBar />
            <div className="onCallCalendar infoContainer">
                <Calendar />
            </div>

        </div>

    )
}

export default OnCallCalendar