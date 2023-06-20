const express = require('express')
const bcrypt = require('bcryptjs')
const Vendor = require('../models/vendors')
const roles = require('../models/roles')
const { signJwt } = require('../utils/jwt')
const users = require('../models/users')
const vendorRouter = express.Router()



vendorRouter.post('/login',async(req,res)=>{
    console.log(req.body)
    const {Email, Password, role} = req.body
    let Role = await roles.findOne({role})
    let vendor =await Vendor.findOne({
        Email:Email
    })
    
    console.log(vendor)
    if(vendor == null ){
        return res.json({
            message:"User with this email does not exist"
        })
    }
    let passwordValid = await bcrypt.compare(Password, vendor.Password)
    if(!passwordValid){
        return res.json({
            message:"Incorrect password"
        })
    }
  
    var token = signJwt({id:vendor._id, email:vendor.Email})
    return res.json({
        status: true,
        message:"User logged in successfully",
        data:{
            business:vendor.BusinessName,
            email:vendor.Email,
            mobile:vendor.PhoneNumber,
            location:vendor.Location,
            token
        }
    })
})

vendorRouter.post('/register', async(req,res)=>{
    const {businessname, email,
    password, location, phone} = req.body

   
    let emailExists = await Vendor.findOne({Email:email})
    let nameExist = await Vendor.findOne({BusinessName: businessname})
    console.log(businessname);

   
    if(nameExist){
        return res.json({
            message: "Business name already Exist"
        })
    }
    console.log(emailExists);
    if(emailExists){
        return res.json({
            message:"Email already exists"
        })
    }
    
    let hashedPassword = await bcrypt.hash(password,10)
    let createNewVendor = await Vendor.create({
        BusinessName:businessname,
        Email:email,
        Password:hashedPassword,
        PhoneNumber:phone,
        Location:location,
    })
    let token = signJwt({id:createNewVendor._id, email})
    return res.json({
        msg:{
            message: "User successfully registered",
        status: true},
        data:{
            BusinessName: createNewVendor.BusinessName,
            PhoneNumber: createNewVendor.PhoneNumber,
            Email:createNewVendor.Email,
            Location:createNewVendor.Location,
            accessToken:token,
            role
        }
    })
})

module.exports = vendorRouter