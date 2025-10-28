import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper } from "../../utils/Helper";
import { routes } from "../../router";

export default function AddFamilyPage() {
  const [name, setName] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [componentItemn, setComponentItemn] = useState("");
  const [image, setImage] = useState(""); // base64 o url
  const [preview, setPreview] = useState<string>("");
  const navigate = useNavigate();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        setPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImage(e.target.value);
    setPreview(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    dataHelper.addTechnicalFamily({
      name: name.trim(),
      descriptions: descriptions.trim() || undefined,
      componentItemn: componentItemn.trim() || undefined,
      image: image || undefined,
    });

    navigate(routes.TechnicalConceptPage);
  }

  return (
    <Container className="py-4">
      <h2>Añadir familia técnica</h2>
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

        <Form.Group className="mb-3" controlId="descriptions">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={descriptions}
            onChange={(e) => setDescriptions(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="componentItemn">
          <Form.Label>Componentes (ej: Base, Fuste, Capitel)</Form.Label>
          <Form.Control
            type="text"
            value={componentItemn}
            onChange={(e) => setComponentItemn(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="imageFile">
          <Form.Label>Imagen (selecciona archivo o pega URL)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="my-2 text-center">o</div>
          <Form.Control
            type="text"
            placeholder="/assets/column.png o URL completa"
            value={image.startsWith("data:") ? "" : image}
            onChange={handleUrlChange}
          />
        </Form.Group>

        {preview && (
          <div className="mb-3 text-center">
            <img src={preview} alt="Previsualización" style={{ maxWidth: 200, maxHeight: 200 }} />
          </div>
        )}

        <div className="d-flex gap-2">
          <Button variant="primary" type="submit">
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
