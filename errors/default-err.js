/** базовая ApplicationError */
class DefaultErr extends Error {
  constructor(message) {
    super(message); // выз конструктор
    this.status = 500;
  }
}

/** вар.2 */
// class DefaultErr extends Error {
//   constructor(status = 500, message = 'Ошибка по умолчанию') {
//     super(); // вызываем конструктор
//     this.status = status;
//     this.message = message;
//     this.name = this.constructor.name; // имя у ошибки будет то же самое
//
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

module.exports = DefaultErr;
