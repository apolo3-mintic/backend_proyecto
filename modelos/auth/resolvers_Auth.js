import bcrypt from "bcrypt"
import { GeneradorToken,Encriptacion } from "./Auth.js"
import modeloUsuarios from "../usuarios/Usuarios.js"
const { compare } = bcrypt

const resolvers_Auth = {
    Query:{
        refrescarTokenUsuario: async(parent, arg, context) => {
            if(!context.dataUsuario){
                return { Error: "Token no valido"}
            } else{
                //context.dataUsuario.exp = null
                const tokenRenovado = await GeneradorToken({...context.dataUsuario})
                return {Token : tokenRenovado }
            }
        }
    },
    Mutation: {
        registrarUsuario: async (parent, arg) => {
            const hash_contrasena = await Encriptacion(arg.Contrasena)
            const registroCreado = await modeloUsuarios.create({
                Primer_Nombre: arg.Primer_Nombre,
                Segundo_Nombre: arg.Segundo_Nombre,
                Primer_Apellido: arg.Primer_Apellido,
                Segundo_Apellido: arg.Segundo_Apellido,
                Correo: arg.Correo,
                Identificacion: arg.Identificacion,
                Contrasena: hash_contrasena,
                Rol: arg.Rol,
            })
            
            delete registroCreado._doc.Contrasena //Revisar si el _doc es por la version de mongo
            const token = await GeneradorToken({ ...registroCreado._doc })

            return { Token: token }
        },
        loginUsuario: async (parent, arg) => {
            const usuarioEncontrado = await modeloUsuarios.findOne({ Correo: arg.Correo })
            
            if (!usuarioEncontrado) return { Error: "El usuario no se encuentra registrado en nuestra base de datos" }

            const verificacion = await compare(arg.Contrasena, usuarioEncontrado.Contrasena)
            delete usuarioEncontrado._doc.Contrasena

            if (verificacion) {
                const token = await GeneradorToken({ ...usuarioEncontrado._doc })
                return { Token: token }
            } else {
                return { Error: "El usuario o la contraseña son incorrectos" }
            }

        }

    }
}

export default resolvers_Auth