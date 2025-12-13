import React, { useState } from 'react';

const AIAssistantChat: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error('Failed to get answer');
      const data = await res.json();
      // Friendly fallback for identity questions
      const q = question.trim().toLowerCase();
      if (
        q.includes('who are you') ||
        q.includes('your name') ||
        q.includes('what are you')
      ) {
        setAnswer(
          "I'm Marcy, your friendly math assistant! I'm here to help you solve math problems step by step. Just ask me any math question!"
        );
      } else if (
        !data.answer ||
        data.answer.trim() === '' ||
        data.answer.toLowerCase().includes("i don't know")
      ) {
        setAnswer(
          "I'm not sure about that one, but I can help you solve math problems! Try asking me a math question, and I'll do my best to help."
        );
      } else {
        setAnswer(data.answer);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: '3rem auto',
        padding: 0,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 rgba(233,30,99,0.10)',
        border: '1.5px solid #e91e63',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: '#e91e63',
          color: '#fff',
          padding: '1.2rem 2rem',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
          Marcy
        </span>
        <div style={{ fontSize: 14, fontWeight: 400, marginTop: 4 }}>
          Your friendly AI math assistant
        </div>
      </div>
      <form
        onSubmit={handleAsk}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: '1.5rem 2rem 1rem 2rem',
        }}
      >
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a math question..."
          rows={3}
          required
          style={{
            border: '1.5px solid #e91e63',
            borderRadius: 8,
            padding: '0.75rem',
            fontSize: 16,
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            background: '#fdf6fa',
          }}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          style={{
            background: loading ? '#f06292' : '#e91e63',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.7rem 0',
            fontWeight: 600,
            fontSize: 17,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            boxShadow: '0 2px 8px 0 rgba(233,30,99,0.08)',
          }}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      {answer && (
        <div
          style={{
            margin: '0 2rem 1.5rem 2rem',
            background: '#f6f8fa',
            padding: '1rem',
            borderRadius: 10,
            border: '1px solid #f06292',
            color: '#222',
            fontSize: 16,
            fontWeight: 500,
            boxShadow: '0 1px 4px 0 rgba(233,30,99,0.04)',
          }}
        >
          <strong style={{ color: '#e91e63' }}>Answer:</strong>
          <div style={{ marginTop: 6 }}>{answer}</div>
        </div>
      )}
      {error && (
        <div
          style={{
            color: '#e91e63',
            margin: '0 2rem 1rem 2rem',
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default AIAssistantChat;
