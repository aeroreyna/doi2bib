const doi2bib = require("./index.js");
doi2bib.verbose = 0;

//doi2bib.updateFromFile('./examples/example_paper.md');

doi2bib.watchFile('./examples/example_paper.md');

doi2bib.getCitation('10.1007/s10462-018-09676-2').then((r)=>{
  if(r){
    console.log(r)
  }
}).catch(console.error);
