const {Product} = require('../models');
function deleteProduct(){
    return Product.destroy({where: {}})
}

module.exports = deleteProduct