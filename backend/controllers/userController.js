const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Task = require('../models/taskModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


// it will give user detail to user example profile page
const getUser = asyncHandler(async(req, res) => {
 if (!req.user) {
    return res.status(401).json({message: "User not found"})
  }

  return res.status(200).json(req.user)
})


// user registration 
const registerUser = asyncHandler(async(req, res) => {
  const {name, email, password} = req.body

  if (!name || !email || !password) {
    return res.status(400).json({message: "Please fill all required fields"})
  }

  const userExists = await User.findOne({email})

  if (userExists) {
    return res.status(400).json({message: "Email already exists!"})
    
  }

  const salt = await bcrypt.genSalt(10) 
  const hashedPassword = await bcrypt.hash(password, salt)// using for hashi password

  const user = await User.create({name, email, password: hashedPassword})
  if (user) {
    return res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    })
  } else {
    return res.status(400).json({message: "Invalid user data"})
    
  }
})

// user will login through thus api and Token will generate here
const signIn = asyncHandler(async(req, res) => {
  const {email, password} = req.body

  if (!email || !password) {
    return res.status(400).json({message: "Please fill all requied feilds"})
  }

  const user = await User.findOne({email})
  if (user && (await bcrypt.compare(password, user.password))) {
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      token: generateToken(user.id)
    })
  } else {
    return res.status(401).json({message: "Invalid credentials"})
  }
})

// user want to delete his account
const deleteUser = asyncHandler(async(req, res) => {
  if (!req.user) {
    return res.status(400).json({message: "User not found"})
  }

  await Task.deleteMany({user: req.user.id})
  await User.deleteOne(req.user)
  return res.status(200).json(req.user.id)
})

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}



const pendingTask = asyncHandler(async(req,res) =>{
  const {id} = req.user;
  if(!id){
    return res.status(401).json({message: "User not found"})
    
  }
  const pending = await Task.find({ user: id, taskCompleted: false });
  return res.status(200).json(pending);
  
})

const completedTask = asyncHandler(async(req,res) =>{
  const {id} = req.user;
  if(!id){
    return res.status(401).json({message: "User not found"})
    
  }
  const completedTask = await Task.find({ user: id, taskCompleted: true });
  return res.status(200).json(completedTask);
  
})

module.exports = {
  getUser,
  registerUser,
  signIn,
  deleteUser,
  pendingTask,
  completedTask 
}  