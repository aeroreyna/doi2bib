const doi2bib = require("./index.js");
doi2bib.verbose = 1;

//doi2bib.updateFromFile('./examples/example_paper.md');

doi2bib.watchFile('./examples/example_paper.md');

doi2bib.getCitation('10.1145/937503.937505').then((r)=>{
  if(r==1){
    console.log("In the library")
  }
});
