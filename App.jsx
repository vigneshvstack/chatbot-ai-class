import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('/api/chat', { message: text, history: newMessages.map(m => ({role: m.role, content: m.text})) });
      const reply = res.data.reply || 'No reply';
      setMessages(m => [...m, { role: 'assistant', text: reply }]);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', text: 'Error: could not reach server' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Professional Chatbot</h1>
        <p className="sub">Secure, minimal, and ready for production</p>
      </header>

      <main className="chat-window" role="main">
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={'message ' + m.role}>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </main>

      <footer className="composer">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type your message..."
        />
        <button onClick={send} disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
      </footer>
    </div>
  );
}
