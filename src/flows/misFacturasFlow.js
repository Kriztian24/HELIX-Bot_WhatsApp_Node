const { addKeyword } = require('@bot-whatsapp/bot')
const { getConnection } = require('../database/connection')
const { plantillaFacturas } = require('../utils/getPlantillas')
const convertHtmlToImage = require('../utils/convertHtmlToImage')
const { MSG_PROCESANDO_PETICION, MSG_NO_ESTA_REGISTRADO, MSG_TENEMOS_PROBLEMAS, MSG_NECESITO_FACTURA, MSG_NUMERO_FACTURA } = require('../utils/constants')
const { ByeFlow } = require('./despedidaFlow')


const FacturaFlow = addKeyword(['factura'])
    .addAnswer([MSG_NUMERO_FACTURA], { capture: true }, async(ctx, { flowDynamic, fallBack }) => {
        //valido si escribio el numero de secuencia
        if (!ctx.body.includes('-') || ctx.body.length != 17) return fallBack()

        //CONSULTO EL ID DEL CLIENTE
        const pool = await getConnection()
        pool.request()
            .query(`SELECT TOP 1 ID FROM ERICORLA.dbo.CLI_CLIENTES WHERE Teléfono1 = '${ctx.from}'`, async(err, result) => {
                if (err || result.recordset.length <= 0) {
                    console.log(err)
                    flowDynamic(MSG_NO_ESTA_REGISTRADO)
                } else {
                    ID = result.recordset[0]['ID'].split(' ')[0]
                    flowDynamic([ctx.body, ID])
                        //TODO consulto si existe, creo y le envio la factura
                }
            })
    }, [ByeFlow])


const MisFacturasFlow = addKeyword(['2'], { sensitive: true })
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
                        .query(`SELECT TOP 10 CONVERT(varchar, Fecha, 103) AS Fecha, Secuencia, Total FROM ERICORLA.dbo.VEN_FACTURAS 
                                    WHERE ClienteID IN ('${ID}', '0000000512') ORDER BY Fecha DESC`, async(err, result) => {
                            if (err || result.recordset.length <= 0) {
                                console.log(err)
                                flowDynamic(MSG_TENEMOS_PROBLEMAS)
                            } else {
                                const facturas = result.recordset
                                var plantilla = plantillaFacturas()
                                plantilla = plantilla.replace('@Cliente', nombre)

                                var data = ''
                                for (let i = 0; i < facturas.length; i++) {
                                    data += `<tr>
                                                <td>${facturas[i]['Fecha']}</td>
                                                <td>${facturas[i]['Secuencia']}</td>
                                                <td>$${facturas[i]['Total']}</td>
                                            </tr>`
                                }
                                plantilla = plantilla.replace('@Data', data)

                                const rutaImagen = await convertHtmlToImage(plantilla)

                                await flowDynamic({
                                    body: `*${nombre.split(' ')[0]}*, tus últimas Facturas son:`,
                                    media: rutaImagen
                                })

                                await flowDynamic(MSG_NECESITO_FACTURA)
                            }
                        })
                }
            })
    }, [FacturaFlow, ByeFlow])


module.exports = {
    MisFacturasFlow
}