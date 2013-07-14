# Outline: A Static Site Generator

Inspired by Jekyll but built with the following in mind:
- Uses jade for layouts
- Uses markdown for documents/posts/files etc
- Generates a table of contents from the headings in the markdown files

A work in progress.

# What works now:

    $ node index.js yourfile.md

This builds yourfile.md into a html file using the layout specified in the front matter of the md file (similar to jekyll). Writes html file to `_site` folder.

Provides `toc` and `body` variables within the jade template.

# Deps
- node.js
- node modules
    - jade
    - marked
    - yaml

# Credits
- Borrows heavily from Heckle source code. Esp the file parsing part (which I was lazy to implement.).

