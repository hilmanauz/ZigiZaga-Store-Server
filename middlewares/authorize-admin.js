const {User} = require('../models');
const authorize = (req, res, next) =>{
    User.findOne({where: {email: req.currentUser.email, role: 'admin'}})
        .then(user => {
            if(user){
                next();
            } else {
                next({
                    code: 401,
                    message: 'You are not an admin'
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