import { gql } from "apollo-server-express"

import type_Auth from "../modelos/auth/type_Auth.js"
import type_Avances from "../modelos/avances/type_Avances.js"
import type_Inscripciones from "../modelos/inscripciones/type_Inscripciones.js"
import type_Proyectos from "../modelos/proyectos/type_Proyectos.js"
import type_Usuarios from "../modelos/usuarios/type_Usuarios.js"

const type_General = gql`
    scalar Date

    enum enum_Roles{
        ESTUDIANTE
        LIDER
        ADMINISTRADOR
    }

    enum enum_EstadoRegistro{
        PENDIENTE
        AUTORIZADO
        NO_AUTORIZADO
    }

    enum enum_EstadoInscripcion{
        PENDIENTE
        ACEPTADA
        RECHAZADA
    }

    enum enum_EstadoProyecto{
        ACTIVO
        INACTIVO
    }
    enum enum_FaseProyecto{
        INICIADO
        EN_DESARROLLO
        TERMINADO
        NULL
    }

`
const Types = [type_General, type_Usuarios, type_Auth, type_Proyectos, type_Inscripciones, type_Avances]

export default Types

