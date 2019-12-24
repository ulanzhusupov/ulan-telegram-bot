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

bot.onText(/\/start/, function (msg, match) {
  const startText = `Привет, ${msg.from.first_name}!\nВыберите действие:`;

  bot.sendMessage(helper.getChatId(msg), startText, options);
});

bot.on('message', msg => {
  const charts = [];
  const message = msg.text;

  switch(message) {
    case kb.home.getQuote: {
      getQuote();
      bot.sendMessage(helper.getChatId(msg), `"${phrase.quoteText}" ${phrase.quoteAuthor}`);
    }

    case kb.home.getTopMusics: {
      const pad = function(num, size) { return ('000' + num).slice(size * -1); };

      let topMusicKeyboard = {
        reply_markup: {
          keyboard: []
        }
      }

      if(topMusics) {
        topMusics.map((item, index) => {
          let time = parseFloat(item.duration).toFixed(3);
          let minutes = Math.floor(time/60)%60;
          let seconds = Math.floor(time - minutes * 60);
          let text = '';

          text += `0${index+1}. ${item.title}\n${item.album.cover_medium}\nИсполнитель: ${item.artist.name}\nПродолжительность: ${pad(minutes, 2)} : ${pad(seconds, 2)}\nМесто: ${item.position}\nПревью: ${item.preview}\nСсылка на трек: ${item.link}\n\n`;
          topMusicKeyboard.reply_markup.keyboard.push([`0${index+1}.${item.title}`]);
          charts.push(text);
        })
      }

      if(topMusicKeyboard.reply_markup.keyboard) {
        bot.sendMessage(helper.getChatId(msg), `Выберите интересный хит:`, topMusicKeyboard);
      } else {
        bot.sendMessage(helper.getChatId(msg), `Произошла ошибка при загрузке хитов. Сожалею!`);
      }
    }
    default:
      break;
  }

  switch(message[0]) {
    case '0': {
      let str = msg.text.slice(3);
      if(charts) {
        topMusics.map((item, index) => {
          if(item.title == str) {
            bot.sendMessage(helper.getChatId(msg), charts[index]);
          }

        })
      }


    }
    default:
      break;
  }
});