const express = require('express');
const bodyParser = require('body-parser');
const settingRouter = express();
const { verifyToken } = require("../utils/jwt");
// Middleware
settingRouter.use(bodyParser.urlencoded({ extended: false }));
settingRouter.use(bodyParser.json());

// Handle POST request to update profile settings
settingRouter.post('/api/profile/settings', verifyToken, (req, res) => {
  const { fullName, email, password, phone, address, newsletter, theme } = req.body;
  
  // Perform database update or any necessary actions to save the profile settings
  
  // Return success response
  res.json({ success: true, message: 'Profile settings updated successfully' });
});
module.exports = settingRouter;
