var tblDiamond = require('./models/tblDiamond');
var express = require('express');
var initWebRoutes = require('./routes/web');
var bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

initWebRoutes(app);


let port = process.env.PORT || 8090;

app.listen(port);

console.log('Diamond API is runnning at ' + port);