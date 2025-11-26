import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper } from "../../utils/Helper";
import { routes } from "../../router";
import "../../css/AddConceptForm.css"; // <-- IMPORTACIÓN CORRECTA

export default function AddFamilyPage() {
  const [name, setName] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [componentItemn, setComponentItemn] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    dataHelper.addTechnicalFamily({
      name: name.trim(),
      descriptions: descriptions.trim() || undefined,
      componentItemn: componentItemn.trim() || undefined,
      image: image.trim() || undefined,
    });

    navigate(routes.TechnicalConceptPage);
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

          {/* Componentes */}
          <Form.Group className="mb-3" controlId="componentItemn">
            <Form.Label>Componentes (ej: Base, Fuste, Capitel)</Form.Label>
            <Form.Control
              type="text"
              className="add-form-input"
              value={componentItemn}
              onChange={(e) => setComponentItemn(e.target.value)}
            />
          </Form.Group>

          {/* Imagen */}
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>URL de imagen (opcional)</Form.Label>
            <Form.Control
              type="text"
              className="add-form-input"
              placeholder="/assets/column.png"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </Form.Group>

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
