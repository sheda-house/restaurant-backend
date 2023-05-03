const express = require('express')
const userRouter = express.Router()
const Users = require('../models/users')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const roles = require('../models/roles')
// const { router } = require('../app')

userRouter.post('/login',async(req,res)=>{
    const {Email, Password, role} = req.body

    let userExist = await Users.findOne({Email})
    let decryptPass = bcrypt.compare(Password,userExist.Password)
    
    if (userExist){
        if(!decryptPass){
            return res.json({
                "message":"Incorrect Password"
        })
    }

  return res.json({
    message: `Congratulations!! Welcome ${userExist.FirstName}`,
    FirstName: userExist.FirstName,
    LastName: userExist.LastName,
    Email: userExist.Email,
    PhoneNumber: userExist.PhoneNumber,
    role: userExist.role
})    
}  
})

userRouter.post('/register',async(req,res)=>{
    const {FirstName,LastName, Email, Password,PhoneNumber, cPassword, role} = req.body
    let getRole
    if(role == undefined){
        getRole = await roles.findOne({
            Name:"Customer"
        })
    }
    else{
        getRole = await roles.findOne({
            Name:role
        })
    }
    let roleId = getRole._id
    let userExist = await Users.findOne({Email})
    

    //let roleId = getRole._id
    console.log(roleId)
    if(userExist){
        return res.json({
            "message": "User with this Email already exist"
        })
    }
    if(Password !== cPassword){
        return res.json({
            "message": "Confirm Password has to match Password"
        })
    }
    let hashPassword = await bcrypt.hash(Password, 10)

    let newUser = await Users.create({
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Password:hashPassword,
        RoleId:roleId
    })
    return res.json({
        message: `User ${newUser.Email} has been registered. Congratulations`,
        FirstName: newUser.FirstName,
        LastName: newUser.LastName,
        Email: newUser.Email,
        roleId:roleId

    })
})

module.exports = userRouter