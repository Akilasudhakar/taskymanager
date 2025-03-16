const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')


// it check that user is login or not
const protect = asyncHandler(async(req, res, next) => {
  let token 
  // console.log("--------", req.headers.authorization);
  // console.log("----->",req.headers.authorization.startsWith('Bearer')) 
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // console.log('if condition is')
    try {
      token = req.headers.authorization.split(' ')[1]
      // console.log('token ---> ', token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // console.log('user Id ---> ', decoded.id);
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not Authorized to access this resource')
    }
  }
  
  if (!token) {
    res.status(401)
    throw new Error('Not Authorized, Token not found')
  }
})

module.exports = {protect}