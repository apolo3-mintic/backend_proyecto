import resolvers_Auth from "../modelos/auth/resolvers_Auth.js";
import resolvers_Avances from "../modelos/avances/resolvers_Avances.js";
import resolvers_Inscripciones from "../modelos/inscripciones/resolvers_Inscripciones.js";
import resolvers_Proyectos from "../modelos/proyectos/resolvers_Proyectos.js";
import resolvers_Usuarios from "../modelos/usuarios/resolvers_Usuarios.js";

const Resolvers = [resolvers_Usuarios, resolvers_Auth,resolvers_Proyectos, resolvers_Inscripciones, resolvers_Avances]

export default Resolvers
