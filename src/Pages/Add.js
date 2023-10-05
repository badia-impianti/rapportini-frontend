import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose, IoAdd } from "react-icons/io5";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingError from "../components/LoadingError";
import NavBar from "../components/NavBar";

const Add = () => {

    //Navigation
    const navigate = useNavigate();

    //Page state
    const [loadingError, setLoadingError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
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
    const [labour, setLabour] = React.useState([{ date: "", laborers: [{ id: "", name: "", surname: "", hours: 0, minutes: 0 }], vehicles: [{ id: "", name: "", plate: "", hours: 0, minutes: 0 }] }]);


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
                        setIsLoading(false);
                    });
                }
                else {
                    setLoadingError(true);
                }
            })
            .catch((err) => {
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
            .catch((err) => {
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
        if (materials[materials.length - 1].name !== "" && materials[materials.length - 1].quantity !== "" && materials[materials.length - 1].unit !== "") {
            setMaterials([...materials, { name: "", quantity: 0, unit: "n" }]);
        }
    }, [materials]);

    useEffect(() => {
        // if last worker of any labour is filled, add a new empty worker
        labour.forEach((val, idx) => {
            if (val.laborers[val.laborers.length - 1].id !== "" && val.laborers[val.laborers.length - 1].hours !== "" && val.laborers[val.laborers.length - 1].minutes !== "") {
                let newLabour = [...labour]
                newLabour[idx].laborers.push({ id: "", name: "", surname: "", hours: 0, minutes: 0 })
                setLabour(newLabour)
            }
        })
    }, [labour]);

    useEffect(() => {
        // if last vehicle of any labour is filled, add a new empty vehicle
        labour.forEach((val, idx) => {
            if (val.vehicles[val.vehicles.length - 1].id !== "") {
                let newLabour = [...labour]
                newLabour[idx].vehicles.push({ id: "", name: "", plate: "", hours: 0, minutes: 0 })
                setLabour(newLabour)
            }
        })
    }, [labour]);
    //End of adding new empty material/worker/vehicle


    const uploadImages = (id) => {
        images.forEach((image) => {
            let formData = new FormData();
            formData.append("photo", image);
            fetch("https://backend.rapportini.badiasilvano.it/works/" + id + "/images", {
                method: "POST",
                credentials: "include",
                body: formData
            })
                .then((response) => {
                    if (response.status === 200) {
                        response.json().then((data) => {
                            console.log(data);
                        });
                    }

                })
                .catch((err) => {
                    console.log("Error: ", err);
                });

        });
    }


    //Upload the work to the backend
    const save = (e) => {
        e.preventDefault();
        let newMaterials = [...materials]
        newMaterials.pop()
        let newLabour = []
        let errorType = ""
        labour.forEach((val) => {
            let newUsers = []
            val.laborers.forEach((laborer) => {

                //Tali if sono necessari a seguito del fatto che la "onchange" viene chiamato solo al cambio di valore, e se si vuole inserire
                //per esempio 30 minuti al server arriva stringa vuota nelle ore
                if (laborer.id !== "") {
                    newUsers.push(laborer)
                }
            })
            let newVehicles = []
            val.vehicles.forEach((vehicle) => {
                if (vehicle.id !== "") {
                    newVehicles.push(vehicle)
                }
            })

            //Check that the date is not null, or the work cannot be accepted
            if (val.date === "" || val.date === null) {
                errorType = "date"
                alert("Inserire una data valida")
                return
            }

            newLabour.push({ date: val.date, users: newUsers, vehicles: newVehicles })
        })

        if (errorType !== "") {
            return
        }

        const data = {
            customer: customer,
            description: description,
            notes: notes,
            completed: completed ? 1 : 0,
            oncall: onCall ? 1 : 0,
            materials: newMaterials,
            labour: newLabour
        }
        fetch("https://backend.rapportini.badiasilvano.it/works", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        uploadImages(data.workId);
                        navigate("/home");
                    });
                }
                else {
                    setLoadingError(true)
                }
            })
            .catch((err) => {
                setLoadingError(true);
            });
    }

    return (
        loadingError ? <LoadingError /> :
            isLoading ? <LoadingSpinner /> :
                <div className="mainContainer">
                    <NavBar />
                    <h1>Nuovo Rapporto</h1>
                    <form style={{ width: "100%" }}>
                        <div className="form__group" >
                            <input type="text" className="form__field" id='customer' name="customer" placeholder="Cliente"
                                onChange={e => setCustomer(e.target.value)}
                            />
                            <label for="customer" className="form__label">Cliente</label>
                        </div>
                        <div className="form__group" >
                            <textarea className="form__field" id="description" placeholder="Descrizione"
                                onChange={e => setDescription(e.target.value)}
                            />
                            <label for="description" className="form__label">Descrizione</label>
                        </div>
                        <div className="form__group">
                            <textarea className="form__field" id='notes' placeholder="Note"
                                onChange={e => setNotes(e.target.value)}
                            />
                            <label for="notes" className="form__label">Note</label>
                        </div>
                        <div className="form__group" style={{ display: "flex", flexDirection: "row", justifyContent: "center" }} >
                            <input type="checkbox" id="onCall" onChange={e => setOnCall(e.target.checked)} checked={onCall} />
                            &nbsp;<label for="onCall">Reperibilità</label>
                        </div>
                        <div className="form__group" style={{ display: "flex", flexDirection: "row", justifyContent: "center", padding: 20 }}>
                            <input type="checkbox" id="completed" name="completed" onChange={e => setCompleted(e.target.checked)} checked={completed} />
                            &nbsp;<label for="completed">Lavoro completato</label>
                        </div>
                        <div>
                            <h2>Immagini</h2>
                            <div style={{ justifyContent: "center" }}>
                                {
                                    //Show the images that the user has selected
                                    images.map((image) => {
                                        return (
                                            <div>
                                                <img src={URL.createObjectURL(image)} style={{ width: 100, height: 100 }} />
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
                    <h2 style={{ marginTop: "100px" }}>Materiali</h2>
                    <table style={{ width: "100%" }}>
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
                                                <input type="text" name="name" data-id={idx} id={materialName} className="form__field" placeholder="Nome"
                                                    value={materials[idx].name}
                                                    onChange={(e) => {
                                                        let newMaterials = [...materials]
                                                        newMaterials[idx].name = e.target.value
                                                        setMaterials(newMaterials)
                                                    }}
                                                />
                                            </td>
                                            <td style={{ paddingInline: "10px" }} >
                                                <input type="number" name="quantity" data-id={idx} id={quantity} className="form__field" placeholder="Quantità" style={window.innerWidth < 600 ? { maxWidth: 80 } : { maxWidth: 120 }}
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
                                                    console.log(newMaterials)
                                                    setMaterials(newMaterials)
                                                }} />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                    <h2 style={{ marginTop: "100px" }}>Giornate</h2>
                    {
                        labour.map((val, index) => {
                            return (
                                <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", maxWidth: 200 }}>
                                        <input type="date" name="date" data-id={index} id={`date-${index}`} className="form__field" placeholder="Data"
                                            value={val.date}
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
                                            console.log(newLabour)
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
                                                val.laborers.map((laborer, idx) => {
                                                    return (
                                                        <tr key={idx} >
                                                            <td style={{ paddingInline: "10px" }} >
                                                                <select name="id" data-id={idx} id={`id-${idx}`} className="form__field" style={{ minWidth: 150 }}
                                                                    value={laborer.id}
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].laborers[idx].id = e.target.value
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
                                                                                    val.laborers.filter((val) => parseInt(val.id) === parseInt(user.id)).length > 0
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
                                                                        newLabour[index].laborers[idx].hours = e.target.value
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
                                                                        newLabour[index].laborers[idx].minutes = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}>
                                                                    <option value={0}>0</option>
                                                                    <option value={30}>30</option>
                                                                </select>
                                                            </td>
                                                            <td style={{ paddingInline: "0px" }} >
                                                                <IoClose color={"grey"} size={24} style={{ cursor: "pointer" }} onClick={() => {
                                                                    if (val.laborers.length === 1) {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].laborers = [{ name: "", surname: "", hours: 0, minutes: 0 }]
                                                                        setLabour(newLabour)
                                                                        return
                                                                    }
                                                                    let newLabour = [...labour]
                                                                    // remove current row
                                                                    newLabour[index].laborers.splice(idx, 1)
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
                                                                    console.log(newLabour)
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
                        setLabour([...labour, { date: "", laborers: [{ id: "", name: "", surname: "", hours: 0, minutes: 0 }], vehicles: [{ id: "", name: "", plate: "", hours: 0, minutes: 0 }] }])
                    }}>
                        Aggiungi Ulteriore Giornata
                    </button>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", width: "100%" }}>
                        <button className="button" style={{ width: "100%", maxWidth: 200, marginTop: "100px" }} onClick={save}
                        >Salva</button>
                    </div>
                </div>
    )
}

export default Add;


