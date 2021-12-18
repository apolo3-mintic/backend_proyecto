import { gql } from "apollo-server-express"

const type_Avances = gql `

    type Avance{
        _id: ID!
        Proyecto_Id: Proyecto!
        Estudiante_Id: Usuario!
        Fecha_Avance: Date!
        Descripcion: String!
        Observaciones: String
    }

    type Query{
        listarAvances:[Avance]
        buscarAvance(_id: ID!): Avance
        fitrarAvances(
            Proyecto_Id: String
            Estudiante_Id: String
        ): [Avance]
    }

    type Mutation{
        crearAvance(
            Proyecto_Id: String!
            Estudiante_Id: String!
            Descripcion: String!
        ): Avance

        editarAvance(
            _id: ID!
            Proyecto_Id:String
            Descripcion: String
            Observaciones: String
        ): Avance

        eliminarAvance(_id: ID!): Avance

        agregarObservaciones(
            _id: ID!
            Observaciones: String!
        ): Avance
    }

`

export default type_Avances