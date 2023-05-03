const express = require('express')
const bcrypt = require('bcryptjs')
const Vendor = require('../models/vendors')
const { signJwt } = require('../utils/jwt')
const router = express.Router()

router.get('/ping',(req,res)=>{
    res.json({
        message:"Vendor endpoint alive"
    })
})

router.post('/login',async(req,res)=>{
    console.log(req.body)
    const {email, password} = req.body
    let vendor =await Vendor.findOne({
        where:email
    })
    console.log(vendor)
    if(vendor == null){
        return res.json({
            message:"User with this email does not exist"
        })
    }
    let passwordValid = await bcrypt.compare(password, vendor.Password)
    if(!passwordValid){
        return res.json({
            message:"Incorrect password"
        })
    }
    var token = signJwt({id:vendor._id, email:vendor.Email})
    return res.json({
        message:"Useer logged in successfully",
        data:{
            business:vendor.BusinessName,
            email:vendor.Email,
            mobile:vendor.PhoneNumber,
            location:vendor.Location,
            token
        }
    })
})

router.post('/', async(req,res)=>{
    const {businessname, email,
    password, location, phone} = req.body

    let emailExists = await Vendor.findOne({email})
    if(emailExists){
        return res.json({
            message:"Email already exists"
        })
    }
    let salt =10;
    let hashedPassword = await bcrypt.hash(password,salt)
    let createNewVendor = await Vendor.create({
        BusinessName:businessname,
        Email:email,
        Password:hashedPassword,
        PhoneNumber:phone,
        Location:location
    })
    let token = signJwt({id:createNewVendor._id, email})
    return res.json({
        message:"User successfully registered",
        data:{
            BusinessName: createNewVendor.BusinessName,
            PhoneNumber: createNewVendor.PhoneNumber,
            Email:createNewVendor.Email,
            Location:createNewVendor.Location,
            accessToken:token
        }
    })
})

module.exports = router