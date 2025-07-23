// src/app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [ruc, setRuc] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruc }),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error al obtener datos');
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: 600, margin: 'auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Buscador SERCOP</h1>
      <input
        type="text"
        placeholder="RUC de la entidad"
        value={ruc}
        onChange={e => setRuc(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', marginTop: '1rem' }}
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      {result && (
        <pre
          style={{
            background: '#f1f1f1',
            padding: '1rem',
            marginTop: '1rem',
            borderRadius: '8px',
            maxHeight: '400px',
            overflow: 'auto',
            fontSize: '0.9rem',
          }}
        >
          {result}
        </pre>
      )}
    </main>
  );
}

// src/app/api/scrape/route.ts
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
