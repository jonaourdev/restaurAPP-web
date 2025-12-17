import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper, type Family } from "../../utils/Helper";
import CloudinaryUpload from "../Cloudinary/CloudinaryUpload"; 
import "../../css/AddConceptForm.css";

export default function AddTechnical() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [familyId, setFamilyId] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // CORRECCIÓN: Estado array
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFamilies() {
      try {
        const realFamilies = await dataHelper.getRealFamilias();
        // Mapeo simple para llenar el select
        const mapped: Family[] = realFamilies.map((f) => ({
          idFamilies: f.idFamilia,
          name: f.nombreFamilia,
          descriptions: f.descripcionFamilia,
          image: "", // No necesitamos cargar imágenes aquí para el select
          subFamily: [],
        }));
        setFamilies(mapped);
        if (mapped.length > 0) setFamilyId(String(mapped[0].idFamilies));
      } catch (error) {
        console.error("Error cargando familias:", error);
      }
    }
    fetchFamilies();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fid = Number(familyId);
    if (Number.isNaN(fid) || !name.trim()) {
      alert("Seleccione familia y nombre.");
      return;
    }

    try {
      await dataHelper.addSubConcept(fid, {
        name: name.trim(),
        description: description.trim() || undefined,
        images: imageUrls, // Enviamos array
      });

      alert("Subconcepto técnico creado y enviado a revisión.");
      navigate(`/familia/${fid}`);
    } catch (error) {
      alert(`Error al guardar: ${error instanceof Error ? error.message : "Error"}`);
    }
  }

  return (
    <div className="add-form-container text-black">
      <div className="add-form-card">
        <h2 className="text-center mb-4">Añadir subconcepto técnico</h2>
        {/* ... (Lógica de familias vacías igual que antes) ... */}
        {families.length > 0 && (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Familia</Form.Label>
              <Form.Select className="add-form-input" value={familyId} onChange={(e) => setFamilyId(e.target.value)}>
                {families.map((f) => (
                  <option key={f.idFamilies} value={f.idFamilies}>{f.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" className="add-form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} className="add-form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>

            {/* CORRECCIÓN: Prop correcta */}
            <CloudinaryUpload 
              label="Imágenes de Referencia (Opcional)"
              onImagesUploaded={setImageUrls}
            />

            <div className="d-flex gap-2 justify-content-center mt-4">
              <Button type="submit" className="add-form-btn">Guardar</Button>
              <Button type="button" className="add-form-btn-secondary" onClick={() => navigate(-1)}>Cancelar</Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}