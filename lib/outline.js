var _ = require('underscore');
var yaml = require('js-yaml');
var utils = require('./utils');
var jade = require('jade');
var ExtendedMarked = require('./extendedmarked');


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
  SITE: '_site'
};


/** Enum of filetypes to process and their corresponding regexes. */
Outline.FileType = {
  MARKDOWN: /\.(md|markdown)$/,
  JADE: /\.jade$/
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


/** Generates the site. */
Outline.prototype.generateSite = function() {
  this.readConfig();
  this.processDir(); 
};


/**
 * Processes the given directory. Defaults to the root.
 * @param {string=} path The directory path to process.
 */
Outline.prototype.processDir = function(path) {
  var self = this;

  // Mirror directory in output folder.
  if (path) {
    utils.mkdir(Outline.Path.SITE + path);
  } else {
    // We are at the root.
    path = './';
    // Remove all files in _site
    utils.deleteFolder(Outline.Path.SITE);
    utils.mkdir(Outline.Path.SITE);
  }

  utils.lsDir(path).forEach(function(fileObj) {
    if (utils.isDir(fileObj)) {
      self.processDir(fileObj);
    } else {
      self.processFile(fileObj);
    }
  });
};


/**
 * Process the current file, converting the page to a html if applicable.
 * @param {string} path The path of the file to process.
 */
Outline.prototype.processFile = function(path) {
  // Site content files.
  if (path.match(Outline.FileType.MARKDOWN) ||
      path.match(Outline.FileType.JADE)) {
    var fileContents = utils.fileContents(path);

    // Read yaml at the top of the file (if present).
    var fileObj = StaticSite.readFrontMatter(fileContents);
    var frontMatter = fileObj.front;
    var mainContent = fileObj.main;

    if (path.match(Outline.FileType.MARKDOWN)) {
      this.processMdFile(path, mainContent, frontMatter);
    } else if (path.match(Outline.FileType.JADE)) {
      // TODO.
    }
  }

  // TODO: process LESS files as well.

  // Default case:
  // Copy file over to the site directory.
  // TODO.
};

Outline.prototype.processMdFile = function(path, mainContent, frontMatter) {
  var extendedMarked = new ExtendedMarked(mainContent);
  var toc = extendedMarked.getTableOfContents();
  var body = extendedMarked.getDoc();
  var title = frontMatter.title || "An Outline Generated HTML page.";
  var output = this.getLayout(frontMatter.layout)(_.extend({
    title: title,
    toc: toc,
    body: body
  }, frontMatter));
  var outputFileName = path.replace(/\.md$/, '.html');
  fs.writeFileSync(outputFileName, output, 'utf8');
};

Outline.prototype.processJadeFile = function(path) {
  // TODO.
};
