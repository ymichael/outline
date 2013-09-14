# Outline: A Markdown to HTML Static Site Generator

Inspired by [Jekyll][0] but built with the following in mind:
- [Jade][1] templates
- [Markdown][2] documents
- [node.js][3]
- Generates a table of contents from the headings in the markdown document

# Installation

    $ npm install -g outline-md

# Quick Start
Run the following command in the folder containing your `.md` files.

    $ outline

This __deletes__ all existing `.html` files in the folder and compiles the `.md` files into HTML using the default layout. 

# Document Metadata (Front Matter)
Much like `Jekyll` posts, you can attach metadata to your documents using [YAML][4]. Here is a sample document

```md
---
title: This is the title of my document.
layout: base
---
# Introduction
Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nulla vitae elit libero, a pharetra augue.

# Body
Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.

# Conclusion
```

# Layouts
Like `Jekyll`, outline searches for layouts in the `_layouts` directory. If no layout is specified, the default layout is used.

```jade
// sample layout
!!!
html
  head
  body
    #toc!= toc
    #contents!= body
```

The jade template is given the `toc` and `body` variables parsed from the markdown. All other metadata from the document front matter is passed to the layout as well.

# Credits
- Borrows heavily from [Heckle][5] source code.

# License

The MIT License (MIT)

Copyright (c) 2013 Michael Yong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


[0]: http://jekyllrb.com/
[1]: http://jade-lang.com/
[2]: http://daringfireball.net/projects/markdown/
[3]: http://nodejs.org
[4]: http://www.yaml.org/
[5]: https://github.com/marijnh/heckle
