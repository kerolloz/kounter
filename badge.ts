const { makeBadge } = require("badge-maker");

const getCountBadge = (options) => makeBadge(options);

module.exports = {
  getCountBadge,
};
