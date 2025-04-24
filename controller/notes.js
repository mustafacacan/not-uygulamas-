const { User, Notes } = require("../models");
const noteSchema = require("../middleware/validation/notesValidate");
const Response = require("../services/response");

exports.createNote = async (req, res) => {
  try {
    const { error, value } = noteSchema.validate(req.body);
    if (error) {
      return new Response(false, error.details[0].message).error400(res);
    }

    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return new Response(false, "Kullanıcı bulunamadı").error404(res);
    }

    const newNote = await Notes.create({
      userId,
      title: value.title,
      content: value.content,
    });
    console.log(newNote);

    return new Response(newNote, "Not oluşturuldu").create(res);
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası : ${error.message}`).error500(
      res
    );
  }
};

exports.getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (user.role !== "admin") {
      return new Response(false, "Yetkisiz erişim").error403(res);
    }

    const notes = await Notes.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "role"],
        },
      ],
    });

    return new Response(notes, "Notlar listelendi").success(res);
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası : ${error.message}`).error500(
      res
    );
  }
};

exports.getUserNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const notes = await Notes.findAll({
      where: { userId },
    });

    if (!notes) {
      return new Response(false, "Not bulunamadı").error404(res);
    }

    return new Response(notes, "Notlar Listelendi").success(res);
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası : ${error.message}`).error500(
      res
    );
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    const note = await Notes.findOne({
      where: { id: noteId, userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    if (!note) {
      return new Response(false, "Not bulunamadı").error404(res);
    }

    return new Response(note, "Not bulundu").success(res);
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası : ${error.message}`).error500(
      res
    );
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Notes.findOne({
      where: { id, userId },
    });

    if (!note) {
      return new Response(false, "Not bulunamadı").error404(res);
    }

    const updatedNote = await note.update(req.body);

    return new Response(updatedNote, "Not güncellendi").success(res);
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası : ${error.message}`).error500(
      res
    );
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const note = await Notes.findOne({
      where: { id, userId },
    });

    if (!note) {
      return new Response(false, "Not bulunamadı").error404(res);
    }

    await note.destroy();

    return new Response(null, "Not silindi").success(res);
  } catch (error) {
    console.log(error);
    return new Response(false, `Sunucu hatası : ${error.message}`).error500(
      res
    );
  }
};
