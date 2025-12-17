import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper, type FamiliaDTO } from "../../utils/Helper";
import "../../css/AddConceptForm.css";

export default function AddSubfamily() {
  const [families, setFamilies] = useState<FamiliaDTO[]>([]);
  const [familyId, setFamilyId] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFamilies() {
      const realFamilies = await dataHelper.getRealFamilias();

      setFamilies(realFamilies);

      if (realFamilies.length > 0) {
        setFamilyId(String(realFamilies[0].idFamilia));
      }
    }

    fetchFamilies();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fid = Number(familyId);

    if (Number.isNaN(fid)) {
      alert("Debes seleccionar una familia.");
      return;
    }

    if (!name.trim()) {
      alert("El nombre de la subfamilia es obligatorio.");
      return;
    }

    try {
      await dataHelper.addSubfamily(fid, {
        name: name.trim(),
        description: description.trim() || undefined,
        image: image.trim() || undefined,
      });

      alert("Subfamilia creada y enviada a revisión.");

      // Redirigir al detalle de la familia
      navigate(`/familia/${fid}`);
    } catch (error) {
      console.error("Error al guardar subfamilia:", error);
      alert(
        `Error al guardar subfamilia: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  return (
    <div className="add-form-container text-black">
      <div className="add-form-card">
        <h2 className="text-center mb-4">Añadir subfamilia técnica</h2>

        {families.length === 0 ? (
          <p className="text-center">
            No hay familias técnicas disponibles. Crea una familia primero.
          </p>
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
                  <option key={f.idFamilia} value={f.idFamilia}>
                    {f.nombreFamilia}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Nombre subfamilia */}
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre de la subfamilia</Form.Label>
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
                placeholder="/assets/subfamilia.png"
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
        )}
      </div>
    </div>
  );
}
