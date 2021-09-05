const ItemController = require("../../app/controllers/ItemController");
const ItemImageController = require("../../app/controllers/ItemImageController");
const authMiddleware = require("../../app/middlewares/auth");
const multerImage = require("../../app/middlewares/uploadImage");

const multer = require("multer");

const uploadImage = multer(multerImage);

module.exports = (router) => {
  router.get("/items", ItemController.index);
  router.get("/item/:id", ItemController.show);
  router.post("/item", authMiddleware, ItemController.store);
  router.put("/item/:id", authMiddleware, ItemController.update);
  router.delete("/item/:id", authMiddleware, ItemController.delete);

  router.put(
    "/item-img/:dest/:id",
    authMiddleware,
    uploadImage.single("file"),
    ItemImageController.update
  );
};
