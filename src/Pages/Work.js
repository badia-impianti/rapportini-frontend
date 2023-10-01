import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingError from "../components/LoadingError";
import { IoPerson, IoTime, IoBookmark } from "react-icons/io5";

import "./Work.css"

const Work = () => {

    const { id } = useParams();

    //Page state
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false)
    const [imagesUrls, setImagesUrls] = useState([]); //Array of strings [url1, url2, ...

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

                        //Calcolo totali giornalieri
                        data.labour.forEach((labour) => {
                            labour.totalHours = labour.users.reduce((acc, curr) => acc + curr.hours, 0);
                            labour.totalMinutes = labour.users.reduce((acc, curr) => acc + curr.minutes, 0);
                            labour.totalHours += Math.floor(labour.totalMinutes / 60);
                            labour.totalMinutes = labour.totalMinutes % 60;
                        })

                        //Calcolo totale complessivo
                        data.totalHours = data.labour.reduce((acc, curr) => acc + curr.totalHours, 0);
                        data.totalMinutes = data.labour.reduce((acc, curr) => acc + curr.totalMinutes, 0);
                        data.totalHours += Math.floor(data.totalMinutes / 60);
                        data.totalMinutes = data.totalMinutes % 60;

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
                else if (res.status !== 404) {
                    setLoadingError(true)
                }
            })
    }, []);

    const deleteWork = () => {
        const confirm = window.confirm("Sei sicuro di voler eliminare il rapportino?");
        if (!confirm) return;

        fetch("https://backend.rapportini.rainierihomecollection.it/works/" + id, {
            method: "DELETE",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    window.location.href = "/works";
                }
                else if (res.status === 401) {
                    window.alert("Non sei atorizzato ad eliminare questo rapportino; Sono necessari i privilegi di amministratore")
                }
                else {
                    setLoadingError(true)
                }
            })
            .catch((err) => {
                setLoadingError(true)
            });
    }

    return (
        loadingError ? <LoadingError /> :
            isLoading ? <LoadingSpinner /> :
                <div className="mainContainer">
                    <h1>Riepilogo per il lavoro n°{work.id}</h1>
                    <div className="infoAndPhotosContainer">
                        <div className="infoContainer">
                            <p><IoPerson /> <b>{work.customer} </b></p>
                            <p><IoTime /> <b>Iniziato:</b> {new Date(work.labour[0].date).toLocaleDateString()} -  <IoTime /> <b>Terminato:</b> {new Date(work.labour[work.labour.length - 1].date).toLocaleDateString()}</p>
                            <p>{work.description}</p>
                            <p><IoBookmark /> {work.note} </p>
                        </div>
                        <div className="photosContainer">
                            {imagesUrls.map((image) => (
                                <img src={image.url} alt="Nessuna Immagine" className="images" />
                                ))}
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
                                        <td>
                                            <div className="date">{new Date(labour.date).toLocaleDateString()}</div>
                                        </td>
                                        <td>{labour.users.map((user) =>
                                            <p>{user.name} {user.surname} </p>
                                        )}
                                            <b>Totale Giornaliero:</b>
                                        </td>
                                        <td>{labour.users.map((user) =>
                                            <p>{user.hours}:{user.minutes} </p>
                                        )}
                                            <b>{labour.totalHours}:{labour.totalMinutes}</b>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td></td>
                                    <td><b>Totale:</b></td>
                                    <td><b>{work.totalHours}:{work.totalMinutes}</b></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button className="deleteButton" style={{marginTop: "100px"}} onClick={deleteWork}>Elimina</button>
                </div>
    );
}

export default Work;