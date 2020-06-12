const axios = require('axios')
const User = require('../../users/model/User.js')

module.exports = {
   getListOfCryptos: async(req,res) => {
      try {
         const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20dogecoin%2C%20ethereum%2C%20tether%2C%20litecoin%2C%200x%2C%20monero%2C%20eos%2C%20chainlink%2C%20cardano&order=market_cap_desc&per_page=100&page=1&sparkline=false')
         res.status(200).json(response.data)
      } catch (err) {
         console.log(err)
      }
   },

   getLeaderBoard: async (req,res) => {
      try {
         const users = await User.find()
         const foundUsers = users.map(user => {
            return {username: user.username, amount: user.walletUSD.toFixed(2)}
         })
         res.status(200).json(foundUsers)
      } catch (error) {
         console.log(error)
      }
   },

   buyOrder: async(req,res) => {
      try {
         let foundUser = await User.findById(req.auth._id).select("-__v -userCreated -password");
         foundUser.walletUSD = req.body.balance

         const newCrypto = foundUser.cryptos.filter(entry=> entry.name !== req.body.name)
         newCrypto.push({name: req.body.name, amount: req.body.amount})

         foundUser.cryptos = newCrypto
         await foundUser.save()

         res.status(200).json('success')
      } catch (error) {
         console.log(error)
      }
   },

   sellOrder: async(req,res) => {
      try {
         let foundUser = await User.findById(req.auth._id).select("-__v -userCreated -password");
         foundUser.walletUSD = req.body.balance

         const newCrypto = foundUser.cryptos.filter(entry=> entry.name !== req.body.name)
         newCrypto.push({name: req.body.name, amount: req.body.amount})

         foundUser.cryptos = newCrypto
         await foundUser.save()

         res.status(200).json('success')
      } catch (error) {
         console.log(error)
      }
   }
}