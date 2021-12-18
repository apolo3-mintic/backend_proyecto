import mongosee from "mongoose"

const conexionBD = async() => {
    await mongosee.connect(process.env.BASEDATOS_URL)
        .then(() => console.log("base datos conectada"))
}

export default conexionBD