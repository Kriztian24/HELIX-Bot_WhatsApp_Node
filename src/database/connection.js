const sql = require('mssql');

//se define un objeto dbSettings que contiene la configuración de la conexión a la base de datos
const dbSettings = {
    user: "helix",
    password: "Metallica1982*",
    server: "192.168.0.2",
    database: "HELIX-E",
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    requestTimeout: 300000
}

//función getConnection  se utiliza para establecer una conexión con una 
//base de datos SQL Server utilizando la biblioteca mssql. 
//devuelve un objeto de conexión  utilizado para consultas y otras operaciones en la base de datos.
const getConnection = async() => {
    try {
        const pool = await sql.connect(dbSettings)
        return pool
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getConnection
}