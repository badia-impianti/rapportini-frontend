const inputFieldChecker = (inputs) => {


    //Check form inputs
    if (inputs.customer === "") {
        throw new Error("nome cliente vuoto")
    }

    // TABLES CHECK

    //Check material
    let validatedMaterials = [...inputs.materials]
    validatedMaterials.pop()

    validatedMaterials.forEach((material) => {
        material.quantity = material.quantity.replace(",", ".")
        material.quantity = parseInt(material.quantity)
        if (material.quantity <= 0 || isNaN(material.quantity) ) {
            throw new Error("materiale con quantità non valida")
        }

        if (material.name === "") {
            throw new Error("materiale con nome vuoto")
        }
    })


    //Check labour
    let validatedLabour = []
    inputs.labour.forEach((val) => {

        if (val.date === "" || val.date === null) {
            throw new Error("data non valida")
        }

        //Users check
        let validatedUsers = [...val.users]
        validatedUsers.pop()

        validatedUsers.forEach((laborer) => {

            if (laborer.id === "") {
                throw new Error("lavoratore con orario inserito non selezionato")
            }

            laborer.hours = parseInt(laborer.hours)
            laborer.minutes = parseInt(laborer.minutes)
            if (isNaN(laborer.hours) || (laborer.hours === 0 && laborer.minutes === 0)) {
                throw new Error("orario di un lavoratore non valido")
            }
        })

        //Vehicles check
        let validatedVehicles = [...val.vehicles]
        validatedVehicles.pop()

        validatedVehicles.forEach((vehicle) => {
            if (vehicle.id === "") {
                throw new Error("veicolo non selezionato")
            }
        })


        //Check that the date is not null, or the work cannot be accepte
        validatedLabour.push({date: val.date, users: validatedUsers, vehicles: validatedVehicles})
    })

    //Check that the date value in newlabour is unique in the array
    validatedLabour.every((val) => {
        if (validatedLabour.filter((labor) => labor.date === val.date).length > 1) {
            throw new Error("data duplicata")
        }
    })

    //Check that for each element with different data the users and vehicles are not empty
    validatedLabour.every((val) => {
        if (val.users.length === 0 && val.vehicles.length === 0) {
            throw new Error("data senza lavoratori o veicoli")
        }
    })

    return {
        customer: inputs.customer,
        description: inputs.description,
        notes: inputs.notes,
        completed: inputs.completed ? 1 : 0,
        oncall: inputs.oncall ? 1 : 0,
        materials: validatedMaterials,
        labour: validatedLabour
    }
}

export default inputFieldChecker