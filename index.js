require('dotenv').config()
const app = require('./app')
const connectDB = require('./configs/database')
const vendorRoutes = require('./routes/vendors')
const port = process.env.PORT || 4000

app.use('/api/v1/vendors', vendorRoutes)

connectDB()
app.listen(port,()=>{
    console.log(`App is running on port ${port}`);
})