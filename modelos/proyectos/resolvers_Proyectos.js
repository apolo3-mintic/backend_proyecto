import { Autenticacion_Autorizacion } from "../auth/type_Auth.js"
import modeloInscripciones from "../inscripciones/Inscripciones.js"
import modeloProyectos from "./Proyectos.js"

const resolvers_Proyectos = {
    Query: {
        listarProyectos: async (parent, arg, context) => {
            //Autenticacion_Autorizacion(context, ["ADMINISTRADOR", "ESTUDIANTE"])
            let filtroPorLider = arg.filtro && { Lider_Id: arg.filtro  }

            const listadoProyectos = await modeloProyectos.find({ ...filtroPorLider })
                .populate("Lider_Id")
                .populate({ path: "Inscripciones", populate: "Estudiante_Id" })
                .populate({ path: "Avances_Proyecto", populate: "Estudiante_Id" })


            return listadoProyectos
        },
        buscarProyecto: async (parent, arg) => {
            const proyecto = await modeloProyectos.findById({ _id: arg._id })
                .populate("Lider_Id")
                .populate({ path: "Inscripciones", populate: "Estudiante_Id" })
                .populate({ path: "Avances_Proyecto", populate: "Estudiante_Id" })


            return proyecto
        },
        buscarProyectosPorLider: async (parent, arg) => {
            const filtroEstadoInscripcion = arg.filtroEstado && { Estado: { $eq: `${arg.filtroEstado}` } }

            const proyectosPorLider = await modeloProyectos.find({ Lider_Id: arg.Lider_Id })
                .populate("Lider_Id")
                .populate({ path: "Inscripciones", match: { ...filtroEstadoInscripcion }, populate: "Estudiante_Id" })
                .populate({ path: "Avances_Proyecto", populate: "Estudiante_Id" })

            return proyectosPorLider
        }
    },
    Mutation: {
        crearProyecto: async (parent, arg, context) => {
            //Autenticacion_Autorizacion(context, ["LIDER"])
            const proyectoCreado = await modeloProyectos.create({
                Nombre_Proyecto: arg.Nombre_Proyecto,
                Objetivo_General: arg.Objetivo_General,
                Objetivos_Especificos: arg.Objetivos_Especificos,
                Presupuesto: arg.Presupuesto,
                Lider_Id: arg.Lider_Id
            })

            //const proyecto = await modeloProyectos.findById({ _id: proyectoCreado._id }).populate("Lider_Id")
            return proyectoCreado
        },
        editarProyecto: async (parent, arg, context) => {
            Autenticacion_Autorizacion(context, ["LIDER"])
            const proyectoBuscado = await modeloProyectos.findById({ _id: arg._id }, { Estado: 1 })

            // verificar que no se pueda enviar si el estado es INACTIVO desde el front
            if (proyectoBuscado.Estado === "ACTIVO") {
                const proyectoEditado = await modeloProyectos.findByIdAndUpdate({ _id: arg._id }, {
                    Nombre_Proyecto: arg.Nombre_Proyecto,
                    Objetivo_General: arg.Objetivo_General,
                    Objetivos_Especificos: arg.Objetivos_Especificos,
                    Presupuesto: arg.Presupuesto,
                }, { new: true })

                return proyectoEditado
            }
        },
        eliminarProyecto: async (parent, arg) => {
            const proyectoEliminado = await modeloProyectos.findByIdAndDelete({ _id: arg._id })
            return proyectoEliminado
        },
        cambiarEstadoProyecto: async (parent, arg, context) => { //verificar que este completa esta mutacion
            Autenticacion_Autorizacion(context, ["ADMINISTRADOR"])
            // se pasa la fase desde el front - el usuario no lo incluye
            if (arg.Fase === "NULL" && arg.Estado === "ACTIVO") {
                const edicionEstadoProyecto = await modeloProyectos.findByIdAndUpdate({ _id: arg._id }, {
                    Estado: arg.Estado,
                    Fase: "INICIADO",
                    Fecha_Inicio: Date.now()
                }, { new: true })

                return edicionEstadoProyecto

            } else if (arg.Estado === "INACTIVO") {
                const edicionEstadoProyecto = await modeloProyectos.findByIdAndUpdate({ _id: arg._id }, {
                    Estado: arg.Estado,
                    Fecha_Terminacion: Date.now()
                }, { new: true })

                if (edicionEstadoProyecto._id) {
                    await modeloInscripciones.updateMany({
                        Proyecto_Id: arg._id,
                        Estado: "ACEPTADA",
                        Fecha_Egreso: { $exists: false }
                    }, {
                        Fecha_Egreso: Date.now()
                    }, { new: true })
                }

                return edicionEstadoProyecto

            } else if (arg.Estado === "ACTIVO") {
                const edicionEstadoProyecto = await modeloProyectos.findByIdAndUpdate({ _id: arg._id }, {
                    Estado: arg.Estado,
                }, { new: true })

                return edicionEstadoProyecto
            }
        },
        cambiarFaseProyecto: async (parent, arg, context) => {
            Autenticacion_Autorizacion(context, ["ADMINISTRADOR"])

            const verificarFaseProyecto = await modeloProyectos.findById({ _id: arg._id }, { Fase: 1 })

            if (arg.Fase === "TERMINADO" && verificarFaseProyecto.Fase === "EN_DESARROLLO") {
                const edicionFaseProyecto = await modeloProyectos.findByIdAndUpdate({ _id: arg._id }, {
                    Fase: arg.Fase,
                    Estado: "INACTIVO",
                    Fecha_Terminacion: Date.now()
                }, { new: true })
                
                // no tuve en en cuenta la condicion de que se pone inactivo y afecta a las inscripciones

                return edicionFaseProyecto
            }
        }
    }
}

export default resolvers_Proyectos
/*
 if (arg.Objetivos_Especificos) {
                var array = []
                proyectoEditado.Objetivos_Especificos.map(elem => {
                    arg.Objetivos_Especificos.map(elem2 => {
                        if (elem._id === elem2._id) {
                            elem.Descripcion = elem2.Descripcion
                        } else {
                            array.push(elem2)
                        }
                    })
                })
                if (array.length > 0) {
                    var arrayfinal = proyectoEditado.Objetivos_Especificos.concat(array)
                }

                const nuevoProyectoEditado = await modeloProyectos.findByIdAndUpdate({ _id: arg._id }, {
                    Objetivos_Especificos: arrayfinal,
                }, { new: true })

                return nuevoProyectoEditado
            }
*/