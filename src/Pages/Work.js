import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    IoPerson,
    IoTime,
    IoBookmark,
    IoMoon,
    IoTrashBin,
    IoPrint,
    IoArchive,
    IoCloudDownloadOutline
} from "react-icons/io5";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingError from "../components/LoadingError";

import JSZip from 'jszip';
import saveAs from 'file-saver';



import "./Work.css"
import NavBar from "../components/NavBar";

const Work = () => {

    const { id } = useParams();

    //Page state
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false)
    const [errorType, setErrorType] = useState("");
    const [imagesUrls, setImagesUrls] = useState([]); //Array of strings [url1, url2, ...
    const navigate = useNavigate();

    //Page data
    const [work, setWork] = useState({});


    //Retrive work details
    useEffect(() => {
        fetch("https://backend.rapportini.badiasilvano.it/work/" + id, {
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
                    setErrorType("Lavoro non trovato")
                    setLoadingError(true)
                }
            })
            .catch((err) => {
                setErrorType(err.message)
                setLoadingError(true)
            });
    }, []);

    useEffect(() => {
        fetch("https://backend.rapportini.badiasilvano.it/works/" + id + "/images", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setImagesUrls(data.images);
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

        fetch("https://backend.rapportini.badiasilvano.it/works/" + id, {
            method: "DELETE",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 200) {
                    navigate("/")
                }
                else if (res.status === 401) {
                    window.alert("Non sei atorizzato ad eliminare questo rapportino; Sono necessari i privilegi di amministratore")
                }
                else {
                    setLoadingError(true)
                }
            })
            .catch((err) => {
                setErrorType(err.message)
                setLoadingError(true)
            });
    }

    const setAsProcessed = () => {
        setIsLoading(true)
        fetch("https://backend.rapportini.badiasilvano.it/works/" + id + "/processed", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ processed: 1 }),
        }).then((res) => {
            if (res.status === 200) {
                navigate("/")
            } else {
                setIsLoading(false)
                window.alert("Non disponi dei privilegi per compiere questa azione")
            }
        }).catch((err) => {
            setErrorType("Network error")
            setLoadingError(true)
        })
    }

    const downloadImagesZip = async () => {

        setIsLoading(true)
        const zip = new JSZip();

        for (let i = 0; i < imagesUrls.length; i++) {
            const response = await fetch(imagesUrls[i].url, {
                method: "GET",
                credentials: "include",
            });
            const blob = await response.blob();

            //Add file to zip
            await zip.file(work.id + "-" + i +".jpeg", blob);
        }

        const archive = await zip.generateAsync({type:"blob"})
        saveAs (archive, "Immagini del lavoro " + work.id + ".zip")
        setIsLoading(false)
    }

    return (
        loadingError ? <LoadingError errorDescription={errorType} /> :
        isLoading ? <LoadingSpinner /> :
            <div className="mainContainer">
                <NavBar />
                <h1>Riepilogo per il lavoro n°{work.id}</h1>
                <div className="infoAndPhotosContainer">
                    <div className="infoContainer">
                        <div className="statusContainer">

                            {work.completed ?
                                <div className="statusIndicator green" >Completato</div>
                                :
                                <div className="statusIndicator red" >In lavorazione</div>
                            }

                            {work.processed ?
                                <div className="statusIndicator green" >Contabilizzato</div>
                                :
                                <div className="statusIndicator red" >Da contabilizzare</div>
                            }

                        </div>

                        <p><IoPerson /> <b>{work.customer} </b></p>
                        <p><IoTime /> <b>Iniziato:</b> {work.labour[0] && new Date(work.labour[0].date).toLocaleDateString()} -
                            &nbsp;<IoTime /> <b>Terminato:</b> {work.labour[0] && new Date(work.labour[work.labour.length - 1].date).toLocaleDateString()}</p>
                        <p><IoMoon /> <b>Reperibile</b> {(work.oncall) ? "Si" : "No" }</p>
                        <p>{work.description}</p>
                        <p><IoBookmark /> {work.note} </p>
                    </div>
                    {(imagesUrls.length > 0) &&
                        <div className="photosContainer">
                            {imagesUrls.map((image) => (
                                <img
                                    src={image.url}
                                    alt="Immagine relativa al lavoro"
                                    className="images"
                                    onClick={() => window.open(image.url, "_blank")}
                                />
                            ))}
                        </div>}
                </div>

                <div className="tableContainer">
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

                <div className="tableContainer">
                    <h2>Veicoli utilizzati</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Nome</th>
                                <th>Targa</th>
                                <th>Ore</th>
                            </tr>
                        </thead>
                        <tbody>
                            {work.labour.map((labour) => (
                                (labour.vehicles.length > 0) ?
                                <tr >
                                    <td>
                                        <div className="date">{new Date(labour.date).toLocaleDateString()}</div>
                                    </td>
                                    <td>{labour.vehicles.map((vehicle) =>
                                        <p>{vehicle.name} </p>
                                    )}
                                    </td>
                                    <td>{labour.vehicles.map((vehicle) =>
                                        <p>{vehicle.plate} </p>
                                    )}
                                    </td>
                                    <td>{labour.vehicles.map((vehicle) =>
                                        <p>{vehicle.hours}:{(vehicle.minutes < 10) ? "0"+vehicle.minutes : vehicle.minutes} </p>
                                    )}
                                    </td>
                                </tr>
                                    :
                                    ""
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={"tableContainer"}>
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
                                        <p>{user.hours}:{(user.minutes < 10) ? "0"+user.minutes : user.minutes} </p>
                                    )}
                                        <b>{labour.totalHours}:{(labour.totalMinutes < 10) ? "0"+labour.totalMinutes:labour.totalMinutes}</b>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td></td>
                                <td><b>Totale:</b></td>
                                <td><b>{work.totalHours}:{(work.totalMinutes < 10) ? "0"+work.totalMinutes:work.totalMinutes}</b></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="buttonContainer">
                    <button className="deleteButton" onClick={deleteWork}>
                        <IoTrashBin size={24}/>
                        &nbsp;
                        Elimina
                    </button>
                    <button className="button" onClick={() => window.print()}>
                        <IoPrint size={24}/>
                        &nbsp;
                        Stampa
                    </button>
                    <button className="button" onClick={setAsProcessed}>
                        <IoArchive size={24}/>
                        &nbsp;
                        Contabilizza
                    </button>
                    {(imagesUrls.length > 0) &&
                        <button className={"button"}
                                onClick={downloadImagesZip}>
                            <IoCloudDownloadOutline size={24}/>
                            &nbsp;
                            Immagini
                        </button>
                    }

                </div>
            </div>

    );
}

export default Work;