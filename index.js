const axios = require('axios');

const helper = require('./helper');
const kb = require('./keyboard_buttons');
const keyboard = require('./keyboard');

const TelegramBot = require('node-telegram-bot-api');
let token = '1029442842:AAEye11IwuHyYVarnHBXc2Y54NzbUdZ5qys';

let bot = new TelegramBot(token, {polling: true});

let options = {
  reply_markup: {
    keyboard: keyboard.home
  }
};

let phrase = {
  quoteText: 'Quote isn\'t here!',
  quoteAuthor: 'None'
};

const getQuote = () => {
  axios('https://api.forismatic.com/api/1.0/?method=getQuote&lang=ru&format=json&json=?')
    .then((res)=>{
      phrase.quoteText = res.data.quoteText;
      phrase.quoteAuthor = res.data.quoteAuthor;
    })
    .catch((error)=>{
      console.log('Error***********', error)
    });
}
getQuote();

// bot.on('message', (msg, match) => {
//   bot.sendMessage(helper.getChatId(msg), 'Введите адрес видео из youtube:');
//   convertVideo();

//   switch(msg.text[0]) {
//     case 'H': {
//       bot.sendMessage(helper.getChatId(msg), `"${phrase.content}" ${phrase.author}`);
//     }
//     default:
//       break;
//   }
// })
    
// bot.on('new_chat_members', (msg, match) => {
//   bot.sendMessage(msg.chat.id, 'Выберите любую кнопку:', options)
// });

bot.onText(/\/start/, function (msg, match) {
  const startText = `Привет, ${msg.from.first_name}!\nВыберите действие:`;

  bot.sendMessage(helper.getChatId(msg), startText, options);
});

bot.on('message', msg => {
  switch(msg.text) {
    case kb.home.getQuote: {
      getQuote();
      bot.sendMessage(helper.getChatId(msg), `"${phrase.quoteText}" ${phrase.quoteAuthor}`);
    }
    default:
      break;
  }
});