import mongoose from "mongoose"
const { Schema, model } = mongoose

const esquemaUsuarios = new Schema({

    Primer_Nombre: {
        type: String,
        required: true
    },
    Segundo_Nombre: {
        type: String
    },
    Primer_Apellido: {
        type: String,
        required: true
    },
    Segundo_Apellido: {
        type: String,
        required: true
    },
    Correo: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            }
        }
    },
    Identificacion: {
        type: String,
        required: true,
        unique: true
    },
    Contrasena: {
        type: String,
        required: true
    },
    Rol: {
        type: String,
        required: true,
        enum: ["ESTUDIANTE", "LIDER", "ADMINISTRADOR"]
    },
    Estado: {
        type: String,
        enum: ["PENDIENTE", "AUTORIZADO", "NO_AUTORIZADO"],
        default: "PENDIENTE"
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

esquemaUsuarios.virtual("Proyectos_Liderados", {
    ref: "proyecto",
    localField: "_id",
    foreignField: "Lider_Id"
})

esquemaUsuarios.virtual("Inscripciones", {
    ref: "inscripciones",
    localField: "_id",
    foreignField: "Estudiante_Id"
})

esquemaUsuarios.virtual("Avances_Estudiantes", {
    ref: "avances",
    localField: "_id",
    foreignField: "Estudiante_Id"
})

const modeloUsuarios = model("usuario", esquemaUsuarios)

export default modeloUsuarios