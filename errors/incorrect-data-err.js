const DefaultErr = require('./default-err');

class IncorrectDataErr extends DefaultErr {
  constructor() {
    super(400, 'Incorrect Data Error.');
  }
}

module.exports = IncorrectDataErr;
