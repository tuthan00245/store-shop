const catchAsyncError = require('../middleware/catchAsyncError');
const Cart = require('../models/cartModel')
const ErrorHander = require('../utils/errorHander')

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {

    Cart.findOneAndUpdate(condition, updateData, {
        new: true
      })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
}
exports.addItemToCart = catchAsyncError(async (req, res) => {
  Cart.findOne({
    user: req.user._id
  }).exec((error, cart) => {
    if (error) return res.status(400).json({
      error
    });
    if (cart) {
      //if cart already exists then update cart by quantity
      let promiseArray = [];

      req.body.cartItems.forEach((cartItem) => {
        const product = cartItem.product;
        const item = cart.cartItems.find((c) => c.product == product);
        let condition, update;
        if (item) {
          condition = {
            user: req.user._id,
            "cartItems.product": product
          };
          update = {
            $set: {
              "cartItems.$": cartItem,
            },
          };
        } else {
          condition = {
            user: req.user._id
          };
          update = {
            $push: {
              cartItems: cartItem,
            },
          };
        }
        promiseArray.push(runUpdate(condition, update));
      });
      Promise.all(promiseArray)
        .then((data) => res.status(201).json({
          data
        }))
        .catch((error) => res.status(400).json({
          error
        }));
    } else {
      const cart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems,
      });
      cart.save((error, cart) => {
        if (error) return res.status(400).json({
          error
        });
        if (cart) {
          return res.status(201).json({
            cart
          });
        }
      });
    }
  });
})

exports.getCartItems = catchAsyncError(async (req, res, next) => {
  const cart = await Cart.findOne({
    user: req.user._id
  }).populate("cartItems.product", "_id category name moneyShip price images description Stock sale")
  if (!cart) {
    return next(new ErrorHander("Card not found", 404));
  }
  let cartItems = {};
  cart.cartItems.forEach((item, index) => {
    cartItems[item.product._id.toString()] = {
      _id: item.product._id.toString(),
      name: item.product.name,
      images: item.product.images[0].url,
      price: item.product.price,
      quantity: item.quantity,
      description: item.product.description,
      Stock: item.product.Stock,
      sale: item.product.sale,
      selected: item.selected,
      moneyShip: item.product.moneyShip,
      category: item.product.category
    };
  });
  res.status(200).json({
    cartItems
  });

})

// new update remove cart items
exports.removeCartItems = catchAsyncError(async (req, res, next) => {
  const productId = req.body.id;
  if (productId) {
    Cart.update({
      user: req.user._id
    }, {
      $pull: {
        cartItems: {
          product: productId,
        },
      },
    }).exec((error, result) => {
      if (error) return res.status(400).json({
        error
      });
      if (result) {
        res.status(202).json({
          result
        });
      }
    });
  }
})

exports.removeCardUser = catchAsyncError(async (req, res, next) => {
  const card = await Cart.findOne(req.user._id)
  if(!card) {
    return next(new ErrorHander("Card not found", 404));
  }
  await card.remove()

  res.status(200).json({
    success: true
  })
})

exports.updateSelectedAll = catchAsyncError(async (req, res, next) => {
  const card = await Cart.findOne(req.user._id)
  if(!card) {
    return next(new ErrorHander("Card not found", 404));
  }

  card.cartItems.forEach((cartItem, i) => {
    cartItem.selected = req.body.selected
  })

  card.save()
  
  res.status(200).json({
    success: true
  })
})