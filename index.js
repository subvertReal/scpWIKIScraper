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


fs.writeFile(paths, reg, (err) => {
      if (err) {
        console.error('Error saving file:', err);
      } else {
        console.log(`HTML saved to ${itemNum}.html`);

      }
    });

}




// downloads file from wiki
let seriesItemUrl = 'https://scp-wiki.wikidot.com/scp-series';

async function seriesGet() {
  let itemIds = await getItemIds(seriesItemUrl);

  if (itemIds[0] === 'SCP-001') {
    itemIds.shift();
  }

  // let it = ['SCP-002', 'SCP-003'];

  // console.log('test');

  for (let i = 0; i < itemIds.length; i++) {
  try {
    let url = `https://scp-wiki.wikidot.com/${itemIds[i]}`;
    const response = await axios.get(url);

    const html = response.data;

    let paths = path.join('editFile.html');

    await fs.promises.writeFile(paths, html);

    console.log(`HTML saved for ${itemIds[i]}`);

    downloadItem();

    // wait 2 seconds before next request
    await sleep(2000);

  } catch (error) {
    console.error('Error fetching or saving HTML:', error);
  }
}
}

seriesGet();



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


