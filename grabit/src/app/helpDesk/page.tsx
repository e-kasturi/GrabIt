'use client'

import { useState } from 'react';
import Cookies from 'js-cookie'; // Menggunakan js-cookie untuk mengakses cookies

export default function GeminiPage() {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedText, setGeneratedText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous results
    setGeneratedText('');
    setError('');
    setLoading(true);

    // Ambil token akses dari cookies
    const accessToken = Cookies.get('accessToken'); 
    console.log('Token:', accessToken);

    if (!accessToken) {
      setError('Token tidak ditemukan, pastikan Anda sudah login');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Kirim token dalam header
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedText(data.text);
      } else {
        setError(data.error || 'Terjadi kesalahan saat menghubungi Gemini API');
      }
    } catch (err) {
      setError('Tidak dapat menghubungi API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto pt-24">
      <h1 className="text-3xl font-semibold text-center mb-6">Generate Text with Gemini API</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-xl font-medium">Prompt</label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan prompt untuk di-generate"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Memproses...' : 'Generate'}
        </button>
      </form>

      {generatedText && (
        <div className="mt-6 p-4 border-2 border-gray-300 bg-gray-100 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold">Hasil Generate:</h3>
          <p className="mt-2">{generatedText}</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-200 text-red-800 rounded-lg shadow-sm">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
