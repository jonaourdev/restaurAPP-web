import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper } from "../../utils/Helper"; //
import { routes } from "../../router";
import CloudinaryUpload from "../Cloudinary/CloudinaryUpload"; // Importamos el componente
import "../../css/AddConceptForm.css"; //

export default function AddFamily() {
  const [name, setName] = useState("");
  const [descriptions, setDescriptions] = useState("");
  
  // 1. Estado para almacenar múltiples URLs (array)
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("El nombre de la familia es obligatorio.");
      return;
    }

    try {
      // 2. Enviamos el array 'imageUrls' al helper
      await dataHelper.addTechnicalFamily({
        name: name.trim(),
        descriptions: descriptions.trim() || undefined,
        images: imageUrls, // Pasamos el array de imágenes
      });

      alert("Familia técnica creada y enviada a revisión.");
      navigate(routes.TechnicalConceptPage);
      
    } catch (error) {
      console.error("Error al guardar familia:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Desconocido"}`);
    }
  }

  return (
    <div className="add-form-container text-black">
      <div className="add-form-card">
        <h2 className="text-center mb-4">Añadir familia técnica</h2>

        <Form onSubmit={handleSubmit}>
          {/* Nombre */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              className="add-form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Descripción */}
          <Form.Group className="mb-3" controlId="descriptions">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              className="add-form-input"
              value={descriptions}
              onChange={(e) => setDescriptions(e.target.value)}
            />
          </Form.Group>

          {/* 3. Reemplazamos el input de texto por el componente de subida */}
          <CloudinaryUpload 
            label="Imágenes de Referencia (Opcional)"
            onImagesUploaded={setImageUrls} // Conectamos la función plural
          />

          {/* Botones */}
          <div className="d-flex gap-2 justify-content-center mt-4">
            <Button type="submit" className="add-form-btn">
              Guardar
            </Button>

            <Button
              type="button"
              className="add-form-btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}