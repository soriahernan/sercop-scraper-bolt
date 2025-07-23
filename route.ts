import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
  const { ruc } = await req.json();

  if (!ruc) {
    return NextResponse.json({ error: 'RUC requerido' }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto('https://www.compraspublicas.gob.ec/ProcesoContratacion/compras/PC/buscarProceso.cpe');
    await page.type('#entidad_ruc', ruc);
    await Promise.all([
      page.click('#btnBuscar'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      return rows.slice(1).map(row => {
        const cols = row.querySelectorAll('td');
        return {
          codigo: cols[0]?.textContent?.trim(),
          objeto: cols[1]?.textContent?.trim(),
          estado: cols[4]?.textContent?.trim(),
        };
      });
    });

    await browser.close();
    return NextResponse.json({ procesos: data });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Error durante scraping' }, { status: 500 });
  }
}