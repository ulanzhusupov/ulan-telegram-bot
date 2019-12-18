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
  content: 'Not exists',
  author: 'None'
};

const convertVideo = () => {
  
  axios('https://api.quotable.io/random')
    .then((res)=>{
      console.log(res.data);
      phrase.content = res.data.content;
      phrase.author = res.data.author;
    })
    .catch((error)=>{
      console.log('Error***********', error)
    });
}

bot.on('message', (msg, match) => {
  bot.sendMessage(helper.getChatId(msg), 'Введите адрес видео из youtube:');
  convertVideo();

  switch(msg.text[0]) {
    case 'H': {
      bot.sendMessage(helper.getChatId(msg), `"${phrase.content}" ${phrase.author}`);
    }
    default:
      break;
  }
})
    
// bot.on('new_chat_members', (msg, match) => {
//   bot.sendMessage(msg.chat.id, 'Выберите любую кнопку:', options)
// });

// bot.onText(/\/start/, function (msg, match) {
//   const startText = `Привет, ${msg.from.first_name}!\nВыберите действие:`;

//   bot.sendMessage(helper.getChatId(msg), startText, options);
// });

// bot.on('message', msg => {
//   switch(msg.text) {
//     case kb.home.convert: {
//       bot.sendMessage(helper.getChatId(msg), 'Введите адрес видео из youtube:');
//     }
//     default:
//       bot.sendMessage(helper.getChatId(msg), 'Выберите действие:', options);
//   }
// });