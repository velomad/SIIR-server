const { Op } = require("sequelize");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const models = require("../models");
const { destroy, upload } = require("../cloudinary");
const { signAccessToken } = require("../middlewares/jwt");

module.exports = {
  signup: async (req, res, next) => {
    const body = req.body;
    let image, response;

    try {
      const found = await models.User.findOne({
        where: {
          [Op.or]: [
            {
              userName: body.userName,
            },
            {
              emailId: body.emailId,
            },
          ],
        },
      });

      if (found)
        throw createError.Conflict("Email Or Username Already Exist !");

      if (req.file) {
        image = req.file.path;
        response = await upload(image);
      }

      const result = await models.User.create({
        ...body,
        profileImageUrl: image ? response.url : null,
      });

      res.status(201).json({ status: "success", result, found });
    } catch (error) {
      next(error);
      // console.log(error);
    }
  },
  login: async (req, res, next) => {
    const body = req.body;
    try {
      const result = await models.User.findOne({
        where: {
          [Op.or]: [
            { emailId: body.emailId ? body.emailId : null },
            { userName: body.userName ? body.userName : null },
          ],
        },
      });

      if (!result) {
        throw createError.Unauthorized("invalid username/password");
      }
      const comparedPass = await bcrypt.compare(body.password, result.password);

      if (!comparedPass)
        throw createError.Unauthorized("invalid username/password");

      const token = await signAccessToken(
        JSON.stringify(result.id),
        process.env.USER_ACCESS_TOKEN_SECRET
      );

      res.status(200).json({ status: "success", token });
    } catch (error) {
      next(error);
    }
  },
};
