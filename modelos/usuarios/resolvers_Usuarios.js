import { Autenticacion_Autorizacion } from "../auth/type_Auth.js"
import modeloUsuarios from "./Usuarios.js"


const resolvers_Usuarios = {
    Query: {
        listarUsuarios: async (parent, arg, context) => {
            //Autenticacion_Autorizacion(context, ["LIDER", "ADMINISTRADOR"])

            const filtroRol = arg.filtroRol && { Rol: { $eq: `${arg.filtroRol}` } }
            const listaUsuarios = await modeloUsuarios.find({ ...filtroRol })
                .populate("Proyectos_Liderados")
                .populate({ path: "Inscripciones", populate: "Proyecto_Id" })
                .populate({ path: "Avances_Estudiantes", populate: "Proyecto_Id" })

            return listaUsuarios
        },
        buscarUsuario: async (parent, arg) => {

            const filtroEstadoInscripcion = arg.FiltroInscripciones && { Estado: arg.FiltroInscripciones }

            if (Object.keys(arg).includes("_id")) {
                const buscarUsuario = await modeloUsuarios.findById({ _id: arg._id })
                    .populate("Proyectos_Liderados")
                    .populate({ path: "Inscripciones", match: { ...filtroEstadoInscripcion }, populate: "Proyecto_Id" })
                    .populate({ path: "Avances_Estudiantes", populate: "Proyecto_Id" })

                return buscarUsuario

            } else if (Object.keys(arg).includes("correoOidentificacion")) {
                const buscarUsuario = await modeloUsuarios.findOne({ $or: [{ Correo: arg.correoOidentificacion }, { Identificacion: arg.correoOidentificacion }] })
                    .populate("Proyectos_Liderados")
                    .populate({ path: "Inscripciones", match: { ...filtroinscripcion }, populate: "Proyecto_Id" })
                    .populate({ path: "Avances_Estudiantes", populate: "Proyecto_Id" })

                return buscarUsuario
            }
        }
    },
    Mutation: {
        crearUsuario: async (parent, arg) => {
            const hash_contrasena = await Encriptacion(arg.Contrasena)
            const usuarioCreado = await modeloUsuarios.create({
                Primer_Nombre: arg.Primer_Nombre,
                Segundo_Nombre: arg.Segundo_Nombre,
                Primer_Apellido: arg.Primer_Apellido,
                Segundo_Apellido: arg.Segundo_Apellido,
                Correo: arg.Correo,
                Identificacion: arg.Identificacion,
                Contrasena: hash_contrasena,
                Rol: arg.Rol,
            })
            return usuarioCreado
        },
        editarUsuario_Id: async (parent, arg) => {
            let hash_contrasena
            if (arg.Contrasena) {
                hash_contrasena = await Encriptacion(arg.Contrasena)
            }
            const usuarioEditadoId = await modeloUsuarios.findByIdAndUpdate({ _id: arg._id }, {
                Primer_Nombre: arg.Primer_Nombre,
                Segundo_Nombre: arg.Segundo_Nombre,
                Primer_Apellido: arg.Primer_Apellido,
                Segundo_Apellido: arg.Segundo_Apellido,
                Correo: arg.Correo,
                Identificacion: arg.Identificacion,
                Contrasena: hash_contrasena,
                Estado: arg.Estado
            }, { new: true })

            return usuarioEditadoId
        },
        eliminarUsuario: async (parent, arg) => {
            if (Object.keys(arg).includes("_id")) {
                const usuarioEliminado = await modeloUsuarios.findByIdAndDelete({ _id: arg._id })
                return usuarioEliminado
            } else if (Object.keys(arg).includes("Correo")) {
                const usuarioEliminado = await modeloUsuarios.findOneAndDelete({ Correo: arg.Correo })
                return usuarioEliminado
            } else if (Object.keys(arg).includes("Identificacion")) {
                const usuarioEliminado = await modeloUsuarios.findOneAndDelete({ Identificacion: arg.Identificacion })
                return usuarioEliminado
            }
        },
        cambiarEstadoUsuario: async (parent, arg, context) => {

            Autenticacion_Autorizacion(context, ["ADMINISTRADOR", "LIDER"])
            const edicionEstadoUsuario = await modeloUsuarios.findByIdAndUpdate({ _id: arg._id }, {
                Estado: arg.Estado
            }, { new: true })
            return edicionEstadoUsuario

        }

    }
}

export default resolvers_Usuarios
/*
else if (Object.keys(arg).includes("Identificacion")) {
const buscarUsuario = await modeloUsuarios.findOne({ Identificacion: arg.Identificacion })
.populate("Proyectos_Liderados")
.populate({ path: "Inscripciones", populate: "Proyecto_Id" })

return buscarUsuario
*/