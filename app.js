let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let app = express()

const CHANNEL_ACCESS_TOKEN = 'X7lgi6Sxoz1tQNbN4U8oQ9H5ShXS7ATpvRNQ0yXaSuQtX8GKaH3kZjpq5y4zfEheFS/VLkaP9ksJEI9kQTpU32Lz4TEsJw3vKpDjJ9auSXK4kA2IhMeB5kC72Hgq9/nqf4B2ozj6+jk4ZR3l3z3YfwdB04t89/1O/w1cDnyilFU='
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`)
})

// handler receiving messages
app.post('/', function (req, res) {
    console.log(JSON.stringify(req.body, null, 2));
    let replyToken = req.body.events[0].replyToken;
    let text = req.body.events[0].message.text;
    if (text) {
        sendMessage(replyToken, text);
    }
    res.send();
})

// generic function sending messages
function sendMessage(replyToken, text) {
    let body = {
        replyToken,
        messages: [{
            type: 'text',
            text,
        }],
    };

    let options = {
        url: 'https://api.line.me/v2/bot/message/reply',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
        body,
        json: true,
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}
