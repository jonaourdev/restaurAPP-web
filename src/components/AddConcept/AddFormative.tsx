// src/components/AddConcept/AddFormative.tsx

import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper } from "../../utils/Helper";
import { routes } from "../../router";

export default function AddFormative() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("El nombre del concepto es obligatorio.");
      return;
    }

    try {
      // Llamamos al helper corregido
      await dataHelper.addFormativeConcept({
        name: name.trim(),
        description: description.trim() || "",
      });

      alert("Concepto formativo creado y enviado a revisión.");
      navigate(routes.FormativeConceptPage);
      
    } catch (error) {
      console.error("Error al guardar concepto formativo:", error);
      alert(`Error al guardar: ${error instanceof Error ? error.message : "Error desconocido"}`);
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
            placeholder="Ej: Patrimonio Inmaterial"
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="description">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el concepto..."
          />
        </Form.Group>

        {/* Campo de imagen eliminado por ahora */}

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