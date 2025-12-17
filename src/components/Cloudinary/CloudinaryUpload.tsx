import React, { useState } from "react";
import { Form, Button, Image, Spinner, Row, Col } from "react-bootstrap";
import { uploadToCloudinary } from "../../utils/cloudinaryHelper"; //

interface Props {
  label?: string;
  // CAMBIO CLAVE: Esperamos una función que reciba un ARRAY de strings
  onImagesUploaded: (urls: string[]) => void;
}

export default function CloudinaryUpload({ label = "Imágenes", onImagesUploaded }: Props) {
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]); // Estado es un array

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      // Subimos todas las imágenes en paralelo
      const uploadPromises = Array.from(files).map((file) => uploadToCloudinary(file));
      const urls = await Promise.all(uploadPromises);
      
      // Actualizamos estado local
      const newPreviews = [...previews, ...urls];
      setPreviews(newPreviews);
      
      // Notificamos al padre con el array actualizado
      if (onImagesUploaded) {
         onImagesUploaded(newPreviews);
      }
      
    } catch (error) {
      console.error("Error subiendo imágenes", error);
      alert("Error al subir algunas imágenes");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const newPreviews = previews.filter((_, index) => index !== indexToRemove);
    setPreviews(newPreviews);
    if (onImagesUploaded) {
        onImagesUploaded(newPreviews);
    }
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      
      <div className="d-flex align-items-center gap-2 mb-3">
        <Form.Control 
          type="file" 
          accept="image/*" 
          multiple // IMPORTANTE: Permite seleccionar varios
          onChange={handleFileChange} 
          disabled={loading} 
        />
        {loading && <Spinner animation="border" size="sm" />}
      </div>

      {/* Grid de previsualización */}
      {previews.length > 0 && (
        <div className="p-3 border rounded bg-light">
          <Row xs={2} md={4} className="g-2">
            {previews.map((url, index) => (
              <Col key={index} className="position-relative">
                <Image 
                  src={url} 
                  thumbnail 
                  style={{ width: "100%", height: "100px", objectFit: "cover" }} 
                />
                <Button 
                  variant="danger" 
                  size="sm" 
                  className="position-absolute top-0 end-0 m-1 p-0 px-1"
                  style={{ lineHeight: "1" }}
                  onClick={() => handleRemove(index)}
                >
                  &times;
                </Button>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Form.Group>
  );
}