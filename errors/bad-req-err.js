class BadRequestErr extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    // this.message = message;
    this.name = this.constructor.name; // имя у ошибки будет то же самое
  }
}

module.exports = BadRequestErr;
