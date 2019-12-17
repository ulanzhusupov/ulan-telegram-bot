const kb = require('./keyboard_buttons');

module.exports = {
  home: [
    [kb.home.films, kb.home.cinemas],
    [kb.home.favorite]
  ],
  films: [
    [kb.film.random, kb.film.action, kb.film.comedy]
  ]
}