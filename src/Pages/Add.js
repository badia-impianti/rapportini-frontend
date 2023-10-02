import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose, IoAdd } from "react-icons/io5";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingError from "../components/LoadingError";
import { upload } from "@testing-library/user-event/dist/upload";

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
    const [images, setImages] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [materials, setMaterials] = React.useState([{ name: "", quantity: "", unit: "n" }]);
    const [labour, setLabour] = React.useState([{ date: "", laborers: [{ id: "", name: "", surname: "", hours: "", minutes: "" }], vehicles: [{ id: "", name: "", plate: "" }] }]);


    useEffect(() => {
        fetch("https://backend.rapportini.rainierihomecollection.it/users", {
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
            })
            .catch((err) => {
                setLoadingError(true);
            });

        fetch("https://backend.rapportini.rainierihomecollection.it/vehicles", {
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
               setLoadingError(true);
            });
    }, []);

    useEffect(() => {
        if (users.length > 0 && vehicles.length > 0) {
            setIsLoading(false);
        }
    }, [users, vehicles]);

    useEffect(() => {
        //if last material is filled, add a new empty material
        if (materials[materials.length - 1].name !== "" && materials[materials.length - 1].quantity !== "" && materials[materials.length - 1].unit !== "") {
            setMaterials([...materials, { name: "", quantity: "", unit: "n" }]);
        }
    }, [materials]);

    useEffect(() => {
        // if last worker of any labour is filled, add a new empty worker
        labour.forEach((val, idx) => {
            if (val.laborers[val.laborers.length - 1].id !== "" && val.laborers[val.laborers.length - 1].hours !== "" && val.laborers[val.laborers.length - 1].minutes !== "") {
                let newLabour = [...labour]
                newLabour[idx].laborers.push({ id: "", name: "", surname: "", hours: "", minutes: "" })
                setLabour(newLabour)
            }
        })
    }, [labour]);

    useEffect(() => {
        // if last vehicle of any labour is filled, add a new empty vehicle
        labour.forEach((val, idx) => {
            if (val.vehicles[val.vehicles.length - 1].id !== "") {
                let newLabour = [...labour]
                newLabour[idx].vehicles.push({ id: "", name: "", plate: "" })
                setLabour(newLabour)
            }
        })
    }, [labour]);


    const uploadImages = (id) => {
        let formData = new FormData();
        images.forEach((image) => {
            formData.append("images", image);
        })
        fetch("https://backend.rapportini.rainierihomecollection.it/works/" + id + "/images", {
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
    }

    const save = (e) => {
        e.preventDefault();
        let newMaterials = [...materials]
        newMaterials.pop()
        let newLabour = []
        labour.forEach((val) => {
            let newUsers = []
            val.laborers.forEach((laborer) => {
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
            newLabour.push({ date: val.date, users: newUsers, vehicles: newVehicles })
        })
        let data = {
            customer: customer,
            description: description,
            notes: notes,
            completed: completed,
            materials: newMaterials,
            labour: newLabour
        }
        console.log(data)
        fetch("https://backend.rapportini.rainierihomecollection.it/works", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        console.log(data);
                        uploadImages();
                        window.alert("Rapporto salvato con successo");
                        navigate("/home");
                    });
                }
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    }


    return (
        loadingError ? <LoadingError /> :
            isLoading ? <LoadingSpinner /> :
                <div style={{ alignContent: "center", textAlign: "center", width: "100%" }}>
                    <h1>Nuovo Rapporto</h1>
                    <form style={{ textAlign: "-moz-center", width: "100%" }}>
                        <div className="form__group field" >
                            <input type="text" className="form__field" placeholder="Cliente" name="customer" id='customer' required
                                onChange={e => setCustomer(e.target.value)}
                            />
                            <label for="customer" className="form__label">Cliente</label>
                        </div>
                        <div className="form__group field" >
                            <textarea className="form__field" placeholder="Descrizione" name="description" id='description' required
                                onChange={e => setDescription(e.target.value)}
                            />
                            <label for="description" className="form__label">Descrizione</label>
                        </div>
                        <div className="form__group field">
                            <textarea className="form__field" placeholder="Note" name="notes" id='notes' required
                                onChange={e => setNotes(e.target.value)}
                            />
                            <label for="notes" className="form__label">Note</label>
                        </div>
                        <div className="form__group field" style={{ display: "flex", flexDirection: "row", justifyContent: "center", width: "80%", maxWidth: 200 }}>
                        <input type="checkbox" id="completed" name="completed" onChange={e => setCompleted(e.target.checked)} />
                        <p>
                            <label for="completed">Lavoro completato</label>
                        </p>
                        </div>
                        <div>
                            <h2>Immagini</h2>
                            <input type="file" id="images" name="images" accept="image/*" multiple 
                            onChange={(e) => {
                                let newImages = [...images]
                                for (let i = 0; i < e.target.files.length; i++) {
                                    newImages.push(e.target.files[i])
                                }
                                setImages(newImages)
                            } 
                            }/>
                        </div>
                    </form>
                    <h2>Materiali</h2>
                    <table style={{ width: "80%" }}>
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

                    <h2>Giornate</h2>
                    {
                        labour.map((val, index) => {
                            return (
                                <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
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
                                                setLabour([{ date: "", laborers: [{ name: "", surname: "", hours: "", minutes: "" }], vehicles: [{ name: "", plate: "" }] }])
                                                return
                                            }
                                            let newLabour = [...labour]
                                            // remove current row
                                            newLabour.splice(index, 1)
                                            console.log(newLabour)
                                            setLabour(newLabour)
                                        }} />
                                    </div>
                                    <table style={{ width: "80%" }}>
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
                                                                <select name="id" data-id={idx} id={`id-${idx}`} className="form__field" placeholder="Operatore" style={{ minWidth: 150 }}
                                                                    defaultValue={""}
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
                                                                                <option value={user.id}>{user.name} {user.surname}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </td>
                                                            <td style={{ paddingInline: "10px" }} >
                                                                <input type="number" name="hours" data-id={idx} id={`hours-${idx}`} className="form__field" placeholder="Ore" style={window.innerWidth < 600 ? { maxWidth: 80, minWidth: 60 } : { maxWidth: 120 }}
                                                                    value={laborer.hours}
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].laborers[idx].hours = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}
                                                                />
                                                            </td>
                                                            <td style={{ paddingInline: "10px" }} >
                                                                <input type="number" name="minutes" data-id={idx} id={`minutes-${idx}`} className="form__field" placeholder="Minuti" style={window.innerWidth < 600 ? { maxWidth: 80 } : { maxWidth: 120 }}
                                                                    value={laborer.minutes}
                                                                    onChange={(e) => {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].laborers[idx].minutes = e.target.value
                                                                        setLabour(newLabour)
                                                                    }}
                                                                />
                                                            </td>
                                                            <td style={{ paddingInline: "0px" }} >
                                                                <IoClose color={"grey"} size={24} style={{ cursor: "pointer" }} onClick={() => {
                                                                    if (val.laborers.length === 1) {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].laborers = [{ name: "", surname: "", hours: "", minutes: "" }]
                                                                        setLabour(newLabour)
                                                                        return
                                                                    }
                                                                    let newLabour = [...labour]
                                                                    // remove current row
                                                                    newLabour[index].laborers.splice(idx, 1)
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
                                    <table style={{ width: "80%" }}>
                                        <thead>
                                            <tr>
                                                <th>Veicolo</th>
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
                                                                                <option value={vehicle.id}>{vehicle.name} {vehicle.plate}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </td>
                                                            <td style={{ paddingInline: "0px" }} >
                                                                <IoClose color={"grey"} size={24} style={{ cursor: "pointer" }} onClick={() => {
                                                                    if (val.vehicles.length === 1) {
                                                                        let newLabour = [...labour]
                                                                        newLabour[index].vehicles = [{ id: "", name: "", plate: "" }]
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
                    <IoAdd color={"grey"} size={30} style={{ cursor: "pointer" }} onClick={() => {
                        setLabour([...labour, { date: "", laborers: [{ name: "", surname: "", hours: "", minutes: "" }], vehicles: [{ name: "", plate: "" }] }])
                    }} />
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", width: "100%" }}>
                        <button className="button" style={{ width: "80%", maxWidth: 200, margin: 20 }} onClick={save}
                        >Salva</button>
                    </div>
                </div>
    )
}

export default Add;


