import React, { useEffect, useState } from "react";
  import { Container, Form, Button } from "react-bootstrap";
  import { useNavigate } from "react-router-dom";
  import { dataHelper } from "../../utils/Helper";
  import type { Family } from "../../utils/Helper";

export default function AddTechnicalPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [familyId, setFamilyId] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // base64 o url
  const [preview, setPreview] = useState<string>("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const fams = dataHelper.getTechnicalFamilies();
    setFamilies(fams);
    if (fams.length > 0 && !familyId) {
      setFamilyId(String(fams[0].idFamilies));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const fid = Number(familyId);
    if (Number.isNaN(fid) || !name.trim()) return;

    dataHelper.addSubConcept(fid, {
      name: name.trim(),
      description: description.trim() || undefined,
      image: image || undefined,
    });

    navigate(`/familia/${fid}`);
  }

  return (
    <Container className="py-4">
      <h2>Añadir subconcepto técnico</h2>
      {families.length === 0 ? (
        <div>
          <p>No hay familias técnicas. Crea una familia primero.</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="family">
            <Form.Label>Familia</Form.Label>
            <Form.Select value={familyId} onChange={(e) => setFamilyId(e.target.value)}>
              {families.map((f) => (
                <option key={f.idFamilies} value={f.idFamilies}>
                  {f.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
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
              placeholder="/assets/subconcept.png o URL completa"
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
      )}
    </Container>
  );
}
