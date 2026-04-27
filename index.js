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

function downloadItem(itemNumber){
// cheerio loads the html file that is read

// let $ = cheerio.load(fs.readFileSync('editFile.html'), null, false);
let $ = cheerio.load(fs.readFileSync(`editingFiles/${itemNumber}.html`), null, false);

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

// replace the hrefs
$('a[href*="/scp-"]').each((i, el) => {
  const oldHref = $(el).attr('href');

  const match = oldHref.match(/\/scp-(\d+)/);
  if (!match) return;

  const itemNum = match[1];

  const newHref = `https://raw.githubusercontent.com/subvertReal/scpWikiAPI/refs/heads/main/SCP-${itemNum}.html`;

  $(el).attr('href', newHref);
});
// console.log(itemNum);




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
let seriesItemUrl = 'https://scp-wiki.wikidot.com/scp-series-';

let seriesItemArray = [];
let check = true;

async function countSeriesTotal(i) {
  try {
    await axios.get(seriesItemUrl + i);
    seriesItemArray.push(i);
    return true;
  } catch (err) {
    if (err.response) {
      console.log('we have err ' + err.response.status);
    }
    return false;
  }
}
async function doCount() {
  let i = 1;
  let check = true;



  while (check) {
    // console.log(seriesItemUrl + i);

    check = await countSeriesTotal(i);
    i++;
  }

  
}

(async () => {
  await doCount();
  // console.log('Final array:', seriesItemArray);
  // console.log('Final array:', seriesItemArray.length);
  let i = 0;

  while ( i < seriesItemArray.length){
    seriesGet(seriesItemArray[i]);
    i++
  }
})();


async function seriesGet(i) {
  let itemIds = await getItemIds(seriesItemUrl+i);

  if (itemIds[0] === 'SCP-001') {
    itemIds.shift();
  }

  if (itemIds.includes('STAFF')) {
  itemIds = itemIds.filter(id => id !== 'STAFF');
  
}

  // let it = ['SCP-002', 'SCP-003'];

  // console.log('test');

  for (let i = 0; i < itemIds.length; i++) {
  try {
    console.log(itemIds[i]);
    let url = `https://scp-wiki.wikidot.com/${itemIds[i]}`;
    const response = await axios.get(url);

    const html = response.data;

    // let paths = path.join(`editFile.html`);
    let paths = path.join('editingFiles',`${itemIds[i]}.html`);

    await fs.promises.writeFile(paths, html);

    console.log(`HTML saved for ${itemIds[i]}`);

    downloadItem(itemIds[i]);

    // wait 1 second before next request, to help prevent race condition
    await sleep(1000); // 1000 ms seems safe, going lower seems to show a race condition

  } catch (error) {
    console.error('Error fetching or saving HTML:', error);
  }
}
}






function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


