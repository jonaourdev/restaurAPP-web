// src/components/AddConcept/AddFormative.tsx

import React, { useState } from "react";
import { Form, Button, Card, Spinner, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper } from "../../utils/Helper";
import { routes } from "../../router";
import { uploadToCloudinary } from "../../utils/cloudinaryHelper"; // Asegúrate de tener este helper
import "../../css/AddConceptForm.css";

export default function AddFormative() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // Estados para la gestión de la imagen
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Para bloquear el botón mientras sube

  const navigate = useNavigate();

  // Función para manejar la selección del archivo en el input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Creamos una URL temporal para mostrar la previsualización al usuario
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("El nombre del concepto es obligatorio.");
      return;
    }

    try {
      setIsUploading(true); // Bloqueamos el formulario y mostramos spinner
      let imageUrl = "";

      // 1. Si el usuario seleccionó una foto, la subimos a Cloudinary primero
      if (selectedFile) {
        imageUrl = await uploadToCloudinary(selectedFile);
      }

      // 2. Llamamos al helper enviando la URL obtenida (o string vacío si no hubo foto)
      await dataHelper.addFormativeConcept({
        name: name.trim(),
        description: description.trim() || "",
        image: imageUrl, 
      });

      alert("Concepto formativo creado y enviado a revisión.");
      navigate(routes.FormativeConceptPage);
      
    } catch (error) {
      console.error("Error al guardar concepto formativo:", error);
      alert(`Error al guardar: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setIsUploading(false); // Desbloqueamos el formulario
    }
  }

  return (
    <div className="add-form-container">
      <Card className="add-form-card shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">Añadir concepto formativo</h2>

          <Form onSubmit={handleSubmit}>
            {/* Input Nombre */}
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                className="add-form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isUploading}
              />
            </Form.Group>

            {/* Input Descripción */}
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                className="add-form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
              />
            </Form.Group>

            {/* Input Imagen (NUEVO) */}
            <Form.Group className="mb-4" controlId="image">
              <Form.Label>Imagen de Referencia (Opcional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              
              {/* Previsualización de la imagen */}
              {previewUrl && (
                <div className="mt-3 text-center">
                  <Image 
                    src={previewUrl} 
                    thumbnail 
                    style={{ maxHeight: "200px", objectFit: "cover" }} 
                  />
                  <div className="text-muted small mt-1">Vista previa</div>
                </div>
              )}
            </Form.Group>

            {/* Botones */}
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Button className="add-form-btn" type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Subiendo...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
              
              <Button
                className="add-form-btn-secondary"
                onClick={() => navigate(-1)}
                disabled={isUploading}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}