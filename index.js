require("dotenv").config();
const express = require("express");
const app = require("./app");
const connectDB = require("./configs/database");
const vendorRoutes = require("./routes/vendors");
const rolesRoutes = require("./routes/roles");
const userRouter = require("./routes/users");
const menuRouter = require("./routes/menu");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const port = process.env.PORT || 4000;
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/roles", rolesRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/menu", menuRouter);

connectDB();
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
