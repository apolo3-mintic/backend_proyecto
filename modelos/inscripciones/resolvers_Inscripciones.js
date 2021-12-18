import { Autenticacion_Autorizacion } from "../auth/type_Auth.js"
import modeloInscripciones from "./Inscripciones.js"


const resolvers_Inscripciones = {
    Query: {
        listarInscripciones: async (parent, arg) => {
            const listadoInscripciones = await modeloInscripciones.find()
                .populate("Estudiante_Id")
                .populate("Proyecto_Id")
            return listadoInscripciones
        },
        listarPorIdProyecto: async (parent, arg) => {
            const listaPorProyecto = await modeloInscripciones.find({ Proyecto_Id: arg.Proyecto_Id })
                .populate("Estudiante_Id")
                .populate("Proyecto_Id")
            return listaPorProyecto
        },
        buscarInscripcion: async (parent, arg) => {
            const buscarPorId = await modeloInscripciones.findById({ _id: arg._id })
                .populate("Estudiante_Id")
                .populate("Proyecto_Id")
            return buscarPorId
        }
    },
    Mutation: {
        crearInscripcion: async (parent, arg, context) => {
            Autenticacion_Autorizacion(context, ["ESTUDIANTE"])
            if (context.dataUsuario.Estado === "ACEPTADA") {

                const inscripcionCreada = await modeloInscripciones.create({
                    Proyecto_Id: arg.Proyecto_Id,
                    Estudiante_Id: arg.Estudiante_Id
                })
                return inscripcionCreada
            }
        },
        editarInscripcion: async (parent, arg) => {
 
            const inscripcionEditada = await modeloInscripciones.findByIdAndUpdate({ _id: arg._id }, {
                Proyecto_Id: arg.Proyecto_Id,
                Estado: arg.Estado,
                Fecha_Ingreso: arg.Fecha_Ingreso,
                Fecha_Egreso: arg.Fecha_Egreso
            }, { new: true })

            return inscripcionEditada
        },
        eliminarInscripcion: async (parent, arg) => {
            const inscripcionEliminada = await modeloInscripciones.findByIdAndDelete({ _id: arg._id })
            return inscripcionEliminada
        },
        modificarEstadoInscripcion: async (parent, arg, context) => {

            Autenticacion_Autorizacion(context, ["LIDER"])

            if (arg.Estado === "ACEPTADA") {
                const estadoModificado = await modeloInscripciones.findByIdAndUpdate({ _id: arg._id }, {
                    Estado: arg.Estado,
                    Fecha_Ingreso: Date.now()
                })
                return estadoModificado
            } else {
                const estadoModificado = await modeloInscripciones.findByIdAndUpdate({ _id: arg._id }, {
                    Estado: arg.Estado,
                })
                return estadoModificado
            }
        },
        aceptarInscripcion: async (parent, arg) => {
            if (arg.Estado === "ACEPTADA") {
                arg.Fecha_Ingreso = Date.now()
            }
            const inscripcionAceptada = await modeloInscripciones.findByIdAndUpdate({ _id: arg._id }, {
                Estado: arg.Estado,
                Fecha_Ingreso: arg.Fecha_Ingreso,
            }, { new: true })

            return inscripcionAceptada
        }
    }

}

export default resolvers_Inscripciones
/*
        aceptarInscripcion: async(parent, arg) => {
            const inscripcionAceptada = await modeloInscripciones.findByIdAndUpdate({ _id: arg._id }, {

                Fecha_Ingreso: Date.now()
            })
            return inscripcionAceptada
        }
*/