import axios from "axios";

const CLOUD_NAME = "dtprjmqch";
const UPLOAD_PRESET = "restaurapp_uploads";

// 1. Definimos qué forma tiene la respuesta de Cloudinary (para que TS lo sepa)
interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  created_at: string;
  // ... vienen más datos, pero solo nos interesa la URL
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    // 2. Le decimos a Axios: "Espera una respuesta tipo CloudinaryResponse"
    const response = await axios.post<CloudinaryResponse>(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    // Ahora TS sabe que .secure_url existe y es un string
    return response.data.secure_url;
  } catch (error) {
    console.error("Error subiendo a Cloudinary", error);
    throw new Error("Error al subir imagen");
  }
};