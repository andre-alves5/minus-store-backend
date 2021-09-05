const LoginController = require('../../app/controllers/LoginController');
const PasswordRecoveryController = require('../../app/controllers/PasswordRecoveryController');
const PerfilController = require('../../app/controllers/PerfilController');
const PerfilImagemController = require('../../app/controllers/PerfilImageController');
const UserController = require('../../app/controllers/UserController');
const authMiddleware = require('../../app/middlewares/auth');
const multerImage = require('../../app/middlewares/uploadImage');

const multer = require('multer');

const uploadImage = multer(multerImage);

module.exports = (router) => {
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
