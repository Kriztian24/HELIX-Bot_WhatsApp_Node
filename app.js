const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

//const QRPortalWeb = require('@bot-whatsapp/portal')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
const { WelcomeFlow, BotFlow } = require('./src/flows/flows')

/*const ChatGPTClass = require('./src/openai/chatgpt.class')
const createBotGPT = async({ provider, database }) => {
    return new ChatGPTClass(database, provider)
}*/

/******************************************************************************************************/
/*const finalizacionFlujo = addKeyword(['gracias', 'chao', 'bye'])
    .addAnswer('Hasta otra ocasión, chao.')

const flujoUno = addKeyword(['uno'])
    .addAnswer('Escribiste el numero *Uno*')

const flujoConRespuestaApi = addKeyword(['Pedir'], { sensitive: true })
    .addAnswer('El menu del dia es el siguiente:', null, async(ctx, { flowDynamic }) => {
        //aqui iria la peticion al Api o al servidor
        //const data = await metodoApiParaTraerRegistros();
        //flowDynamic(data)

        flowDynamic([{ body: '1. mensaje ' }, { body: '2. mensaje' }, { body: '3. mensaje' }])
    })
    .addAnswer('Si te interesa alguna opcion escribe el *numero* de la opcion en letras', { delay: 1500 }, null, [flujoUno])

const flujoImagen = addKeyword('imagen')
    .addAnswer('esta es tu imagen', {
        media: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSph1l-PpljS-lY_czJi5Rcj-jInHOBwzbrw&usqp=CAU'
    })

const flujoBotones = addKeyword('botones')
    .addAnswer('Te envio estos botones', {
        buttons: [
            { body: 'imagen' },
            { body: 'Pedir' },
            { body: 'chao' }
        ]
    })
*/


const main = async() => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([WelcomeFlow, BotFlow])
    const adapterProvider = createProvider(BaileysProvider)

    /*createBotGPT({
        provider: adapterProvider,
        database: adapterDB,
    })*/

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    //QRPortalWeb()
}

main()