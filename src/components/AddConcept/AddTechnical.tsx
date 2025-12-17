import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper, type SubfamiliaDTO } from "../../utils/Helper";
import "../../css/AddConceptForm.css";

export default function AddTechnical() {
  const [subfamilias, setSubfamilias] = useState<SubfamiliaDTO[]>([]);
  const [subfamilyId, setSubfamilyId] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubfamilias() {
      const realSubs = await dataHelper.getRealSubfamilias();

      setSubfamilias(realSubs);

      if (realSubs.length > 0) {
        setSubfamilyId(String(realSubs[0].idSubfamilia));
      }
    }

    fetchSubfamilias();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sid = Number(subfamilyId);

    if (Number.isNaN(sid) || !name.trim()) return;

    try {
      await dataHelper.addSubConcept(sid, {
        name: name.trim(),
        description: description.trim() || undefined,
        image: image.trim() || undefined,
      });

      alert("Concepto técnico creado y enviado a revisión.");

      // Buscar la subfamilia seleccionada para saber su familia
      const selectedSub = subfamilias.find((s) => s.idSubfamilia === sid);

      if (selectedSub) {
        // Redirigir al detalle de la familia de esa subfamilia
        navigate(`/familia/${selectedSub.familiaId}`);
      } else {
        // Si por alguna razón no se encuentra, volvemos atrás
        navigate(-1);
      }
    } catch (error) {
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
        <h2 className="text-center mb-4">Añadir concepto técnico</h2>

        {subfamilias.length === 0 ? (
          <div>
            <p className="text-center">
              No hay subfamilias registradas. Crea una subfamilia primero.
            </p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {/* Selección de Subfamilia */}
            <Form.Group className="mb-3" controlId="subfamily">
              <Form.Label>Subfamilia</Form.Label>
              <Form.Select
                className="add-form-input"
                value={subfamilyId}
                onChange={(e) => setSubfamilyId(e.target.value)}
              >
                {subfamilias.map((s) => (
                  <option key={s.idSubfamilia} value={s.idSubfamilia}>
                    {s.nombreSubfamilia}
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
