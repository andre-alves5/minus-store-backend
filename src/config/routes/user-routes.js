import LoginController from '../../app/controllers/LoginController';
import PasswordRecoveryController from '../../app/controllers/PasswordRecoveryController';
import PerfilController from '../../app/controllers/PerfilController';
import PerfilImagemController from '../../app/controllers/PerfilImageController';
import UserController from '../../app/controllers/UserController';
import authMiddleware from '../../app/middlewares/auth';
import multerImage from '../../app/middlewares/uploadImage';

import multer from 'multer';

const uploadImage = multer(multerImage);

export default (router) => {
  router.get('/users', UserController.index);
  router.get('/users/:id', UserController.show);
  router.post('/users', UserController.store);
  router.put('/users', authMiddleware, UserController.update);
  router.delete('/users/:id', authMiddleware, UserController.delete);

  router.post('/login', LoginController.store);

  router.post('/passwordrecovery', PasswordRecoveryController.store);
  router.get('/passwordrecovery/:validatekey', PasswordRecoveryController.show);
  router.put('/passwordrecovery', PasswordRecoveryController.update);

  router.get('/perfil', authMiddleware, PerfilController.show);
  router.put('/perfil', authMiddleware, PerfilController.update);
  router.put(
    '/perfil-img/:dest/:id',
    authMiddleware,
    uploadImage.single('file'),
    PerfilImagemController.update
  );
};
