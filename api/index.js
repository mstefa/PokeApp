const server = require('./src/app.js');
const { conn } = require('./src/db.js');

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  console.log('starting server')
  server.listen(3002, () => {
    console.log('%s listening at 3002'); // eslint-disable-line no-console
  });
});

// conn.sync({ force: true }).then(() => {
// conn.sync({ force: true }).then(() => {
//   server.listen(process.env.PORT, () => {
//     console.log(`%s listening at ${process.env.PORT}`); // eslint-disable-line no-console
//   });
// })