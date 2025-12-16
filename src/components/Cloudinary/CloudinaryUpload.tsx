// src/components/Cloudinary/CloudinaryUpload.tsx
import React, { useState } from "react";
import { Form, Button, Image, Spinner } from "react-bootstrap";
import { uploadToCloudinary } from "../../utils/cloudinaryHelper";

interface Props {
  label?: string;
  onImageUploaded: (url: string) => void;
}

export default function CloudinaryUpload({ label = "Imagen", onImageUploaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setPreview(url);
      onImageUploaded(url); // Enviamos la URL al formulario padre
    } catch (error) {
      alert("No se pudo subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onImageUploaded("");
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      {!preview ? (
        <div className="d-flex align-items-center gap-2">
          <Form.Control type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
          {loading && <Spinner animation="border" size="sm" />}
        </div>
      ) : (
        <div className="mt-2 text-center p-2 border rounded bg-white">
          <Image src={preview} alt="Preview" thumbnail style={{ maxHeight: "150px" }} />
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={handleRemove}>Cambiar imagen</Button>
          </div>
        </div>
      )}
    </Form.Group>
  );
}