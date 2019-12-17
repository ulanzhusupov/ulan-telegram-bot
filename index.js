const http = require('http');
const helper = require('./helper');
const kb = require('./keyboard_buttons');
const keyboard = require('./keyboard');

const TelegramBot = require('node-telegram-bot-api');
let token = '';

let bot = new TelegramBot(token, {polling: true});

let options = {
  reply_markup: {
    keyboard: keyboard.home
  }
};

// bot.on('new_chat_members', (msg, match) => {
//   bot.sendMessage(msg.chat.id, 'Выберите любую кнопку:', options)
// });

bot.onText(/\/start/, function (msg, match) {
  const startText = `Привет, ${msg.from.first_name}!\nВыберите действие:`;

  bot.sendMessage(helper.getChatId(msg), startText, options);
});

bot.on('message', msg => {
  switch(msg.text) {
    case kb.home.films:
      bot.sendMessage(helper.getChatId(msg), 'Выберите жанр:', {
        reply_markup: {
          keyboard: keyboard.films
        }
      })
    case kb.home.favorite:
      break;
    case kb.home.cinemas:
      break;
  }
});