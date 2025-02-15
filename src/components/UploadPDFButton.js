import React, { useState } from 'react';
import { Plus } from 'lucide-react'; // Usamos Lucide para el ícono

function UploadPDFButton({ onUpload }) {

  const handleFileChange = (event) => {
    if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
      console.error("No se pudo leer el archivo.");
      return;
    }
    
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      onUpload(event);
    } else {
      alert("Por favor, selecciona un archivo PDF válido.");
    }
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="fileInput"
      />
      <label htmlFor="fileInput" className="upload-button-circle">
        <Plus size={18} color="#fff" />
      </label>
    </div>
  );
}

export default UploadPDFButton;
