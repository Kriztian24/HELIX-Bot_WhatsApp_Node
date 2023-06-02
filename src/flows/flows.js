const { addKeyword } = require('@bot-whatsapp/bot')
const { getClienteByDocumentID } = require('../controllers/data.controller')
const { delay } = require('@adiwajshing/baileys')
const { getConnection } = require('../database/connection')

const SALUDOS_KEYWORD = ['Hola', 'buenas', 'saludos', 'que tal', 'hi', 'ayuda', 'dias', 'tardes', ]


const PrincipalFlow = addKeyword(SALUDOS_KEYWORD)
    .addAnswer(['Bienvenido a HELIX',
        'Soy _Honey bot_ y puedo ayudarte con tus consultas mas frecuentes.',
        'Si quieres conocer las opciones en las que te puedo ayudar escribe *BOT*',
        'Si quieres hablar directamente con un agente deja tu consulta y en un momento te atenderemos'
    ])

const initBotFlow = addKeyword(['bot'])
    .addAnswer(['Genial, ayudame con tu _*número de cédula*_ para poder atenderte mejor y presentarte las opciones en las que te puedo ayudar.'], { capture: true },
        async(ctx, { fallBack }) => {
            if (!ctx.body.lenght == 10) {
                return fallBack()
            }

            let nombre = ''
            const pool = await getConnection()
            await pool.request()
                .query(`SELECT TOP 1 ID, Código AS Codigo, Ruc, Nombre FROM ERICORLA.dbo.CLI_CLIENTES WHERE Ruc = '${ctx.body}'`, (err, result) => {
                    if (err || result.recordset.length <= 0) {
                        console.log(err)
                        nombre = ''
                    } else {
                        nombre = result.recordset[0]['Nombre']
                    }
                })

            await delay(3500)

            console.log('Mensaje Entrante: ', ctx.body, nombre)
        })
    .addAnswer('Hola', { delay: 500 })




module.exports = {
    PrincipalFlow,
    initBotFlow
}