import ItemController from '../../app/controllers/ItemController';
import ItemImageController from '../../app/controllers/ItemImageController';
import authMiddleware from '../../app/middlewares/auth';
import multerImage from '../../app/middlewares/uploadImage';

import multer from 'multer';

const uploadImage = multer(multerImage);

export default (router) => {
  router.get('/items', authMiddleware, ItemController.index);
  router.get('/item/:id', authMiddleware, ItemController.show);
  router.post('/item', authMiddleware, ItemController.store);
  router.put('/item/:id', authMiddleware, ItemController.update);
  router.delete('/item/:id', authMiddleware, ItemController.delete);

  router.put(
    '/item-img/:dest/:id',
    authMiddleware,
    uploadImage.single('file'),
    ItemImageController.update
  );
};
