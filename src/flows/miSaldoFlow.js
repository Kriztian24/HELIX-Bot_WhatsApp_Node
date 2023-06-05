const { addKeyword } = require('@bot-whatsapp/bot')
const { getConnection } = require('../database/connection')

const MiSaldoFlow = addKeyword(['1'], { sensitive: true })
    .addAnswer(['Estamos procesando tu petición...'], null, async(ctx, { flowDynamic }) => {
        //CONSULTO EL ID DEL CLIENTE
        const pool = await getConnection()
        console.log(ctx.from)
        pool.request()
            .query(`SELECT TOP 1 ID FROM ERICORLA.dbo.CLI_CLIENTES WHERE Teléfono1 = '${ctx.from}'`, async(err, result) => {
                if (err || result.recordset.length <= 0) {
                    console.log(err)
                    flowDynamic('Parece que no eres cliente nuestro o no tienes tu numero de WhatsApp registrado, por favor dejanos tus nombres completos y tu numero de identificacion para registrarte y puedas usar nuestro bot.')
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
                                flowDynamic('Upss... Tenemos Problemas, en un momento te ponemos en contacto con un asesor...')
                            } else {
                                const saldo = result.recordset[0]['Total']
                                await flowDynamic(`Estimad@ *${nombre.split(' ')[0]}*, Tu saldo Actual es: *_$${Number(saldo).toFixed(2)}_*`)
                            }
                        })
                }
            })
    })


module.exports = {
    MiSaldoFlow
}