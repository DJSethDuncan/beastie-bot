"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomReplyFromCollection = exports.stripAlphaNum = exports.moreVowels = exports.sarcasm = exports.beastieBoysify = exports.isVowel = exports.getRandomInt = exports.hasWordInWordCollection = exports.removeFirstWord = exports.getFirstWordLowercase = void 0;
var config_1 = require("./config");
var getFirstWordLowercase = function (_a) {
    var text = _a.text;
    var stringArray = text.toLowerCase().split(" ");
    return (0, exports.stripAlphaNum)({ text: stringArray[0] });
};
exports.getFirstWordLowercase = getFirstWordLowercase;
var removeFirstWord = function (_a) {
    var text = _a.text;
    return text.split(" ").slice(1).join(" ");
};
exports.removeFirstWord = removeFirstWord;
var hasWordInWordCollection = function (_a) {
    var messageContent = _a.messageContent, wordCollectionName = _a.wordCollectionName;
    var messageContentArray = messageContent.toLowerCase().split(" ");
    var intersection = config_1.config.wordCollections[wordCollectionName].filter(function (element) { return messageContentArray.includes(element); });
    return !!intersection.length;
};
exports.hasWordInWordCollection = hasWordInWordCollection;
var getRandomInt = function (_a) {
    var min = _a.min, max = _a.max;
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getRandomInt = getRandomInt;
var isVowel = function (_a) {
    var character = _a.character;
    return ["a", "e", "i", "o", "u"].indexOf(character.toLowerCase()) !== -1;
};
exports.isVowel = isVowel;
var beastieBoysify = function (_a) {
    var text = _a.text;
    var capitalizeRand = (0, exports.getRandomInt)({ min: 3, max: 10 });
    var exclamationPointsRand = (0, exports.getRandomInt)({
        min: 0,
        max: 10,
    });
    var messageArray = text.split(" ");
    var beastieReply = messageArray[messageArray.length - 1];
    var exclamationPoints = "";
    for (var i = 1; i <= exclamationPointsRand; i++) {
        exclamationPoints += "!";
    }
    if (capitalizeRand > 5) {
        beastieReply = (0, exports.moreVowels)({ text: beastieReply });
        beastieReply = beastieReply.toUpperCase();
    }
    beastieReply = (0, exports.stripAlphaNum)({ text: beastieReply });
    beastieReply += exclamationPoints;
    return beastieReply;
};
exports.beastieBoysify = beastieBoysify;
var sarcasm = function (_a) {
    var text = _a.text;
    return text
        .split("")
        .map(function (item, index) {
        return index % 2 === 1 ? item.toUpperCase() : item.toLowerCase();
    })
        .join("");
};
exports.sarcasm = sarcasm;
var moreVowels = function (_a) {
    var text = _a.text;
    var textArray = text.split("");
    for (var i = 0; i < text.length; i++) {
        var moreVowels_1 = "";
        if ((0, exports.isVowel)({ character: text.charAt(i) })) {
            var extraRand = (0, exports.getRandomInt)({ min: 1, max: 10 });
            for (var j = 1; j <= extraRand; j++) {
                moreVowels_1 += text.charAt(i);
                textArray.splice(i, 1, moreVowels_1);
            }
        }
    }
    return textArray.join();
};
exports.moreVowels = moreVowels;
var stripAlphaNum = function (_a) {
    var text = _a.text;
    return text.replace(/\W/g, "");
};
exports.stripAlphaNum = stripAlphaNum;
var getRandomReplyFromCollection = function (_a) {
    var collectionName = _a.collectionName;
    if (collectionName in config_1.config.replyCollections) {
        var thisCollection = config_1.config.replyCollections[collectionName];
        return thisCollection[(0, exports.getRandomInt)({ min: 0, max: thisCollection.length - 1 })];
    }
    else {
        return "";
        console.error("No collection name found for ".concat(collectionName));
    }
};
exports.getRandomReplyFromCollection = getRandomReplyFromCollection;
