const router = require('express').Router();
const Controller = require('../controllers')

router.post('/', Controller.createBanner);

router.patch('/:id', Controller.updateStatusBanner);

router.delete('/:id', Controller.deleteBanner);

module.exports = router