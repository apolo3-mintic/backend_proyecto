import jsonweb from "jsonwebtoken"
import bcrypt from "bcrypt"
const { genSalt, hash } = bcrypt
const {sign, verify} = jsonweb


export async function Encriptacion(contrasena) {
    const salt = await genSalt(10)
    const encriptado = await hash(contrasena, salt)
    return encriptado
}

export async function GeneradorToken(payload) {
    if (Object.keys(payload).includes("exp")){
        delete payload.exp
        delete payload.iat
    }
    const firma = await sign(payload, process.env.SECRETO_JWT, {
        expiresIn: '24h',
    })
    return firma
}

export const ValidarToken = (token) =>{
    if (token){
        const verificacion = verify(token.split(" ")[1], process.env.SECRETO_JWT, (err,data)=>{
            if (err) return { Error: err}
            return {...data}
        })
        return verificacion
    }
    return null
}


