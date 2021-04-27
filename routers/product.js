const router = require('express').Router();
const Controller = require('../controllers')

router.post('/', Controller.createProduct);

router.put('/:id', Controller.updateProduct);

router.delete('/:id', Controller.deleteProduct);

module.exports = router