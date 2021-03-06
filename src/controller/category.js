const createError = require("http-errors");
const models = require("../models");
const { destroy, upload } = require("../cloudinary");
const { getPublicId } = require("../utils/cloudinary");
const { Op } = require("sequelize");

module.exports = {
  create: async (req, res, next) => {
    const body = req.body;
    let image, imageUploadResponse;

    try {
      const find = await models.Category.findOne({
        where: { categoryName: body.categoryName },
      });

      if (find) {
        throw new createError.UnprocessableEntity(
          `category ${body.categoryName} already exist`
        );
      }

      if (req.file) {
        image = req.file.path;
        imageUploadResponse = await upload(image);
      }
      const result = await models.Category.create({
        ...body,
        categoryImageUrl: image ? imageUploadResponse.url : null,
      });
      res.status(201).json({ status: "success", result });
    } catch (error) {
      next(error);
      console.log(error.sqlState);
      console.log(error);
    }
  },
  allCategories: async (req, res, next) => {
    try {
      const result = await models.Category.findAll();
      res.status(200).json({ status: "success", result });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    const body = req.body;
    const categoryId = req.params.categoryId;
    let image, imageUploadResponse;
    try {
      let find = await models.Category.findOne({ where: { id: categoryId } });

      if (!find)
        throw new createError.NotFound(
          "category id " + categoryId + " not found"
        );

      const categoryImageUrl = find.categoryImageUrl;

      if (body.remove == 1) {
        destroy(getPublicId(categoryImageUrl));
      } else if (req.file) {
        image = req.file.path;
        imageUploadResponse = await upload(image);
      }

      await models.Category.update(
        {
          ...body,
          categoryImageUrl: req.file
            ? imageUploadResponse.url
            : body.remove == 1
            ? null
            : categoryImageUrl,
        },
        { where: { id: categoryId } }
      );

      res.status(200).json({ status: "success", message: "category updated" });
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    const categoryId = req.params.categoryId;
    try {
      const find = await models.Category.findOne({ findByPk: categoryId });

      if (!find)
        throw new createError.NotFound(
          "category id " + categoryId + " not found"
        );

      const categoryImageUrl = find.categoryImageUrl;

      if (categoryImageUrl !== null) {
        destroy(destroy(getPublicId(categoryImageUrl)));
      }
      await models.Category.destroy({
        where: { id: categoryId },
      });

      res.status(200).json({ status: "success", message: "category removed" });
    } catch (error) {
      next(error);
    }
  },

  addUserCategories: async (req, res, next) => {
    const categories = req.body.categories;
    const { aud } = req.payload;

    try {
      let data = [];

      categories.forEach((element) => {
        data.push({ userId: aud, categoryId: element });
      });

      const result = await models.UserCategory.bulkCreate(data);

      res.status(201).json({ status: "success", result });
    } catch (error) {
      next(error);
    }
  },

  getUserCategories: async (req, res, next) => {
    const { aud } = req.payload;

    try {
      const result = await models.UserCategory.findAll({
        where: { userId: aud },
      });

      res.status(200).json({
        status: "success",
        results: result.length,
        categories: result,
      });
    } catch (error) {
      next(error);
    }
  },

  toggleUserCategory: async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const { aud } = req.payload;
    let categoryAdded = null;
    try {
      const find = await models.UserCategory.findOne({
        where: { [Op.and]: [{ categoryId: categoryId }, { userId: aud }] },
      });

      if (find !== null) {
        await models.UserCategory.destroy({
          where: { [Op.and]: [{ categoryId: categoryId }, { userId: aud }] },
        });
      } else {
        categoryAdded = await models.UserCategory.create({
          userId: aud,
          categoryId,
        });
      }

      res.status(200).json({
        status: "success",
        message: "categoty toggeled",
        result: find ? "category removed" : categoryAdded,
      });
    } catch (error) {
      next(error);
    }
  },
};
