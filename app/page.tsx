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
      const res = await fetch('https://sercop-api-final.up.railway.app/scrape', {
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
// Eliminado porque ahora usamos API externa
