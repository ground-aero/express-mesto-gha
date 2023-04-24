class AuthoErr extends Error {
  constructor(message = 'Authorization Error *') {
    super(message);
    this.status = 401;
  }
}

module.exports = AuthoErr;
