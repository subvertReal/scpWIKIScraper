const axios = require('axios');
const path = require('path');
const fs = require('fs');
 
// const url = 'https://scp-wiki.wikidot.com/scp-series';
// axios.get(url)
//   .then(response => {
//     const html = response.data;
//     fs.writeFile('download.html', html, (err) => {
//       if (err) {
//         console.error('Error saving file:', err);
//       } else {
//         console.log('HTML saved to page.html');
//       }
//     });
//   })
//   .catch(error => {
//     console.error('Error fetching HTML:', error);
//   });

// ! for all items 002 to 999 that are in html format
function createPath (pathNew){
    try {
      if (!fs.existsSync(pathNew)) {
        fs.mkdirSync(pathNew);
      }
    } catch (err) {
      console.error(err);
    }
}

// Creates all needed paths
let pathsCreating = ['html','html/item'];
Object.keys(pathsCreating).forEach(pathKey => {
  createPath(pathsCreating[pathKey]);
  console.log(pathsCreating[pathKey]);
});



let scpItemUrls = ['https://raw.githubusercontent.com/scp-data/scp-api/refs/heads/main/docs/data/scp/items/content_series-1.json'];

// function getSCPItems(itemURL){
//   let url = scpItemUrls[0];

//   axios.get(url)
//   .then(response => {
//     let data = response.data;

//     Object.keys(data).forEach(key => {
//     newJson = {
      
//     }
//     let numSCP = key;
//     newJson.itemNumber = numSCP;
//     newJson.description = data[key].raw_content;
    
//     let jsonData = JSON.stringify(newJson, null, 2);
    
//     let paths
//     paths = path.join('html/item',`${numSCP}.json`);
//     // console.log(paths);
//     fs.writeFile(paths, jsonData, 'utf8', (err) => {
//         if (err) {
//             console.error('Error writing to file', err);
//         } else {
//             console.log('Data written to file');
//         }
//     });
      
//   });
//   })
//   .catch(error => {
//     console.error('Error fetching HTML:', error);
//   });

// }

function getSCPItems(itemURL){
  let url = scpItemUrls[0];

  axios.get(url)
  .then(response => {
    let data = response.data;

    Object.keys(data).forEach(key => {
    newJson = {
      
    }
    let numSCP = key;
    newJson.itemNumber = numSCP;
    newJson.description = data[key].raw_content;
    
    let jsonData = JSON.stringify(newJson, null, 2);
    
    let paths
    paths = path.join('html/item',`${numSCP}.json`);
    // console.log(paths);
    fs.writeFile(paths, jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Data written to file');
        }
    });
      
  });
  })
  .catch(error => {
    console.error('Error fetching HTML:', error);
  });

}

let i = -1;
while(i<(Object.keys(scpItemUrls)+1)){
  console.log(i);
  getSCPItems(scpItemUrls[i+1])
  i++
}