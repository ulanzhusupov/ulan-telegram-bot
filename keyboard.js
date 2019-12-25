const kb = require('./keyboard_buttons');

module.exports = {
  home: [
    [kb.home.getQuote],
    [kb.home.getRandomJoke],
    [kb.home.getTopMusics]
  ]
}