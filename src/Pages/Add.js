import React from "react";

const Add = () => {

    const [date, setDate] = React.useState("");
    const [customer, setCustomer] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [notes, setNotes] = React.useState("");
    return (
        <div>
            <h1>Nuovo Rapporto</h1>
            <form>
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



        </div>
    );
}

export default Add;