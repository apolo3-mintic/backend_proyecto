import mongoose from "mongoose"
const { Schema, model } = mongoose

const esquemaProyectos = new Schema({
    Nombre_Proyecto: {
        type: String,
        required: true,
        unique: true
    },
    Presupuesto: {
        type: Number,
        required: true
    },
    Objetivo_General: {
        type: String
    },
    Objetivos_Especificos: [{
        type: String
    }],
    Fecha_Inicio: {
        type: Date
    },
    Fecha_Terminacion: {
        type: Date
    },
    Lider_Id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "usuario"
    },
    Estado: {
        type: String,
        enum: ["ACTIVO", "INACTIVO"],
        default: "INACTIVO"
    },
    Fase: {
        type: String,
        enum: ["INICIADO", "EN_DESARROLLO", "TERMINADO", "NULL"],
        default: "NULL"
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


/* query virtual => permite traer los campos del documento referenciado hacia el presente documento
pero solo en cache, el campo Inscripciones no existe en el documento de la BD
*/
esquemaProyectos.virtual("Inscripciones", { /* Inscripciones es el nombre campo virtual a agregar */
    ref: "inscripciones",
    /*El documento desde el cual se quiere traer informacion */
    localField: "_id",
    /*El enlace de presente documento el cual pertenece a un campo del documento referenciado*/
    foreignField: "Proyecto_Id" /*El campo del documento referenciado que contiene el mismo valor de localField */
})

esquemaProyectos.virtual("Avances_Proyecto", {
    ref: "avances",
    localField: "_id",
    foreignField: "Proyecto_Id"
})


const modeloProyectos = model("proyecto", esquemaProyectos)

export default modeloProyectos