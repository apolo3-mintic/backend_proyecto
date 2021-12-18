import { gql } from "apollo-server-express"

const type_Usuarios = gql `

    type Usuario{
        _id: ID!
        Primer_Nombre: String!
        Segundo_Nombre: String
        Primer_Apellido: String!
        Segundo_Apellido: String!
        Correo: String!
        Identificacion: String!
        Contrasena: String!
        Rol: enum_Roles!
        Estado: enum_EstadoRegistro!
        Proyectos_Liderados: [Proyecto]
        Inscripciones: [Inscripcion]
        Avances_Estudiantes: [Avance]
    }

    type Query{
        listarUsuarios(
            filtroRol: enum_Roles
        ): [Usuario]
        buscarUsuario(
            _id: ID
            correoOidentificacion: String
            FiltroInscripciones: enum_EstadoInscripcion
        ):Usuario
    }
    
    type Mutation{
        crearUsuario(
            Primer_Nombre: String!
            Segundo_Nombre: String
            Primer_Apellido: String!
            Segundo_Apellido: String!
            Correo: String!
            Identificacion: String!
            Contrasena: String!
            Rol: enum_Roles!
        ): Usuario

        editarUsuario_Id(
            _id:ID!
            Primer_Nombre: String
            Segundo_Nombre: String
            Primer_Apellido: String
            Segundo_Apellido: String
            Correo: String
            Identificacion: String
            Contrasena: String
            Estado: enum_EstadoRegistro
        ): Usuario

        eliminarUsuario(
            _id: String
            Correo: String
            Identificacion: String
        ): Usuario

        cambiarEstadoUsuario(
            _id: ID!
            EstadoPorAdmin: enum_EstadoRegistro
            EstadoPorLider: enum_EstadoRegistroLider
        ): Usuario
    }

`

export default type_Usuarios