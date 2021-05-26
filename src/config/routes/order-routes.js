import OrderController from '../../app/controllers/OrderController';
import authMiddleware from '../../app/middlewares/auth';

export default (router) => {
  router.get('/orders', authMiddleware, OrderController.index);
  router.get('/order/:id', authMiddleware, OrderController.show);
  router.post('/order', authMiddleware, OrderController.store);
  router.put('/order/:id', authMiddleware, OrderController.update);
  router.delete('/order/:id', authMiddleware, OrderController.delete);
};
