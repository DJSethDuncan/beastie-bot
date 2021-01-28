const dotenv = require('dotenv')
dotenv.config()
const Discord = require('discord.js')
const client = new Discord.Client()

// my vars
let targetWord = 'beastie'

// my functions
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isVowel(c) {
    return ['a','e','i','o','u'].indexOf(c.toLowerCase()) !== -1
}

function moreVowels(text) {
    let textArray = text.split('')
    let moreVowels = ''
    for (i = 0; i < text.length; i++) {
        if (isVowel(text.charAt(i))) {
            let extraRand = getRandomInt(1, 10)
            for (j=1; j<=extraRand; j++) {
                moreVowels += text.charAt(i)
            }
            textArray.splice(i, 1, moreVowels)
        }
    }
    return (textArray.join())
}

function beastieBoysify(text) {
    const capitalizeRand = getRandomInt(3, 10)
    const exclamationPointsRand = getRandomInt(0, 10)
    const messageArray = text.split(' ')
    let beastieReply = messageArray[messageArray.length - 1]
    let exclamationPoints = ''

    for (i = 1; i <= exclamationPointsRand; i++) {
        exclamationPoints += '!'
    }

    // MODIFIERS

    // capitalize
    if (capitalizeRand > 5) {
        beastieReply = moreVowels(beastieReply)
        beastieReply = beastieReply.toUpperCase()
    }

    // strip non alphanum
    beastieReply = beastieReply.replace(/\W/g, '')

    // add exclamation points
    beastieReply += exclamationPoints
    return beastieReply
}


// discord stuff
client.once('ready', () => {
    const drop = beastieBoysify('DROP')
    console.log('BeastieBot is about to ' + drop)
})

client.on('message', message => {
    if (message.content.includes(targetWord)) {
        if (message.author.id == '91971213080940544') {
            const jonChance = getRandomInt(1, 10)
            if (jonChance > 1) {
                return
            }
        }
        console.log('author: ', message.author.id + ' ' + message.author.username)
        console.log('content: ', message.content)
        const channelMessage = beastieBoysify(message.content)
        console.log('beastiebot reply: ', channelMessage)
        message.channel.send(channelMessage);
    }
})

client.login(process.env.TOKEN)