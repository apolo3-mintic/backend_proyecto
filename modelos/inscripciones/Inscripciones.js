import mongoose from "mongoose"
const { Schema, model } = mongoose


const esquemaInscripciones = new Schema({

    Proyecto_Id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "proyecto"
    },
    Estudiante_Id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "usuario"
    },
    Estado: {
        type: String,
        enum: ["PENDIENTE", "ACEPTADA", "RECHAZADA"],
        default: "PENDIENTE"
    },
    Fecha_Ingreso: {
        type: Date
    },
    Fecha_Egreso: {
        type: Date
    }
})

const modeloInscripciones = model("inscripciones", esquemaInscripciones, "inscripciones")

export default modeloInscripciones