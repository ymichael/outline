/**
 * Extending Marked to provide hooks into headers and to generate table of
 * contents from headers.
 */
var extendedMarked = require('marked');
var originalTok = extendedMarked.Parser.prototype.tok;
/** Override Parser#tok */
extendedMarked.Parser.prototype.tok = function() {
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
extendedMarked.Parser.prototype.outputHeading = function(depth, heading) {
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
    return '<h'
        + this.token.depth
        + ' id="' + headingId + '"'
        + '>'
        + heading
        + '</h'
        + this.token.depth
        + '>\n';
};

/** Generate table of contents from headers. */
extendedMarked.Parser.prototype.outputTableOfContents = function() {
    var output = '';
    if (!this.headings_) return output;
    var currentDepth = 0;
    for (var i = 0; i < this.headings_.length; i++) {
        var heading = this.headings_[i];
         if (currentDepth < heading.depth) {
            output += '<ul>';
        } else if (currentDepth > heading.depth) {
            output += '</ul>';
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

// Export extendedMarked.
module.exports  =  {
    'getDoc': function(src, opt) {
        if (opt) opt = merge({}, marked.defaults, opt);
        var parser = new extendedMarked.Parser(opt);
        return parser.parse(extendedMarked.Lexer.lex(src, opt));
    },
    'getTableOfContents': function(src, opt) {
        if (opt) opt = merge({}, marked.defaults, opt);
        var parser = new extendedMarked.Parser(opt);
        parser.parse(extendedMarked.Lexer.lex(src, opt));
        return parser.outputTableOfContents();
    }
};
