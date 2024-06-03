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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.use(cookieParser());

initWebRoutes(app);

app.listen(PORT, () => {
  console.log('Diamond API is running at ' + PORT);
});

module.exports = app;
