const models = require("../models");
const bcrypt = require("bcrypt");
const { destroy, upload } = require("../cloudinary");
const { getPublicId } = require("../utils/cloudinary");
const Op = require("sequelize");

module.exports = {
  allShayris: async (req, res, next) => {
    const userId = req.aud;
    try {
      const result = await models.Shayri.findAll({
        where: {
          categoryId: 21,
        },
      });

      res.json({ status: "success", results: result.length, shayris: result });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    const { aud } = req.payload;
    const body = req.body;
    let image, imageUploadResponse;

    try {
      if (req.file) {
        image = req.file.path;
        imageUploadResponse = await upload(image);
      }

      const result = await models.Shayri.create({
        ...body,
        userId: aud,
        shayriBackgroundImageUrl: image ? imageUploadResponse.url : null,
      });

      res.status(201).json({ status: "success", result });
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    const { aud } = req.payload;
    const shayriId = req.params.shayriId;

    try {
      const find = await models.Shayri.findOne({
        where: { [Op.and]: [{ id: shayriId }, { userId: aud }] },
      });

      if (!find) throw new createError.NotFound("Shayri not found");

      const result = await models.Shayri.destroy({
        where: { [Op.and]: [{ id: shayriId }, { userId: aud }] },
      });

      // delete image from cloud if shayri post gets deleted
      if (result == 1) destroy(getPublicId(find.shayriBackgroundImageUrl));

      res.status(200).json({ status: "success", message: "Shayri Deleted" });
    } catch (error) {
      next(error);
    }
  },
};
