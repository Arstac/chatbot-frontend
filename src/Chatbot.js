// src/Chatbot.js

import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:8000/api/chatbot/', {
        message: input,
      });

      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  return (
    <div>
      <h1>Chatbot</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <p><strong>{msg.sender === 'user' ? 'Tú' : 'Bot'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyUp={e => e.key === 'Enter' ? handleSend() : null}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}

export default Chatbot;