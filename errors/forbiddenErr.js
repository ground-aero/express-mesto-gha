class ForbiddenErr extends Error {
  constructor(message = 'Access is Forbidden') {
    super(message);
    this.status = 403;
  }
}

module.exports = ForbiddenErr;
