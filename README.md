# Microsoft Bot Framework connector for Botpress (https://botpress.io/)

## Installation

```
botpress install botfmk
```

## Get started

#### 1. Sign in on Bot Framework (https://dev.botframework.com/)

#### 2. Create a bot (https://docs.botframework.com/en-us/csharp/builder/sdkreference/gettingstarted.html#registering)

#### 3. Set the env vars

- Set the bot application ID in env var BOTFMK_APP_ID 
- Set the bot password in env var BOTFMK_APP_PASSWORD
- Choose a port for the webhook and set it to env var BOTFMK_WEBHOOK_PORT

#### 4. Deploy your bot

Or use ngrok (https://github.com/bubenshchykov/ngrok) to expose your local bot to the world

#### 5. Set the webhook url in Bot Framework config (https://docs.botframework.com/en-us/csharp/builder/sdkreference/gettingstarted.html#registering)


## Usage

### Incoming

You can listen to incoming events easily with Botpress by using the built-in "hear" function.
```js
bp.hear({platform: 'botfmk', type: 'message'}, (event, next) => {
    const text = event.text
    const session = event.session

    bp.botfmk.sendText(session, `You said ${text}`)
})
```

### Outgoing

#### Text messages
```js
bp.botfmk.sendText(session, 'aMessage')
```

#### Attachments

You can use the Bot Framework attachment API described here: https://docs.botframework.com/en-us/csharp/builder/sdkreference/attachments.html

You can see how it is rendered on different platforms here: https://docs.botframework.com/en-us/channel-inspector/channels/Facebook 

```js
bp.botfmk.sendText(session, {
    'contentType': 'application/vnd.microsoft.card.hero',
    'content': {
      'title': 'Who is it?',
      'subtitle': 'Guess who is on the picture',
      "images": [
        {
          "url": "https://upload.wikimedia.org/wikipedia/en/a/a6/Bender_Rodriguez.png"
        }
      ],
      'buttons': [
        {
            'type': 'postBack',
            'title': 'Bender Rodriguez',
            'value': 'insert_your_postback'
        },
        {
            'type': 'postBack',
            'title': 'R2D2',
            'value': 'insert_your_postback'
        }
      ]
    }
  })
```

#### Multiple messages
```js
bp.botfmk.sendText(session,[
  'Who is it?',
  {
    "contentType": "image/png",
    "contentUrl": "https://upload.wikimedia.org/wikipedia/en/a/a6/Bender_Rodriguez.png"
    "name":"Bender_Rodriguez.png"
  },
  {
    'attachments': [
      {
        'contentType': 'application/vnd.microsoft.card.hero',
        'content': {
          'buttons': [
            {
              'type': 'postBack',
              'title': 'Bender Rodriguez',
              'value': 'insert_your_postback'
            },
            {
              'type': 'postBack',
              'title': 'R2D2',
              'value': 'insert_your_postback'
            }
          ]
        }
      }
    ]
  }
])
```
