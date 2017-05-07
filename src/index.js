const _ = require('lodash')
const Promise = require('bluebird')
const botbuilder = require('botbuilder')
const express = require('express')
const incoming = require('./incoming')
const outgoing = require('./outgoing')
const actions = require('./actions')

let botfmk = null

const outgoingMiddleware = (event, next) => {
  if (event.platform !== 'botfmk') {
    return next()
  }
  if (!outgoing[event.type]) {
    return next('Unsupported event type: ' + event.type)
  }

  outgoing[event.type](event, next, botfmk)
}

module.exports = {

  config: {
    applicationID: { type: 'string', required: true, env: 'BOTFMK_APP_ID' },
    applicationPassword: { type: 'string', required: true, env: 'BOTFMK_APP_PASSWORD' },
    webhookPort: { type: 'string', required: true, env: 'BOTFMK_WEBHOOK_PORT' }
  },

  init: function (bp) {
    bp.middlewares.register({
      name: 'botfmk.sendMessages',
      type: 'outgoing',
      order: 100,
      handler: outgoingMiddleware,
      module: 'botpress-botbuilder',
      description: 'Sends out messages that targets platform = botfmk.' +
      ' This middleware should be placed at the end as it swallows events once sent.'
    })

    bp.botfmk = {}
    _.forIn(actions, (action, name) => {
      bp.botfmk[name] = action
      var sendName = name.replace(/^create/, 'send')
      console.log('Created action ' + sendName)
      bp.botfmk[sendName] = Promise.method(function () {
        var msg = action.apply(this, arguments)
        msg.__id = new Date().toISOString() + Math.random()
        const resolver = {event: msg}
        const promise = new Promise(function (resolve, reject) {
          resolver.resolve = resolve
          resolver.reject = reject
        })
        bp.middlewares.sendOutgoing(msg)
        return promise
      })
    })
  },

  ready: async function (bp, configurator) {
    const config = await configurator.loadAll()
    const appId = config.applicationID || console.error('BOTFMK_APP_ID is not defined')
    const appPassword = config.applicationPassword || console.error('BOTFMK_APP_PASSWORD is not defined')
    const port = config.webhookPort || console.error('BOTFMK_WEBHOOK_PORT is not defined')

    const connector = new botbuilder.ChatConnector({
      appId,
      appPassword
    })
    botfmk = new botbuilder.UniversalBot(connector)

    const server = express()

    server.post('/api/messages', connector.listen())
    server.get('/', (req, res, next) => {
      res.send('Server is running')
      next()
    })

    server.listen(port, function () {
      console.log(`Bot Framework webhook is listening to port ${port}`)
    })

    incoming(bp, botfmk)
  }
}
