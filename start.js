const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(db)
  .then((con) => {
    // console.log(con.connection);
    console.log('connected to database');
  })
  .catch((err) => {
    console.log(err);
  });

let port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`started litsening on ${port}`);
});
