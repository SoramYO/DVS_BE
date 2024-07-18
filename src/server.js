const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const initWebRoutes = require('./routes/web');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('swagger-jsdoc');
var config = require('../src/config/dbconfig');
const sql = require('mssql');
const http = require('http');
const { Server } = require('socket.io');
const chat = require('./common/socket'); // Import chat module

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.9/swagger-ui.min.css";

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

const swaggerDocs = swaggerDocument(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL }));
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

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

initWebRoutes(app);

// Database connection
sql.connect(config).then(pool => {
  if (pool.connected) {
    console.log('Connected to database');
  } else {
    console.log('Failed to connect to database');
  }
}).catch(err => {
  console.error('Database connection failed: ', err);
});

// Initialize chat functionality
chat(io);

server.listen(PORT, () => {
  console.log('Diamond API is running at ' + PORT);
});

module.exports = app;
