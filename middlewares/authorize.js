const {Cart} = require('../models');
const authorize = (req, res, next) =>{
    Cart.findOne({where: {id: req.params.id}})
        .then(Cart => {
            const isCartUser = Cart.UserId === req.currentUser.id
            if(isCartUser){
                next();
            } else {
                next({
                    code: 401,
                    message: 'This Cart is Not Yours'
                });
            }
        })
        .catch(err => {
            next({
                code: 500,
                message: 'failed reach server to create data'
            })
        })
}

module.exports = authorize