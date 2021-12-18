import express from "express"
import cors from "cors"
import { ApolloServer } from "apollo-server-express"
import conexionBD from "./basedatos.config/basedatos.js"
import Types from "./graphql/typeDefs.js"
import Resolvers from "./graphql/resolvers.js"
import { ValidarToken } from "./modelos/auth/Auth.js"
import dotenv from 'dotenv';

dotenv.config()

const app = express()
const puerto = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const servidor = new ApolloServer({
    typeDefs: Types,
    resolvers: Resolvers,
    context: ({ req, res }) => {
        const token = req.headers?.authorization ?? null
        if (token) {
            const dataUsuario = ValidarToken(token)
            if (dataUsuario) {
                return { dataUsuario: dataUsuario }
            }
        }
        return { Error: "Su sesion expiró o no ha ingresado correctamente" }
    },

})

/* app.use((req, res, next) => {
    if (!req.headers.authorization) {
        res.send(new ApolloError("problemas asquis"))
    } else {
        next()
    }
}) */

app.listen(puerto, async () => {
    conexionBD()
        .then(() => servidor.start())
        .then(() => servidor.applyMiddleware({ app }))
        .then(() => console.log("conexion exitosa al servidor, puerto =>", puerto))
        .catch(e => console.warn({ messageError: e }))
})