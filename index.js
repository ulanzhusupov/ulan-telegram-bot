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
const getQuote = () => {
  axios('https://api.forismatic.com/api/1.0/?method=getQuote&lang=ru&format=jsonp&json=?')
    .then((res)=>{
      phrase.quoteText = res.data.quoteText;
      phrase.quoteAuthor = res.data.quoteAuthor;
    })
    .catch((error)=>{
      console.log('Error***********', error)
    });
}
getQuote();

/**
 * Gets top 10 music from Deezer
*/
const getTopMusic = () => {
  axios({
    method: 'get',
    url: 'https://api.deezer.com/chart/0/tracks',
  })
  .then(res => {
    topMusics = res.data.data;
  })
  .catch(err => {
    console.log("Error++++", err)
  });
}
getTopMusic();

/**
 * Get Chuck Norris random jokes from icndb.com/jokes/random/3
*/
const getRandomJoke = () => {
  axios({
    method: 'get',
    url: 'http://api.icndb.com/jokes/random/',
  })
  .then(res => {
    joke = res.data.joke;
  })
  .catch(err => {
    console.log("Error++++", err)
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

  switch(msg.text) {
    case kb.home.getQuote: {
      getQuote();
      bot.sendMessage(helper.getChatId(msg), `"${phrase.quoteText}" ${phrase.quoteAuthor}`);
    }
    case kb.home.getTopMusics: {
      let text = '';

      if(topMusics) {
        topMusics.map((item, index) => {
          let time = parseFloat(item.duration).toFixed(3);
          let minutes = Math.floor(time/60)%60;
          let seconds = Math.floor(time - minutes * 60);
          
          text += `0${index+1}. ${item.title}\nИсполнитель: ${item.artist.name}\nМесто: ${item.position}\nСсылка на трек: ${item.link}\n\n`;
        })
      }
      bot.sendMessage(helper.getChatId(msg), `Список топ 10 хитов:\n\n${text}`, options);
    }
    case kb.home.getRandomJoke: {
      getRandomJoke();
      bot.sendMessage(helper.getChatId(msg), `${joke}`, options)
    }
    default:
      break;
  }
});