'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Buscador SERCOP</h1>
      <Input placeholder="RUC de la entidad" value={ruc} onChange={e => setRuc(e.target.value)} />
      <Button onClick={handleSearch} disabled={loading}>{loading ? 'Buscando...' : 'Buscar'}</Button>
      {result && (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
          {result}
        </pre>
      )}
    </main>
  );
}