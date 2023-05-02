require('dotenv').config()
const app = require('./app')
const connectDB = require('./configs/database')
const port = process.env.PORT || 4000

connectDB()
app.listen(port,()=>{
    console.log(`App is running on port ${port}`);
})