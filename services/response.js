class Response {
  constructor(data = null, message = null) {
    this.data = data;
    this.message = message;
  }

  success(res) {
    return res.status(200).json({
      success: true,
      data: this.data,
      message: this.message ? this.message : "İşlem başarılı",
    });
  }

  create(res) {
    return res.status(201).json({
      success: true,
      data: this.data,
      message: this.message ? this.message : "İşlem Başarılı",
    });
  }

  error400(res) {
    return res.status(400).json({
      success: false,
      message: this.message ? this.message : "İşlem Başarısız",
    });
  }

  error401(res) {
    return res.status(401).json({
      success: false,
      message: this.message ? this.message : "Yetkisiz erişim",
    });
  }
  error403(res) {
    return res.status(403).json({
      success: false,
      message: this.message ? this.message : "Yetkisiz erişim",
    });
  }

  error404(res) {
    return res.status(404).json({
      success: false,
      message: this.message ? this.message : "İşlem Başarısız",
    });
  }

  error500(res) {
    return res.status(500).json({
      success: false,
      message: this.message ? this.message : "İşlem başarısız",
    });
  }
}

module.exports = Response;
