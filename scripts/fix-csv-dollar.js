const fs = require('fs');
const parse = require('csv-parse/sync').parse;
const stringify = require('csv-stringify/sync').stringify;

const path = 'c:/Users/moham/Downloads/arc-p.csv';
const outPath = 'c:/Users/moham/Downloads/arc-p-products-dollar.csv';

const data = fs.readFileSync(path, 'utf-8');
const records = parse(data, { columns: true, skip_empty_lines: true });

const outRecords = records.map(row => {
  let price = row.price;
  if (!price.startsWith('$')) price = '$' + price;
  return {
    name: row.name,
    price,
    image: row.image
  };
});

const outCsv = stringify(outRecords, { header: true, columns: ['name', 'price', 'image'] });
fs.writeFileSync(outPath, outCsv, 'utf-8');
console.log('Done!');
