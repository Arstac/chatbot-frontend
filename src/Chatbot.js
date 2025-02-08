import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Plot from 'react-plotly.js';
import './Chatbot.css';

const API_BASE_URL = 'http://localhost:8000/api/predict';

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?', type: 'text' },
  ]);
  const [input, setInput] = useState('');
  const [expandedMessage, setExpandedMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleDetails = (index) => {
    setExpandedMessage(expandedMessage === index ? null : index);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input, type: 'text' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      let botResponse;
      let endpoint = null;

      if (input.toLowerCase().includes('costo final')) {
        endpoint = `${API_BASE_URL}/costo_final/`;
      } else if (input.toLowerCase().includes('duración real')) {
        endpoint = `${API_BASE_URL}/duracion_real/`;
      } else if (input.toLowerCase().includes('satisfacción cliente')) {
        endpoint = `${API_BASE_URL}/satisfaccion_cliente/`;
      } else if (input.toLowerCase().includes('desviación presupuestaria')) {
        endpoint = `${API_BASE_URL}/desviacion_presupuestaria/`;
      }

      if (endpoint) {
        const requestData = {
          features: [100, 1, 2000, 0, 1, 50, 75]
        };
        const response = await axios.post(endpoint, requestData);
        botResponse = response.data;

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', type: 'prediction', prediction: botResponse }
        ]);
      } else {
        const response = await axios.post('http://localhost:8000/api/chatbot/', { message: input });
        botResponse = response.data.response;

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', type: 'text', text: botResponse }
        ]);
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', type: 'text', text: 'Ocurrió un error. Inténtalo de nuevo.' }]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Asistente Virtual</div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.type === 'prediction' ? (
              <div className="prediction-container">
                <h4>🔍 Resultado de Predicción</h4>
                {Object.entries(msg.prediction).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
                <button className="details-button" onClick={() => toggleDetails(index)}>
                  {expandedMessage === index ? "Ocultar detalles" : "Ver detalles"}
                </button>
                {expandedMessage === index && (
                  <div className="details-box">
                    <p>📊 Esta predicción se basa en modelos de Machine Learning entrenados con datos de construcción.</p>
                    <p>⚙️ Para obtener mejores resultados, asegúrate de proporcionar datos precisos.</p>
                    <p>📅 Predicción realizada el: {new Date().toLocaleString()}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="message-content">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
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
