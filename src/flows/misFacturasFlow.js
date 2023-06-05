const { addKeyword } = require('@bot-whatsapp/bot')
const { getConnection } = require('../database/connection')
const { plantillaFacturas } = require('../utils/getPlantillas')
const convertHtmlToImage = require('../utils/convertHtmlToImage')

const MisFacturasFlow = addKeyword(['2'], { sensitive: true })
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
                        .query(`SELECT TOP 10 CONVERT(varchar, Fecha, 103) AS Fecha, Secuencia, Total FROM ERICORLA.dbo.VEN_FACTURAS 
                                    WHERE ClienteID IN ('${ID}', '0000000512') ORDER BY Fecha DESC`, async(err, result) => {
                            if (err || result.recordset.length <= 0) {
                                console.log(err)
                                flowDynamic('Upss... Tenemos Problemas, en un momento te ponemos en contacto con un asesor...')
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

                                await flowDynamic('Si necesitas una factura en concreto escribe *Factura*, si deseas regresar al inicio escribe _bot_')
                            }
                        })
                }
            })
    })


module.exports = {
    MisFacturasFlow
}