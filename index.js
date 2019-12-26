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
let topMusics = [];
let joke = '';

/**
 * Gets random quotes from forismatic.com
 */
const getQuote = (id) => {
  axios('https://api.forismatic.com/api/1.0/?method=getQuote&lang=ru&format=json&json=?')
    .then((res)=>{
      phrase.quoteText = res.data.quoteText;
      phrase.quoteAuthor = res.data.quoteAuthor;
    })
    .catch((err)=>{
      bot.sendMessage(id, err);
    });
}
getQuote();
/**
 * Gets top 10 music from Deezer
*/
const getTopMusic = (id) => {
  axios({
    method: 'get',
    url: 'https://api.deezer.com/chart/0/tracks',
  })
  .then(res => {
    topMusics = res.data.data;
  })
  .catch(err => {
    bot.sendMessage(id, err);
  });
}
getTopMusic();
/**
 * Get Chuck Norris random jokes from icndb.com/jokes/random/3
*/
const getRandomJoke = (id) => {
  axios({
    method: 'get',
    url: 'http://api.icndb.com/jokes/random/',
  })
  .then(res => {
    joke = res.data.value.joke;
  })
  .catch(err => {
    bot.sendMessage(id, err);
  });
}
getRandomJoke();
/**
 * On user started this bot
*/
bot.onText(/\/start/, function (msg, match) {
  const startText = `Привет, ${msg.from.first_name}!\nВыберите действие:`;

  bot.sendMessage(helper.getChatId(msg), startText, options);
});

/**
 * On user messaging ant text
 */
bot.on('message', msg => {
  const msgTxt = msg.text;
  const id = msg.chat.id;

  if(msgTxt === kb.home.getQuote) {
    getQuote(id);
    bot.sendMessage(helper.getChatId(msg), `"${phrase.quoteText}" ${phrase.quoteAuthor}`);
  }
  else if(msgTxt === kb.home.getTopMusics) {
    getTopMusic(id);
    let text = '';
    if(topMusics) {
      topMusics.map((item) => {
        
        text += `Место: ${item.position}\n${item.title}\nИсполнитель: ${item.artist.name}\nСсылка на трек: ${item.link}\n\n`;
      })
    }
    bot.sendMessage(helper.getChatId(msg), `Список топ 10 хитов:\n\n${text}`, options);
  }
  else if(msgTxt === kb.home.getRandomJoke) {
    getRandomJoke(id);
    bot.sendMessage(helper.getChatId(msg), `${joke}`, options)
  }
  else 
    return
  
});