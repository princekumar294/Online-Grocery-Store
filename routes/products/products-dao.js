/* 
 * Products Routers * 
 * Products Data Access Object *
 * Product Items *

 * Functionalities Index: 
        ======================================================================================================
        | S.No. |  Type  |         URL         |   Function Call   | Controller |         Description        |
        ======================================================================================================
        |   1.  | Post   | /products/doa       | addNewProduct     | products   | Add new product record     |
        ------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../../data');
const productsData = data.products;

/* global scoped function */
//------------------------ route to get product information by id
router.get('/id/:id', (req, res) => {
        productsData.getProductById(xss(req.params.id)).then((productInfo) => {

                if (productInfo != null) {
                        res.render('product/product-info', {
                                mainTitle: `${productInfo.title} •`,
                                user: req.user,
                                product: productInfo
                        });
                } else {
                        res.render('alerts/error', {
                                mainTitle: "Page Not Found •",
                                code: 404,
                                message: "Page Not Found",
                                url: req.originalUrl,
                                user: req.user
                        });
                }
        })
        .catch((error) => {
                res.render('alerts/error', {
                        mainTitle: "Page Not Found •",
                        code: 404,
                        message: "Page Not Found",
                        url: req.originalUrl,
                        user: req.user
                });
        })
});

//------------------------ route to get product information by id
router.get('/category/:category', (req, res) => {
        productsData.getProductByCategory(xss(req.params.category)).then((productsList) => {

                if (productsList != null) {
                        res.render('product/product-category-results', {
                                mainTitle: `${xss(productsList[0].category)} Products •`,
                                user: req.user,
                                product: productsList
                        });
                } else {
                        res.render('alerts/error', {
                                mainTitle: "Page Not Found •",
                                code: 404,
                                message: "Page Not Found",
                                url: req.originalUrl,
                                user: req.user
                        });
                }
        })
        .catch((error) => {
                res.render('alerts/error', {
                        mainTitle: "Page Not Found •",
                        code: 404,
                        message: "Page Not Found",
                        url: req.originalUrl,
                        user: req.user
                });
        })
});

//------------------------ route to get product information by search command
//router.post('/search?keyword:query', (req, res) => {
router.get('/search', (req, res) => {
        let prodSearchbar = xss(req.query.keyword);

        if (prodSearchbar) {
                productsData.getProductBySearch(prodSearchbar).then((productResults) => {

                        if (productResults.length != 0) {
                                res.render('product/product-search-results', {
                                        mainTitle: `${prodSearchbar} •`,
                                        product: productResults,
                                        user: req.user
                                });
                        } else {
                                res.render('alerts/error', {
                                        mainTitle: "Page Not Found •",
                                        code: 404,
                                        message: "Your search did not match any products.",
                                        url: req.originalUrl,
                                        user: req.user
                                });
                        }

                })
                .catch((error) => {
                        res.render('alerts/error', {
                                mainTitle: "Page Not Found •",
                                code: 404,
                                message: "Page Not Found",
                                url: req.originalUrl,
                                user: req.user
                        });
                });
        } else {
                res.redirect('/');
        }
});



//------------------------ route to get all product list
router.get('/', (req, res) => {
        productsData.getAllProducts().then((productsList) => {
                res.send(productsList);
        })
        .catch((error) => {
                res.send({ error: error });
        })
});

//------------------------ route to add product information
router.post('/', (req, res) => {

        let productUpdates = req.body;

        if (Object.keys(productUpdates).length === 0 || productUpdates == undefined) {    // check for empty json passed
                res.status(400).json({ error: "No data provided" });
        } else if (!productUpdates.title) {
                res.status(400).json({ error: "No title provided" });
        } else if (!productUpdates.description) {
                res.status(400).json({ error: "No description provided" });
        } else if (!productUpdates.category) {
                res.status(400).json({ error: "No category provided" });
        } else if (!productUpdates.expDate) {
                res.status(400).json({ error: "No expiry date provided" });
        } else if (!productUpdates.mfdDate) {
                res.status(400).json({ error: "No manufactured date provided" });
        } else if (!productUpdates.size) {
                res.status(400).json({ error: "No size provided" });
        } else if (!productUpdates.price) {
                res.status(400).json({ error: "No price provided" });
        } else if (!productUpdates.stock) {
                res.status(400).json({ error: "No stock provided" });
        } else if (!productUpdates.images) {
                productUpdates["images"] = []
        } else if (!productUpdates.suggestion) {
                productUpdates["suggestion"] = []
        } else if (!productUpdates.allegations) {
                productUpdates["allegations"] = []
        }
        
        productsData.addNewProduct(productUpdates.title, productUpdates.description, productUpdates.category, productUpdates.expDate, 
                productUpdates.mfdDate, productUpdates.size, productUpdates.price, productUpdates.stock, productUpdates.images, 
                productUpdates.suggestion, productUpdates.allegations)
                .then(() => {
                        res.status(200).send({ success: true });
                })
                .catch((error) => {     // rendering error page
                        res.render('alerts/error', {
                                mainTitle: "Server Error •",
                                code: 500,
                                message: error,
                                url: req.originalUrl,
                                user: req.user
                        });
                });
});

// exporting routing apis
module.exports = router;