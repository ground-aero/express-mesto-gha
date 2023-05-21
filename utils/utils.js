// const regex = /^https?:\/\/(w{3}\.)?([-a-zA-Z0-9._~:/?#[\]@!$&'()*+-,;=]*)$[#]/gi;
const regex = /^https?:\/\/(w{3}\.)?([-a-zA-Z0-9._~:/?#[\]@!$&'()*+-,;=]*)(#)?$/gi;

const isURL = (link) => regex.test(link);

module.exports = { regex, isURL };
