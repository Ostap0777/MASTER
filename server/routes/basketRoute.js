const Router = require('express');
const basketController = require('../controllers/basketController');
const router = new Router()


router.post('/', basketController.addToBasket);
router.get('/',basketController.getBasket)
router.delete('/', basketController.removeFromBasket);

module.exports = router;