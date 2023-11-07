import React, {useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import NavBar from "../components/NavBar";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingError from "../components/LoadingError";
import "./Edit.css"
import inputFieldChecker from "../functions/inputFieldChecker";



const Edit = () => {

    const { id } = useParams();

    //Navigation
    const navigate = useNavigate();
    const [isMobile] = useState(window.innerWidth < 767);

    //Page state
    const [loadingError, setLoadingError] = React.useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [errorType, setErrorType] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    //Page data
    const [customer, setCustomer] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [notes, setNotes] = React.useState("");
    const [completed, setCompleted] = React.useState(false);
    const [onCall, setOnCall] = React.useState(false);
    const [loadedImages, setLoadedImages] = React.useState([]);
    const [newImages, setNewImages] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [materials, setMaterials] = React.useState([{ name: "", quantity: "", unit: "n" }]);
    const [labour, setLabour] = React.useState([{ date: "", users: [{ id: "", name: "", surname: "", hours: 0, minutes: 0 }], vehicles: [{ id: "", name: "", plate: "" }] }]);


    useEffect(() => {
        fetch("https://backend.rapportini.badiasilvano.it/work/" + id, {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        setCustomer(data.customer);
                        setDescription(data.description);
                        setNotes(data.note);
                        setCompleted(data.completed === 1);
                        setOnCall(data.oncall === 1);
                        setMaterials(data.materials);
                        //make labour dates readable
                        data.labour.forEach((val) => {
                            val.date = new Date(val.date).toISOString().split('T')[0]
                        })
                        setLabour(data.labour);
                    });
                }
                else if (response.status === 404) {
                    setLoadingError(true)
                }
            })
            .catch((err) => {
                setErrorType("Network error")
                setLoadingError(true)
            });



        fetch("https://backend.rapportini.badiasilvano.it/users", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        setUsers(data.users);
                    });
                }
            })
            .catch((err) => {
                setErrorType("Network error")
                setLoadingError(true);
            });

        fetch("https://backend.rapportini.badiasilvano.it/vehicles", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        setVehicles(data.vehicles);
                    });
                }
            })
            .catch((err) => {
                setErrorType("Network error")
                setLoadingError(true);
            });

        fetch("https://backend.rapportini.badiasilvano.it/works/" + id + "/images", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        setLoadedImages(data.images);
                    });
                }
            })
            .catch((err) => {
                setErrorType("Network error")
                setLoadingError(true);
            });

    }, []);

    useEffect(() => {
        if (users.length > 0 && vehicles.length > 0) {
            setIsLoading(false);
        }
    }, [users, vehicles]);

    useEffect(() => {
        //if labour is empty, add a new empty labour
        if (labour.length === 0) {
            setLabour([{ date: "", users: [], vehicles: [] }]);
        }

        // if last worker of any labour is filled, add a new empty worker
        labour.forEach((val, idx) => {
            if (val.users.length === 0) {
                let newLabour = [...labour]
                newLabour[idx].users.push({ id: "", name: "", surname: "", hours: 0, minutes: 0 })
                setLabour(newLabour)
            }
            else if (val.users[val.users.length - 1].id !== "" && val.users[val.users.length - 1].hours !== "" && val.users[val.users.length - 1].minutes !== "") {
                let newLabour = [...labour]
                newLabour[idx].users.push({ id: "", name: "", surname: "", hours: 0, minutes: 0 })
                setLabour(newLabour)
            }
        })
        // if last vehicle of any labour is filled, add a new empty vehicle
        labour.forEach((val, idx) => {
            if (val.vehicles.length === 0) {
                let newLabour = [...labour]
                newLabour[idx].vehicles.push({ id: "", name: "", plate: "", hours: 0, minutes: 0 })
                setLabour(newLabour)
            }
            else if (val.vehicles[val.vehicles.length - 1].id !== "") {
                let newLabour = [...labour]
                newLabour[idx].vehicles.push({ id: "", name: "", plate: "", hours: 0, minutes: 0 })
                setLabour(newLabour)
            }
        })
    }, [labour]);

    useEffect(() => {
        //if last material is filled, add a new empty material
        if (materials.length === 0) {
            setMaterials([{ name: "", quantity: "", unit: "n", checked: 0 }]);
        }
        else if (materials[materials.length - 1].name !== "" && materials[materials.length - 1].quantity !== "" && materials[materials.length - 1].unit !== "") {
            setMaterials([...materials, { name: "", quantity: "", unit: "n", checked: 0 }]);
        }
    }, [materials]);

    const save = async (e) => {


        // meaning that the default action that belongs to the event will not occur.
        // In this case do not send as a normal www-form-urlencoded form, but as a json with fetch
        e.preventDefault();

        const inputField = {
            customer: customer,
            description: description,
            notes: notes,
            completed: completed,
            oncall: onCall,
            materials: materials,
            labour: labour,
            vehicles: vehicles,
        }

        let validatedInput

        try {
            validatedInput = inputFieldChecker(inputField)
        } catch (error) {
            alert("Errore nel salvataggio del rapportino: nel dettaglio " + error.message)
            return
        }

        console.log(validatedInput)

        setIsLoading(true)


        try {
            const response = await fetch("https://backend.rapportini.badiasilvano.it/works/" + id, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(validatedInput),
            })

            if (response.status === 200) {
                await uploadImages(id);
                if (!loadingError) navigate("/home");
            } else {
                setErrorType("Errore nel salvataggio del rapportino. Nel dettaglio " + response.message)
                setLoadingError(true)
            }
        } catch (err) {
            setErrorType("Errore di connessione; Nel dettaglio " + err.message)
            setLoadingError(true)
        }
    }

    const uploadImages = async (workId) => {

        try {

            for (const image of newImages) {

                setLoadingMessage("Caricamento immagine " + (newImages.indexOf(image) + 1) + " di " + newImages.length)

                let formData = new FormData();
                formData.append("photo", image);
                const response = await fetch("https://backend.rapportini.badiasilvano.it/works/" + workId + "/images", {
                    method: "POST",
                    credentials: "include",
                    body: formData
                })
                if (response.status !== 200) {
                    setErrorType("Errore nel caricamento di una immagine. Nel dettaglio " + response.message)
                    setLoadingError(true)
                }

            }
        } catch (err) {
            setErrorType("Errore di connessione; Nel dettaglio " + err.message)
            setLoadingError(true)
        }
    }

    const deleteImage = (image) => {
        // Take the name from the url, removing the .format
        let name = image.url.split("/").pop().split(".")[0]
        fetch("https://backend.rapportini.badiasilvano.it/works/" + id + "/images/" + name, {
            method: "DELETE",
            credentials: "include",
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        let newImages = [...loadedImages]
                        // Remove current row
                        newImages.splice(newImages.indexOf(image), 1)
                        setLoadedImages(newImages)
                    });
                }
            })
            .catch((err) => {
                setErrorType("Network error")
                setLoadingError(true)
            });
    }

    return (
        loadingError ? <LoadingError errorDescription={errorType} /> :
            isLoading ? <LoadingSpinner message={loadingMessage}/> :
                <div className="mainContainer">
                    <NavBar />
                    <h1>Rapporto N° {id}</h1>
                    <form style={{ width: "100%", maxWidth: "600px" }}>
                        <div className="form__group" >
                            <input type="text" className="form__field" placeholder="Cliente" id="CustomerInput"
                                onChange={e => setCustomer(e.target.value)}
                                value={customer}
                            />
                            <label htmlFor="customerInput" className="form__label">Cliente</label>
                        </div>
                        <div className="form__group" >
                            <textarea className="form__field" placeholder="Descrizione" name="description" id='description' required
                                onChange={e => setDescription(e.target.value)}
                                value={description}
                            />
                            <label className="form__label">Descrizione</label>
                        </div>
                        <div className="form__group">
                            <textarea className="form__field" placeholder="Note" name="notes" id='notes' required
                                onChange={e => setNotes(e.target.value)}
                                value={notes}
                            />
                            <label className="form__label">Note</label>
                        </div>
                        <div style={{ margin: "30px" }} >
                            <input type="checkbox" onChange={e => setOnCall(e.target.checked)} checked={onCall} />
                            <label>Reperibilità</label>
                        </div>
                        <div style={{ margin: "30px" }}>
                            <input type="checkbox" onChange={e => setCompleted(e.target.checked)} checked={completed} />
                            <label>Completato</label>
                        </div>

                        <button className="completedButton">Completato</button>

                        <div>
                            <h2>Immagini</h2>
                            <div className="imageContainer">
                                {
                                    loadedImages.map((image) => {
                                        return (
                                            <div key={image.icon} style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: 10 }}>
                                                <img src={image.icon} className="image"  alt="Scatto del lavoro"/>
                                                <IoClose color={"grey"} size={24} style={{ cursor: "pointer" }} onClick={() => { deleteImage(image) }} />
                                            </div>
                                        )
                                    })
                                }
                                {
                                    newImages.map((image, idx) => {
                                        return (
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: 10 }}>
                                                <img src={URL.createObjectURL(image)} className="image"  alt="Immagine del lavoro da caricare" />
                                                <IoClose color={"grey"} size={24} style={{ cursor: "pointer" }} onClick={() => {
                                                    let newImages = [...newImages]
                                                    // remove current row
                                                    newImages.splice(idx, 1)
                                                    setNewImages(newImages)
                                                }} />
                                            </div>
                                        )
                                    }
                                    )

                                }
                            </div>
                            <input type="file" id="images" name="images" accept="image/*" multiple
                                onChange={(e) => {
                                    let tempImages = [...newImages]
                                    for (let i = 0; i < e.target.files.length; i++) {
                                        tempImages.push(e.target.files[i])
                                    }
                                    setNewImages(tempImages)
                                }
                                } />
                        </div>
                    </form>
                    <h2>Materiali</h2>
                    <table style={{ width: "100%", maxWidth: "600px" }}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Quantità</th>
                                <th>Unità</th>
                                <th hidden={isMobile}>Inserito</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {
                                materials.map((val, idx) => {
                                    let materialName = `material-${idx}`, quantity = `quantity-${idx}`, unit = `unit-${idx}`
                                    return (
                                        <tr key={val.index}>
                                            <td style={{ paddingInline: "10px" }} >
                                                <textarea name="name" data-id={idx} id={materialName} className="form__field" placeholder="Nome"
                                                          value={materials[idx].name}
                                                          onChange={(e) => {
                                                        let newMaterials = [...materials]
                                                        newMaterials[idx].name = e.target.value
                                                        setMaterials(newMaterials)
                                                    }}
                                                />
                                            </td>
                                            <td style={{ paddingInline: "10px" }} >
                                                <input type="number" name="quantity" inputMode="decimal" pattern="[0-9]*([,.][0-9]+)?" data-id={idx} id={quantity} className="form__field" placeholder="Quantità" style={window.innerWidth < 600 ? { maxWidth: 80 } : { maxWidth: 120 }}
                                                    value={materials[idx].quantity}
                                                    onChange={(e) => {
                                                        let newMaterials = [...materials]
                                                        newMaterials[idx].quantity = e.target.value
                                                        setMaterials(newMaterials)
                                                    }}
                                                />
                                            </td>
                                            <td style={{ paddingInline: "10px" }} >
                                                <select name="unit" data-id={idx} id={unit} className="form__field" placeholder="Unità" style={{ minWidth: 40 }}
                                                    value={materials[idx].unit}
                                                    onChange={(e) => {
                                                        let newMaterials = [...materials]
                                                        newMaterials[idx].unit = e.target.value
                                                        setMaterials(newMaterials)
                                                    }}
                                                >
                                                    <option value="n">n</option>
                                                    <option value="m">mt</option>
                                                </select>
                                            </td>
                                            <td hidden={isMobile} style={{ paddingInline: "10px" }} >
                                                <input type="checkbox" name="inserted" data-id={idx} id={`inserted-${idx}`} className="form__field" placeholder="Inserito"
                                                    checked={materials[idx].checked === 1}
                                                    onChange={(e) => {
                                                        let newMaterials = [...materials]
                                                        newMaterials[idx].checked = (e.target.checked) ? 1 : 0
                                                        setMaterials(newMaterials)
                                                    }}
                                                />
                                            </td>
                                            <td style={{ paddingInline: "0px" }} >
                                                <IoClose color={"grey"} size={24} style={{ cursor: "pointer" }} onClick={() => {
                                                    if (materials.length === 1) {
                                                        setMaterials([{ name: "", quantity: "", unit: "n" }])
                                                        return
                                                    }
                                                    let newMaterials = [...materials]
                                                    // remove current row
                                                    newMaterials.splice(idx, 1)
                                                    setMaterials(newMaterials)
                                                }} />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                    <h2>Giornate</h2>
                    {
                        labour.map((val, index) => {
                            return (
                                <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "600px", gap: "50px" }}>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "80%", maxWidth: 200 }}>
                                        <input type="date" name="date" data-id={index} id={`date-${index}`} className="form__field" placeholder="Data"
                                            value={labour[index].date}
                                            onChange={(e) => {
                                                let newLabour = [...labour]
                                                newLabour[index].date = e.target.value
                                                setLabour(newLabour)
                                            }}
                                        />
                                        <IoClose color={"grey"} size={30} style={{ cursor: "pointer", marginLeft: 20 }} onClick={() => {
                                            if (labour.length === 1) {
                                                setLabour([{ date: "", users: [{ name: "", surname: "", hours: 0, minutes: 0 }], vehicles: [{ name: "", plate: "", hours: 0, minutes: 0 }] }])
                                                return
                                            }
                                            let newLabour = [...labour]
                                            // remove current row
                                            newLabour.splice(index, 1)
                                            setLabour(newLabour)
                                        }} />
                                    </div>
                                    <table style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th>Operatore</th>
                                                <th>Ore</th>
                                                <th>Minuti</th>
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                val.users.map((laborer, idx) => {
                                                    return (
                                                        <tr key={idx} >
                                                            <td style={{ paddingInline: "10px" }} >
                                                                <select name="id" data-id={idx} id={`id-${idx}`} className="form__field" placeholder="Operatore" style={{ minWidth: 150 }}
                                                                    defaultValue={""}
                                                                    value={laborer.id}
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].users[idx].id = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}
                                                                >
                                                                    <option value={""}>Nessuno</option>
                                                                    {
                                                                        users && users.map((user) => {
                                                                            return (
                                                                                <option 
                                                                                hidden={
                                                                                    // if the user is already selected, hide it from the options
                                                                                    val.users.filter((val) => parseInt(val.id) === parseInt(user.id)).length > 0
                                                                                }
                                                                                value={user.id}>{user.name} {user.surname}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </td>
                                                            <td style={{ paddingInline: "10px" }} >
                                                                <select name="hours" data-id={idx} id={`hours-${idx}`} className="form__field" placeholder="Ore" style={window.innerWidth < 600 ? { maxWidth: 80, minWidth: 60 } : { maxWidth: 120 }}
                                                                    value={laborer.hours}
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].users[idx].hours = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}
                                                                >
                                                                    <option value={0}>0</option>
                                                                    <option value={1}>1</option>
                                                                    <option value={2}>2</option>
                                                                    <option value={3}>3</option>
                                                                    <option value={4}>4</option>
                                                                    <option value={5}>5</option>
                                                                    <option value={6}>6</option>
                                                                    <option value={7}>7</option>
                                                                    <option value={8}>8</option>
                                                                    <option value={9}>9</option>
                                                                    <option value={10}>10</option>
                                                                    <option value={11}>11</option>
                                                                    <option value={12}>12</option>
                                                                </select>
                                                            </td>
                                                            <td style={{ paddingInline: "10px" }} >
                                                                <select name="minutes" data-id={idx} id={`minutes-${idx}`} className="form__field" placeholder="Minuti" style={window.innerWidth < 600 ? { maxWidth: 80 } : { maxWidth: 120 }}
                                                                    value={laborer.minutes}
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].users[idx].minutes = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}
                                                                >
                                                                    <option value={0}>0</option>
                                                                    <option value={30}>30</option>
                                                                </select>
                                                            </td>
                                                            <td style={{ paddingInline: "0px" }} >
                                                                <IoClose color={"grey"} size={24} style={{ cursor: "pointer" }} onClick={() => {
                                                                    if (val.users.length === 1) {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].users = [{ name: "", surname: "", hours: 0, minutes: 0 }]
                                                                        setLabour(newLabour)
                                                                        return
                                                                    }
                                                                    let newLabour = [...labour]
                                                                    // remove current row
                                                                    newLabour[index].users.splice(idx, 1)
                                                                    setLabour(newLabour)
                                                                }} />
                                                            </td>
                                                        </tr>
                                                    )
                                                }

                                                )
                                            }
                                        </tbody>
                                    </table>
                                    <table style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th>Veicolo</th>
                                                <th>Ore</th>
                                                <th>Minuti</th>
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                val.vehicles.map((vehicle, idx) => {
                                                    return (
                                                        <tr key={idx} >
                                                            <td style={{ paddingInline: "10px" }} >
                                                                <select name="id" data-id={idx} id={`id-${idx}`} className="form__field" placeholder="Veicolo" style={{ minWidth: 150 }}
                                                                    //set the default shown value to none of the options
                                                                    defaultValue={0}
                                                                    value={vehicle.id}
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].vehicles[idx].id = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}
                                                                >
                                                                    <option value={-1}>Nessuno</option>
                                                                    {
                                                                        vehicles && vehicles.map((vehicle) => {
                                                                            return (
                                                                                <option hidden={
                                                                                    // if the vehicle is already selected, hide it from the options
                                                                                    val.vehicles.filter((val) => parseInt(val.id) === parseInt(vehicle.id)).length > 0
                                                                                }
                                                                                    value={vehicle.id}>{vehicle.name} {vehicle.plate}
                                                                                </option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </td>
                                                            <td style={{ paddingInline: "10px" }} >
                                                                <select name="hours" data-id={idx} id={`hours-${idx}`} className="form__field" placeholder="Ore" style={window.innerWidth < 600 ? { maxWidth: 80, minWidth: 60 } : { maxWidth: 120 }}
                                                                    value={vehicle.hours}
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].vehicles[idx].hours = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}
                                                                >
                                                                    <option value={0}>0</option>
                                                                    <option value={1}>1</option>
                                                                    <option value={2}>2</option>
                                                                    <option value={3}>3</option>
                                                                    <option value={4}>4</option>
                                                                    <option value={5}>5</option>
                                                                    <option value={6}>6</option>
                                                                    <option value={7}>7</option>
                                                                    <option value={8}>8</option>
                                                                    <option value={9}>9</option>
                                                                    <option value={10}>10</option>
                                                                    <option value={11}>11</option>
                                                                    <option value={12}>12</option>
                                                                </select>
                                                            </td>
                                                            <td style={{ paddingInline: "10px" }} >
                                                                <select name="minutes" data-id={idx} id={`minutes-${idx}`} className="form__field" placeholder="Minuti" style={window.innerWidth < 600 ? { maxWidth: 80 } : { maxWidth: 120 }}
                                                                    value={vehicle.minutes}
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].vehicles[idx].minutes = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}
                                                                >
                                                                    <option value={0}>0</option>
                                                                    <option value={30}>30</option>
                                                                </select>
                                                            </td>
                                                            <td style={{ paddingInline: "0px" }} >
                                                                <IoClose color={"grey"} size={24} style={{ cursor: "pointer" }} onClick={() => {
                                                                    if (val.vehicles.length === 1) {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].vehicles = [{ id: "", name: "", plate: "", hours: 0, minutes: 0 }]
                                                                        setLabour(newLabour)
                                                                        return
                                                                    }
                                                                    let newLabour = [...labour]
                                                                    // remove current row
                                                                    newLabour[index].vehicles.splice(idx, 1)
                                                                    setLabour(newLabour)
                                                                }} />
                                                            </td>
                                                        </tr>
                                                    )
                                                }

                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                        })
                    }
                    <button className="button" onClick={() => {
                        setLabour([...labour, { date: "", users: [{ id: "", name: "", surname: "", hours: 0, minutes: 0 }], vehicles: [{ id: "", name: "", plate: "", hours: 0, minutes: 0 }] }])
                    }} >
                        Aggiungi ulteriore giornata
                    </button>
                    <button className="button" style={{ width: "80%", maxWidth: 200, margin: 20 }} onClick={save}>
                        Salva
                    </button>
                </div>
    )

};

export default Edit;