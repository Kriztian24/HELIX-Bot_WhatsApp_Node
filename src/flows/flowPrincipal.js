const { addKeyword, EVENTS } = require("@bot-whatsapp/bot")

const FlowPrincipal = addKeyword(['Hola', 'Hi', 'Buenas'])
    .addAnswer("Bienvenido a *Helix BI*", "Sistema de analisis y moldeado de informacion")
    .addAnswer([
        "Como te Ayudamos?",
        "",
        "*1* Ver status de Reparacion",
        "*2* Ventas",
        "*3* Administracion"
    ])
    .addAnswer("Responde con el numero de la opción")

module.exports = FlowPrincipal