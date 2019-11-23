const createService = require('./createService');

module.exports = createService('highscores', {
  username: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  eventId: {
    type: String,
    required: true,
  }
});
