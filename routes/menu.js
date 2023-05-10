const express = require("express");
const Menu = require("../models/menu");
// const upload = require('../middleware/upload')

const menuRouter = express.Router();

const randomId =
  "_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

menuRouter.get("/", async (req, res) => {
  try {
    const menus = await Menu.find({});
    return res.status(200).json({ success: true, data: menus });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
});

// function to save menu
menuRouter.post("/", async (req, res) => {
  const file = req.files.image;
  console.log(file);
  const { title, desc, price } = req.body;
  if (!file || !title || !desc || !price) {
    return res.json({ success: false, message: "Invalid Parameters" });
  }

  //Generate unique file name
  const fileName = randomId + file.name; 
console.log(fileName);
  //Generate image url
  const imgUrl =
    req.protocol + "://" + req.get("host") + "/api/v1/menu/uploads/" + fileName;


  const document = { title, desc, price, image: imgUrl };

  const saveDocument = async () => {
    try {
      const menu = await Menu.create(document);
      return res.json({
        success: true,
        message: "upload success",
        data: menu,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };
  file.mv(__dirname + "/uploads/" + fileName, function (err) {
    if (err) {
      return res.json({ success: false, message: "Image upload failed" });
    }

    return saveDocument();
});
});

menuRouter.get("/uploads/:imageName", async (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = __dirname + "/uploads/" + imageName;

  res.sendFile(imagePath, function (err) {
    if (err) {
      console.log(err);
    }
  });
});

module.exports = menuRouter;
