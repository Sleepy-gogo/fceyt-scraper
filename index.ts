import { writeFile } from 'fs/promises';
import { join } from 'path';
import scrapeData from './src/scraper';

const url = "https://fce.unse.edu.ar/?q=node/89";

const { title, data } = await scrapeData(url);


const fileName = `${title}.json`;
const filePath = join(__dirname, fileName);

await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Data saved to ${fileName}`);