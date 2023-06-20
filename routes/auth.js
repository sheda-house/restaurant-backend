const express = require("express");
const bcrypt = require("bcryptjs");
const Vendor = require("../models/vendors");
const User = require("../models/users");
const Role = require("../models/roles")
const { signJwt } = require("../utils/jwt");
const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  let userExist;
  if (role == "Vendor") {
    userExist = await Vendor.findOne({ Email: email });
  } else if (role == "Customer") {
    userExist = await User.findOne({ Email: email });
  }
  console.log(userExist)
  if(userExist == null){
    return res.status(404).json({
      message:"user not found"
    })
  }
  let decryptPass = bcrypt.compare(password, userExist.Password);
  console.log(userExist);
  if (userExist) {
    if (!decryptPass) {
      return res.json({
        status: false,
        message: "Incorrect Password",
      });
    }
    let token = signJwt({ id: userExist._id, email: userExist.Email });
    if (role == "Vendor") {
      return res.json({
        status :"00",
        message: `Welcome ${userExist.BusinessName}`,
        BusinessName: userExist.BusinessName,
        Location: userExist.Location,
        Email: userExist.Email,
        PhoneNumber: userExist.PhoneNumber,
        token: token,
      });
    } else {
      return res.json({
        status:"00",
        message: `Congratulations!! Welcome ${userExist.FirstName}`,
        FirstName: userExist.FirstName,
        LastName: userExist.LastName,
        Email: userExist.Email,
        PhoneNumber: userExist.PhoneNumber,
        role: userExist.role,
        token: token,
      });
    }
  }
});

authRouter.post("/admin/login", async(req,res)=>{
  const { email, password,role } = req.body;
  
  let userExist = await User.findOne({Email: email});
    let adminRoleId= await Role.findOne({Name:"Admin"})
  if(userExist.RoleId !== adminRoleId._id){
    return res.json({
      message: "You are not an Admin"
    })
  }
  let decryptPass = bcrypt.compare(password, adminExist.Password);
  console.log(userExist);
  if(userExist){
    if(!decryptPass){
      return res.json({
        message: "Incorrect Password"
      });
    }
    let token = signJwt({ id: userExist._id, email: userExist.Email });
    if(role !== "Vendor" || role !== "Customer"){
      return res.json({
        message: `Congratulations!! Welcome ${adminExist.FirstName}`,
        FirstName: userExist.FirstName,
        LastName: userExist.LastName,
        Email: userExist.Email,
        PhoneNumber: userExist.PhoneNumber,
        role: userExist.role,
        token: token,
      });
    }
  }
})

module.exports = authRouter;
