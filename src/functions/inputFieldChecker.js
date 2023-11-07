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

        let validatedUsers = [...val.users]
        validatedUsers.pop()

        validatedUsers.forEach((laborer) => {
            laborer.hours = parseInt(laborer.hours)
            if (isNaN(laborer.hours) || (laborer.hours === 0 && laborer.minutes === 0)) {
                throw new Error("orario di un lavoratore non valido")
            }
        })


        /*
        val.laborers.forEach((laborer) => {

            //Tali if sono necessari a seguito del fatto che la "onchange" viene chiamato solo al cambio di valore, e se si vuole inserire
            //per esempio 30 minuti al server arriva stringa vuota nelle ore

            // commentato perchè secondo me dovrebbe esser risolto
            if ((laborer.hours === 0 || laborer.hours === null || laborer.hours === "") && (laborer.minutes === 0 || laborer.minutes === null || laborer.minutes === "")) {
                if (laborer.id !== "") {
                    alert("Inserire un orario per i lavoratori valido")
                    return
                }
            }

            if (laborer.id !== "") {
                validatedUsers.push(laborer)
            }
        })
           */



        let validatedVehicles = [...val.vehicles]
        validatedVehicles.pop()


        /*  Dovrebbe esser sufficiente rimuovere l'ultimo
        val.vehicles.forEach((vehicle) => {
            if (vehicle.id !== "") {
                validatedVehicles.push(vehicle)
            }
        })
         */

        //Check that the date is not null, or the work cannot be accepte
        validatedLabour.push({date: val.date, users: validatedUsers, vehicles: validatedVehicles})
    })

    //Check that the date value in newlabour is unique in the array
    validatedLabour.every((val) => {
        if (validatedLabour.filter((labor) => labor.date === val.date).length > 1) {
            throw new Error("data duplicata")
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