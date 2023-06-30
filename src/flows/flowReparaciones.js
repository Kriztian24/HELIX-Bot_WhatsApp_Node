const { addKeyword } = require("@bot-whatsapp/bot")
const { readFileSync } = require("fs")
const { join } = require("path")
const delay = (ms) => new Promise((res => setTimeout(res, ms)))

const FlowPrincipal = require("./flowPrincipal")


const getPromt = async() => {
    const pathPrompt = join(process.cwd(), "prompts")
    const text = readFileSync(join(pathPrompt, "Prompt_SoporteTecnico.txt"), "utf-8")
    return text
}


module.exports = {
    flowReparacion: (chatgptClass) => {
        return addKeyword("1", { sensitive: true })
            .addAction(async(ctx, { endFlow, flowDynamic, provider }) => {
                await flowDynamic("Consultando a la base de datos....")

                // await delay(500)

                const lastTicket = `[ID_CLIENTE: 593990179723, cliente: Kristian, Modelo: Iphone 14 Pro Max, Descripcion: Daño de pantalla le callo agua, Estado: en Reparacion, ObservacionTecnico: le entro coca cola en los contactos],
                [ID_CLIENTE: 593990179723, cliente: Kristian, Modelo: Samsung j7 Pro, Descripcion: Daño en la Memoria, Estado: Reparado, ObservacionTecnico: se le cambio la memoria por una nueva, lo puede venir a retirar]`

                const data = await getPromt()
                await chatgptClass.handleMsgChatGPT(data)

                console.log(ctx.from)

                const textFromAI = await chatgptClass.handleMsgChatGPT(`lista_de_reparaciones=${lastTicket}, ID_CLIENTE=${ctx.from}`)

                await flowDynamic(textFromAI.text)
            })
            .addAnswer('¿Tienes otra duda?', { capture: true }, async(ctx, { endFlow, fallBack, gotoFlow, flowDynamic }) => {

                if (!ctx.body.toLowerCase().includes('gracias')) {
                    const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body)
                    await fallBack(textFromAI.text)
                } else {
                    const textFromAI = await chatgptClass.handleMsgChatGPT(ctx.body)
                    await flowDynamic(textFromAI.text)
                    await endFlow()
                        //await gotoFlow(FlowPrincipal)
                }

            })
    }
}