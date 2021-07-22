const models = require("../models");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { destroy, upload } = require("../cloudinary");
const { getPublicId } = require("../utils/cloudinary");
const { Op } = require("sequelize");
const paginate = require("../utils/paginate");

module.exports = {
  allUserPrefShayris: async (req, res, next) => {
    const { aud } = req.payload;
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

      let associations = [
        {
          attributes: { exclude: ["userId", "categoryId"] },
          include: [
            {
              model: models.Category,
              as: "category",
              attributes: ["categoryName", "categoryImageUrl"],
            },
            {
              model: models.User,
              as: "user",
              attributes: ["userName", "profileImageUrl"],
            },
            {
              model: models.Like,
              as: "likes",
              attributes: ["userId", "createdAt"],
            },
            {
              model: models.PinnedShayri,
              as: "pinned",
              attributes: ["userId", "createdAt"],
            },
          ],
        },
      ];

      const shayris = await paginate(
        models.Shayri,
        associations,
        page,
        limit,
        search,
        next
      );

      let dataArry = [];
      shayris.data.map((el) => {
        const isLiked = el.likes.some(function (ele) {
          return ele.userId === parseInt(aud);
        });
        const isPinned = el.pinned.some(function (ele) {
          return ele.userId === parseInt(aud);
        });
        dataArry.push({
          isLiked: isLiked,
          isPinned: isPinned,
          data: el,
        });
      });

      res.json({
        status: "success",
        previousPage: shayris.previousPage,
        currentPage: shayris.currentPage,
        nextPage: shayris.nextPage,
        total: shayris.total,
        limit: shayris.limit,
        data: dataArry,
      });
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

  pinned: async (req, res, next) => {
    const { aud } = req.payload;
    const { page, limit } = req.query;
    try {
      const associations = [
        { include: [{ model: models.PinnedShayri, as: "shayri" }] },
      ];
      const search = { where: { userId: aud } };

      const paginatedResponse = await paginate(
        models.PinnedShayri,
        associations,
        page,
        limit,
        search,
        next
      );

      res
        .status(200)
        .json({ status: "success", pinnedShayris: paginatedResponse });
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
    }
  },

  likeToggle: async (req, res, next) => {
    const { aud } = req.payload;
    const shayriId = req.params.shayriId;
    try {
      const find = await models.Shayri.findOne({ where: { id: shayriId } });
      if (!find) throw new createError.NotFound("Shayri not found");

      const findLike = await models.Like.findOne({
        where: { [Op.and]: [{ userId: aud }, { shayriId }] },
      });

      if (findLike) {
        await models.Like.destroy({
          where: { [Op.and]: [{ userId: aud }, { shayriId }] },
        });
      } else {
        await models.Like.create({ userId: aud, shayriId });
      }

      res.status(201).json({
        status: "success",
        result: findLike ? "Shayri Unliked" : "shayri liked",
      });
    } catch (error) {
      next(error);
    }
  },

  likedBy: async (req, res, next) => {
    const shayriId = req.params.shayriId;
    try {
      const result = await models.Like.findAll({
        where: { shayriId },
        attributes: ["id", ["createdAt", "likedAt"]],
        include: [
          {
            model: models.User,
            as: "user",
            attributes: ["id", "userName", "profileImageUrl"],
          },
        ],
      });
      res.status(200).json({
        status: "success",
        likes: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
