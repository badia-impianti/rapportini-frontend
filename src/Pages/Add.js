import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingError from "../components/LoadingError";
import NavBar from "../components/NavBar";
import inputFieldChecker from "../functions/inputFieldChecker";
import ToggleSwitch from "../components/ToggleSwitch/ToggleSwitch";

const Add = () => {

    //Navigation
    const navigate = useNavigate();

    //Page state
    const [loadingError, setLoadingError] = React.useState(false);
    const [errorType, setErrorType] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadingMessage, setLoadingMessage] = useState()
    //Page data
    const [customer, setCustomer] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [notes, setNotes] = React.useState("");
    const [completed, setCompleted] = React.useState(false);
    const [onCall, setOnCall] = React.useState(false);
    // Add images as an array of files
    const [images, setImages] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [materials, setMaterials] = React.useState([{ name: "", quantity: "", unit: "n" }]);
    const [labour, setLabour] = React.useState([{ date: "", users: [{ id: "", name: "", surname: "", hours: 0, minutes: 0 }], vehicles: [{ id: "", name: "", plate: "", hours: 0, minutes: 0 }] }]);


    //Loading needed data
    useEffect(() => {

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
                else {
                    setLoadingError(true);
                }
            })
            .catch(() => {
                setErrorType("Errore di rete nel caricamento dei dati: verifica la tua connessione e riprova")
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
                else {
                    setLoadingError(true);
                }
            })
            .catch(() => {
                setErrorType("Errore di rete nel caricamento dei dati: verifica la tua connessione e riprova")
                setLoadingError(true);
            });
    }, []);

    useEffect(() => {
        if (users.length > 0 && vehicles.length > 0) {
            setIsLoading(false);
        }
    }, [users, vehicles]);
    //End of loading needed data


    //Add a new empty line to the materials/worker/vehicle table
    useEffect(() => {
        //if last material is filled, add a new empty material
        if (materials[materials.length-1].name !== "" || materials[materials.length - 1].quantity !== "" || materials[materials.length - 1].unit !== "n") {
            setMaterials([...materials, { name: "", quantity: "", unit: "n" }]);
        }
    }, [materials]);

    useEffect(() => {
        // if last worker of any labour is filled, add a new empty worker
        labour.forEach((val, idx) => {
            if (val.users[val.users.length - 1].id !== "" && val.users[val.users.length - 1].hours !== "" && val.users[val.users.length - 1].minutes !== "") {
                let newLabour = [...labour]
                newLabour[idx].users.push({ id: "", name: "", surname: "", hours: 0, minutes: 0 })
                setLabour(newLabour)
            }
        })
    }, [labour]);

    useEffect(() => {
        // if last vehicle of any labour is filled, add a new empty vehicle
        labour.forEach((val, idx) => {
            if (val.vehicles[val.vehicles.length - 1].id !== "" || val.vehicles[val.vehicles.length - 1].hours !== 0 || val.vehicles[val.vehicles.length - 1].minutes !== 0) {
                let newLabour = [...labour]
                newLabour[idx].vehicles.push({ id: "", name: "", plate: "", hours: 0, minutes: 0 })
                setLabour(newLabour)
            }
        })
    }, [labour]);
    //End of adding new empty material/worker/vehicle


    const uploadImages = async (workId) => {

        try {

            for (const image of images) {

                setLoadingMessage("Caricamento immagine " + (images.indexOf(image) + 1) + " di " + images.length)

                let formData = new FormData();
                formData.append("photo", image);

                const response = await fetch("https://backend.rapportini.badiasilvano.it/works/" + workId + "/images", {
                    method: "POST",
                    credentials: "include",
                    body: formData
                })

                if (response.status !== 200) {
                    setErrorType("Il server non ha accettato tale richiesta; ecco il messaggio nel dettaglio: " + response.message)
                    setLoadingError(true)
                    return
                }

            }
        } catch (error) {
            setErrorType("Errore di rete nel caricamento di un'immagine: verifica la tua connessione e riprova")
            setLoadingError(true)
        }
    }


    //Upload the work to the backend
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

        setIsLoading(true)

        try {

            const response = (await fetch("https://backend.rapportini.badiasilvano.it/works", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(validatedInput),
            }))

            if (response.status === 200) {
                const responseJson = await response.json()
                await uploadImages(responseJson.workId);
                if (!loadingError) navigate("/home")
            } else {
                const responseJson = await response.json()
                setErrorType("Il server non ha accettato tale richiesta; ecco il messaggio nel dettaglio: " + responseJson.message)
                setLoadingError(true)
            }

        } catch (error) {
            setErrorType("Errore di rete nel caricamento del rapportino: verifica la tua connessione e riprova")
            setLoadingError(true)
        }

    }

    return (
        loadingError ? <LoadingError errorDescription={errorType}/> :
            isLoading ? <LoadingSpinner message={loadingMessage} /> :
                <div className="mainContainer">
                    <NavBar />
                    <h1>Nuovo Rapporto</h1>
                    <form style={{ width: "100%", maxWidth: "600px" }}>
                        <div className="form__group" >
                            <input type="text" className="form__field" id='customer' name="customer" placeholder="Cliente"
                                onChange={e => setCustomer(e.target.value)}
                            />
                            <label className="form__label">Cliente</label>
                        </div>
                        <div className="form__group" >
                            <textarea className="form__field" id="description" placeholder="Descrizione"
                                onChange={e => setDescription(e.target.value)}
                            />
                            <label className="form__label">Descrizione</label>
                        </div>
                        <div className="form__group">
                            <textarea className="form__field" id='notes' placeholder="Note"
                                onChange={e => setNotes(e.target.value)}
                            />
                            <label className="form__label">Note</label>
                        </div>
                        <div className="form__group" style={{ display: "flex", flexDirection: "row", justifyContent: "center" }} >
                            <ToggleSwitch
                                name="onCallToggle"
                                trueValue="REPERIBILITÀ"
                                falseValue="ORDINARIO"
                                value={[onCall, setOnCall]}
                            ></ToggleSwitch>
                        </div>
                        <div className="form__group" style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: 20 }}>
                            <ToggleSwitch
                                name="completedToggle"
                                trueValue="COMPLETATO"
                                falseValue="IN CORSO"
                                value={[ completed, setCompleted]}
                            ></ToggleSwitch>
                        </div>
                        <div>
                            <h2>Immagini</h2>
                            <div style={{ justifyContent: "center" }}>
                                {
                                    //Show the images that the user has selected
                                    images.map((image) => {
                                        return (
                                            <div>
                                                <img src={URL.createObjectURL(image)} style={{ width: 100, height: 100 }} alt="Work Image"/>
                                                <IoClose color={"grey"} size={24} style={{ cursor: "pointer" }} onClick={() => {
                                                    let newImages = [...images]
                                                    // remove current row
                                                    newImages.splice(images.indexOf(image), 1)
                                                    setImages(newImages)
                                                }} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <input type="file" id="images" name="images" accept="image/*" multiple
                                onChange={(e) => {
                                    let newImages = [...images]
                                    for (let i = 0; i < e.target.files.length; i++) {
                                        newImages.push(e.target.files[i])
                                    }
                                    setImages(newImages)
                                }
                                } />
                        </div>
                    </form>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h2>Materiali</h2>
                    <table style={{ width: "100%", maxWidth: "600px" }}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Quantità</th>
                                <th>Unità</th>
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
                                                <input type="number" name="quantity" data-id={idx} inputMode="decimal" pattern="[0-9]*([,.][0-9]+)?" id={quantity} className="form__field" placeholder="Quantità" style={window.innerWidth < 600 ? { maxWidth: 80 } : { maxWidth: 120 }}
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
                    </div>


                    <div style={{width: "100%"}}>
                    <h2>Giornate</h2>
                    {
                        labour.map((val, index) => {
                            return (
                                <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: "50px", marginBottom: "100px" }}>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", maxWidth: 200 }}>
                                        <input type="date" name="date" data-id={index} id={`date-${index}`} className="form__field" placeholder="Data"
                                            value={val.date}
                                               style={{ marginBottom: "10px" }}
                                            onChange={(e) => {
                                                let newLabour = [...labour]
                                                newLabour[index].date = e.target.value
                                                setLabour(newLabour)
                                            }}
                                        />
                                        <IoClose color={"grey"} size={30} style={{ cursor: "pointer", marginLeft: 20 }} onClick={() => {
                                            if (labour.length === 1) {
                                                setLabour([{ date: "", laborers: [{ name: "", surname: "", hours: 0, minutes: 0 }], vehicles: [{ name: "", plate: "", hours: 0, minutes: 0 }] }])
                                                return
                                            }
                                            let newLabour = [...labour]
                                            // remove current row
                                            newLabour.splice(index, 1)
                                            setLabour(newLabour)
                                        }} />
                                    </div>
                                    <table style={{ width: "100%", maxWidth: "600px" }}>
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
                                                                <select name="id" data-id={idx} id={`id-${idx}`} className="form__field" style={{ minWidth: 150 }}
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
                                                            <td style={{ paddingInline: "10px", minWidth: 40 }} >
                                                                <select
                                                                    className="form__field"
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].users[idx].hours = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}>
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

                                                            <td style={{ paddingInline: "10px" }}>
                                                                <select className="form__field"
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].users[idx].minutes = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}>
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
                                    <table style={{ width: "100%", maxWidth: "600px" }}>
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
                                                            <td style={{ paddingInline: "10px", minWidth: 40 }} >
                                                                <select className="form__field"
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].vehicles[idx].hours = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}>
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
                                                            <td style={{ paddingInline: "10px" }}>
                                                                <select className="form__field"
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].vehicles[idx].minutes = e.target.value
                                                                        setLabour(newLabour)
                                                                    }
                                                                    }>
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
                    </div>
                    <button className="button" onClick={() => {
                        setLabour([...labour, { date: "", users: [{ id: "", name: "", surname: "", hours: 0, minutes: 0 }], vehicles: [{ id: "", name: "", plate: "", hours: 0, minutes: 0 }] }])
                    }}>
                        Aggiungi Ulteriore Giornata
                    </button>

                    <button className="button" onClick={save}>
                        Salva
                    </button>
                </div>
    )
}

export default Add;


