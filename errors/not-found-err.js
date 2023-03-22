class NotFoundErr extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.status = 404;
  }
}

module.exports = NotFoundErr;
