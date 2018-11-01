# DOI2Bib(Tex)

This package parse Markdown files or text searching for DOI references on it with the format: $$[@DOI:---.---/-----------]$$.
And keeps updated a library.bib file with all the references and information obtained from internet.

It can be used as a Gulp task to be applied when .md files changes.

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
