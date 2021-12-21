import modeloProyectos from "../proyectos/Proyectos.js"
import modeloAvances from "./Avances.js"


const resolvers_Avances = {
    Query: {
        listarAvances: async (parent, arg, context) => {

            if (context.dataUsuario.Rol === "ESTUDIANTE") {
                let filtroPorEstudiante = { Estudiante_Id: context.dataUsuario._id }
                const listadoAvances = await modeloAvances.find({ ...filtroPorEstudiante })
                    .populate("Proyecto_Id")
                    .populate("Estudiante_Id")

                return listadoAvances
            } else if (context.dataUsuario.Rol === "LIDER") {
                const listadoAvances = await modeloAvances.find()
                    .populate("Estudiante_Id")
                    .populate("Proyecto_Id")

                const filtroPorLider = listadoAvances.filter(
                    (avance) => avance.Proyecto_Id.Lider_Id.toString() === arg.Avances_Lider
                )

                return filtroPorLider
            }
        },
        buscarAvance: async (parent, arg) => {
            const buscarPorId = await modeloAvances.findById({ _id: arg._id })
                .populate("Proyecto_Id")
                .populate("Estudiante_Id")
            return buscarPorId
        },
        fitrarAvances: async (parent, arg) => {
            const listadoFiltrado = await modeloAvances.find({ $or: [{ Proyecto_Id: arg.Proyecto_Id }, { Estudiante_Id: arg.Estudiante_Id }] })
                .populate("Proyecto_Id")
                .populate("Estudiante_Id")
            return listadoFiltrado
        }
    },
    Mutation: {
        crearAvance: async (parent, arg, context) => {

            //Autenticacion_Autorizacion(context, ["ESTUDIANTE"])

            const verificarPrimerAvance = await modeloAvances.find({ Proyecto_Id: arg.Proyecto_Id }).limit(1)

            const avanceCreado = await modeloAvances.insertMany({
                Proyecto_Id: arg.Proyecto_Id,
                Estudiante_Id: arg.Estudiante_Id,
                Descripcion: arg.Descripcion
            }, { populate: "Estudiante_Id" })

            if (verificarPrimerAvance.length == 0) {
                await modeloProyectos.findByIdAndUpdate({ _id: arg.Proyecto_Id }, {
                    Fase: "EN_DESARROLLO"
                })
            }

            return avanceCreado[0]
        },
        editarAvance: async (parent, arg) => {
            const avanceEditado = await modeloAvances.findByIdAndUpdate({ _id: arg._id }, {
                Proyecto_Id: arg.Proyecto_Id,
                Descripcion: arg.Descripcion,
            }, { new: true })
            return avanceEditado
        },
        eliminarAvance: async (parent, arg) => {
            const avanceEliminado = await modeloAvances.findByIdAndDelete({ _id: arg._id })
            return avanceEliminado
        },
        agregarObservaciones: async (parent, arg, context) => {
            //Autenticacion_Autorizacion(context, ["LIDER"])

            const observacionAgregada = await modeloAvances.findByIdAndUpdate({ _id: arg._id }, {
                Observaciones: arg.Observaciones
            }, { new: true })
            return observacionAgregada
        }
    }
}

export default resolvers_Avances