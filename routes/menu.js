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

// contentRouter.post('/contents', async (req, res) => {
//   try {
//     const { title, category, author } = req.body;
//     const imageFile = req.files.image;
//     const videoFile = req.files.video;

//     if (!imageFile || !videoFile || !title || !category || !author) {
//       return res.json({ success: false, message: 'Invalid Parameters' });
//     }

//     // Check if a content with the same title, category, and author already exists
//     const existingContent = await Content.findOne({ title, category, author });

//     if (existingContent) {
//       return res.status(409).json({ message: 'Content with the same title and author already exists', action: 'update' });
//     }

//     // Generate unique file names for image and video
//     const imageFileName = randomId + imageFile.name;
//     const videoFileName = randomId + videoFile.name;

//     // Generate image and video URLs
//     const imageImgUrl = req.protocol + '://' + req.get('host') + '/api/v1/menu/uploads/' + imageFileName;
//     const videoUrl = req.protocol + '://' + req.get('host') + '/api/v1/menu/uploads/' + videoFileName;

//     const document = { title, category, author, image: imageImgUrl, video: videoUrl };

//     imageFile.mv(__dirname + '/uploads/' + imageFileName, function (imageErr) {
//       if (imageErr) {
//         return res.json({ success: false, message: 'Image upload failed' });
//       }

//       videoFile.mv(__dirname + '/uploads/' + videoFileName, async function (videoErr) {
//         if (videoErr) {
//           return res.json({ success: false, message: 'Video upload failed' });
//         }

//         try {
//           const content = await Content.create(document);
//           res.status(201).json({
//             success: true,
//             message: 'Upload success',
//             data: content,
//           });
//         } catch (error) {
//           res.json({
//             success: false,
//             message: error.message,
//           });
//         }
//       });
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });


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
