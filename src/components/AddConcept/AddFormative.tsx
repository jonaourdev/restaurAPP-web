// src/components/AddConcept/AddFormative.tsx

import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper } from "../../utils/Helper";
import { routes } from "../../router";
import "../../css/AddConceptForm.css";

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
    <div className="add-form-container">
      <Card className="add-form-card shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">Añadir concepto formativo</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                className="add-form-input"
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
                className="add-form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-center mt-4">
              <Button className="add-form-btn" type="submit">
                Guardar
              </Button>
              <Button
                className="add-form-btn-secondary"
                onClick={() => navigate(-1)}
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