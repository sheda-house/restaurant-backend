const express = require("express");
const cors = require("cors");
const Cart = require("../models/cart");
const Menu = require("../models/menu")
const { verifyToken } = require("../utils/jwt");
const { data } = require("jquery");
const cartRouter = express.Router();



// Apply middleware
cartRouter.use(express.json()); // Add JSON parsing middleware


cartRouter.post("/", verifyToken, async (req, res) => {
  try {
    const cartItem = req.body;
    const userId = req.user.id;
    const realUser = await Cart.findOne({ userId }).lean();

    let cart;
    if (!realUser) {
      // If cart is not found, create a new cart
      cart = new Cart({
        userId: req.user.id,
        cart: [cartItem],
      });
    } else {
      cart = realUser;
      cart.cart = cart.cart || []; // Initialize cart.cart as an array if it is undefined or null

      // Check if the item already exists in the cart
      const existingItemIndex = cart.cart.findIndex((item) => item.id === cartItem.id);

      if (existingItemIndex !== -1) {
        // If the item exists, increment its quantity
        cart.cart[existingItemIndex].quantity += 1;
      } else {
        // If the item doesn't exist, add it to the cart
        cart.cart.push(cartItem);
      }
    }

    await Cart.findOneAndUpdate({ userId }, cart, { upsert: true });

    return res.status(200).json({
      success: true,
      message: "Added to cart successfully",
      cart: cart.cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding to the cart.",
    });
  }
});


cartRouter.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Cart.findOne({ userId }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Cart is Empty",
      });
    }
console.log(user);
    return res.status(200).json({
      success: true,
      message: "Cart items fetched successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching cart items.",
    });
  }
});

// Remove item from cart
cartRouter.delete("/removeItem/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id; // Assuming the `id` property is sent in the request parameters

    // const user = await Cart.findOne({ userId });
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const removedItem = user.cart.findIndex((item) => item.id === itemId);
    user.cart.splice(removedItem, 1)

    const updatedCart = user.cart.filter((item) => item.id !== itemId);
    user.cart = updatedCart;
    await user.updateOne({ cart: updatedCart })

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while removing item from the cart.",
    });
  }
});


module.exports = cartRouter;





















// const express = require("express");
// const Users = require("../models/users");
// const cors = require("cors");

// const cartRouter = express.Router();
// cartRouter.use(cors());


// cartRouter.post("/", async (req, res) => {
//   const { title, desc, price, image: imgUrl } = req.body.data;
//   const { id } = req.body;

//   try {
//     const user = await Users.findById(id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "Invalid user id",
//       });
//     }

//     user.cart.push({
//       title,
//       desc,
//       price,
//       image: imgUrl,
//     });

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Added to cart successfully",
//       data: user.cart,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while adding to the cart.",
//     });
//   }
// });


// cartRouter.get("/", async (req, res) => {
//   const { id } = req.query;

//   try {
//     const user = await Users.findById(id);

//     return res.status(200).json({
//       success: true,
//       message: "Success",
//       data: user.cart,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching cart items.",
//     });
//   }
// });


// cartRouter.post("/removeItem", async (req, res) => {
//   const { userId, menuId } = req.body;

//   try {
//     const user = await Users.findById(userId);

//     const menuIndex = user.cart.findIndex(
//       (item) => item._id.toString() === menuId
//     );

//     if (menuIndex !== -1) {
//       user.cart.splice(menuIndex, 1);
//       await user.save();
//       res.status(200).json({
//         success: true,
//         message: "Product removed from cart successfully.",
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: "Product not found in the cart.",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while removing the product from the cart.",
//     });
//   }
// });


// module.exports = cartRouter;


// cartRouter.post("/", async (req, res) => {
//   const { title, desc, price, image: imgUrl } = req.body.data;
//   const { id } = req.body;

//   const addToCart = async () => {
//     try {
//       // Find the user by their ID
//       const user = await Users.findOne({ _id: id });

//       if (!user) {
//         return res.json({
//           success: false,
//           message: "Invalid user id",
//         });
//       }

//       // Push the product object into the cart array
//       user.cart.push(req.body.data);

//       // Save the updated user object
//       await user.save();

//       return res.json({
//         success: true,
//         message: "Added to cart successfully",
//         data: user.cart,
//       });
//     } catch (error) {
//       return res.json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };

//   addToCart();
// });


// cartRouter.get("/", async (req, res) => {
//   const { id } = req.body;

//   const getCartItems = async () => {
//     try {
//       const user = await Users.findOne({ _id: id });
//       return res.json({
//         success: true,
//         message: "Success",
//         user,
//       });
//     } catch (error) {
//       return res.json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };

//   getCartItems();
// });

// cartRouter.post("/removeItem", async (req, res) => {
//   const { userId, menuId } = req.body;

//   try {
//     // Find the user by their ID
//     const user = await Users.findById(userId);

//     // Find the index of the product in the cart array
//     const menuIndex = user.cart.findIndex(
//       (item) => item._id.toString() === menuId
//     );

//     // If the product exists in the cart, remove it
//     if (menuIndex !== -1) {
//       user.cart.splice(menuIndex, 1);
//       await user.save();
//       res.status(200).json({
//         success: true,
//         message: "Product removed from cart successfully.",
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: "Product not found in the cart.",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while removing the product from the cart.",
//     });
//   }
// });