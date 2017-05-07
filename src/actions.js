const createText = (session, message) => {
  return {
    platform: 'botfmk',
    type: 'text',
    text: 'botfmk',
    raw: message,
    session
  }
}

module.exports = {
  createText
}
