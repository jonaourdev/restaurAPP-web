// src/components/AddConcept/AddFormative.tsx

import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper } from "../../utils/Helper";
import { routes } from "../../router";

export default function AddFormative() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validación básica: El nombre no puede estar vacío
    if (!name.trim()) {
      alert("El nombre del concepto es obligatorio.");
      return;
    }

    try {
      // LLAMADA AL BACKEND a través de dataHelper.addFormativeConcept
      // Esto llama a POST /api/v1/conceptos-formativos
      await dataHelper.addFormativeConcept({
        name: name.trim(),
        description: description.trim() || "",
        image: image.trim() || undefined,
      });

      alert("Concepto formativo creado y enviado a revisión.");
      // Redirigir a la página de lista de conceptos formativos
      navigate(routes.FormativeConceptPage);
      
    } catch (error) {
      // Manejo de errores de la API o de red
      console.error("Error al guardar concepto formativo:", error);
      alert(`Error al guardar concepto formativo: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  }

  return (
    <Container className="py-4">
      <h2 className="text-warning">Añadir concepto formativo</h2>
      <Form onSubmit={handleSubmit}>
        
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="image">
          <Form.Label>URL de imagen (opcional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="/assets/formative/example.png"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="warning" type="submit">
            Guardar
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
}