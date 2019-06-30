const nets = require('nets');
const fs = require('fs');

let library = {};
let defaultFile = './library.bib';

let readLibrary = function(file){
  let temp = {};
  if(fs.existsSync(file)){
    let content = fs.readFileSync(file, 'utf8');
    let m = content.match(/DOI:\S*[,;{]/g);
    if(!m) return {};
    m.forEach((doi)=>{
      let d = doi.substring(4, doi.length-1);
      temp[d] = 1;
    });
  }
  return temp;
}

library = readLibrary(defaultFile);

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

let addCitations = function(entries, file, verbose){
  let addString = "";
  let count = 0;
  entries.forEach((entry)=>{
    if(entry){
      addString += entry + "\n\n";
      count++;
    }
  });
  if(count){
    fs.appendFile(file, addString, (err) => {
      if (err) throw err;
      if(verbose) console.log('Library updated:', entries);
    });
  }
}

let doi2bib = {
  outFile: defaultFile,
  verbose: 0,
  updateFromText(content){
    let promises = [];
    let m = content.match(/@DOI:\S*[\];]/g);
    if(!m) return 0;
    m.forEach((doi)=>{
      let tempIndex = doi.indexOf(']') != -1 ? doi.indexOf(']') : doi.indexOf(';');
      let d = doi.substring(5, tempIndex);
      if(!library[d]){
        promises.push(getCitationFromDOI(d).then((data)=>{
          if(data) library[d] = data;
          return data;
        }));
      }
    });
    return Promise.all(promises).then((data)=>{
      return addCitations(data, this.outFile, this.verbose);
    });
  },
  updateFromFile(inFile){
    fs.readFile(inFile, 'utf8', (err, content)=> {
      if (err) console.error(err);
      this.updateFromText(content);
    });
  },
  watchFile(inFile){
    this.updateFromFile(inFile);
    fs.watchFile(inFile, (curr, prev) => {
      if(this.verbose) console.log(`${inFile} file Changed`);
      this.updateFromFile(inFile);
    });
  },
  getCitation(doi){
    return new Promise((resolve, reject)=>{
      if(library[doi]){
        resolve(library[doi]);
      } else {
        return getCitationFromDOI(doi).then( (entry)=>{
          if(entry){
            library[doi] = entry;
            addCitations([entry], this.outFile, this.verbose);
          }
          resolve(entry);
        });
      }
    });
  },
  setLibraryFile(file){
    this.outFile = file;
    library = readLibrary(file);
  }
};

module.exports = doi2bib;
