require("dotenv").config()
const { verifToken } = require('../utils/generateToken')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  // ---get token from request header---
  // x-auth-token => cle => mettez dans postman ,, value => token
  try {
    const token = req.header('x-auth-token')
    //console.log(token, req.header)
    // ---check whether token exists---
    if (!token) {
      return res
        .status(401)
        .json({ msg: 'Token not found or invalid! Access  denied' })
    }
    const decryptedToken = await jwt.verify(token, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    req.user = decryptedToken.user
    next()
  } catch (er) {
    console.log(er)
    res.status(400).json({ msg: 'Token nottt found or invalid! Access denied' })
  }
}