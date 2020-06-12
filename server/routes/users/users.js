const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt')

const { 
  login, 
  register,
  refreshToken,
  userInfo,
  logout
} = require('./controller/userController')

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout)

router.get('/refresh-token', expressJwt({
    secret: process.env.JWT_USER_REFRESH_SECRET_KEY,
    userProperty: 'auth',
  }),
  refreshToken
)

router.get('/user-info', expressJwt({
    secret: process.env.JWT_USER_SECRET_KEY,
    userProperty: 'auth',
  }),
  userInfo
)

module.exports = router;
