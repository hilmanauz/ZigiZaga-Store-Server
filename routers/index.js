const router = require('express').Router();
const routerProduct = require('./product');
const routerBanner = require('./banner');
const Controller = require('../controllers');
const authenticate = require('../middlewares/authenticate')
const authorizeAdmin = require('../middlewares/authorize-admin')
const authorize = require('../middlewares/authorize')

router.post('/register', Controller.register);

router.post('/login', Controller.login);

router.get('/photos', Controller.getPhotos);

router.get('/products', Controller.viewProduct);

router.get('/banners', Controller.viewBanner);

router.use(authenticate);

router.get('/products/:id', Controller.viewProductById);

router.get('/carts', Controller.viewAllCart);

router.post('/carts/:id', Controller.addToCart);

router.put('/carts/:id', authorize, Controller.updateCart);

router.delete('/carts/:id', authorize, Controller.deleteCart);

router.post('/transactions', Controller.addTransaction);

router.get('/transactions',Controller.viewTransaction);

router.use('/products', authorizeAdmin, routerProduct);

router.use('/banners', authorizeAdmin, routerBanner);


module.exports = router