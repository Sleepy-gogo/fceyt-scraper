import { writeFile } from 'fs/promises';
import { join } from 'path';
import scrapeData from './src/scraper';
import axios from 'axios';

const url = "https://fce.unse.edu.ar/?q=node/129";
const response = await axios.get(url);
const html: string = response.data;
const { title, data } = await scrapeData(html);


const fileName = `${title}.json`;
const filePath = join(__dirname, fileName);

await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Data saved to ${fileName}`);