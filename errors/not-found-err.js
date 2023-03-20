const DefaultErr = require('./default-err');

class NotFoundErr extends DefaultErr {
  constructor() {
    super(404, 'Not found..');
  }
}

module.exports = NotFoundErr;
