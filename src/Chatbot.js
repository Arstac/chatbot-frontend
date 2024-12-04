import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?', type: 'text' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // Referencia al final del contenedor de mensajes
  const messagesContainerRef = useRef(null); // Referencia al contenedor de mensajes

  // Función para desplazar automáticamente al final del chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Ejecutar el scroll automáticamente al final cuando se actualicen los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input, type: 'text' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:8000/api/chatbot/', {
        message: input,
      });

      const { response: botResponse, type } = response.data;

      const botMessage =
        type === 'image'
          ? { sender: 'bot', type: 'image', url: `http://localhost:8000/${botResponse}` }
          : { sender: 'bot', type: 'text', text: botResponse };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Asistente Virtual</div>
      <div
        className="chatbot-messages"
        ref={messagesContainerRef} // Referencia para el contenedor
      >
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.type === 'image' ? (
              <img src={msg.url} alt="Bot response" />
            ) : (
              <div className="message-content">
                {msg.sender === 'bot' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            )}
          </div>
        ))}
        {/* Punto de referencia para desplazar el scroll al final */}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => (e.key === 'Enter' ? handleSend() : null)}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}

export default Chatbot;