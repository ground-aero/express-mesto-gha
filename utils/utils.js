const REGEX = /^https?:\/\/(w{3}\.)?([-a-zA-Z0-9._~:/?#[\]@!$&'()*+-,;=]*)(#)?$/;

const isURL = (link) => REGEX.test(link);

module.exports = {
  REGEX,
  isURL,
};
