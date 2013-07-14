/**
 * Script to generate site from markdown files and templates.
 */
 var fs = require('fs');
 var yaml = require('yaml');
 var jade = require('jade');
 var marked = require('./lib/extendedmarked');

 var StaticSite = function() {
  this.layouts_ = [];
 };

 /** Enum of directories */
 StaticSite.Path = {
  SITE: '_site/',
  LAYOUTS: '_layouts/',
  INCLUDES: '_includes/'
 };

/**
 * Reads front matter at the top of files. Taken from heckle.js.
 */
 StaticSite.readFrontMatter = function(contents) {
  if (/^---\n/.test(contents)) {
    var end = contents.search(/\n---\n/);
    if (end != -1) {
      return {
        front: yaml.eval(contents.slice(4, end + 1)) || {},
        main: contents.slice(end + 5)
      };
    }
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
  if (this.layouts_[name]) {
    return this.layouts_[name];
  }
  var content = fs.readFileSync(
    StaticSite.Path.LAYOUTS + name + '.jade', 'utf8');
  this.layouts_[name] = jade.compile(content);
  return this.layouts_[name];
 };

/**
 * Generates a single page of markdown.
 */
 StaticSite.prototype.generatePage = function(fname) {
    // Only generate markdown pages.
    if (!fname.match(/\.md/)) return;
    var fileContents = fs.readFileSync(fname, 'utf8');
    // Read yaml at the top of the file (if present).
    var fileObj = StaticSite.readFrontMatter(fileContents);
    var frontMatter = fileObj.front;
    var mainContent = fileObj.main;
    var toc = marked.getTableOfContents(mainContent);
    var body = marked.getDoc(mainContent);

    var output = !frontMatter.layout ? toc + body :
    this.getLayout(frontMatter.layout)({
      toc: toc,
      body: body
    });
    var outputFileName = fname.replace(/\.md$/, '.html');
    fs.writeFileSync(
      StaticSite.Path.SITE + outputFileName,
      output, 'utf8');
  };

// tmp.
var staticSite = new StaticSite();
process.argv.forEach(function(fname) {
  staticSite.generatePage(fname);
});

