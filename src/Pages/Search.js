import NavBar from "../components/NavBar";
import SearchBox from "../components/Search/SearchBox";
import {useEffect, useState} from "react";
import WorksTable from "../components/Search/WorksTable";
import LoadingError from "../components/LoadingError";
import LoadingSpinner from "../components/LoadingSpinner";

const Search = () => {

    //Const pages values
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [errorType, setErrorType] = useState();

    // Search values
    const [client, setClient] = useState("")
    const [start, setStart] = useState(new Date().toISOString().split('T')[0])
    const [end, setEnd] = useState(new Date().toISOString().split('T')[0])
    const [processed, setProcessed] = useState(false)

    const searchValues = {client, start, end, processed}
    const setSearchValues = {setClient, setStart, setEnd, setProcessed}

    //Works values
    const [reports, setReports] = useState()

    const loadReports = () => {

        setIsLoading(true)
        let url = "https://backend.rapportini.badiasilvano.it/works/search?customer=" + client + "&start=" + start + "&end=" + end + "&processed="
        url += (processed) ? "1" : "0"

        fetch(url, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setReports(data.works);
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
        loadReports();
    }, [client, start, end, processed])



    return (
        loadingError ? <LoadingError errorDescription={errorType} /> :
        <div className="mainContainer">
            <NavBar />
            <SearchBox values={searchValues} setValues={setSearchValues} />
            {isLoading ? <LoadingSpinner /> :
            <WorksTable reports={reports} />}
        </div>
    )
}

export default Search