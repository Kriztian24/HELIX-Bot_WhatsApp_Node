const { addKeyword } = require('@bot-whatsapp/bot')
const { getConnection } = require('../database/connection')
const { MisFacturasFlow } = require('./misFacturasFlow')
const { MiSaldoFlow } = require('./miSaldoFlow')
const { MSG_BIENVENIDA, MSG_HABLAR_ASESOR } = require('../utils/constants')
const { SalirFlow, ByeFlow } = require('./despedidaFlow')

const SALUDOS_KEYWORD = ['Hola', 'buenas', 'saludos', 'que tal', 'hi', 'dias', 'tardes']

const WelcomeFlow = addKeyword(SALUDOS_KEYWORD)
    .addAnswer(MSG_BIENVENIDA)
    .addAnswer([MSG_HABLAR_ASESOR])


const opcionesBot = '1️⃣. Mi Saldo 💵\n2️⃣. Mis Facturas 🧾\n3️⃣. Estado de mis despachos 📦\n4️⃣. _Salir_ 👋'

const BotFlow = addKeyword(['bot'])
    .addAnswer(['Genial, espera un momento muentras validamos tus datos....'], null, async(ctx, { flowDynamic }) => {
        const pool = await getConnection()
            //console.log(ctx.from)
        pool.request()
            .query(`SELECT TOP 1 ID, Código AS Codigo, Ruc, Nombre FROM ERICORLA.dbo.CLI_CLIENTES WHERE Teléfono1 = '${ctx.from}'`, async(err, result) => {
                if (err || result.recordset.length <= 0) {
                    console.log(err)
                    nombre = ''
                    flowDynamic('Parece que no eres cliente nuestro o no tienes tu numero de WhatsApp registrado, por favor dejanos tus nombres completos y tu numero de identificacion para registrarte y puedas usar nuestro bot.')
                } else {
                    nombre = result.recordset[0]['Nombre']
                    await flowDynamic('Estimad@ _*' + nombre.split(' ')[0] + '*_, por favor elije una de las siguientes opciones:')
                    await flowDynamic(opcionesBot)
                    await flowDynamic(['Escriba el número de la opción seleccionada'])
                }
            })
    }, [MisFacturasFlow, MiSaldoFlow, ByeFlow, SalirFlow])


module.exports = {
    WelcomeFlow,
    BotFlow,
    ByeFlow
}