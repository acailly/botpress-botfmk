
module.exports = (bp, botfmk) => {
  const sendMessageToIncomingMiddlewares = (session) => {
    // push the message to the incoming middleware

    const {message} = session

    const text = message.text !== '' ? message.text : 'hey'

    bp.middlewares.sendIncoming({
      platform: 'botfmk',
      type: 'message',
      text,
      raw: message,
      session
    })
  }

  botfmk.dialog('/', function (session) {
    sendMessageToIncomingMiddlewares(session)
  })

}
