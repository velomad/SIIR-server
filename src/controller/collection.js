const models = require("../models");
const { Op } = require("sequelize");
const createError = require("http-errors");
const { getPublicId } = require("../utils/cloudinary");
const { destroy, upload } = require("../cloudinary");

module.exports = {
  create: async (req, res, next) => {
    let image, response;
    const { aud } = req.payload;
    try {
      if (!req.file) throw new createError.NotFound(`Image not found`);

      if (req.file) {
        image = req.file.path;
        response = await upload(image);
      }
      const result = await models.Collection.create({
        userId: aud,
        collectionImageUrl: response.url,
      });
      res.status(201).json({ status: "success", result });
    } catch (error) {
      next(error);
    }
  },
  allCollections: async (req, res, next) => {
    const { aud } = req.payload;
    try {
      const result = await models.Collection.findAll({ userId: aud });
      res.status(200).json({ status: "success", collections: result });
    } catch (error) {
      next(error);
    }
  },
  removeCollection: async (req, res, next) => {
    const collectionId = req.params.collectionId;
    const { aud } = req.payload;

    try {
      const result = await models.Collection.destroy({
        where: { [Op.and]: [{ id: collectionId }, { userId: aud }] },
      });

      // delete image from cloud if shayri post gets deleted
      if (result == 1) destroy(getPublicId(find.shayriBackgroundImageUrl));

      res
        .status(200)
        .json({ status: "success", messages: "collection removed" });
    } catch (error) {
      next(error);
    }
  },
};
