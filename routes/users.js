const express = require("express");
const userRouter = express.Router();
const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const roles = require("../models/roles");
const { createLogger, transports, format } = require('winston');


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

userRouter.post("/register", async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      Email,
      Password,
      PhoneNumber,
      cPassword,
      role,
    } = req.body;

    const getRole = await roles.findOne({ Name: role });

//  console.log((getRole));
// return res.json(roles);

    if (!role) {
      return res.json({ 
        status: false,
        message: "Invalid role" });
    }

    const userExist = await Users.findOne({ Email });

    if (userExist) {
      return res.json({ 
        status: false,
        message: "User with this Email already exists" });
    }

    if (cPassword !== Password) {
      return res.json({ 
        status: false,
        message: "Confirm Password has to match Password" });
    }

    const hashPassword = await bcrypt.hash(Password, 10);

    const newUser = await Users.create({
      FirstName,
      LastName,
      Email,
      PhoneNumber,
      Password: hashPassword,
      role,
      // RoleId: getRole._id,
    });

    return res.json({
      status: true,
      message: `User ${newUser.FirstName} has been registered. Congratulations`,
      Id: newUser._id,
      FirstName: newUser.FirstName,
      LastName: newUser.LastName,
      Email: newUser.Email,
      roleId: newUser.RoleId,
      PhoneNumber:newUser.PhoneNumber,
      role
    });
    
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ 
      status: false,
      message: "Internal Server Error" });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { Email, Password, role } = req.body;

    const userExist = await Users.findOne({ Email });

    if (!userExist) {
      return res.json({
        status: false,
        message: "User with this Email does not exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      Password,
      userExist.Password
    );

    if (!isPasswordCorrect) {
      return res.json({
        status: false,
        message: "Incorrect Password",
      });
    }

  //   const getRole = await roles.findOne({ _id: userExist.RoleId });
  //  console.log(getRole);

    //if (role === "Customer") {
      return res.json({
        status: true,
        FirstName: userExist.FirstName,
        LastName: userExist.LastName,
        Email: userExist.Email,
        PhoneNumber: userExist.PhoneNumber,
        Role: role,
        message: `Congratulations!! Welcome ${userExist.FirstName}`,
        token
      });
    
    //}
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = userRouter;




// const express = require("express");
// const userRouter = express.Router();
// const Users = require("../models/users");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const roles = require("../models/roles");

// userRouter.post("/register", async (req, res) => {
//   try {
//     const {
//       FirstName,
//       LastName,
//       Email,
//       Password,
//       PhoneNumber,
//       cPassword,
//       role,
//     } = req.body;

//     let getRole;

//     if (role === undefined) {
//       getRole = await roles.findOne({ Name: "Customer" });
//     } else {
//       getRole = await roles.findOne({ Name: role });
//     }

//     if (!getRole) {
//       return res.json({ message: "Invalid role" });
//     }

//     const userExist = await Users.findOne({ Email });

//     if (userExist) {
//       return res.json({ message: "User with this Email already exists" });
//     }

//     if (cPassword !== Password) {
//       return res.json({ message: "Confirm Password has to match Password" });
//     }

//     const hashPassword = await bcrypt.hash(Password, 10);

//     const newUser = await Users.create({
//       FirstName,
//       LastName,
//       Email,
//       PhoneNumber,
//       Password: hashPassword,
//       role,
//       RoleId: getRole._id,
//     });

//     return res.json({
//       message: `User ${newUser.FirstName} has been registered. Congratulations`,
//       Id: newUser._id,
//       FirstName: newUser.FirstName,
//       LastName: newUser.LastName,
//       Email: newUser.Email,
//       roleId: newUser.RoleId,
     
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// userRouter.post("/login", async (req, res) => {
//   try {
//     const { Email, Password } = req.body;
//     let getRole;

//     const userExist = await Users.findOne({ Email });
//     console.log(userExist);
    
//     if (!userExist) {
//       return res.json({
//         status: false,
//         message: "User with this Email does not exist",
//       });
//     }

//     const isPasswordCorrect = await bcrypt.compare(
//       Password,
//       userExist.Password
//     );

//     if (!isPasswordCorrect) {
//       return res.json({
//         status: false,
//         message: "Incorrect Password",
//       });
//     }
//      getRole = await roles.findOne({ _id: userExist.RoleId });
//     let role = getRole.Name

//       if (role === "Customer") {
//         return res.json({
//           status: true,
//           FirstName: userExist.FirstName,
//           LastName: userExist.LastName,
//           Email: userExist.Email,
//           PhoneNumber: userExist.PhoneNumber,
//           Role: role,
//           message: `Congratulations!! Welcome ${userExist.FirstName}`,
//         });
//       }
//       else if(role !== "Customer"){
//         return res.json({
//           status: false,
//           message: "Access Denied",
//         });
//       }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// module.exports = userRouter;
