import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Plot from 'react-plotly.js';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?', type: 'text' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

      console.log("Bot response:", botResponse);

      const botMessage =
        type === 'chart'
          ? { sender: 'bot', type: 'chart', chartData: typeof botResponse === 'string' ? JSON.parse(botResponse) : botResponse }
          : { sender: 'bot', type: 'text', text: botResponse };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };
  console.log("messages", messages);

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Asistente Virtual</div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.type === 'chart' ? (
              <div className="plot-container">
                <h4>{msg.chartData.title}</h4>
                <Plot
                  data={[
                    {
                      x: msg.chartData.chart_data.x,
                      y: msg.chartData.chart_data.y,
                      type: msg.chartData.chart_data.type || 'scatter',
                      mode: msg.chartData.chart_data.mode || 'lines+markers',
                      name: msg.chartData.chart_data.name || '',
                    },
                  ]}
                  layout={{
                    title: msg.chartData.title || 'Gráfico',
                    xaxis: { title: 'Eje X' },
                    yaxis: { title: 'Eje Y' },
                    responsive: true,
                  }}
                />
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