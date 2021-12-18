import { gql } from "apollo-server-express"

const type_Inscripciones = gql `


    type Inscripcion{
        _id: ID!
        Proyecto_Id: Proyecto!
        Estudiante_Id: Usuario!
        Estado: enum_EstadoInscripcion!
        Fecha_Ingreso: Date
        Fecha_Egreso: Date
    }

    type Query{
        listarInscripciones: [Inscripcion]
        listarPorIdProyecto(Proyecto_Id: String!):[Inscripcion]
        buscarInscripcion(_id: ID!): Inscripcion
    }

    type Mutation{
        crearInscripcion(
            Proyecto_Id: String!
            Estudiante_Id: String!
        ):Inscripcion

        editarInscripcion(
            _id: ID!
            Proyecto_Id: String
            Estado: enum_EstadoInscripcion
            Fecha_Ingreso: Date
            Fecha_Egreso: Date
        ):Inscripcion

        eliminarInscripcion(_id: ID!):Inscripcion

        modificarEstadoInscripcion(
            _id: ID!
        ): Inscripcion

        aceptarInscripcion(
            _id: ID!
            Estado: enum_EstadoInscripcion!
        ): Inscripcion
    }


`

export default type_Inscripciones
/*
aceptarInscripcion(_id: ID!): Inscripcion
*/