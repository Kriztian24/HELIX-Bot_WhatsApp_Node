require("dotenv").config()
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const WhatsappProvider = require('@bot-whatsapp/provider/web-whatsapp')
const JsonFileAdapter = require('@bot-whatsapp/database/json')


const ChatGPTClass = require('./src/openai/chatgpt.class')
const chatGPT = new ChatGPTClass()

const FlowPrincipal = require("./src/flows/flowPrincipal")
const { flowReparacion } = require("./src/flows/flowReparaciones")
    //const { WelcomeFlow, BotFlow } = require('./src/flows/flows')


const main = async() => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow(
        [
            FlowPrincipal,
            //FlowAgente,
            flowReparacion(chatGPT)
        ]
    )

    const adapterProvider = createProvider(WhatsappProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()