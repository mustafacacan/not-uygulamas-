const { User, Notes } = require("../models");
const Response = require("../services/response");
const {
  registerSchema,
  loginSchema,
} = require("../middleware/validation/userValidate");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return new Response(false, error.details[0].message).error400(res);
    }

    const existingUser = await User.findOne({ where: { email: value.email } });

    if (existingUser) {
      return new Response(false, "bu e-posta adresi kayıtlı durumda").error400(
        res
      );
    }

    const newUser = await User.create(value);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    newUser.token = token;

    return new Response({ newUser, token }, "Kayıt başarılı").create(res);
  } catch (error) {
    return new Response(false, "Sunucu hatası").error500(res);
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return new Response(false, error.details[0].message).error400(res);
    }

    const user = await User.findOne({ where: { email: value.email } });

    if (!user) {
      return new Response(false, "Geçersiz e-posta adresi veya şifre").error400(
        res
      );
    }

    const isValidPassword = await user.isValidPassword(value.password);

    if (!isValidPassword) {
      return new Response(false, "Geçersiz e-posta adresi veya şifre").error400(
        res
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    user.token = token;

    return new Response({ user, token }, "Giriş başarılı").success(res);
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası: ${error.message}`).error500(res);
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [{ model: Notes, as: "notes" }],
    });

    if (!user) {
      return new Response(false, "kullanıcı bulunamadı").error404(res);
    }

    return new Response(user, "Kullanıcı bilgileri getirildi").success(res);
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası : ${error.message}`).error500(
      res
    );
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Notes, as: "notes" }],
    });

    if (!users) {
      return new Response(false, "Kullanıcı bulunamadı").error404(res);
    }

    return new Response(users, "Kullanıcılar listelendi").success(res);
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası : ${error.message}`).error500(
      res
    );
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return new Response(false, "Kullanıcı bulunamadı").error404(res);
    }

    const updatedUser = await user.update(req.body);

    return new Response(updatedUser, "Kullanıcı bilgileri güncellendi").success(
      res
    );
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası : ${error.message}`).error500(
      res
    );
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return new Response(false, "Kullanıcı bulunamadı").error404(res);
    }

    await user.destroy();

    return new Response("Kullanıcı başarıyla silindi").success(res);
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası : ${error.message}`).error500(
      res
    );
  }
};

exports.deleteUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return new Response(false, "Kullanıcı bulunamadı").error404(res);
    }

    if (user.role === "admin") {
      return new Response(false, "Admin kullanıcı silinemez").error403(res);
    }

    const notes = await Notes.findAll({ where: { userId: id } });

    await user.destroy();

    if (notes) {
      await Notes.destroy({ where: { userId: id } });
    }

    return new Response("Kullanıcı başarıyla silindi").success(res);
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası : ${error.message}`).error500(
      res
    );
  }
};
