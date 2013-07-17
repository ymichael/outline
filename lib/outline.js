var _ = require('underscore');
var yaml = require('js-yaml');
var utils = require('./utils');

/**
 * Main Outline Class.
 */
var Outline = function() {
};


/** Path to config file. */
Outline.CONFIG_FILE = '_config.yml'


/** Enum of properties in config file. */
Outline.PROPERTIES = {
  DEFAULT_LAYOUT: 'default-layout',
  TITLE: 'title'
};


/** Read yaml config in root folder. */
Outline.prototype.readConfig = function() {
  this.config_ = utils.fileExists(Outline.CONFIG_FILE) ?
    yaml.load(fs.readFileSync(Outline.CONFIG_FILE, 'utf8')) || {};
};
