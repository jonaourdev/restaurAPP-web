import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper } from "../../utils/Helper";
import { routes } from "../../router";
import "../../css/AddConceptForm.css"; 
import CloudinaryUpload from "../Cloudinary/CloudinaryUpload"; 

export default function AddFamily() {
  const [name, setName] = useState("");
  const [descriptions, setDescriptions] = useState("");
  // ELIMINADO: const [componentItemn, setComponentItemn] = useState("");
  
  const [imageUrl, setImageUrl] = useState(""); 
  
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("El nombre de la familia es obligatorio.");
      return;
    }

    try {
      await dataHelper.addTechnicalFamily({
        name: name.trim(),
        descriptions: descriptions.trim() || undefined,
        // ELIMINADO: componentItemn: ... (ya no se envía)
        image: imageUrl || undefined,
      });

      alert("Familia técnica creada y enviada a revisión.");
      navigate(routes.TechnicalConceptPage);
      
    } catch (error) {
      console.error("Error al guardar familia:", error);
      alert(`Error al guardar familia: ${error instanceof Error ? error.message : "Error desconocido"}`);
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

          {/* ELIMINADO: Aquí estaba el campo de componentes */}

          {/* Imagen (Cloudinary) */}
          <CloudinaryUpload 
            label="Foto de Portada (Opcional)"
            onImageUploaded={(url) => setImageUrl(url)}
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