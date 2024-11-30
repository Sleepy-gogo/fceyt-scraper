import * as cheerio from "cheerio"
import { writeFile } from 'fs/promises';
import { join } from 'path';
import axios from 'axios';

const url = "https://fce.unse.edu.ar/?q=node/89"

interface Materia {
  id: number;
  name: string;
  weeklyHours: number | null;
  totalHours: number | null;
  regulares: number[] | null;
  aprobadas: number[] | null;
}

function parseIntoNumber(str: string) { 
  return str == "-" || str == "" || isNaN(Number(str)) || str == "*" ? null : Number.parseInt(str);
}

function parseIntoArray(str: string) { 
  return str == "-" || str == "" || str == "--" || str == "(**)" ? null : str.split('-').map(Number);
}

async function scrapeData() { 
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const data : Materia[]= [];
    const materiasAgregadas = new Set();

    $('table:has(a[target="_blank"]), table tr:has(td:nth-child(5))').each((indexTabla, tabla) => {
      $(tabla).find('tr').each((indexFila, fila) => {
        const columnas = $(fila).find('td');
        const numColumnas = columnas.length;

        if (numColumnas < 5) return;

        const id = Number.parseInt($(columnas[0]).text().trim());
        if (isNaN(id)) return;
        const name = $(columnas[1]).text().trim();
        const weeklyHours = numColumnas >= 6 ? parseIntoNumber($(columnas[numColumnas - 4]).text().trim()) : null;
        const totalHours = parseIntoNumber($(columnas[numColumnas - 3]).text().trim());
        const regulares = parseIntoArray($(columnas[numColumnas - 2]).text().trim());
        const aprobadas = parseIntoArray($(columnas[numColumnas - 1]).text().trim());

        if (!materiasAgregadas.has(id)) {
          data.push({
            id,
            name,
            weeklyHours,
            totalHours,
            regulares,
            aprobadas
          });
          materiasAgregadas.add(id);
        }
      });
    });

    if (data.length === 0) {
      throw new Error('No se encontraron datos, o formato no compatible en la página.');
    }

    const titulo = $('title').text().trim().split(" | ")[0];

    const fileName = `${titulo}.json`;
    const filePath = join(__dirname, fileName);

    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data saved to ${fileName}`);
  } catch (error) {
    console.error('Error al scrapear la página:', error);
  }
}

scrapeData();