<h3 align="center">DOI2BIB</h3>

<div align="center">

  [![Status](https://img.shields.io/badge/status-active-success.svg)]()
  [![GitHub Issues](https://img.shields.io/github/issues/aeroreyna/doi2bib.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
  [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/aeroreyna/doi2bib.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
  [![NPM Downloads](https://img.shields.io/npm/dt/doi2bib.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
  [![License](https://img.shields.io/badge/license-ISC-blue.svg)](/LICENSE)


</div>

---

<p align="center"> A node.js package to retrieve citation information of any given DOI and update it to a specified BibText (.bib) file.
    <br>
</p>

## 📝 Table of Contents
- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [TODO](#todo)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>
This package parse Markdown files or text strings searching for DOI references with the format: \@DOI:---.---/-----------.
It keeps a *.bib file (library.bib per default) updated by adding the necessary references and information obtained from [http://dx.doi.org/]().

This package is used as part of the [pandoc-doi2bib](https://github.com/aeroreyna/pandoc-doi2bib) filter and [pdf2doi](https://github.com/aeroreyna/pdf2doi) utilities.

## 🏁 Getting Started <a name = "getting_started"></a>
These instructions will get you the doi2bib package to use on your node projects.

### Installing
A step by step series of examples that tell you how to get a development env running.

For using as Node.js package use:

~~~sh
npm install --save doi2bib
~~~

And for development, clone the repository as:

~~~sh
git clone https://github.com/aeroreyna/doi2bib
cd doi2bib
npm install
~~~

## 🎈 Usage <a name="usage"></a>
This package exposes the following functions:

  - `updateFromText(text)`: Looks for DOI references and updates the .bib file.
  - `updateFromFile(file)`: Read the file and uses the function updateFromText.
  - `watchFile(file)`: Read the file and keeps and eye on it looking for new references.
  - `getCitation(DOI)`: Obtain and return the citation of the DOI document and added to the library if necessary.
  - `setLibraryFile(file)`: Change the bibliography .bib file to work on.

An example could be:

~~~js
const doi2bib = require("./index.js");

doi2bib.getCitation('10.1007/s10462-018-09676-2').then((r)=>{
  console.log(r)
});
~~~

Which keeps an eye on the specified file in case of new DOI references are given.

### Using Gulp
![](https://proxy.duckduckgo.com/ip3/gulpjs.com.ico)

It also can be used with Gulp as a task to act when .md files in a directory changes using the follow gulp file.

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

## ⛏️ Built Using <a name = "built_using"></a>
- [NodeJs](https://nodejs.org/en/)

## ✍️ Authors <a name = "authors"></a>
- [\@aeroreyna](https://github.com/aeroreyna) - Idea & Initial work

See also the list of [contributors](https://github.com/kylelobo/The-Documentation-Compendium/contributors) who participated in this project.

## To do: <a name = "todo"></a>

- [ ] remove nets dependency
- [ ] make sure all functions return a Promise
- [ ] catch errors in promises
