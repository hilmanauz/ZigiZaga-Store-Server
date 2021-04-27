const {User, Product, Banner, Cart, Transaction} = require('../models');
const {comparePassword} = require("../helpers/hash-password");
const {access_token} = require("../helpers/jwt");
const { createClient } = require('pexels');
const Op = require('sequelize').Op;
var _ = require('lodash');

class Controller {
    static register(req,res,next){
        const data = {
            email: req.body.email,
            password: req.body.password
        }
        User.create(data)
            .then(user => {
                res.status(201).json({message: 'Success create user'})
            })
            .catch(err => {
                next(err)
            })
    }

    static login(req,res,next){
        const email = req.body.email;
        const password = req.body.password;
        User.build({ email, password }).validate()
            .then(() => {
                User.findOne({where: {email: email}})
                    .then(user => {
                        if(user){
                            const isUser = comparePassword(password, user.password);
                            if(isUser){
                                let token = access_token({id: user.id, email: user.email});
                                res.status(200).json({access_token: token, email: user.email})
                            } else {
                                next({
                                    code: 401,
                                    message: 'Password is incorrect'
                                });
                            }
                        } else {    
                            next({
                                code: 401,
                                message: "Email is not exist"
                            });
                        }
                    })
                    .catch(err => {
                        next(err);
                    })
                })
                .catch(err => {
                next(err);
            })
    }

    static viewProduct(req,res,next){
        Product.findAll({order: [['id', 'ASC']]})
            .then(products => {
                res.status(200).json(products);
            })
            .catch(err => {
                next({
                    code: 500
                })
            })
    }

    static viewProductById(req,res,next){
        Product.findByPk(req.params.id)
            .then(product => {
                res.status(200).json(product);
            })
            .catch(err => {
                next({
                    code: 500
                })
            })
    }

    static createProduct(req,res,next){
        const product = {
            name: req.body.name,
            image_url: req.body.image_url,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description
        }
        Product.create(product)
            .then(product => {
                res.status(201).json(product);
            })
            .catch(err => {
                next(err);
            })
    }

    static updateProduct(req,res,next){
        const updateProduct = {
            name: req.body.name,
            image_url: req.body.image_url,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description
        }
        Product.update(updateProduct, {where: {id: req.params.id}, returning: true})
            .then(product => {
                const infoProduct = product[1][0]
                res.status(200).json(infoProduct);
            })
            .catch(err => {
                next(err);
            })
    }

    static deleteProduct(req,res,next){
        Product.destroy({where: {id:req.params.id}})
            .then(() => {
                res.status(200).json({message: 'Success Delete'});
            })
            .catch(() => {
                next({
                    code: 500
                })
            })
    }

    static viewBanner(req,res,next){
        Banner.findAll({order: [['id', 'ASC']]})
            .then(banners => {
                res.status(200).json(banners);
            })
            .catch(err => {
                next({
                    code: 500
                })
            })
    }

    static createBanner(req,res,next){
        const banner = {
            title: req.body.title,
            image_url: req.body.image_url,
            status: req.body.status,
        }
        Banner.create(banner)
            .then(banner => {
                res.status(201).json(banner);
            })
            .catch(err => {
                next(err);
            })
    }

    static updateStatusBanner(req,res,next){
        const updateStatus = {
            status: req.body.status
        }
        Banner.update(updateStatus, {where: {id: req.params.id}, returning: true})
            .then(banner => {
                const infoBanner = banner[1][0]
                res.status(200).json(infoBanner);
            })
            .catch(err => {
                next(err);
            })
    }

    static deleteBanner(req,res,next){
        Banner.destroy({where: {id:req.params.id}})
            .then(() => {
                res.status(200).json({message: 'Success Delete'});
            })
            .catch(() => {
                next({
                    code: 500
                })
            })
    }

