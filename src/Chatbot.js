import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Plot from 'react-plotly.js';
import './Chatbot.css';
import UploadPDFButton from './components/UploadPDFButton'; 
import "./components/UploadPDFButton.css";


const API_BASE_URL = 'http://localhost:8000/chatbot/';

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
      const response = await axios.post(API_BASE_URL, {
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

  // const handleUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (file && file.type === "application/pdf") {
  //     const formData = new FormData();
  //     formData.append("file", file);
      
  //     try {
  //       const response = await fetch("http://localhost:8000/upload-pdf/", {
  //         method: "POST",
  //         body: formData,
  //       });
  
  //       if (response.ok) {
  //         const pdfBlob = await response.blob();
  //         const url = URL.createObjectURL(pdfBlob);  // Crear URL del blob
          
  //         // Crear un enlace de descarga
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.download = 'informe_viabilidad.pdf';  // Nombre del archivo a descargar
  //         link.textContent = 'Descargar Informe de Viabilidad';
  //         link.style.display = 'block';

  //         setMessages((prevMessages) => [...prevMessages, link]);
  //         document.getElementById("result").innerText = "Exito al subir el PDF";
  //       } else {
  //         document.getElementById("result").innerText = "Error en la respuesta";
  //       }
  //     } catch (error) {
  //       document.getElementById("result").innerText = "Error al subir el PDF";
  //     }
  //   } else {
  //     alert("Por favor, selecciona un archivo PDF válido.");
  //   }
  // };
  
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const response = await fetch("http://localhost:8000/upload-pdf/", {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          const pdfBlob = await response.blob();
          const url = URL.createObjectURL(pdfBlob);
  
          // Agregamos un mensaje que incluya el enlace de descarga
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: 'link',
              url: url,
              text: 'Descargar Informe de Viabilidad',
            }
          ]);
          document.getElementById("result").innerText = "Éxito al subir el PDF";
        } else {
          document.getElementById("result").innerText = "Error en la respuesta";
        }
      } catch (error) {
        document.getElementById("result").innerText = "Error al subir el PDF";
      }
    } else {
      alert("Por favor, selecciona un archivo PDF válido.");
    }
  };
  

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
            ) : msg.type === 'link' ? (
              <a
                href={msg.url}
                download="informe_viabilidad.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="pdf-download-link"
              >
                {msg.text}
              </a>
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
      <UploadPDFButton onUpload={handleUpload} />
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
