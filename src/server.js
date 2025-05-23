const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const initWebRoutes = require('./routes/web');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
var config = require('../src/config/dbconfig');
const sql = require('mssql');
dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.9/swagger-ui.min.css";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Diamond API',
      version: '1.0.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/web.js'],
};

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// })

// const swaggerDocs = swaggerDocument(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCssUrl: CSS_URL }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


const allowedOrigins = [
  'http://localhost:3000',
  'https://diamond-dashboard-one.vercel.app',
  'https://dvs-fe-soramyos-projects.vercel.app',
  'https://dvs-be-sooty.vercel.app',
  'https://dvs-fe.vercel.app',
  'https://dvs-fe-git-main-soramyos-projects.vercel.app',
  'http://localhost:8080',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET,POST,PUT,DELETE",
  })
);

initWebRoutes(app);

// // Database connection
// sql.connect(config).then(pool => {
//   if (pool.connected) {
//     console.log('Connected to database');
//   } else {
//     console.log('Failed to connect to database');
//   }
// }).catch(err => {
//   console.error('Database connection failed: ', err);
// });

//CONNECT TO DATABASE MONGODB
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB database connection established successfully'))
.catch(err => console.error('MongoDB connection error:', err));


app.listen(PORT, () => {
  console.log('Diamond API is running at ' + PORT);
});

module.exports = app;
