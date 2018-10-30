const doi2bib = require("./index.js");

doi2bib.watchFile('./examples/example_paper.md');

doi2bib.getCitation('10.1145/937503.937505').then(console.log);
