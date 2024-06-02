const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const initWebRoutes = require('./routes/web');

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET,POST,PUT,DELETE",
  })
);
app.use('/api', router);
app.use(cookieParser());

initWebRoutes(app);

app.listen(PORT);
console.log('Diamond API is runnning at ' + PORT);