import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingError from "../components/LoadingError";
import {IoPerson, IoTime, IoBookmark} from "react-icons/io5";

import "./Work.css"

const Work = () => {

    const { id } = useParams();

    //Page state
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false)
    const [imagesUrls, setImagesUrls] = useState([{url:"", icon:""}]); //Array of strings [url1, url2, ...

    //Page data
    const [work, setWork] = useState({});


    //Retrive work details
    useEffect(() => {
        fetch("https://backend.rapportini.rainierihomecollection.it/work/" + id, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setWork(data);
                        setIsLoading(false);
                    });
                }
                else if (res.status === 404) {
                    setLoadingError(true)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        fetch("https://backend.rapportini.rainierihomecollection.it/works/" + id + "/images", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        console.log(imagesUrls)
                        setImagesUrls(data.images);
                        console.log(data)
                    });
                }
                else if (res.status === 404) {
                    setLoadingError(true)
                }
            })
    }, []);

    return (
        loadingError ? <LoadingError/> :
        isLoading ? <LoadingSpinner /> :
            <div className="mainContainer">
                <h1>Riepilogo per il lavoro n°{work.id}</h1>
                <div className="infoAndPhotosContainer">
                    <div className="infoContainer">
                        <p><IoPerson /> <b>{ work.customer } </b></p>
                        <p><IoTime/> <b>Iniziato:</b> { work.startTime } -  <IoTime /> <b>Terminato:</b> { work.completionTime }</p>
                        <p>{ work.description }</p>
                        <p><IoBookmark /> { work.note } </p>
                    </div>
                    <div className="photosContainer">
                        <img src={imagesUrls[0].url} alt={"Image"} className="mainImage"/>
                        <p>qui mettere foto piccole e selezionabili  (tipo amazon)</p>
                    </div>
                </div>

                <div className="materialsContainer">
                    <h2>Materiali utilizzati</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Unità</th>
                            <th>Quantità</th>
                        </tr>
                        </thead>
                        <tbody>
                        {work.materials.map((material) => (
                            <tr key={material.id}>
                                <td>{material.name}</td>
                                <td>{material.unit}</td>
                                <td>{material.quantity}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className={"materialsContainer"}>
                    <h2>Manodopera</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Data</th>
                            <th>Lavoratore</th>
                            <th>Ore</th>
                        </tr>
                        </thead>
                        <tbody>
                        {work.labour.map((labour) => (
                            <tr >
                                <td>{labour.date}</td>
                                <td>{labour.users.map((user) =>
                                    <p>{user.name} {user.surname} ha lavorato per {user.hours} ore e {user.minutes} minuti</p>
                                )}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
    );
}

export default Work;