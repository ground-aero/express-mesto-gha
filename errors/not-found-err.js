class NotFoundErr extends Error {
  constructor(message = 'Resource Not found') {
    super(message);
    this.status = 404;
  }
}

module.exports = NotFoundErr;
