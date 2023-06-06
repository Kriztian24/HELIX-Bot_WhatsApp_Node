const { addKeyword } = require('@bot-whatsapp/bot')
const { getConnection } = require('../database/connection')
const { MSG_PROCESANDO_PETICION, MSG_NO_ESTA_REGISTRADO, MSG_TENEMOS_PROBLEMAS, MSG_NECESITA_AYUDA } = require('../utils/constants')
const { ByeFlow } = require('./despedidaFlow')

const MiSaldoFlow = addKeyword(['1'], { sensitive: true })
    .addAnswer([MSG_PROCESANDO_PETICION], null, async(ctx, { flowDynamic }) => {
        //CONSULTO EL ID DEL CLIENTE
        const pool = await getConnection()
        pool.request()
            .query(`SELECT TOP 1 ID FROM ERICORLA.dbo.CLI_CLIENTES WHERE Teléfono1 = '${ctx.from}'`, async(err, result) => {
                if (err || result.recordset.length <= 0) {
                    console.log(err)
                    flowDynamic(MSG_NO_ESTA_REGISTRADO)
                } else {
                    ID = result.recordset[0]['ID'].split(' ')[0]

                    //CONSULTO LAS FACTURAS
                    const pool = await getConnection()
                    console.log(ctx.from)
                    pool.request()
                        .query(`SELECT TOP 10  SUM(Total) AS Total FROM ERICORLA.dbo.VEN_FACTURAS  
                                    WHERE ClienteID IN ('${ID}', '0000000512')`, async(err, result) => {
                            if (err || result.recordset.length <= 0) {
                                console.log(err)
                                flowDynamic(MSG_TENEMOS_PROBLEMAS)
                            } else {
                                const saldo = result.recordset[0]['Total']
                                await flowDynamic(`Estimad@ *${nombre.split(' ')[0]}*, Tu saldo Actual es: *_$${Number(saldo).toFixed(2)}_*`)
                                await flowDynamic(MSG_NECESITA_AYUDA)
                            }
                        })
                }
            })
    }, [ByeFlow])


module.exports = {
    MiSaldoFlow
}