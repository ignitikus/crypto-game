const User = require('../model/User.js')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
   login: async(req, res, next) =>{
      try {
         let foundUser = await User.findOne({email: req.body.email}).select("-__v -userCreated");
         if (foundUser === null) {
            throw Error("User not found, please sign up.");
         }

         let comparedPassword = await bcrypt.compare(req.body.password, foundUser.password);
         if (comparedPassword) {
            foundUser = foundUser.toObject();
            delete foundUser.password;

            let jwtToken = jwt.sign(foundUser, process.env.JWT_USER_SECRET_KEY, {
               expiresIn: "15m",
            });
            
            let jwtRefreshToken = jwt.sign({_id: foundUser._id}, process.env.JWT_USER_REFRESH_SECRET_KEY, {
               expiresIn: "7d",
            });

            res.cookie("jwt-access-token", jwtToken, {
               expires: new Date(Date.now() + 60000 * 15),
               httpOnly: false,
               secure: process.env.NODE_ENV === "production" ? true : false,
            });

            res.cookie("jwt-refresh-token", jwtRefreshToken, {
               expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
               httpOnly: false,
               secure: process.env.NODE_ENV === "production" ? true : false,
            });

            res.status(200).json({ user: foundUser });
         } else {
            throw "Check your email and/or password.";
         }
      } catch (err) {
         res.status(500).json({
            message: err,
         });
      }
   },

   register: async (req, res) => {
      try {
         let createdUser = await new User({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
         });

         let genSalt = await bcrypt.genSalt(12);
         let hashedPassword = await bcrypt.hash(createdUser.password, genSalt);

         createdUser.password = hashedPassword;

         const user = await createdUser.save();

         res.status(200).json({message: 'User created'});
      } catch (err) {
         let message = Object.keys(err.keyValue)[0] === 'username' || Object.keys(err.keyValue)[0] === 'email' 
         ? `${Object.keys(err.keyValue)[0]} already exists` 
         : 'password has to contain: min eight characters, one uppercase, one lowercase letter, one number and one special character'
         res.status(500).json({message});
      }
   },

   refreshToken: async(req,res) => {
      try {
         let foundUser = await User.findById(req.auth._id).select("-__v -userCreated")
         foundUser = foundUser.toObject();
         delete foundUser.password;

         let jwtToken = jwt.sign(foundUser, process.env.JWT_USER_SECRET_KEY, {
            expiresIn: "15m",
         });
         
         let jwtRefreshToken = jwt.sign({_id: foundUser._id}, process.env.JWT_USER_REFRESH_SECRET_KEY, {
            expiresIn: "7d",
         });

         res.cookie("jwt-access-token", jwtToken, {
            expires: new Date(Date.now() + 60000 * 15),
            httpOnly: false,
            secure: process.env.NODE_ENV === "production" ? true : false,
         });

         res.cookie("jwt-refresh-token", jwtRefreshToken, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: false,
            secure: process.env.NODE_ENV === "production" ? true : false,
         });
         
         res.status(200).json('tokens-refreshed')
      } catch (error) {
         console.log(error)
      }
   },

   userInfo: async (req,res) => {
      let foundUser = await User.findById(req.auth._id).select("-__v -userCreated -password")
      res.status(200).json(foundUser)
   },

   logout: (req,res) => {
      res.clearCookie('jwt-access-token')
      res.clearCookie('jwt-refresh-token')
      res.status(200).json('success-logout')
   }
}