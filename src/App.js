import React, { useRef } from "react";
import "./App.css";
import Chatbot from "./Chatbot";
import { FaTools } from "react-icons/fa";
import UploadPDFButton from './components/UploadPDFButton';

function App() {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch("http://localhost:8000/upload-pdf/", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        document.getElementById("result").innerText = "PDF subido con éxito";
      } catch (error) {
        document.getElementById("result").innerText = "Error al subir el PDF";
      }
    } else {
      alert("Por favor, selecciona un archivo PDF válido.");
    }
  };

  return (
    <div className="container">
      <header className="header">
        <FaTools className="header-icon" />
        <h1 className="header-title">Análisis de licitaciones y presupuestos</h1>
      </header>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <div className="placeholder pdf-upload" onClick={handleFileClick}>
        Añadir PDF aquí
      </div>
      <div className="placeholder result" id="result">Resultado</div>
      <div className="chatbot-container">
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
