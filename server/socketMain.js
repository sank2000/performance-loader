const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/perfData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Machine = require('./models/Machine');

function socketMain(io, socket) {
  let macA;

  socket.on('clientAuth', (key) => {
    if (key === '5t78yuhgirekjaht32i3') {
      // valid nodeClient
      socket.join('clients');
    } else if (key === 'uihjt3refvdsadf') {
      // valid ui client has joined
      socket.join('ui');
    } else {
      // an invalid client has joined. Goodbye
      socket.disconnect(true);
    }
  });

  socket.on('initPerfData', async (data) => {
    // update our socket connect function scoped variable
    macA = data.macA;
  });
}

module.exports = socketMain;
