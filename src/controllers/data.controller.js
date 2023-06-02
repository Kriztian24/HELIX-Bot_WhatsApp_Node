const { getConnection } = require('../database/connection')
const sql = require('mssql')

const getClienteByDocumentID = async(DocumentID) => {
    let nombre = '';
    try {
        const pool = await getConnection()
        await pool.request()
            .query(`SELECT TOP 1 ID, Código AS Codigo, Ruc, Nombre FROM ERICORLA.dbo.CLI_CLIENTES WHERE Ruc = '${DocumentID}'`, (err, result) => {
                if (err || result.recordset.length <= 0) {
                    console.log(err)
                    nombre = ''
                } else {
                    nombre = result.recordset[0]['Nombre']
                }
            })
    } catch (error) {
        console.log(error)
        nombre = ''
    }
    return nombre
}


module.exports = {
    getClienteByDocumentID
}