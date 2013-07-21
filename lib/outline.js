var _ = require('underscore');
var yaml = require('js-yaml');
var utils = require('./utils');

/**
 * Main Outline Class.
 */
var Outline = function() {
  // Project wide config.
  this.config_ = {};

  // Layouts
  this.layouts_ = {};

  // TODO: Allow user to specify custom jade options.
  this.jadeOptions = Outline.JADE_OPTIONS;
};

/** Enum of properties in config file. */
Outline.Property = {
  DEFAULT_LAYOUT: 'default-layout',
  TITLE: 'title'
};

/** Enum of paths that are special for outline. */
Outline.Path = {
  CONFIG: '_config.yml',
  LAYOUTS: '_layouts',
  DOCS: '_docs'
};

/** Jade default options */
Outline.JADE_DEFAULTS = {
  pretty: true
};

/** Static method to convert layout name to path. */
Outline.layoutPath = function(name) {
  return Outline.Path.LAYOUTS + name + '.jade';
};

/** Read yaml config in root folder. */
Outline.prototype.readConfig = function() {
  var contents = utils.fileContents(Outline.Path.CONFIG);
  this.config_ = contents ? yaml.load(contents) : {};
};

/** Lazily read layouts as needed and cache the compiled function for reuse. */
Outline.prototype.getLayout = function(name) {
  if (this.layouts_[name]) {
    return this.layouts_[name];
  }
  var content = utils.fileContents(Outline.layoutPath(name));
  this.layouts_[name] = jade.compile(content, this.JADE_OPTIONS);
  return this.layouts_[name];
};

/** Reads front matter at the top of files. Taken from heckle.js. */
Outline.prototype.readFrontMatter = function(contents) {
  var end = contents.search(/\n---\n/);
  if (/^---\n/.test(contents) && end !== -1) {
    return {
      front: yaml.load(contents.slice(4, end + 1)) || {},
      main: contents.slice(end + 5)
    };
  }
  return {
    front: {},
    main: contents
  };
};

/** Generates page. */
Outline.prototype.generatePage = function(name) {
  // TODO.
};

/** Generates the site. */
Outline.prototype.generateSite = function() {
  this.readConfig();
  // Remove all files in _sites.
  // Copy over all files in non-white listed file/folders.
  // Read in markdown documents
  // Generate pages
};
