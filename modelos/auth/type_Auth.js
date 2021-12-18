import { gql, AuthenticationError, ForbiddenError } from "apollo-server-express"

const type_Auth = gql`

    type Token{
        Token: String
        Error: String
    }

    type Query{
        refrescarTokenUsuario: Token
    }

    type Mutation{

        registrarUsuario(
            Primer_Nombre: String!
            Segundo_Nombre: String
            Primer_Apellido: String!
            Segundo_Apellido: String!
            Correo: String!
            Identificacion: String!
            Contrasena: String!
            Rol: enum_Roles!
        ): Token
        
        loginUsuario(Correo: String!, Contrasena: String!): Token
    
    }

`
export const Autenticacion_Autorizacion = (context, listaPermitida) => {
    if (!context.dataUsuario) {
        throw new AuthenticationError("Usted no se encuentra autenticado.")
    } else {
        if (listaPermitida.includes(context.dataUsuario.Rol)) {
            return
        } else {
            throw new ForbiddenError("No tienes permisos para realizar esta accion.")
        }
    }
}

export default type_Auth
