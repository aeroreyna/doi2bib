const nets = require('nets');
const fs = require('fs');

let doi2bib = {};
let outFile = './library.bib';

let libraryJSON = './library.json';
let library = {};
if(fs.existsSync(libraryJSON)){
  library = JSON.parse(fs.readFileSync(libraryJSON));
}
//console.log(library)

let getCitationFromDOI = function(doi){
  return new Promise((resolve, reject)=>{

    var options = {
      url: 'http://dx.doi.org/' + doi,
      encoding: undefined,
      headers: {
        'Accept': 'application/x-bibtex'
      }
    };
    nets(options, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        let data = body.replace(/([A-Z])\w+/, "DOI:" + doi);
        resolve(data);
      }else{
        console.error(doi + " not found");
        resolve(null);
        //throw error;
      }
    });

  });
};

let addCitations = function(entries){
  let addString = "";
  let count = 0;

  entries.forEach((entry)=>{
    if(entry){
      addString += entry + "\n\n";
      count++;
    }
  });

  if(count){
    fs.appendFile(outFile, addString, (err) => {
      if (err) throw err;
      console.log('Library updated');
    });
    fs.writeFile(libraryJSON, JSON.stringify(library), (err) => {
      if (err) throw err;
      console.log('Library JSON updated');
    });
  }
}

doi2bib.updateBibFromFile = function(inFile){
  let promises = [];

  fs.readFile(inFile, 'utf8', function(err, contents) {
    if (err) console.error(err);

    let m = contents.match(/\[@DOI:\S+/g);
    if(!m) return 0;
    m.forEach((doi)=>{
      //console.log(doi.substring(6, doi.length-1));
      let d = doi.substring(6, doi.indexOf(']'));
      //console.log(d, doi);
      if(!library[d]){
        library[d] = "";
        promises.push(
          getCitationFromDOI(d).then((data)=>{
            if(data){
              library[d] = data;
              return data;
            } else {
              return data;
            }
          })
        );
      }
    });
    return Promise.all(promises).then((data)=>{
      return addCitations(data);
    });
  });
}

doi2bib.watchFile = function(inFile){
  fs.watchFile(inFile, (curr, prev) => {
    console.log(`${inFile} file Changed`);
    this.updateBibFromFile(inFile);
  });
}

doi2bib.getCitation = function(doi){
  return new Promise((resolve, reject)=>{
    if(library[doi]){
      resolve(library[doi]);
    } else {
      return getCitationFromDOI(doi).then( (entry)=>{
        if(entry){
          library[doi] = entry;
          addCitations([entry]);
        }
        resolve(entry);
      });
    }
  });
}

module.exports = doi2bib;