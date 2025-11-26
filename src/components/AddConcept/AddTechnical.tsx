import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper, type Family } from "../../utils/Helper";
import "../../css/AddConceptForm.css"; // <--- tu CSS nuevo

export default function AddTechnical() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [familyId, setFamilyId] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFamilies() {
      const realFamilies = await dataHelper.getRealFamilias();

      // Mapear DTO
      const mapped = realFamilies.map((f) => ({
        idFamilies: f.idFamilia,
        name: f.nombreFamilia,
        descriptions: f.descripcionFamilia,
        componentItemn: "",
        image: "",
        subConcepto: [],
      }));

      setFamilies(mapped);

      if (mapped.length > 0) {
        setFamilyId(String(mapped[0].idFamilies));
      }
    }

    fetchFamilies();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fid = Number(familyId);

    // Validar ID de familia y nombre
    if (Number.isNaN(fid) || !name.trim()) return;

    try {
      // LLAMADA AL BACKEND a través de dataHelper.addSubConcept
      // Esto llama a POST /api/v1/conceptos-tecnicos
      await dataHelper.addSubConcept(fid, {
        name: name.trim(),
        description: description.trim() || undefined,
        image: image.trim() || undefined,
      });

      alert("Subconcepto técnico creado y enviado a revisión.");
      // Navegación a la página de detalle de la familia después de la creación
      navigate(`/familia/${fid}`);
    } catch (error) {
      // Manejo de errores de la API o de red
      console.error("Error al guardar subconcepto:", error);
      alert(
        `Error al guardar subconcepto: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  return (
    <div className="add-form-container text-black">
      <div className="add-form-card">
        <h2 className="text-center mb-4">Añadir subconcepto técnico</h2>

        {families.length === 0 ? (
          <div>
            <p className="text-center">
              No hay familias técnicas. Crea una familia primero.
            </p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {/* Selección de Familia */}
            <Form.Group className="mb-3" controlId="family">
              <Form.Label>Familia</Form.Label>
              <Form.Select
                className="add-form-input"
                value={familyId}
                onChange={(e) => setFamilyId(e.target.value)}
              >
                {families.map((f) => (
                  <option key={f.idFamilies} value={f.idFamilies}>
                    {f.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

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
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="add-form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            {/* Imagen opcional */}
            <Form.Group className="mb-3" controlId="image">
              <Form.Label>URL de imagen (opcional)</Form.Label>
              <Form.Control
                type="text"
                className="add-form-input"
                placeholder="/assets/subconcept.png"
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
                className="add-form-btn-secondary"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
