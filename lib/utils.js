var fs = require('fs');
var _ = require('underscore');

/** Outline utility functions */
var utils = {};


/** Whether path exists. */
utils.fileExists = function(path) {
  try {
    fs.lstatSync(path);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Reads and returns contents of the file if it exists.
 * Returns null otherwise.
 */
utils.fileContents = function(path) {
  return utils.fileExists(path) ? fs.readFileSync(path, 'utf8') : null;
};

/**
 * Reads and returns contents of the directiory as an array if it exists.
 * Returns null otherwise.
 */
utils.lsDir = function(dir) {
  return utils.fileExists(dir) ? fs.readDirSync(dir) : null;
};

/** Delete file. */
utils.deleteFile = function(filename) {
	fs.unlink(filename);
};

/** Delete folder. */
utils.deleteFolder = function(folder) {
	fs.rmdir(folder);
};

/** Create folder */
utils.mkdir = function(name) {
	fs.mkdir(name);
};