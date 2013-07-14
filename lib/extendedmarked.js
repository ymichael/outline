/**
 * Extending Marked to provide hooks into headers and to generate table of
 * contents from headers.
 */
var marked = require('marked');
var _ = require('underscore');
var originalTok = marked.Parser.prototype.tok;
/** Override Parser#tok */
marked.Parser.prototype.tok = function() {
    if (this.token.type == 'heading') {
        return this.outputHeading(
            this.token.depth,
            this.inline.output(this.token.text)
        );
    }
    // Call original method for cases we don't handle.
    return originalTok.apply(this);
};

/**
 * Method to output a heading tag from the depth and the text of the heading
 * parsed from the markdown.
 */
marked.Parser.prototype.outputHeading = function(depth, heading) {
    if (!this.headings_) this.headings_ = [];
    if (!this.usedHeaders_) this.usedHeaders_ = {};
    // Remove all characters in the heading except for alphabets and numbers.
    var headingId = heading.
        replace(/[^A-Za-z0-9]/g, '').
        toLowerCase();
    // Make sure that the headerId is unique.
    if (this.usedHeaders_[headingId]) {
        this.usedHeaders_[headingId] += 1;
        headingId += this.usedHeaders_[headingId];
    }
    // Keep an index so that we can generate unique Ids.
    this.usedHeaders_[headingId] = 1;

    // Keep track of headings to generate table of contents.
    this.headings_.push({
        id: headingId,
        text: heading,
        depth: this.token.depth
    });

    // Shift actual depth by 1 so that we can give the title of the document
    // the h1 tag.
    var depth = this.token.depth + 1;
    return '<h'
        + depth
        + ' id="' + headingId + '"'
        + '>'
        + heading
        + '</h'
        + depth
        + '>\n';
};

/** Generate table of contents from headers. */
marked.Parser.prototype.outputTableOfContents = function() {
    var output = '';
    if (!this.headings_) {
        return output;
    }
    var currentDepth = 0;
    for (var i = 0; i < this.headings_.length; i++) {
        var heading = this.headings_[i];
         if (currentDepth < heading.depth) {
            while (currentDepth != heading.depth) {
                output += '<ul>';
                currentDepth++;
            }
        } else if (currentDepth > heading.depth) {
            while (currentDepth != heading.depth) {
                output += '</ul>';
                currentDepth--;
            }
        }
        output = output
            + '<li>'
            + '<a href="'
            + '#' + heading.id + '">'
            + heading.text
            + '</a>'
            + '</li>';
        var currentDepth = heading.depth;
    }
    while (currentDepth != 0) {
        output += '</ul>';
        currentDepth--;
    }
    return output;
};

/** Compose a parser object. */
var ExtendedMarked = function(src, opt) {
    this.src_ = src;
    this.opt_ = _.extend(marked.defaults, opt);
    this.parser_ = new marked.Parser(opt);
};

ExtendedMarked.prototype.getDoc = function() {
    if (this.doc_) {
        return this.doc_;
    }
    this.doc_ = this.parser_.parse(
        marked.Lexer.lex(this.src_),
        this.opt_);
    return this.doc_;
};

ExtendedMarked.prototype.getTableOfContents = function() {
    if (this.toc_) {
        return this.toc_;
    } else if (this.doc_) {
        this.doc_ = this.getDoc();
    }
    this.toc_ = this.parser_.outputTableOfContents();
    return this.toc_;
};

// Export ExtendedMarked.
module.exports  = ExtendedMarked;
