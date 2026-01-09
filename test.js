const axios = require('axios');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

function a(){
// cheerio loads the html file that is read
let $ = cheerio.load(fs.readFileSync('./test/edit.html'), null, false);

const $div = $('[id="page-content"]');
// console.log($div.text());

// rating
let reg = $div.text().replace(/[\s\S]*?rating:\s*\+\d+\+[–-]x\s*/, '');

// bottom selectors
reg = reg.replace(/«\s*SCP-[0-9]+\s*\|\s*SCP-[0-9]+\s*\|\s*SCP-[0-9]+\s*»[\s\S]*$/g, '\n');
// A close up of SCP-***
reg = reg.replace(/^A\s+close\s+up\s+of\s*SCP-[0-9]+\s*$/gim, '\n');
// new lines
reg = reg.replace(/(\r?\n\s*){2,}/,'\n');

fs.writeFileSync('test.txt', reg);

console.log(reg);
}

// downloads file from wiki
const url = 'https://scp-wiki.wikidot.com/scp-3211';
axios.get(url)
  .then(response => {
    const html = response.data;

    let paths = path.join('test',`edit.html`);

    fs.writeFile(paths, html, (err) => {
      if (err) {
        console.error('Error saving file:', err);
      } else {
        console.log('HTML saved to page.html');
        a();
      }
    });
  })
  .catch(error => {
    console.error('Error fetching HTML:', error);
  });

// console.log of entire file
// console.log($.html());