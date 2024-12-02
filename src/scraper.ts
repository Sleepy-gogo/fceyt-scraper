import * as cheerio from "cheerio";
import { parseIntoArray, parseIntoNumber } from './utils';


export interface Materia {
  id: number;
  name: string;
  weeklyHours: number | null;
  totalHours: number | null;
  regulares: number[] | null;
  aprobadas: number[] | null;
}

export default async function scrapeData(html: string) {
  const $ = cheerio.load(html);

  const data: Materia[] = [];
  const materiasAgregadas = new Set();

  $('table:has(a[target="_blank"]), table:has(tr:has(td:nth-child(5)))').each((indexTabla, tabla) => {
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

  const title = $('title').text().trim().split(" | ")[0];

  return { title, data };
}