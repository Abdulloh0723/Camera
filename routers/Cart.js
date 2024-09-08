const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Mahsulot = require('../models/mahsulot');
const mongoose = require("mongoose");
const cart = require('../models/cart');

router.post('/add', async (req, res) => {
    
    
    try {
        const { productId } = req.body;
        
        let cart = await Cart.findOne(); // Modify this line based on how you retrieve the cart (e.g., by user)

        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart();
        }

        // Find the item in the cart that matches the productId
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // If the item exists, increment its quantity
            cart.items[itemIndex].quantity += 1;
        } else {
            // If the item does not exist, add a new item
            cart.items.push({ product: new mongoose.Types.ObjectId(productId), quantity: 1 });
        }

        // Calculate the total price
        let total = 0;
        for (let i = 0; i < cart.items.length; i++) {
            const item = cart.items[i];
            const product = await mongoose.model('Mahsulot').findById(item.product);
            if (product) {
                total += product.narxi * item.quantity;
            }
        }
        cart.totalPrice = total;

        // Save the cart
        // console.log(cart);
        
        await cart.save();
    

        res.redirect("/");
    } catch (err) {
        console.error(err);
    }
});


router.post('/update', async (req, res) => {
    const { productId, action } = req.body;
    
    try {
        let cart = await Cart.findOne();
        // console.log(cart.items)
        const productIndex = cart.items.findIndex(p => p.product.toString() === productId);
        
        
        if (productIndex > -1) {
            if (action === 'increment') {
                cart.items[productIndex].quantity += 1;
            } else if (action === 'decrement' && cart.items[productIndex].quantity > 1) {
                cart.items[productIndex].quantity -= 1;
            }

            // Recalculate total
            let newTotal = 0;
            for (let item of cart.items) {
                const mahsulot = await Mahsulot.findById(item.product);
                console.log(mahsulot.narxi)
                newTotal += mahsulot.narxi * item.quantity;
            }
            
            cart.totalPrice = newTotal;
            console.log(cart.totalPrice)
            await cart.save();
        }
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/delete", async (req, res) => {
    try {
        const { productId } = req.body;
        console.log(productId)  
        let cart = await Cart.findOne();
        // console.log(featureId);
        if (cart) {
            // Savatdan elementni o'chirish
            cart.items = cart.items.filter(item => item.product.toString() !== productId);

            // Umumiy summani qayta hisoblash
            let newTotal = 0;
            for (let item of cart.items) {
                const product = await Mahsulot.findById(item.product);
                if (product) {
                    newTotal += product.narxi * item.quantity;
                }
            }
            cart.totalPrice = newTotal;

            await cart.save();
        }
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});




router.post('/purchase', async (req, res) => {
    try {
        console.log(req.body);
        
    let cart = await Cart.findOne({ userId: req._id });
        if (!cart) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        
        // Loop through each item in the cart and update product quantities
        for (let item of cart.items) {
            const product = await Mahsulot.findById(item.product._id);
            if (product.soni < item.quantity) {
                return res.status(400).json({ message: `Maxsulot tugap qolgan${product.nomi}` });
            }
            product.soni -= item.quantity; // Update the product quantity
            await product.save();
        }

        // Clear the cart after the purchase
        cart.items = [];
        await cart.save();

        // return res.json({ message: "Purchase successful", cart });
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: "Something went wrong" });
    }
});


module.exports = router;
