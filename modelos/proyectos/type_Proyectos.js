import { gql } from "apollo-server-express"

const type_Proyectos = gql`


    type Proyecto{
        _id: ID!
        Nombre_Proyecto: String!
        Objetivo_General: String
        Objetivos_Especificos: [String]
        Presupuesto: Float!
        Fecha_Inicio: Date
        Fecha_Terminacion: Date
        Lider_Id: Usuario!
        Estado: enum_EstadoProyecto!
        Fase: enum_FaseProyecto!
        Inscripciones: [Inscripcion]
        Avances_Proyecto: [Avance]
    }

    type Query{
        listarProyectos:[Proyecto]
        buscarProyecto(_id: ID!): Proyecto
        buscarProyectosPorLider(
            Lider_Id: String!
            filtroEstado: enum_EstadoInscripcion
        ): [Proyecto]
    }



    type Mutation{
        crearProyecto(
            Nombre_Proyecto: String!
            Objetivo_General: String
            Objetivos_Especificos: [String]
            Presupuesto: Float!
            Lider_Id: String!
        ): Proyecto
        
        editarProyecto(
            _id: ID!
            Nombre_Proyecto: String
            Objetivo_General: String
            Objetivos_Especificos: [String]
            Presupuesto: Float
        ) : Proyecto

        eliminarProyecto(_id:ID!): Proyecto

        cambiarEstadoProyecto(
            _id: ID!
            Estado: enum_EstadoProyecto!
            Fase: enum_FaseProyecto
        ): Proyecto

        cambiarFaseProyecto(
            _id: ID!
            Fase: enum_FaseProyecto!
        ): Proyecto
    }

`

export default type_Proyectos
/* type Objetivo_Especifico {
    _id: ID!
    Descripcion: String!
}

input crear_especifico {
    Descripcion: String!
} */