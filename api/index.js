require('dotenv').config();
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const {
  PORT
} = process.env;

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  console.log('starting server')
  server.listen(PORT, () => {
    console.log('%s listening at ' + PORT); // eslint-disable-line no-console
  });
});

// conn.sync({ force: true }).then(() => {
// conn.sync({ force: true }).then(() => {
//   server.listen(process.env.PORT, () => {
//     console.log(`%s listening at ${process.env.PORT}`); // eslint-disable-line no-console
//   });
// })