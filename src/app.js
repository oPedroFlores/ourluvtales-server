// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./user/Routes');
const inviteRoutes = require('./couple_invite/Route');

const app = express();

// Limitação de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 requisições por janela
  message: 'Muitas requisições, por favor tente novamente mais tarde.',
});
app.use(limiter);

// Middlewares de segurança
app.use(helmet());

// Middlewares

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/invite', inviteRoutes);

app.get('/', (req, res) => {
  res.send('Api OurLuvTales ON!');
});

module.exports = app;
