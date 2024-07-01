import fetch from 'node-fetch';
import fs from 'fs';

async function triggerFetch(startingAfter) {
  const query = new URLSearchParams({
    per_page: '150',
    ...(startingAfter ? { starting_after: startingAfter } : null),
  }).toString();

  const resp = await fetch(`https://api.intercom.io/conversations?${query}`, {
    method: 'GET',
    headers: {
      'Intercom-Version': '2.11',
      Authorization: 'Bearer <api key>',
    },
  });
  const data = await resp.json();
  return data;
}
function saveFile(data, number) {
  // Data to be written to the file

  // File path
  const filePath = `output${number}.txt`;

  // Write to the file
  fs.writeFile(filePath, JSON.stringify(data), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data has been written to', filePath);
    }
  });
}
async function main(params) {
  let startingAfter = '';
  for (let i = 1; i < 10; i++) {
    const result = await triggerFetch(startingAfter);
    startingAfter = result.pages.next.starting_after;
    console.log(startingAfter, 'starting after');
    saveFile(result, i);
  }
}

main();
