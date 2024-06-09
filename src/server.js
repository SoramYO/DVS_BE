const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const initWebRoutes = require('./routes/web');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('swagger-jsdoc');
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
  'https://dvs-fe-soramyos-projects.vercel.app'
];


app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl requests)
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

app.listen(PORT, () => {
  console.log('Diamond API is running at ' + PORT);
});

module.exports = app;
