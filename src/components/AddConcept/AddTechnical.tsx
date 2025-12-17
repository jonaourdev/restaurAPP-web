// src/components/AddConcept/AddTechnical.tsx

import React, { useState, useEffect } from "react";
import { Form, Button, Card, Spinner, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { dataHelper, type FamiliaDTO } from "../../utils/Helper";
import { routes } from "../../router";
import { uploadToCloudinary } from "../../utils/cloudinaryHelper"; 
import "../../css/AddConceptForm.css";

export default function AddTechnical() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | "">("");
  
  // Estado para cargar las familias en el selector
  const [families, setFamilies] = useState<FamiliaDTO[]>([]);
  
  // Estados para la imagen
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  // 1. Cargar las familias al iniciar para llenar el Select
  useEffect(() => {
    async function loadFamilies() {
      const data = await dataHelper.getRealFamilias();
      setFamilies(data);
    }
    loadFamilies();
  }, []);

  // Manejo de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }
    if (!selectedFamilyId) {
      alert("Debes seleccionar una familia.");
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = "";

      // 2. Subir imagen a Cloudinary (si existe)
      if (selectedFile) {
        imageUrl = await uploadToCloudinary(selectedFile);
      }

      // 3. Enviar datos al Helper
      await dataHelper.addSubConcept(Number(selectedFamilyId), {
        name: name.trim(),
        description: description.trim() || "",
        image: imageUrl,
      });

      alert("Concepto técnico propuesto exitosamente.");
      navigate(routes.TechnicalConceptPage);

    } catch (error) {
      console.error("Error al guardar técnico:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Desconocido"}`);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="add-form-container">
      <Card className="add-form-card shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">Añadir concepto técnico</h2>

          <Form onSubmit={handleSubmit}>
            
            {/* SELECTOR DE FAMILIA */}
            <Form.Group className="mb-3" controlId="familySelect">
              <Form.Label>Selecciona la Familia</Form.Label>
              <Form.Select
                value={selectedFamilyId}
                onChange={(e) => setSelectedFamilyId(Number(e.target.value))}
                required
                disabled={isUploading}
                className="add-form-input"
              >
                <option value="">-- Elige una familia --</option>
                {families.map((f) => (
                  <option key={f.idFamilia} value={f.idFamilia}>
                    {f.nombreFamilia}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* NOMBRE */}
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre Técnico</Form.Label>
              <Form.Control
                type="text"
                className="add-form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isUploading}
              />
            </Form.Group>

            {/* DESCRIPCIÓN */}
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                className="add-form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
              />
            </Form.Group>

            {/* IMAGEN */}
            <Form.Group className="mb-4" controlId="image">
              <Form.Label>Imagen de Referencia (Opcional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {previewUrl && (
                <div className="mt-3 text-center">
                  <Image 
                    src={previewUrl} 
                    thumbnail 
                    style={{ maxHeight: "200px", objectFit: "cover" }} 
                  />
                  <div className="text-muted small mt-1">Vista previa</div>
                </div>
              )}
            </Form.Group>

            {/* BOTONES */}
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Button className="add-form-btn" type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Subiendo...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
              <Button
                className="add-form-btn-secondary"
                onClick={() => navigate(-1)}
                disabled={isUploading}
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