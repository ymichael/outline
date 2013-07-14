/**
 * Script to generate site from markdown files and templates.
 */
var fs = require('fs');
var path = require('path');
var yaml = require('yaml');
var jade = require('jade');
var _ = require('underscore');
var marked = require('./extendedmarked');


/**
 * Static site generator class.
 */
var StaticSite = function() {
  this.layouts_ = [];
  this.defaultLayout_;
};


/** Enum of directories */
StaticSite.Path = {
  LAYOUTS: '_layouts/'
};


/** Default layout */
StaticSite.DEFAULT_LAYOUT = path.resolve(__dirname, 'default.jade');


/**
 * Reads front matter at the top of files. Taken from heckle.js.
 */
StaticSite.readFrontMatter = function(contents) {
  if (/^---\n/.test(contents) &&
      contents.search(/\n---\n/) !== -1) {
    return {
      front: yaml.eval(contents.slice(4, end + 1)) || {},
      main: contents.slice(end + 5)
    };
  }
  return {
    front: {},
    main: contents
  };
 };


/**
 * Lazily read layouts as needed and cache the compiled function for reuse.
 */
StaticSite.prototype.getLayout = function(name) {
  if (!name) {
    return this.getDefaultLayout();
  }
  if (this.layouts_[name]) {
    return this.layouts_[name];
  }
  var content = fs.readFileSync(
    StaticSite.Path.LAYOUTS + name + '.jade', 'utf8');
  this.layouts_[name] = jade.compile(content);
  return this.layouts_[name];
};


/** Default Layout */
StaticSite.prototype.getDefaultLayout = function() {
  if (this.defaultLayout_) {
    return this.defaultLayout_;
  }
  var content = fs.readFileSync(StaticSite.DEFAULT_LAYOUT, 'utf8');
  this.defaultLayout_ = jade.compile(content);
  return this.defaultLayout_;
};


/**
 * Generates a single page of markdown.
 */
StaticSite.prototype.generatePage = function(fname) {
  // Only generate markdown pages.
  if (!fname.match(/\.md$/)) {
    return;
  }
  var fileContents = fs.readFileSync(fname, 'utf8');
  // Read yaml at the top of the file (if present).
  var fileObj = StaticSite.readFrontMatter(fileContents);
  var frontMatter = fileObj.front;
  var mainContent = fileObj.main;
  var toc = marked.getTableOfContents(mainContent);
  var body = marked.getDoc(mainContent);

  var title = frontMatter.title || "An Outline Generated HTML page.";

  var output = this.getLayout(frontMatter.layout)(_.extend({
    title: title,
    toc: toc,
    body: body
  }, frontMatter));
  var outputFileName = fname.replace(/\.md$/, '.html');
  fs.writeFileSync(outputFileName, output, 'utf8');
};


/**
 * Delete all html pages.
 */
StaticSite.prototype.clean = function() {
  // Remove all html pages.
  fs.readdirSync('./').forEach(function(fname) {
    if (fname.match(/\.html$/)) {
      fs.unlink(fname);
    }
  });
};

/**
 * Generates the static site.
 */
StaticSite.prototype.generateSite = function() {
  this.clean();
  fs.readdirSync('./').forEach(function(fname) {
    this.generatePage(fname);
  }, this);
};

module.exports = StaticSite;