    static addToCart(req,res,next){
        const data = {
            UserId: req.currentUser.id,
            ProductId: req.params.id,
            quantity: req.body.quantity
        }
        let sumQuantity;
        Cart.findOne({where: {ProductId: req.params.id, UserId: req.currentUser.id, TransactionId: null}})
        .then(cart => {
            if(cart){
                sumQuantity = cart.quantity + +data.quantity
            }
            return (Product.findByPk(req.params.id))
        })
        .then((product) => {
            if (sumQuantity){
                if(product.stock < sumQuantity){
                    next({
                        code: 401,
                        message: 'Your Order is more than stock'
                    });
                } else {
                    const updateQuantity = {
                        quantity: sumQuantity
                    }
                    return (Cart.update(updateQuantity, {where: {ProductId: req.params.id}}))
                }
            } else {
                if(product.stock < data.quantity){
                    next({
                        code: 401,
                        message: 'Your Order is more than stock'
                    });
                } else {
                    return (Cart.create(data))
                }
            }
        })
        .then((cart) => {
            res.status(201).json(cart)
        })
        .catch(err => {
            next(err)
        })
    }

    static viewAllCart(req,res,next){
        Cart.findAll({where: {UserId: req.currentUser.id, TransactionId: null}, include: Product, attributes: ['id', 'UserId', 'ProductId', 'quantity']})
            .then((carts) => {
                res.status(200).json(carts)
            })
            .catch(err => {
                next(err)
            })
    }

    static deleteCart(req,res,next){
        Cart.destroy({where: {id: req.params.id}})
            .then(() => {
                res.status(200).json({message: 'Success delete cart'})
            })
            .catch(err => {
                next(err)
            })
    }

    static updateCart(req,res,next){
        const data = {
            quantity: req.body.quantity
        }
        console.log(req.params.id)
        Cart.findOne({where: {id: req.params.id}, include: Product})
        .then(cart => {
                if(data.quantity > cart.Product.stock){
                    next({
                        code: 401,
                        message: 'Your Order is more than stock'
                    });
                } else {
                    return (Cart.update(data, {where: {id: req.params.id}}))
                }
            })
            .then(() => {
                res.status(200).json({message: 'Success updated cart'})
            })
            .catch(err => {
                next(err)
            })
    }

    static addTransaction(req,res,next){
        let {totalPrice, carts} = req.body
        let updatedStocks = [];
        for( let i = 0; i < carts.length; i++ ){
            carts[i].Product.stock -= carts[i].quantity
            updatedStocks.push(carts[i].Product)
        }
        Product.bulkCreate(updatedStocks, { updateOnDuplicate: ["stock"] })
            .then(() => {
                return (Transaction.create({totalPrice}, {attributes: ['id', 'totalPrice']}))
            })
        .then(transaction => {
            const update = {
                TransactionId: transaction.id
            }
            return (Cart.update(update, {where: {TransactionId: null, UserId: req.currentUser.id}}))
        })
        .then(() => {
            res.status(201).json({message: 'Transaction successfull'})
        })
        .catch(err =>{
            next(err)
        })
    }

    static viewTransaction(req,res,next){
        let carts;
        Cart.findAll({where: {UserId: req.currentUser.id, TransactionId:{[Op.ne]: null}}, include: Product})
            .then(datas => {
                carts = _.groupBy(datas, el => el.TransactionId)
                return (Transaction.findAll())
            })
            .then(transactions => {
                let result = []
                for (let key in carts){
                    for (let i = 0; i < transactions.length; i++){
                        if(transactions[i].id === +key){
                            transactions[i].dataValues.carts = carts[key]
                            result.push(transactions[i].dataValues)
                        }
                    }
                }
                res.status(200).json(result)
            })
            .catch(err => {
                next(err)
            })
    }

    static getPhotos(req,res,next){
        const client = createClient('563492ad6f91700001000001aa326ed5c4d14e98af19e4447697bd7c');
        const query = 'e commerce fashion';
        const orientation = 'potrait';
        const size = 'medium'

        client.photos.search({ query, orientation, size , per_page:25})
            .then(photos => {
                res.status(200).json(photos)
            })
            .catch(err => {
                next(err)
            })
    }
    
}

module.exports = Controller