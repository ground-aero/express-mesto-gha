const DefaultErr = require('./default-err');

class IncorrectDataErr extends DefaultErr {
  constructor(message = 'Bad Request') {
    super(message);
    this.status = 400;
    this.name = this.constructor.name; // имя у ошибки будет то же самое
  }
}

module.exports = IncorrectDataErr;
