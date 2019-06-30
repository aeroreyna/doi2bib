# doi2bib

This package parse Markdown files or text strings searching for DOI references with the format: @DOI:---.---/-----------.
It keeps the library.bib (or other *.bib) file updated adding the necessary references and information obtained from [http://dx.doi.org/]().

This package exposes the following functions:

  - updateFromText(text): Looks for DOI references and updates the .bib file.
  - updateFromFile(file): Read the file and uses the function updateFromText.
  - watchFile(file): Read the file and keeps and eye on it looking for new references.
  - getCitation(DOI): Checks if the specified DOI reference is the library, otherwise is added.

It also can be used as a Gulp task to act when .md files in a directory changes.

```js
const { src, dest, watch, task } = require('gulp');
const through = require('through2');
const doi2bib = require('doi2bib');


let updateBib = function() {
  return src(['**/*.md','!./node_modules/**/*.md'])
    .pipe(through.obj(function (chunk, enc, cb) {
      console.log('File:', chunk.path);
      doi2bib.updateFromText(chunk.contents.toString());
      cb(null, chunk);
    }));
}

task('default', updateBib);

let watcher = watch(['**/*.md','!./node_modules/**/*.md']);

watcher.on('change', function(path, stats) {
  console.log(`File ${path} was changed`);
  doi2bib.updateBibFromFile(path);
});

watcher.on('add', function(path, stats) {
  console.log(`File ${path} was added`);
  doi2bib.updateBibFromFile(path);
});
```

To do:

- [ ] remove nets dependency
- [ ] make sure all functions return a Promise
- [ ] catch errors in promises
