const dotenv = require('dotenv')
dotenv.config()
const Discord = require('discord.js')
const client = new Discord.Client()

// my vars
let targetWordArray = ['beastie boys', 'beastie', 'intergalactic', 'planetary', 'sabotage']

// my functions
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function isVowel(c) {
    return ['a','e','i','o','u'].indexOf(c.toLowerCase()) !== -1
}

function moreVowels(text) {
    let textArray = text.split('')
    for (i = 0; i < text.length; i++) {
        let moreVowels = ''
        if (isVowel(text.charAt(i))) {
            let extraRand = getRandomInt(1, 10)
            for (j = 1; j <= extraRand; j++) {
                moreVowels += text.charAt(i)
                textArray.splice(i, 1, moreVowels)
            }
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
    const drop = beastieBoysify('drop')
    console.log('BeastieBot is about to ' + drop)
})

client.on('message', message => {
    let messageContent = message.content.toLowerCase();
    let messageContentArray = messageContent.split(' ');
    let respondCheck = false;
    messageContentArray.forEach((thisWord) => {
        if (targetWordArray.indexOf(thisWord) > -1) {
            respondCheck = true;
            console.log('author: ', message.author.id + ' ' + message.author.username)
            console.log('content: ', message.content)
        }
    })
    if (respondCheck) {
        const channelMessage = beastieBoysify(message.content)
        console.log('beastiebot reply: ', channelMessage)
        message.channel.send(channelMessage)
    }
})

client.login(process.env.TOKEN)