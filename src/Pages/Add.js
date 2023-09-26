import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";

const Add = () => {

    const [date, setDate] = React.useState("");
    const [customer, setCustomer] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [notes, setNotes] = React.useState("");

    const [materials, setMaterials] = React.useState([{ name: "", quantity: "", unit: "n" }]);


    useEffect(() => {
        //if last material is filled, add a new empty material
        if (materials[materials.length - 1].name !== "" && materials[materials.length - 1].quantity !== "" && materials[materials.length - 1].unit !== "") {
            setMaterials([...materials, { name: "", quantity: "", unit: "n" }]);
        }
    }, [materials]);

    return (
        <div style={{ alignContent: "center", textAlign: "center", width: "100%" }}>
            <h1>Nuovo Rapporto</h1>
            <form style={{ textAlign: "-moz-center", width: "100%" }}>
                <div className="form__group field" >
                    <input type="date" className="form__field" placeholder="Data" name="date" id='date' required
                        onChange={e => setDate(e.target.value)}
                    />
                    <label for="date" className="form__label">Data</label>
                </div>
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
                                            <input type="number" name="quantity" data-id={idx} id={quantity} className="form__field" placeholder="Quantità" style={ window.innerWidth < 600 ? {maxWidth: 80 } : {maxWidth: 120}}
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



        </div>
    );
}

export default Add;