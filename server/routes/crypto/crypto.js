const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt')

const { 
  getListOfCryptos,
  getLeaderBoard,
  buyOrder,
  sellOrder
} = require('./controller/cryptoController')

router.get('/cryptos', getListOfCryptos);
router.get('/leaderboard', getLeaderBoard)

router.post('/buy',expressJwt({
    secret: process.env.JWT_USER_SECRET_KEY,
    userProperty: 'auth',
  }), 
  buyOrder
)

router.post('/sell', expressJwt({
  secret: process.env.JWT_USER_SECRET_KEY,
  userProperty: 'auth',
  }), 
  sellOrder
)

module.exports = router;
