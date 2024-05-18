var db = require('./src/config/dboperations');
var tblDiamond = require('./src/models/tblDiamond');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

router.use((req, res, next) => {
    console.log('middleware');
    next();
});

router.route('/diamonds').get((req, res) => {
    db.getTblDiamond().then(data => {
        res.json(data[0]);
    })
});

router.route('/diamonds/:id').get((req, res) => {
    db.getTblDiamondById(req.params.id).then(data => {
        res.json(data[0]);
    })
});

router.route('/diamonds').post((req, res) => {
    let diamond = { ...req.body };
    db.add(diamond).then(result => {
        res.status(201).json(result);
    })
});

var port = process.env.PORT || 8090;

app.listen(port);

console.log('Diamond API is runnning at ' + port);