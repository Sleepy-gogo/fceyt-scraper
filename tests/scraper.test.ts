import { describe, expect, it } from 'vitest';
import scrapeData from '../src/scraper.ts';

describe('Scraper', () => {
  it('debe extraer datos correctamente de una tabla HTML válida', async () => {
    const html = `
    <table>
      <tr>
        <td>1</td>
        <td>Materia 1</td>
        <td>4</td>
        <td>60</td>
        <td>1-2</td>
        <td>3-4</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Materia 2</td>
        <td>-</td>
        <td>70</td>
        <td>-</td>
        <td>5-6</td>
      </tr>
    </table>
    <title>Ingeniería en Computación | FCE UNSE</title>
    `;

    const { title, data } = await scrapeData(html);

    expect(title).toBe('Ingeniería en Computación');
    expect(data).toEqual([
      {
        id: 1,
        name: 'Materia 1',
        weeklyHours: 4,
        totalHours: 60,
        regulares: [1, 2],
        aprobadas: [3, 4],
      },
      {
        id: 2,
        name: 'Materia 2',
        weeklyHours: null,
        totalHours: 70,
        regulares: null,
        aprobadas: [5, 6],
      },
    ]);
  });

  it('debe extraer datos correctamente de una tabla HTML con columnas adicionales o faltantes', async () => {
    const html = `
    <table>
      <tr>
        <td>1</td>
        <td>Materia 1</td>
        <td>60</td>
        <td>1-2</td>
        <td>3-4</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Materia 2</td>
        <td>4</td>
        <td>-</td>
        <td>70</td>
        <td>-</td>
        <td>5-6</td>
      </tr>
    </table>
    <title>Ingeniería en Computación | FCE UNSE</title>
    `;

    const { title, data } = await scrapeData(html);

    expect(title).toBe('Ingeniería en Computación');
    expect(data).toEqual([
      {
        id: 1,
        name: 'Materia 1',
        weeklyHours: null,
        totalHours: 60,
        regulares: [1, 2],
        aprobadas: [3, 4],
      },
      {
        id: 2,
        name: 'Materia 2',
        weeklyHours: null,
        totalHours: 70,
        regulares: null,
        aprobadas: [5, 6],
      },
    ]);
  });

  it('debe manejar correctamente tablas HTML con formato inválido', async () => {
    const html = `
    <table>
      <tr>
        <td>Nombre</td>
        <td>Descripción</td>
      </tr>
    </table>
    <title>Ingeniería en Computación | FCE UNSE</title>
    `;

    try {
      await scrapeData(html);
    } catch (error) {
      expect(error).toEqual(new Error('No se encontraron datos, o formato no compatible en la página.'));
    }
  });
});
