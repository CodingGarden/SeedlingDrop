const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio');

require('dotenv').config();

const highScores = require('./highScores');

const app = feathers();
app.configure(socketio());

highScores(app);

const port = process.env.PORT || 9999;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
