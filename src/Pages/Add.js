import React from "react";

const Add = () => {

    const [date, setDate] = React.useState("");
    const [customer, setCustomer] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [notes, setNotes] = React.useState("");

    const [materials, setMaterials] = React.useState([]);
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
                    <textarea  className="form__field" placeholder="Descrizione" name="description" id='description' required 
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" className="form__field" placeholder="Nome" name="name" id='name' style={{minWidth: 80}} required /></td>
                            <td><input type="number" className="form__field" placeholder="Quantità" name="quantity" id='quantity' required /></td>
                            <td><select className="form__field" name="unit" id='unit' style={{minWidth: 50}} required>
                                <option value="n">n</option>
                                <option value="m">m</option>
                            </select></td>
                        </tr>
                    </tbody>
                </table>



        </div>
    );
}

export default Add;