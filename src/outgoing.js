const _ = require('lodash')

const handleText = (event, next, botfmk) => {
  if (event.platform !== 'botfmk' || event.type !== 'text') {
    return next()
  }

  const session = event.session

  const replied = event.raw
  if (_.isArray(replied)) {
    replied.forEach(r => session.send(r))
  } else {
    session.send(replied)
  }

  return next()
}

module.exports = {
  'text': handleText
}
