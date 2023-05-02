require('dotenv').config()
const express = require('express')
const app = require('./app')
const connectDB = require('./configs/database')
const vendorRoutes = require('./routes/vendors')
const rolesRoutes = require('./routes/roles')
const port = process.env.PORT || 4000

app.use(express.json())
app.use('/api/v1/vendors', vendorRoutes)
app.use('/api/v1/roles', rolesRoutes)

connectDB()
app.listen(port,()=>{
    console.log(`App is running on port ${port}`);
})