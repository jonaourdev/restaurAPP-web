import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper } from "../../utils/Helper";
import { routes } from "../../router";
import "../../css/AddConceptForm.css";

export default function AddFormativePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    dataHelper.addFormativeConcept({
      name: name.trim(),
      description: description.trim() || "",
      image: image.trim() || undefined,
    });

    navigate(routes.FormativeConceptPage);
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

            <Form.Group className="mb-3" controlId="image">
              <Form.Label>URL de imagen (opcional)</Form.Label>
              <Form.Control
                className="add-form-input"
                type="text"
                placeholder="/assets/formative/example.png"
                value={image}
                onChange={(e) => setImage(e.target.value)}
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
