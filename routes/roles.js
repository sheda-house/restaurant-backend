const express = require('express')
const Role = require('../models/roles')
const roleRouter = express.Router()

roleRouter.post('/',async (req,res)=>{
    const {Name} = req.body
    let checkRoleExists = await Role.find({
        where:Name
    });
    if(checkRoleExists.length !=0 ){
        return res.json({
            message:`${Name} already exists`
        })
    }
    if(!Name){
        res.json({
            message:"Name cannot be empty"
        })
    }
    let newRole = await Role.create({Name})

    return res.json({
        message:`New role added`
    })
})

roleRouter.get('/', async(req,res)=>{
    let roles = await Role.find();
    return res.json({
        message:"Roles fetched succesfully",
        roles
    })
})


module.exports = roleRouter