const axios = require('axios');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

async function getItemIds(url){
  return axios.get(url)
  .then(response=> {
    const html = response.data;
    let $ = cheerio.load(html);

    let $li = $('li:contains("SCP-")');
    let iID = $('$li');
    // console.log($li);
    
    let results = [];
    $li.each((i, el) => {
    let text = $(el).text().trim();
    let id = text.split(' ')[0];
    results.push(id);
});

    // fs.writeFileSync('a.txt', results.join('\n'));
    // console.log(results);

    return results;

  })
}

function downloadItem(){
// cheerio loads the html file that is read

let $ = cheerio.load(fs.readFileSync('editFile.html'), null, false);

// get the page title for filename
let itemNum = $('title').text();
itemNum = itemNum.replace(/ .*/, "");

console.log(itemNum);

// bars
$('#side-bar').remove();
$('#top-bar').remove();

//remove the width of the content
$('#content-wrap').append(`
  <style>
    #content-wrap {
      max-width: none !important;
      width: 100% !important;
    }
  </style>
`);

// wiki elements that wont work
$('.rateup').remove();
$('.ratedown').remove();
$('#search-top-box').remove();
$('#login-status').remove();
$('.cancel.btn.btn-default').remove();

// footer
$('.footer-wikiwalk-nav').remove();
$('#footer').remove();
$('#page-options-bottom').remove();

// SCP-2000 bibitem edit, hopefully doesnt break other pages. The bib entries lose line spacings for some reason, so this should add them back
$('.bibitem').append(
  `
    <style>
      .bibitem { 
        padding-bottom: 2em;
        margin-bottom: 3em;
      }
    </style>
  `
);


let reg = $.html();



let paths = path.join('html',`${itemNum}.html`);

fs.writeFileSync(`${itemNum}.html`, reg);
fs.writeFile(paths, reg, (err) => {
      if (err) {
        console.error('Error saving file:', err);
      } else {
        console.log(`HTML saved to ${itemNum}.html`);

      }
    });

}




// downloads file from wiki
let seriesItemUrl = 'https://scp-wiki.wikidot.com/scp-series-10';

async function seriesGet(){
  let itemIds = await getItemIds(seriesItemUrl);
  console.log('test' + itemIds[0]);
}
seriesGet();



const url = 'https://scp-wiki.wikidot.com/scp-2000';
axios.get(url)
  .then(response => {
    const html = response.data;

    // let paths = path.join('test',`edit.html`);
    let paths = path.join(`editFile.html`);

    fs.writeFile(paths, html, (err) => {
      if (err) {
        console.error('Error saving file:', err);
      } else {
        console.log('HTML saved to editFile.html');
        downloadItem();
      }
    });
  })
  .catch(error => {
    console.error('Error fetching HTML:', error);
  });

