import React, { useState } from 'react';
import { Plus } from 'lucide-react'; // Usamos Lucide para el ícono

function UploadPDFButton({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      onUpload(file);
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
      <label htmlFor="fileInput" className="upload-button">
        <Plus size={24} />
      </label>
    </div>
  );
}

export default UploadPDFButton;
