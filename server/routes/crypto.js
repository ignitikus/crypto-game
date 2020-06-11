const express = require('express');
const router = express.Router();
const axios = require('axios')

router.get('/cryptos', async(req,res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20dogecoin%2C%20ethereum%2C%20tether%2C%20litecoin%2C%200x%2C%20monero%2C%20eos%2C%20chainlink%2C%20cardano&order=market_cap_desc&per_page=100&page=1&sparkline=false')
    res.status(200).json(response.data)

  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
