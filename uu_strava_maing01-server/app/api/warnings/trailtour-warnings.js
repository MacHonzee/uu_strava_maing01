"use strict";
const Errors = require("../errors/trailtour-error");

const WARNINGS = {
  trailtourAlreadyUpdated: {
    code: `${Errors.Update.UC_CODE}alreadyUpToDate`,
    message: "Trailtour is already up to date with official results.",
  },
};

module.exports = WARNINGS;
