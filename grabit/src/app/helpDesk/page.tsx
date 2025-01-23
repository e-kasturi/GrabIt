"use client"

import { useState } from 'react';

type Message = {
  sender: 'user' | 'gemini';
  text: string;
};

export default function GeminiChat(): JSX.Element {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    setMessages((prev) => [...prev, { sender: 'user', text: prompt }]);
    setPrompt(''); 
  
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
  
      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }
  
      const data = await res.json();
      if (!data || !data.text) {
        throw new Error('No valid response from Gemini API');
      }
  
      setMessages((prev) => [...prev, { sender: 'gemini', text: data.text }]);
    } catch (error: any) {
      console.error('Error:', error.message);
      setMessages((prev) => [...prev, { sender: 'gemini', text: error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh', 
        backgroundColor: '#f7f9fc',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ color: '#333', textAlign: 'center' }}>Gemini Chat</h2>

      {/* Tampilan pesan chat */}
      <div
        style={{
          flex: 1, 
          backgroundColor: '#ffffff',
          overflowY: 'auto',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              textAlign: message.sender === 'user' ? 'right' : 'left',
              margin: '15px 0',
            }}
          >
            <span
              style={{
                backgroundColor: message.sender === 'user' ? '#007bff' : '#f0f0f0',
                color: message.sender === 'user' ? 'white' : 'black',
                padding: '12px 18px',
                borderRadius: '15px',
                display: 'inline-block',
                maxWidth: '70%',
                wordBreak: 'break-word',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              }}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>

      {/* Tampilkan indikator loading jika sedang memproses */}
      {isLoading && (
        <div style={{ textAlign: 'center', color: '#007bff', marginBottom: '15px' }}>
          <span>Loading...</span>
        </div>
      )}

      {/* Form input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a message..."
          required
          style={{
            flex: 1,
            padding: '12px 18px',
            borderRadius: '15px',
            border: '1px solid #ccc',
            fontSize: '16px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
            outline: 'none',
            transition: 'border-color 0.3s ease-in-out',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 18px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          Send
        </button>
      </form>
    </div>
  );
}
