var fs = require('fs');

/** Outline utility functions */
var util = {};


/** Whether path exists. */
util.fileExists = function(path) {
  try {
    fs.lstatSync(path);
    return true;
  } catch (e) {
    return false;
  }
};
