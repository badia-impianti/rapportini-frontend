const inputValidator = (refuel) => {

    const { km, l, vehicleId } = refuel

    let validatedRefuel = {}

    validatedRefuel.km = parseInt(km)
    validatedRefuel.l = parseFloat(l)
    validatedRefuel.vehicleId = parseInt(vehicleId)


    if (validatedRefuel.km <= 0 || isNaN(validatedRefuel.km)) {
        throw new Error("Chilometri non validi")
    }

    if (validatedRefuel.l <= 0 || isNaN(validatedRefuel.l)) {
        throw new Error("Litri non validi")
    }

    if (validatedRefuel.vehicleId <= 0 || isNaN(validatedRefuel.vehicleId)){
        throw new Error("Veicolo non valido")
    }

    return validatedRefuel

}

export default inputValidator