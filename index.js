require("dotenv").config();
const express = require("express");
const app = require("./app");
const connectDB = require("./configs/database");
const vendorRouter = require("./routes/vendors");
const roleRouter = require("./routes/roles");
const userRouter = require("./routes/users");
const menuRouter = require("./routes/menu");
const authRouter = require('./routes/auth')
const cartRouter = require('./routes/cart')
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const settingRouter = require("./routes/profile_settings");
const renderRouter = require("./routes/renderPing");
const port = process.env.PORT || 4000;
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use("/api/v1/vendors", vendorRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/menu", menuRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/cart', settingRouter);
app.use('/api/v1/render', renderRouter)

connectDB();
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
