const OrderController = require('../../app/controllers/OrderController');
const authMiddleware = require('../../app/middlewares/auth');

module.exports = (router) => {
  router.get('/orders', authMiddleware, OrderController.index);
  router.get('/order/:id', authMiddleware, OrderController.show);
  router.post('/order', authMiddleware, OrderController.store);
  router.put('/order/:id', authMiddleware, OrderController.update);
  router.delete('/order/:id', authMiddleware, OrderController.delete);
};
