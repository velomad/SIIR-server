const models = require("../models");
const bcrypt = require("bcrypt");
const { destroy, upload } = require("../cloudinary");
const { getPublicId } = require("../utils/cloudinary");
const { Op } = require("sequelize");
const paginate = require("../utils/paginate");

module.exports = {
  allUserPrefShayris: async (req, res, next) => {
    const { categories } = req.body;
    const { page, limit } = req.query;

    try {
      let data = [];

      categories.map((category) => {
        data.push({ categoryId: category });
      });

      let search = {
        where: {
          [Op.or]: data,
        },
      };

      const shayris = await paginate(models.Shayri, page, limit, search, next);

      res.json({ status: "success", shayris });
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

  myShayris: async (req, res, next) => {
    const { aud } = req.payload;

    try {
      const result = await models.Shayri.findAll({ where: { userId: aud } });

      res
        .status(200)
        .json({ status: "success", results: result.length, shayris: result });
    } catch (error) {
      next(error);
    }
  },

  pinShayri: async (req, res, next) => {
    const shayriId = req.params.shayriId;
    const { aud } = req.payload;
    try {
      const result = await models.PinnedShayri.create({
        shayriId,
        userId: aud,
      });
      res.status(201).json({ status: "success", result });
    } catch (error) {
      next(error);
    }
  },
  unPinShayri: async (req, res, next) => {
    const shayriId = req.params.shayriId;
    const { aud } = req.payload;
    try {
      const result = await models.PinnedShayri.destroy({
        where: { [Op.and]: [{ shayriId: shayriId }, { userId: aud }] },
      });

      res.status(200).json({ status: "success", message: "shayri unpinned" });
    } catch (error) {
      next(error);
      console.log(error);
    }
  },
};
