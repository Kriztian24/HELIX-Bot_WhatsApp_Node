const { addKeyword } = require('@bot-whatsapp/bot')
const { MSG_DESPEDIDA } = require('../utils/constants')

const DESPEDIDA_KEYWORD = ['chao', 'gracias', 'bye', 'hasta luego', 'hasta pronto']

const ByeFlow = addKeyword(DESPEDIDA_KEYWORD)
    .addAnswer(MSG_DESPEDIDA)

const SalirFlow = addKeyword('4', { sensitive: true })
    .addAnswer(MSG_DESPEDIDA)

module.exports = {
    SalirFlow,
    ByeFlow
}