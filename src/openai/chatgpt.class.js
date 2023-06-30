require('dotenv').config()

class ChatGPTClass {
    queue = []
    optionGPT = { model: "gpt-3.5-turbo-0301" }
    openai = undefined

    constructor() {
        this.init().then()
    }

    init = async() => {
        const { ChatGPTAPI } = await
        import ("chatgpt");
        this.openai = new ChatGPTAPI({
            apiKey: process.env.API_KEY
        })
    }

    handleMsgChatGPT = async(body) => {
        //const { from, body } = ctx

        const interaccionChatGPT = await this.openai.sendMessage(body, {
            conversationId: (!this.queue.length) ?
                undefined :
                this.queue[this.queue.length - 1].conversationId,
            parentMessageId: (!this.queue.length) ?
                undefined :
                this.queue[this.queue.length - 1].id,
        })

        this.queue.push(interaccionChatGPT)
        return interaccionChatGPT
            /*const parseMessage = {
                ...completion,
                answer: completion.text,
            }

            this.sendFlowSimple([parseMessage], from)*/
    }

}

module.exports = ChatGPTClass