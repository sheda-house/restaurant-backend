const express = require("express");
const bcrypt = require("bcryptjs");
const Vendor = require("../models/vendors");
const User = require("../models/users");
const { signJwt } = require("../utils/jwt");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  let userExist;
  if (role == "Vendor") {
    userExist = await Vendor.findOne({ Email: email });
  } else if (role == "Customer") {
    userExist = await User.findOne({ Email: email });
  }
  let decryptPass = bcrypt.compare(password, userExist.Password);
  console.log(userExist);
  if (userExist) {
    if (!decryptPass) {
      return res.json({
        message: "Incorrect Password",
      });
    }
    let token = signJwt({ id: userExist._id, email: userExist.Email });
    if (role == "Vendor") {
      return res.json({
        message: `Welcome ${userExist.BusinessName}`,
        BusinessName: userExist.BusinessName,
        Location: userExist.Location,
        Email: userExist.Email,
        PhoneNumber: userExist.PhoneNumber,
        token: token,
      });
    } else {
      return res.json({
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

module.exports = router;
