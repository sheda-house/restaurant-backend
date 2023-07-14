const express = require('express')
const bcrypt = require('bcryptjs')
const Vendor = require('../models/vendors')
const roles = require('../models/roles')
const { signJwt } = require('../utils/jwt')
const { createLogger, transports, format } = require('winston');

const vendorRouter = express.Router()


// Configure Winston logger
const logger = createLogger({
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.File({ filename: 'combined.log' })
    ],
    format: format.combine(
      format.timestamp(),
      format.json()
    )
  });
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
    Password, location, phone, cPassword} = req.body

   
    let emailExists = await Vendor.findOne({Email:email})
    let nameExist = await Vendor.findOne({BusinessName: businessname})
    // console.log(businessname);

   
    if(nameExist){
        return res.json({
            status: false,
            message: "Business name already Exist"
        })
    }
    // console.log(emailExists);
    if(emailExists){
        return res.json({
            status: false,
            message:"Email already exists"
        })
    }
    if (cPassword !== Password) {
        return res.json({ 
          status: false,
          message: "Confirm Password has to match Password" });
      }
    
    let hashedPassword = await bcrypt.hash(Password,10)
    let createNewVendor = await Vendor.create({
        BusinessName:businessname,
        Email:email,
        Password:hashedPassword,
        PhoneNumber:phone,
        Location:location,
    })
    let token = signJwt({id:createNewVendor._id, email})
    return res.json({
       
        message: "User successfully registered",
        status: true,
            BusinessName: createNewVendor.BusinessName,
            PhoneNumber: createNewVendor.PhoneNumber,
            Email:createNewVendor.Email,
            Location:createNewVendor.Location,
            accessToken:token,
            role
    })
})

module.exports = vendorRouter