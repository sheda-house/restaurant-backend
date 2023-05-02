const express = require('express')
const router = express.Router()

router.get('/ping',(req,res)=>{
    res.json({
        message:"Vendor endpoint alive"
    })
})

module.exports = router